import clsx from 'clsx';
import { InferGetStaticPropsType } from 'next';
import * as React from 'react';

import { getAllFilesFrontmatter } from '@/lib/mdx.server';
import useLoaded from '@/hooks/useLoaded';

import Accent from '@/components/Accent';
import ProjectCard from '@/components/content/projects/ProjectCard';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

export default function ProjectsPage({
  projects,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const isLoaded = useLoaded();

  return (
    <Layout>
      <Seo templateTitle='已有项目' description='正在建设中……' />

      <main>
        <section className={clsx(isLoaded && 'fade-in-start')}>
          <div className='layout py-12'>
            <h1 className='text-3xl md:text-5xl' data-fade='0'>
              <Accent>已有项目</Accent>
            </h1>
            <p data-fade='1' className='mt-2 text-gray-600 dark:text-gray-300'>
              正在发展中，欢迎任何同学参与建设。
            </p>

            <ul
              data-fade='2'
              className='mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3'
            >
              {projects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </ul>
          </div>
        </section>
      </main>
    </Layout>
  );
}

const PROJECT_ORDER = [
  'bjut-helper',
  'bjut-undergraduate-thesis',
  'bjut-cs',
  'bjut-latex',
  'bjut-ppt-temple',
  'bjut-chaoxing',
];

export async function getStaticProps() {
  const files = await getAllFilesFrontmatter('projects');
  const rank = (slug: string) => {
    const i = PROJECT_ORDER.indexOf(slug);
    return i === -1 ? PROJECT_ORDER.length : i;
  };
  const projects = files.sort((a, b) => rank(a.slug) - rank(b.slug));

  return { props: { projects } };
}
