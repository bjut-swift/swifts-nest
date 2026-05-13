import clsx from 'clsx';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import * as React from 'react';

import { generateProgramSlug } from '@/lib/feiyue.client';
import {
  getAllApplicants,
  getAllMajors,
  getSchoolShortName,
} from '@/lib/feiyue.server';
import useLoaded from '@/hooks/useLoaded';

import FeiyueNav from '@/components/feiyue/FeiyueNav';
import StatsCard from '@/components/feiyue/StatsCard';
import Layout from '@/components/layout/Layout';
import UnstyledLink from '@/components/links/UnstyledLink';
import Seo from '@/components/Seo';

import { ApplicantSummary } from '@/types/feiyue';

type ProgramCount = {
  name: string;
  degree: string;
  slug: string;
  count: number;
};

type PageProps = {
  name: string;
  applicant_count: number;
  gpa_median: string;
  top_program: string;
  avg_applications: string;
  top_programs: ProgramCount[];
  applicants_by_term: Record<string, ApplicantSummary[]>;
};

export default function MajorDetailPage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const isLoaded = useLoaded();
  const terms = Object.keys(props.applicants_by_term).sort().reverse();

  return (
    <Layout>
      <Seo
        templateTitle={`${props.name} — 飞跃手册`}
        description={`${props.name} 专业的留学申请数据汇总`}
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
              {props.name}
            </h1>

            {/* Stats cards */}
            <div
              className='mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4'
              data-fade='2'
            >
              <StatsCard label='总案例数' value={props.applicant_count} />
              <StatsCard label='GPA 中位数' value={props.gpa_median} />
              <StatsCard label='最多申请' value={props.top_program} />
              <StatsCard label='人均申请' value={props.avg_applications} />
            </div>

            {/* Top programs */}
            {props.top_programs.length > 0 && (
              <>
                <h2
                  className='mt-10 text-xl font-bold text-gray-900 dark:text-gray-100'
                  data-fade='3'
                >
                  申请人数最多的项目
                </h2>
                <ol className='mt-4 space-y-2' data-fade='4'>
                  {props.top_programs.map((p, i) => (
                    <li
                      key={p.slug}
                      className='flex items-center justify-between'
                    >
                      <div className='flex items-center gap-2'>
                        <span className='text-sm text-gray-400'>{i + 1}.</span>
                        <UnstyledLink
                          href={`/feiyue/program/${p.slug}`}
                          className='text-primary-400 hover:text-primary-500'
                        >
                          {p.name}
                        </UnstyledLink>
                        <span className='rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400'>
                          {p.degree}
                        </span>
                      </div>
                      <span className='text-sm text-gray-500 dark:text-gray-400'>
                        {p.count} 人
                      </span>
                    </li>
                  ))}
                </ol>
              </>
            )}

            {/* Cases by term */}
            <h2
              className='mt-10 text-xl font-bold text-gray-900 dark:text-gray-100'
              data-fade='5'
            >
              申请案例
            </h2>
            <div className='mt-4 space-y-6' data-fade='6'>
              {terms.map((term) => (
                <div key={term}>
                  <h3 className='font-bold text-gray-800 dark:text-gray-200'>
                    {term}
                  </h3>
                  <div className='-mx-4 mt-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
                    <div className='inline-block min-w-full align-middle md:px-6 lg:px-8'>
                      <div className='overflow-hidden ring-1 ring-black ring-opacity-5 dark:ring-gray-800 md:rounded-lg'>
                        <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-800'>
                          <thead className='bg-gray-50 dark:bg-gray-700'>
                            <tr>
                              <Th>申请人</Th>
                              <Th>申请方向</Th>
                              <Th>去向</Th>
                            </tr>
                          </thead>
                          <tbody className='divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-dark'>
                            {props.applicants_by_term[term].map((a) => (
                              <tr key={a.id}>
                                <Td>
                                  <UnstyledLink
                                    href={`/feiyue/applicant/${a.id}`}
                                    className='font-medium text-primary-400 hover:text-primary-500'
                                  >
                                    {a.name}
                                  </UnstyledLink>
                                </Td>
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

export const getStaticPaths: GetStaticPaths = async () => {
  const majors = await getAllMajors();
  return {
    paths: majors.map((m) => ({ params: { name: m.name } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const name = params?.name as string;
  const allApplicants = await getAllApplicants();
  const majorApplicants = allApplicants.filter(
    (a) => a.undergraduate.major === name
  );

  if (majorApplicants.length === 0) return { notFound: true };

  // GPA median
  const gpas = majorApplicants
    .filter((a) => a.undergraduate.gpa != null)
    .map((a) => {
      const gpa = a.undergraduate.gpa as number;
      const scale = a.undergraduate.gpa_scale || 4.0;
      return scale === 4.0 ? gpa : (gpa / scale) * 4.0;
    })
    .sort((a, b) => a - b);

  const gpa_median =
    gpas.length > 0
      ? gpas.length % 2 === 0
        ? ((gpas[gpas.length / 2 - 1] + gpas[gpas.length / 2]) / 2).toFixed(2)
        : gpas[Math.floor(gpas.length / 2)].toFixed(2)
      : 'N/A';

  // Top programs
  const programCounts = new Map<
    string,
    { name: string; degree: string; slug: string; count: number }
  >();
  for (const a of majorApplicants) {
    for (const app of a.applications) {
      const slug = generateProgramSlug(app.school, app.program, app.degree);
      const existing = programCounts.get(slug);
      if (existing) {
        existing.count++;
      } else {
        programCounts.set(slug, {
          name: `${app.program}@${app.school}`,
          degree: app.degree,
          slug,
          count: 1,
        });
      }
    }
  }

  const top_programs = Array.from(programCounts.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const totalApplications = majorApplicants.reduce(
    (sum, a) => sum + a.applications.length,
    0
  );
  const avg_applications =
    majorApplicants.length > 0
      ? (totalApplications / majorApplicants.length).toFixed(2) + ' 个项目'
      : 'N/A';

  // Applicants by term (using ApplicantSummary)
  const applicants_by_term: Record<string, ApplicantSummary[]> = {};
  for (const a of majorApplicants) {
    const dest = a.applications.find((app) => app.final);
    const term = a.applications[0]?.term || '';
    const summary: ApplicantSummary = {
      id: a.id,
      name: a.anonymous ? '匿名' : a.name,
      major: a.undergraduate.major,
      directions: a.directions,
      destination: dest
        ? `${dest.program} @ ${getSchoolShortName(dest.school)}`
        : null,
      destination_slug: dest
        ? generateProgramSlug(dest.school, dest.program, dest.degree)
        : null,
      term,
    };
    if (!applicants_by_term[term]) applicants_by_term[term] = [];
    applicants_by_term[term].push(summary);
  }

  return {
    props: {
      name,
      applicant_count: majorApplicants.length,
      gpa_median,
      top_program: top_programs[0]?.name || 'N/A',
      avg_applications,
      top_programs,
      applicants_by_term,
    },
  };
};
