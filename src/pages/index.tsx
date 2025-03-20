import clsx from 'clsx';
import { InferGetStaticPropsType } from 'next';
import * as React from 'react';
import { IoArrowDownOutline } from 'react-icons/io5';
import { SiGithub } from 'react-icons/si';
import { InView } from 'react-intersection-observer';

import { trackEvent } from '@/lib/analytics';
import { getAllFilesFrontmatter, getFeatured } from '@/lib/mdx.server';
import { generateRss } from '@/lib/rss';
import useInjectContentMeta from '@/hooks/useInjectContentMeta';
import useLoaded from '@/hooks/useLoaded';

import Accent from '@/components/Accent';
import BlogCard from '@/components/content/blog/BlogCard';
import ShortsCard from '@/components/content/card/ShortsCard';
import ProjectCard from '@/components/content/projects/ProjectCard';
import Layout from '@/components/layout/Layout';
import ButtonLink from '@/components/links/ButtonLink';
import CustomLink from '@/components/links/CustomLink';
import UnstyledLink from '@/components/links/UnstyledLink';
import Seo from '@/components/Seo';
import TC from '@/components/TC';
import Tooltip from '@/components/Tooltip';

import Lark from '/public/images/Lark.svg';

export default function IndexPage({
  featuredPosts,
  featuredProjects,
  featuredShorts,
  introPosts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const populatedPosts = useInjectContentMeta('blog', featuredPosts);
  const populatedIntro = useInjectContentMeta('blog', introPosts);
  const populatedProjects = useInjectContentMeta('projects', featuredProjects);
  const populatedShorts = useInjectContentMeta('library', featuredShorts);

  const isLoaded = useLoaded();

  return (
    <Layout>
      <Seo />

      <main>
        <section
          className={clsx(
            'min-h-main -mt-20 mb-20 flex flex-col justify-center',
            isLoaded && 'fade-in-start'
          )}
        >
          <article className='layout'>
            <h2 className='text-2xl md:text-4xl 2xl:text-5xl' data-fade='1'>
              Hi!
            </h2>
            <h1
              className='mt-1 text-3xl md:text-5xl 2xl:text-6xl'
              data-fade='2'
            >
              We are{' '}
              <Accent className='bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent'>
                BJUT-SWIFT
              </Accent>
            </h1>
            <p
              className='mt-2 max-w-4xl text-sm leading-relaxed text-gray-700 dark:text-gray-200 md:mt-3 md:text-base 2xl:text-lg'
              data-fade='2'
            >
              Sharing Wisdom, Innovation & Futuristic Technologies (S.W.I.F.T.)
            </p>
            <p
              className={clsx(
                'mt-4 max-w-4xl text-gray-700 dark:text-gray-200 md:mt-6',
                'md:text-lg 2xl:text-xl'
              )}
              data-fade='3'
            >
              我们需要你们的力量，欢迎联系以加入组织、申请立项、反馈意见。
            </p>

            <p
              className='mt-3 max-w-4xl leading-relaxed text-gray-700 dark:text-gray-200 md:mt-4 md:text-lg 2xl:text-xl'
              data-fade='4'
            >
              欢迎来我们的 <CustomLink href='/guestbook'>留言簿</CustomLink>{' '}
              留下你的声音！
            </p>
            <div
              data-fade='5'
              className='mt-8 flex flex-wrap gap-4 md:!text-lg'
            >
              <div className='group relative'>
                <div
                  className={clsx(
                    'absolute -inset-0.5 animate-tilt rounded blur',
                    'bg-gradient-to-r from-primary-300 to-primary-400',
                    'dark:from-primary-200 dark:via-primary-300',
                    'opacity-75 transition duration-1000 group-hover:opacity-100 group-hover:duration-200'
                  )}
                />
                <ButtonLink href='#intro'>我们的工作</ButtonLink>
              </div>
              <ButtonLink href='/about'>了解 BJUT-SWIFT</ButtonLink>
            </div>
            <div
              data-fade='6'
              className='mt-4 flex flex-wrap gap-4 gap-y-2 md:mt-8'
            >
              <UnstyledLink
                href='https://fafmkoqaxys.feishu.cn/base/W1XfbxnbUaOGh2s99ErcyZrdnPc?table=tblyS1mwO2WUSuBZ&view=vewoiUIlNk'
                className={clsx(
                  'inline-flex items-center gap-1 text-sm font-medium md:text-base',
                  'group text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white',
                  'focus:outline-none focus-visible:ring focus-visible:ring-primary-300',
                  'transition-colors'
                )}
                onClick={() => {
                  trackEvent('Social Link: Lark', { type: 'link' });
                }}
              >
                <Lark
                  height={16}
                  width={16}
                  className='shrink-0 transition-colors group-hover:text-[#1da1f2]'
                />
                <span>飞书问卷</span>
              </UnstyledLink>
              <UnstyledLink
                href='https://github.com/bjut-swift'
                className={clsx(
                  'inline-flex items-center gap-1 text-sm font-medium md:text-base',
                  'text-gray-600 hover:text-black dark:text-gray-400 dark:hover:text-white',
                  'focus:outline-none focus-visible:ring focus-visible:ring-primary-300',
                  'transition-colors'
                )}
                onClick={() => {
                  trackEvent('Social Link: Github', { type: 'link' });
                }}
              >
                <SiGithub className='shrink-0' />
                <span>bjut-swift</span>
              </UnstyledLink>
            </div>
          </article>
          <UnstyledLink
            href='#intro'
            className={clsx(
              'absolute bottom-2 left-1/2 -translate-x-1/2 md:bottom-10',
              'cursor-pointer rounded-md transition-colors',
              'hover:text-primary-300 focus-visible:text-primary-300'
            )}
          >
            <IoArrowDownOutline className='h-8 w-8 animate-bounce md:h-10 md:w-10' />
          </UnstyledLink>
          <TC
            className={clsx(
              'absolute bottom-0 right-6',
              'translate-y-[37%] transform-gpu',
              'w-[calc(100%-3rem)] md:w-[600px] 2xl:w-[900px]',
              'z-[-1] opacity-70 dark:opacity-30'
            )}
          />
        </section>

        <InView triggerOnce rootMargin='-40% 0px'>
          {({ ref, inView }) => (
            <section
              ref={ref}
              id='intro'
              className={clsx('py-20', inView && 'fade-in-start')}
            >
              <article className='layout' data-fade='0'>
                <div className='flex flex-col md:flex-row md:items-center md:gap-8'>
                  <div className='w-full md:w-1/2'>
                    <h2 className='text-4xl md:text-6xl'>
                      <Accent className='inline decoration-clone leading-snug dark:leading-none'>
                        探索技术，
                        <br className='md:hidden' />
                        <span className='md:ml-2'>分享知识</span>
                      </Accent>
                    </h2>
                    <div className='mt-4 text-base text-gray-600 dark:text-gray-300 md:text-lg'>
                      <Tooltip
                        withUnderline
                        tipChildren={
                          <>
                            BJUT-SWIFT 是北京工业大学的学生技术社区，致力于
                            <strong>技术分享</strong>和<strong>知识传播</strong>
                            ，帮助同学们在技术领域更好地成长。
                          </>
                        }
                      >
                        <span>BJUT-SWIFT</span>
                      </Tooltip>{' '}
                      旨在让技术学习变得更加{' '}
                      <strong className='text-gray-700 dark:text-gray-200'>
                        简单
                      </strong>{' '}
                      和{' '}
                      <strong className='text-gray-700 dark:text-gray-200'>
                        高效
                      </strong>
                      。在我们的平台上，你可以找到实用的教程、项目经验分享以及最新的技术动态，
                      帮助你在信息技术的海洋中找到前进的方向。
                    </div>
                  </div>

                  <div className='mt-8 w-full md:mt-0 md:w-1/2'>
                    <div className='perspective-1000 relative mx-auto h-[400px] w-[350px] max-w-full'>
                      <div className='group relative h-full w-full'>
                        <div className='absolute inset-0 z-10 transition-all duration-700 ease-in-out group-hover:z-0 group-hover:translate-x-[8%] group-hover:translate-y-[5%] group-hover:rotate-6 group-hover:opacity-90'>
                          <BlogCard
                            className='h-full w-full rounded-xl shadow-lg transition-shadow duration-300 hover:shadow-xl'
                            post={populatedIntro[0]}
                          />
                        </div>

                        <div className='absolute inset-0 z-0 translate-x-[8%] translate-y-[5%] rotate-6 opacity-90 transition-all duration-700 ease-in-out group-hover:z-10 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:rotate-0 group-hover:opacity-100'>
                          <BlogCard
                            className='h-full w-full rounded-xl shadow-lg transition-shadow duration-300 hover:shadow-xl'
                            post={populatedIntro[1]}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </section>
          )}
        </InView>

        <InView triggerOnce rootMargin='-40% 0px'>
          {({ ref, inView }) => (
            <section
              ref={ref}
              className={clsx('py-20', inView && 'fade-in-start')}
            >
              <article className='layout' data-fade='0'>
                <h2 className='text-2xl md:text-4xl' id='blog'>
                  <Accent>专栏分享</Accent>
                </h2>
                <p className='mt-2 text-gray-600 dark:text-gray-300'>
                  我们想传的更远的一些声音。
                </p>
                <ul className='mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                  {populatedPosts.map((post, i) => (
                    <BlogCard
                      key={post.slug}
                      post={post}
                      className={clsx(i > 2 && 'hidden sm:block')}
                    />
                  ))}
                </ul>
                <ButtonLink
                  className='mt-4'
                  href='/blog'
                  onClick={() =>
                    trackEvent('Home: See more post', { type: 'navigate' })
                  }
                >
                  查看更多专栏
                </ButtonLink>
              </article>
            </section>
          )}
        </InView>

        <InView triggerOnce rootMargin='-40% 0px'>
          {({ ref, inView }) => (
            <section
              ref={ref}
              className={clsx('py-20', inView && 'fade-in-start')}
            >
              <article className='layout' data-fade='0'>
                <h2 className='text-2xl md:text-4xl' id='projects'>
                  <Accent>已有项目</Accent>
                </h2>
                <p className='mt-2 text-gray-600 dark:text-gray-300'>
                  正在发展中，欢迎任何同学参与建设。
                </p>
                <ul className='mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                  {populatedProjects.map((project, i) => (
                    <ProjectCard
                      key={project.slug}
                      project={project}
                      className={clsx(i > 2 && 'hidden sm:block')}
                    />
                  ))}
                </ul>
                <ButtonLink
                  className='mt-4'
                  href='/projects'
                  onClick={() =>
                    trackEvent('Home: See more project', { type: 'navigate' })
                  }
                >
                  查看更多项目
                </ButtonLink>
              </article>
            </section>
          )}
        </InView>

        <InView triggerOnce rootMargin='-40% 0px'>
          {({ ref, inView }) => (
            <section
              ref={ref}
              className={clsx('py-20', inView && 'fade-in-start')}
            >
              <article className='layout' data-fade='0'>
                <h2 className='text-2xl md:text-4xl' id='library'>
                  <Accent>教程</Accent>
                </h2>
                <p className='mt-2 text-gray-600 dark:text-gray-300'>
                  短小精悍的教程，通常来自个人笔记和技术分享活动。
                </p>
                <ul className='mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                  {populatedShorts.map((short, i) => (
                    <ShortsCard
                      key={short.slug}
                      short={short}
                      className={clsx(i > 2 && 'hidden sm:block')}
                    />
                  ))}
                </ul>
                <ButtonLink
                  className='mt-4'
                  href='/shorts'
                  onClick={() =>
                    trackEvent('Home: See more shorts', { type: 'navigate' })
                  }
                >
                  查看更多教程
                </ButtonLink>
              </article>
            </section>
          )}
        </InView>
      </main>
    </Layout>
  );
}

export async function getStaticProps() {
  generateRss();

  const blogs = await getAllFilesFrontmatter('blog');
  const projects = await getAllFilesFrontmatter('projects');
  const shorts = await getAllFilesFrontmatter('library');

  const featuredPosts = getFeatured(blogs, [
    '2025-intern-interview',
    '2024-cs50x',
    '2023-code-journy',
  ]);
  const featuredProjects = getFeatured(projects, [
    'bjut-helper',
    'bjut-latex',
    'bjut-ppt-temple',
    'bjut-chaoxing',
  ]);
  const featuredShorts = getFeatured(shorts, [
    'tech/swift-git-guide',
    'tech/swift-nextjs-guide',
    'writing-guide',
  ]);

  const introPosts = getFeatured(blogs, [
    '2025-intern-interview',
    '2024-cs50x',
  ]);

  return {
    props: {
      featuredPosts,
      featuredProjects,
      featuredShorts,
      introPosts,
    },
  };
}
