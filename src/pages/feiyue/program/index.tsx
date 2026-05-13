import clsx from 'clsx';
import { InferGetStaticPropsType } from 'next';
import * as React from 'react';

import { getProgramsBySchool, getSchoolShortName } from '@/lib/feiyue.server';
import useLoaded from '@/hooks/useLoaded';

import Accent from '@/components/Accent';
import FeiyueNav from '@/components/feiyue/FeiyueNav';
import Layout from '@/components/layout/Layout';
import UnstyledLink from '@/components/links/UnstyledLink';
import Seo from '@/components/Seo';

import { ProgramSummary } from '@/types/feiyue';

type SchoolEntry = {
  school: string;
  shortName: string;
  programs: ProgramSummary[];
};

export default function ProgramIndexPage({
  schoolEntries,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const isLoaded = useLoaded();
  const [showFull, setShowFull] = React.useState(false);

  const scrollTo = (school: string) => {
    const el = document.getElementById(`school-${encodeURIComponent(school)}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const displayName = (entry: SchoolEntry) =>
    showFull ? entry.school : entry.shortName;

  return (
    <Layout>
      <Seo
        templateTitle='按项目查看 — 飞跃手册'
        description='按学校和项目查看北工大学生的留学申请情况。'
      />

      <main>
        <section className={clsx(isLoaded && 'fade-in-start')}>
          <div className='layout py-12'>
            <div data-fade='0'>
              <FeiyueNav />
            </div>

            <div
              className='mt-4 flex items-center justify-between'
              data-fade='1'
            >
              <h1 className='text-3xl md:text-5xl'>
                <Accent>按项目查看</Accent>
              </h1>
              <button
                onClick={() => setShowFull((p) => !p)}
                className={clsx(
                  'rounded-md border px-3 py-1.5 text-xs font-medium transition-colors',
                  'border-gray-300 text-gray-600 hover:border-primary-300 hover:text-primary-500',
                  'dark:border-gray-600 dark:text-gray-400 dark:hover:border-primary-300 dark:hover:text-primary-300'
                )}
              >
                {showFull ? '显示缩写' : '显示全名'}
              </button>
            </div>

            <div className='mt-6 flex flex-col gap-8 lg:flex-row' data-fade='2'>
              {/* Sidebar */}
              <aside className='lg:sticky lg:top-24 lg:h-fit lg:w-48 lg:shrink-0'>
                <p className='text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400'>
                  目录
                </p>
                <ul className='mt-2 space-y-1 text-sm'>
                  {schoolEntries.map((entry) => (
                    <li key={entry.school}>
                      <button
                        onClick={() => scrollTo(entry.school)}
                        className='text-left text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-300'
                      >
                        {displayName(entry)}
                      </button>
                    </li>
                  ))}
                </ul>
              </aside>

              {/* Main content */}
              <div className='min-w-0 flex-1 space-y-8'>
                {schoolEntries.map((entry) => (
                  <div
                    key={entry.school}
                    id={`school-${encodeURIComponent(entry.school)}`}
                  >
                    <h2 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
                      {displayName(entry)}
                      {!showFull && entry.shortName !== entry.school && (
                        <span className='ml-2 text-sm font-normal text-gray-400'>
                          {entry.school}
                        </span>
                      )}
                    </h2>
                    <ul className='mt-3 space-y-2'>
                      {entry.programs.map((p) => (
                        <li
                          key={p.slug}
                          className='flex items-center justify-between'
                        >
                          <UnstyledLink
                            href={`/feiyue/program/${p.slug}`}
                            className='text-primary-400 hover:text-primary-500'
                          >
                            {p.program}
                            <span className='ml-1.5 rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400'>
                              {p.degree}
                            </span>
                          </UnstyledLink>
                          <span className='text-sm text-gray-500 dark:text-gray-400'>
                            {p.total_count} 个数据点
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export async function getStaticProps() {
  const bySchool = await getProgramsBySchool();

  const schoolEntries: SchoolEntry[] = Object.entries(bySchool)
    .map(([school, programs]) => ({
      school,
      shortName: getSchoolShortName(school),
      programs,
    }))
    .sort((a, b) => a.shortName.localeCompare(b.shortName));

  return { props: { schoolEntries } };
}
