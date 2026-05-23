import { ColumnDef } from '@tanstack/react-table';
import clsx from 'clsx';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import * as React from 'react';
import Markdown from 'react-markdown';

import { schoolAbbr } from '@/lib/feiyue.schools';
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
import Tooltip from '@/components/Tooltip';

import { Applicant, ApplicationRecord } from '@/types/feiyue';

type PageProps = {
  applicant: Applicant;
  storyContent: string | null;
};

const columns: ColumnDef<ApplicationRecord>[] = [
  {
    accessorKey: 'school',
    header: '学校',
    cell: ({ row }) => {
      const full = row.original.school;
      const abbr = schoolAbbr(full);
      if (!abbr) return full;
      return (
        <Tooltip tipChildren={full} withUnderline>
          {abbr}
        </Tooltip>
      );
    },
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
  {
    id: 'extras',
    header: '备注',
    cell: ({ row }) => {
      const { scholarship, note } = row.original;
      if (!scholarship && !note) return null;
      return (
        <span className='text-sm text-gray-600 dark:text-gray-400'>
          {scholarship && (
            <span className='mr-2'>
              <span aria-hidden='true'>🎓</span> {scholarship}
            </span>
          )}
          {note && <span>{note}</span>}
        </span>
      );
    },
  },
];

export default function ApplicantPage({
  applicant,
  storyContent,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const isLoaded = useLoaded();

  const displayName = applicant.name;

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
              <ApplicantProfile applicant={applicant} />
            </div>

            <div className='mt-4' data-fade='1'>
              <FeiyueNav />
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
                    'prose dark:prose-invert mt-4',
                    'prose-headings:text-gray-900 dark:prose-headings:text-gray-100',
                  )}
                  data-fade='6'
                >
                  <Markdown>{storyContent}</Markdown>
                </article>
              </>
            )}

            <div
              className='mt-12 rounded-lg border border-dashed border-gray-300 p-4 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400'
              data-fade='7'
            >
              发现信息有误？欢迎在下方评论区指正，或前往{' '}
              <UnstyledLink
                href='https://github.com/bjut-swift/swifts-nest/issues'
                className='text-primary-400 hover:text-primary-500'
              >
                GitHub Issues
              </UnstyledLink>{' '}
              反馈，也欢迎直接{' '}
              <UnstyledLink
                href='https://github.com/bjut-swift/swifts-nest/pulls'
                className='text-primary-400 hover:text-primary-500'
              >
                发 PR
              </UnstyledLink>{' '}
              修正。
            </div>

            <div className='mt-6' data-fade='8'>
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
