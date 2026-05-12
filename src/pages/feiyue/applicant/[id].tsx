import { ColumnDef } from '@tanstack/react-table';
import clsx from 'clsx';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import * as React from 'react';
import Markdown from 'react-markdown';

import {
  getAllApplicants,
  getApplicantById,
  getApplicantStoryContent,
} from '@/lib/feiyue.server';
import useLoaded from '@/hooks/useLoaded';

import Accent from '@/components/Accent';
import ApplicantProfile from '@/components/feiyue/ApplicantProfile';
import FeiyueGiscus from '@/components/feiyue/FeiyueGiscus';
import FeiyueNav from '@/components/feiyue/FeiyueNav';
import ResultBadge from '@/components/feiyue/ResultBadge';
import Layout from '@/components/layout/Layout';
import UnstyledLink from '@/components/links/UnstyledLink';
import Seo from '@/components/Seo';
import Table from '@/components/table/Table';

import { Applicant, ApplicationRecord } from '@/types/feiyue';

type PageProps = {
  applicant: Applicant;
  storyContent: string | null;
};

const columns: ColumnDef<ApplicationRecord>[] = [
  {
    accessorKey: 'school',
    header: '学校',
  },
  {
    accessorKey: 'program',
    header: '项目',
    cell: ({ row }) => {
      const slug = [
        row.original.school,
        row.original.program,
        row.original.degree,
      ]
        .join('-')
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      return (
        <UnstyledLink
          href={`/feiyue/program/${slug}`}
          className='text-primary-400 hover:text-primary-500'
        >
          {row.original.program}
        </UnstyledLink>
      );
    },
  },
  {
    accessorKey: 'degree',
    header: '学位',
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

export default function ApplicantPage({
  applicant,
  storyContent,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const isLoaded = useLoaded();

  const displayName = applicant.anonymous ? '匿名' : applicant.name;

  const extras = applicant.applications.filter((a) => a.scholarship || a.note);

  return (
    <Layout>
      <Seo
        templateTitle={`${displayName} — 飞跃手册`}
        description={`${displayName} 的留学申请记录`}
      />

      <main>
        <section className={clsx(isLoaded && 'fade-in-start')}>
          <div className='layout py-12'>
            <div data-fade='0'>
              <FeiyueNav />
            </div>

            <div className='mt-4' data-fade='1'>
              <ApplicantProfile applicant={applicant} />
            </div>

            <h2
              className='mt-8 text-xl font-bold text-gray-900 dark:text-gray-100'
              data-fade='2'
            >
              申请项目
            </h2>
            <div data-fade='3'>
              <Table
                className='mt-4'
                data={applicant.applications}
                columns={columns}
              />
            </div>

            {extras.length > 0 && (
              <div className='mt-6 space-y-2' data-fade='4'>
                {extras.map((a, i) => (
                  <div
                    key={i}
                    className='text-sm text-gray-600 dark:text-gray-400'
                  >
                    <span className='font-medium text-gray-800 dark:text-gray-200'>
                      {a.program} @ {a.school}
                    </span>
                    {a.scholarship && (
                      <span className='ml-2'>🎓 {a.scholarship}</span>
                    )}
                    {a.note && <span className='ml-2'>— {a.note}</span>}
                  </div>
                ))}
              </div>
            )}

            {storyContent && (
              <>
                <h2
                  className='mt-12 text-xl font-bold text-gray-900 dark:text-gray-100'
                  data-fade='5'
                >
                  <Accent>申请总结</Accent>
                </h2>
                <article
                  className={clsx(
                    'prose mt-4 dark:prose-invert',
                    'prose-headings:text-gray-900 dark:prose-headings:text-gray-100'
                  )}
                  data-fade='6'
                >
                  <Markdown>{storyContent}</Markdown>
                </article>
              </>
            )}

            <div className='mt-12' data-fade='7'>
              <FeiyueGiscus />
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const applicants = await getAllApplicants();
  return {
    paths: applicants.map((a) => ({ params: { id: a.id } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<PageProps> = async ({ params }) => {
  const id = params?.id as string;
  const applicant = await getApplicantById(id);
  if (!applicant) return { notFound: true };

  const storyContent = await getApplicantStoryContent(id);

  return {
    props: {
      applicant,
      storyContent,
    },
  };
};
