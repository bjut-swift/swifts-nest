import clsx from 'clsx';
import { InferGetStaticPropsType } from 'next';
import * as React from 'react';

import { getProgramsBySchool } from '@/lib/feiyue.server';
import useLoaded from '@/hooks/useLoaded';

import Accent from '@/components/Accent';
import FeiyueNav from '@/components/feiyue/FeiyueNav';
import Layout from '@/components/layout/Layout';
import UnstyledLink from '@/components/links/UnstyledLink';
import Seo from '@/components/Seo';

import { ProgramSummary } from '@/types/feiyue';

type SchoolEntry = { school: string; programs: ProgramSummary[] };

export default function ProgramIndexPage({
  schoolEntries,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const isLoaded = useLoaded();

  const scrollTo = (school: string) => {
    const el = document.getElementById(`school-${school}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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

            <h1 className='mt-4 text-3xl md:text-5xl' data-fade='1'>
              <Accent>按项目查看</Accent>
            </h1>

            <div className='mt-6 flex flex-col gap-8 lg:flex-row' data-fade='2'>
              {/* Sidebar: school directory */}
              <aside className='lg:sticky lg:top-24 lg:h-fit lg:w-48 lg:shrink-0'>
                <p className='text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400'>
                  目录
                </p>
                <ul className='mt-2 space-y-1 text-sm'>
                  {schoolEntries.map(({ school }) => (
                    <li key={school}>
                      <button
                        onClick={() => scrollTo(school)}
                        className='text-left text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-300'
                      >
                        {school}
                      </button>
                    </li>
                  ))}
                </ul>
              </aside>

              {/* Main content */}
              <div className='min-w-0 flex-1 space-y-8'>
                {schoolEntries.map(({ school, programs }) => (
                  <div key={school} id={`school-${school}`}>
                    <h2 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
                      {school}
                    </h2>
                    <ul className='mt-3 space-y-2'>
                      {programs.map((p) => (
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
    .map(([school, programs]) => ({ school, programs }))
    .sort((a, b) => a.school.localeCompare(b.school));

  return { props: { schoolEntries } };
}
