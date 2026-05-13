import { ColumnDef } from '@tanstack/react-table';
import clsx from 'clsx';
import { InferGetStaticPropsType } from 'next';
import * as React from 'react';

import { computeStatsFromDatapoints } from '@/lib/feiyue.client';
import { getAllDatapoints, getStats } from '@/lib/feiyue.server';
import useLoaded from '@/hooks/useLoaded';

import Accent from '@/components/Accent';
import Tag from '@/components/content/Tag';
import FeiyueNav from '@/components/feiyue/FeiyueNav';
import StatsCard from '@/components/feiyue/StatsCard';
import Layout from '@/components/layout/Layout';
import UnstyledLink from '@/components/links/UnstyledLink';
import Seo from '@/components/Seo';
import Table from '@/components/table/Table';

import { Datapoint, FeiyueStats, ProgramSummary } from '@/types/feiyue';

export default function FeiyueStatsPage({
  stats: precomputedStats,
  allDatapoints,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const isLoaded = useLoaded();
  const [termFilter, setTermFilter] = React.useState('');

  const allYears = React.useMemo(() => {
    const years = new Set<number>();
    for (const dp of allDatapoints) {
      const y = parseInt(dp.term.split(' ')[0], 10);
      if (!isNaN(y)) years.add(y);
    }
    return Array.from(years).sort((a, b) => b - a);
  }, [allDatapoints]);

  const currentYear = new Date().getFullYear();

  const stats: FeiyueStats = React.useMemo(() => {
    if (!termFilter) return precomputedStats;

    const filtered = allDatapoints.filter((dp) => {
      const year = parseInt(dp.term.split(' ')[0], 10);
      if (termFilter === 'recent-1') return year >= currentYear;
      if (termFilter === 'recent-3') return year >= currentYear - 2;
      return dp.term.startsWith(termFilter);
    });

    return computeStatsFromDatapoints(filtered);
  }, [precomputedStats, allDatapoints, termFilter, currentYear]);

  const toggleTerm = (t: string) =>
    setTermFilter((prev) => (prev === t ? '' : t));

  const programColumns = React.useMemo<ColumnDef<ProgramSummary>[]>(
    () => [
      {
        accessorKey: 'program',
        header: '项目',
        cell: ({ row }) => (
          <UnstyledLink
            href={`/feiyue/program/${row.original.slug}`}
            className='text-primary-400 hover:text-primary-500 font-medium'
          >
            {row.original.program}
          </UnstyledLink>
        ),
      },
      {
        accessorKey: 'school',
        header: '学校',
      },
      {
        accessorKey: 'degree',
        header: '学位',
      },
      {
        accessorKey: 'total_count',
        header: '申请数',
        meta: { align: 'right' },
      },
      {
        accessorKey: 'admit_count',
        header: '录取',
        meta: { align: 'right' },
      },
      {
        id: 'admit_rate',
        header: '录取率',
        accessorFn: (row) =>
          row.total_count > 0
            ? `${((row.admit_count / row.total_count) * 100).toFixed(0)}%`
            : '–',
        meta: { align: 'right' },
      },
    ],
    [],
  );

  const termEntries = Object.entries(stats.by_term).sort(([a], [b]) =>
    b.localeCompare(a),
  );

  const maxGpaCount = Math.max(
    ...stats.gpa_distribution.map((d) => d.count),
    1,
  );

  return (
    <Layout>
      <Seo
        templateTitle='飞跃统计'
        description='北京工业大学留学申请统计数据总览。'
      />

      <main>
        <section className={clsx(isLoaded && 'fade-in-start')}>
          <div className='layout py-12'>
            <h1 className='text-3xl md:text-5xl' data-fade='0'>
              <Accent>飞跃统计</Accent>
            </h1>

            <div className='mt-4' data-fade='1'>
              <FeiyueNav />
            </div>

            {/* Term filter */}
            <div
              className='mt-6 flex flex-wrap items-baseline gap-2 text-sm text-gray-600 dark:text-gray-300'
              data-fade='2'
            >
              <span className='font-medium'>学期：</span>
              <Tag onClick={() => toggleTerm('recent-1')}>
                {termFilter === 'recent-1' ? <Accent>近一年</Accent> : '近一年'}
              </Tag>
              <Tag onClick={() => toggleTerm('recent-3')}>
                {termFilter === 'recent-3' ? <Accent>近三年</Accent> : '近三年'}
              </Tag>
              {allYears.map((y) => (
                <Tag key={y} onClick={() => toggleTerm(String(y))}>
                  {termFilter === String(y) ? <Accent>{y}</Accent> : String(y)}
                </Tag>
              ))}
            </div>

            {/* Overview cards */}
            <div
              className='mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4'
              data-fade='3'
            >
              <StatsCard label='申请人数' value={stats.total_applicants} />
              <StatsCard label='申请总数' value={stats.total_applications} />
              <StatsCard label='涉及项目' value={stats.total_programs} />
              <StatsCard
                label='整体录取率'
                value={`${(stats.admit_rate * 100).toFixed(0)}%`}
                subtitle={`覆盖 ${stats.total_schools} 所学校`}
              />
            </div>

            {/* Per-term breakdown */}
            <h2
              className='mt-10 text-xl font-bold text-gray-900 dark:text-gray-100'
              data-fade='4'
            >
              各学期统计
            </h2>
            <div
              className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
              data-fade='5'
            >
              {termEntries.map(([term, data]) => (
                <div
                  key={term}
                  className='rounded-lg border border-gray-200 p-4 dark:border-gray-700'
                >
                  <h3 className='font-bold text-gray-900 dark:text-gray-100'>
                    {term}
                  </h3>
                  <div className='mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400'>
                    <p>申请人：{data.applicants} 人</p>
                    <p>申请数：{data.applications} 条</p>
                    <p>录取率：{(data.admit_rate * 100).toFixed(0)}%</p>
                  </div>
                </div>
              ))}
            </div>

            {/* GPA distribution */}
            <h2
              className='mt-10 text-xl font-bold text-gray-900 dark:text-gray-100'
              data-fade='6'
            >
              GPA 分布
            </h2>
            <div className='mt-4 space-y-3' data-fade='7'>
              {stats.gpa_distribution.map((d) => (
                <div key={d.range} className='flex items-center gap-3'>
                  <span className='w-16 text-right text-sm text-gray-600 dark:text-gray-400'>
                    {d.range}
                  </span>
                  <div className='flex-1'>
                    <div
                      className='bg-primary-400/60 dark:bg-primary-300/40 h-6 rounded-sm'
                      style={{
                        width:
                          maxGpaCount > 0
                            ? `${(d.count / maxGpaCount) * 100}%`
                            : '0%',
                        minWidth: d.count > 0 ? '2rem' : '0',
                      }}
                    />
                  </div>
                  <span className='w-8 text-sm text-gray-500 dark:text-gray-400'>
                    {d.count}
                  </span>
                </div>
              ))}
            </div>

            {/* Top programs */}
            <h2
              className='mt-10 text-xl font-bold text-gray-900 dark:text-gray-100'
              data-fade='8'
            >
              热门项目
            </h2>
            <div data-fade='9'>
              <Table
                className='mt-4'
                data={stats.top_programs}
                columns={programColumns}
                withPagination
                pageSize={10}
              />
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export async function getStaticProps() {
  const stats: FeiyueStats = await getStats();
  const allDatapoints: Datapoint[] = await getAllDatapoints();
  return { props: { stats, allDatapoints } };
}
