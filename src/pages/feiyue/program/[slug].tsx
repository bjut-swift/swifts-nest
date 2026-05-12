import { ColumnDef } from '@tanstack/react-table';
import clsx from 'clsx';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import * as React from 'react';

import { getAllPrograms } from '@/lib/feiyue.server';
import useLoaded from '@/hooks/useLoaded';

import Accent from '@/components/Accent';
import FeiyueNav from '@/components/feiyue/FeiyueNav';
import ResultBadge from '@/components/feiyue/ResultBadge';
import StatsCard from '@/components/feiyue/StatsCard';
import Layout from '@/components/layout/Layout';
import UnstyledLink from '@/components/links/UnstyledLink';
import Seo from '@/components/Seo';
import Table from '@/components/table/Table';

import { Datapoint, ProgramSummary } from '@/types/feiyue';

type PageProps = {
  program: ProgramSummary;
};

const columns: ColumnDef<Datapoint>[] = [
  {
    accessorKey: 'applicant_name',
    header: '申请人',
    cell: ({ row }) => (
      <UnstyledLink
        href={`/feiyue/applicant/${row.original.applicant_id}`}
        className='font-medium text-primary-400 hover:text-primary-500'
      >
        {row.original.applicant_name}
      </UnstyledLink>
    ),
  },
  {
    accessorKey: 'applicant_major',
    header: '专业',
  },
  {
    accessorKey: 'term',
    header: '学期',
  },
  {
    accessorKey: 'result',
    header: '结果',
    cell: ({ row }) => (
      <ResultBadge result={row.original.result} isFinal={row.original.final} />
    ),
  },
];

export default function ProgramPage({
  program,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const isLoaded = useLoaded();

  const admitRate =
    program.total_count > 0
      ? ((program.admit_count / program.total_count) * 100).toFixed(0)
      : '–';

  return (
    <Layout>
      <Seo
        templateTitle={`${program.program} @ ${program.school} — 飞跃手册`}
        description={`${program.school} ${program.program} ${program.degree} 的申请数据汇总`}
      />

      <main>
        <section className={clsx(isLoaded && 'fade-in-start')}>
          <div className='layout py-12'>
            <div data-fade='0'>
              <FeiyueNav />
            </div>

            <h1
              className='mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100 md:text-4xl'
              data-fade='1'
            >
              <Accent>{program.program}</Accent>
              <span className='ml-2 text-lg font-normal text-gray-500 dark:text-gray-400'>
                {program.degree} @ {program.school}
              </span>
            </h1>

            <div
              className='mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4'
              data-fade='2'
            >
              <StatsCard label='总申请' value={program.total_count} />
              <StatsCard
                label='录取'
                value={program.admit_count}
                subtitle={`${admitRate}%`}
              />
              <StatsCard label='拒绝' value={program.reject_count} />
              <StatsCard
                label='其他'
                value={
                  program.total_count -
                  program.admit_count -
                  program.reject_count
                }
              />
            </div>

            <h2
              className='mt-8 text-xl font-bold text-gray-900 dark:text-gray-100'
              data-fade='3'
            >
              申请记录
            </h2>
            <div data-fade='4'>
              <Table
                className='mt-4'
                data={program.datapoints}
                columns={columns}
                withFilter
              />
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const programs = await getAllPrograms();
  return {
    paths: programs.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const slug = params?.slug as string;
  const programs = await getAllPrograms();
  const program = programs.find((p) => p.slug === slug);

  if (!program) return { notFound: true };

  return { props: { program } };
};
