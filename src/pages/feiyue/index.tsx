import clsx from 'clsx';
import { InferGetStaticPropsType } from 'next';
import * as React from 'react';

import {
  getAllDirections,
  getAllMajors,
  getApplicantsByTerm,
} from '@/lib/feiyue.server';
import useLoaded from '@/hooks/useLoaded';

import Accent from '@/components/Accent';
import Tag from '@/components/content/Tag';
import FeiyueNav from '@/components/feiyue/FeiyueNav';
import StyledInput from '@/components/form/StyledInput';
import Layout from '@/components/layout/Layout';
import UnstyledLink from '@/components/links/UnstyledLink';
import Seo from '@/components/Seo';

import { ApplicantSummary } from '@/types/feiyue';

export default function FeiyuePage({
  applicantsByTerm,
  majors,
  directions,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const isLoaded = useLoaded();

  const [search, setSearch] = React.useState('');
  const [majorFilter, setMajorFilter] = React.useState('');
  const [directionFilter, setDirectionFilter] = React.useState('');

  const terms = Object.keys(applicantsByTerm).sort().reverse();

  const filteredByTerm = React.useMemo(() => {
    const result: Record<string, ApplicantSummary[]> = {};

    for (const term of terms) {
      const filtered = applicantsByTerm[term].filter((a) => {
        if (majorFilter && a.major !== majorFilter) return false;
        if (directionFilter && !a.directions.includes(directionFilter))
          return false;
        if (search) {
          const q = search.toLowerCase();
          return (
            a.name.toLowerCase().includes(q) ||
            a.major.toLowerCase().includes(q) ||
            (a.destination || '').toLowerCase().includes(q) ||
            a.directions.some((d) => d.toLowerCase().includes(q))
          );
        }
        return true;
      });
      if (filtered.length > 0) result[term] = filtered;
    }

    return result;
  }, [applicantsByTerm, terms, search, majorFilter, directionFilter]);

  const totalCount = Object.values(filteredByTerm).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  const toggleMajor = (m: string) =>
    setMajorFilter((prev) => (prev === m ? '' : m));
  const toggleDirection = (d: string) =>
    setDirectionFilter((prev) => (prev === d ? '' : d));

  return (
    <Layout>
      <Seo
        templateTitle='飞跃手册'
        description='北京工业大学学生留学申请数据库——记录每一份申请，照亮每一段旅程。'
      />

      <main>
        <section className={clsx(isLoaded && 'fade-in-start')}>
          <div className='layout py-12'>
            <h1 className='text-3xl md:text-5xl' data-fade='0'>
              <Accent>飞跃手册</Accent>
            </h1>
            <p className='mt-2 text-gray-600 dark:text-gray-300' data-fade='1'>
              北京工业大学学生留学申请数据库——记录每一份申请，照亮每一段旅程。
            </p>

            <div className='mt-6' data-fade='2'>
              <FeiyueNav />
            </div>

            <StyledInput
              data-fade='3'
              className='mt-6'
              placeholder='搜索申请人、专业、方向...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type='text'
            />

            <div
              className='mt-3 flex flex-wrap items-baseline justify-start gap-2 text-sm text-gray-600 dark:text-gray-300'
              data-fade='4'
            >
              <span className='font-medium'>专业：</span>
              {majors.map((m) => (
                <Tag key={m} onClick={() => toggleMajor(m)}>
                  {majorFilter === m ? <Accent>{m}</Accent> : m}
                </Tag>
              ))}
            </div>

            <div
              className='mt-2 flex flex-wrap items-baseline justify-start gap-2 text-sm text-gray-600 dark:text-gray-300'
              data-fade='5'
            >
              <span className='font-medium'>方向：</span>
              {directions.map((d) => (
                <Tag key={d} onClick={() => toggleDirection(d)}>
                  {directionFilter === d ? <Accent>{d}</Accent> : d}
                </Tag>
              ))}
            </div>

            <div className='mt-8 space-y-8' data-fade='6'>
              {Object.keys(filteredByTerm)
                .sort()
                .reverse()
                .map((term) => (
                  <TermSection
                    key={term}
                    term={term}
                    applicants={filteredByTerm[term]}
                  />
                ))}
            </div>

            <p className='mt-6 text-sm text-gray-500 dark:text-gray-400'>
              共 {totalCount} 位申请人
            </p>

            <div className='mt-8 rounded-lg border border-dashed border-gray-300 p-6 text-center dark:border-gray-700'>
              <p className='text-gray-600 dark:text-gray-300'>
                想分享你的申请数据？
              </p>
              <UnstyledLink
                href='/feiyue/contribute'
                className='mt-2 inline-block font-medium text-primary-400 hover:text-primary-500'
              >
                在线填写并提交 →
              </UnstyledLink>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

function TermSection({
  term,
  applicants,
}: {
  term: string;
  applicants: ApplicantSummary[];
}) {
  return (
    <div>
      <h2 className='text-lg font-bold text-gray-900 dark:text-gray-100'>
        {term}
      </h2>
      <div className='-mx-4 mt-3 overflow-x-auto sm:-mx-6 lg:-mx-8'>
        <div className='inline-block min-w-full align-middle md:px-6 lg:px-8'>
          <div className='overflow-hidden ring-1 ring-black ring-opacity-5 dark:ring-gray-800 md:rounded-lg'>
            <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-800'>
              <thead className='bg-gray-50 dark:bg-gray-700'>
                <tr>
                  <Th>申请人</Th>
                  <Th>专业</Th>
                  <Th>申请方向</Th>
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
                    <Td>
                      <div className='flex flex-wrap gap-1'>
                        {a.directions.map((d) => (
                          <span
                            key={d}
                            className='rounded bg-gray-100 px-1.5 py-0.5 text-xs dark:bg-gray-800'
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </Td>
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
  const applicantsByTerm = await getApplicantsByTerm();
  const allMajors = await getAllMajors();
  const allDirections = await getAllDirections();

  return {
    props: {
      applicantsByTerm,
      majors: allMajors.map((m) => m.name).sort(),
      directions: Object.keys(allDirections).sort(),
    },
  };
}
