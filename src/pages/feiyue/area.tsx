import clsx from 'clsx';
import { InferGetStaticPropsType } from 'next';
import * as React from 'react';

import { getAllDirections } from '@/lib/feiyue.server';
import useLoaded from '@/hooks/useLoaded';

import Accent from '@/components/Accent';
import Tag from '@/components/content/Tag';
import FeiyueNav from '@/components/feiyue/FeiyueNav';
import Layout from '@/components/layout/Layout';
import UnstyledLink from '@/components/links/UnstyledLink';
import Seo from '@/components/Seo';

export default function AreaPage({
  directionEntries,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const isLoaded = useLoaded();

  const directionNames = directionEntries.map((d) => d.name);

  const scrollTo = (name: string) => {
    const el = document.getElementById(`dir-${name}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Layout>
      <Seo
        templateTitle='按方向查看 — 飞跃手册'
        description='按申请方向查看北工大学生的留学申请情况。'
      />

      <main>
        <section className={clsx(isLoaded && 'fade-in-start')}>
          <div className='layout py-12'>
            <div data-fade='0'>
              <FeiyueNav />
            </div>

            <h1 className='mt-4 text-3xl md:text-5xl' data-fade='1'>
              <Accent>按方向查看</Accent>
            </h1>

            {/* Tag navigation */}
            <div className='mt-6 flex flex-wrap gap-2' data-fade='2'>
              {directionNames.map((name) => (
                <Tag key={name} onClick={() => scrollTo(name)}>
                  {name}
                </Tag>
              ))}
            </div>

            {/* Sections per direction */}
            <div className='mt-8 space-y-10' data-fade='3'>
              {directionEntries.map(({ name, applicants }) => (
                <div key={name} id={`dir-${name}`}>
                  <h2 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
                    {name}
                    <span className='ml-2 text-sm font-normal text-gray-500 dark:text-gray-400'>
                      {applicants.length} 人
                    </span>
                  </h2>

                  <div className='-mx-4 mt-3 overflow-x-auto sm:-mx-6 lg:-mx-8'>
                    <div className='inline-block min-w-full align-middle md:px-6 lg:px-8'>
                      <div className='overflow-hidden ring-1 ring-black ring-opacity-5 dark:ring-gray-800 md:rounded-lg'>
                        <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-800'>
                          <thead className='bg-gray-50 dark:bg-gray-700'>
                            <tr>
                              <Th>申请人</Th>
                              <Th>专业</Th>
                              <Th>学期</Th>
                              <Th>去向</Th>
                            </tr>
                          </thead>
                          <tbody className='divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-dark'>
                            {applicants.map((a) => (
                              <tr key={a.id}>
                                <Td>
                                  <UnstyledLink
                                    href={`/feiyue/applicant/${a.id}`}
                                    className='font-medium text-primary-400 hover:text-primary-500'
                                  >
                                    {a.name}
                                  </UnstyledLink>
                                </Td>
                                <Td>{a.major}</Td>
                                <Td>{a.term}</Td>
                                <Td>
                                  {a.destination && a.destination_slug ? (
                                    <UnstyledLink
                                      href={`/feiyue/program/${a.destination_slug}`}
                                      className='text-primary-400 hover:text-primary-500'
                                    >
                                      {a.destination}
                                    </UnstyledLink>
                                  ) : (
                                    <span className='text-gray-400'>N/A</span>
                                  )}
                                </Td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-200'>
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-700 dark:text-gray-300'>
      {children}
    </td>
  );
}

export async function getStaticProps() {
  const directions = await getAllDirections();

  const directionEntries = Object.entries(directions)
    .map(([name, applicants]) => ({ name, applicants }))
    .sort((a, b) => b.applicants.length - a.applicants.length);

  return { props: { directionEntries } };
}
