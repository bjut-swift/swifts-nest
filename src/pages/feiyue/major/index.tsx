import clsx from 'clsx';
import { InferGetStaticPropsType } from 'next';
import * as React from 'react';

import { getAllMajors } from '@/lib/feiyue.server';
import useLoaded from '@/hooks/useLoaded';

import Accent from '@/components/Accent';
import FeiyueNav from '@/components/feiyue/FeiyueNav';
import Layout from '@/components/layout/Layout';
import UnstyledLink from '@/components/links/UnstyledLink';
import Seo from '@/components/Seo';

import { MajorSummary } from '@/types/feiyue';

export default function MajorIndexPage({
  majors,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const isLoaded = useLoaded();

  return (
    <Layout>
      <Seo
        templateTitle='按专业查看 — 飞跃手册'
        description='按本科专业查看北工大学生的留学申请情况。'
      />

      <main>
        <section className={clsx(isLoaded && 'fade-in-start')}>
          <div className='layout py-12'>
            <div data-fade='0'>
              <FeiyueNav />
            </div>

            <h1 className='mt-4 text-3xl md:text-5xl' data-fade='1'>
              <Accent>按专业查看</Accent>
            </h1>

            <ul className='mt-8 space-y-3' data-fade='2'>
              {majors.map((major) => (
                <li
                  key={major.name}
                  className='flex items-center justify-between'
                >
                  <UnstyledLink
                    href={`/feiyue/major/${major.name}`}
                    className='text-lg text-primary-400 hover:text-primary-500'
                  >
                    {major.name}
                  </UnstyledLink>
                  <span className='text-sm text-gray-500 dark:text-gray-400'>
                    {major.applicant_count} 个案例
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export async function getStaticProps() {
  const majors: MajorSummary[] = await getAllMajors();
  return {
    props: {
      majors: majors.sort((a, b) => b.applicant_count - a.applicant_count),
    },
  };
}
