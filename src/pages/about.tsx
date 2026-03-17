import clsx from 'clsx';
import * as React from 'react';
import { InView } from 'react-intersection-observer';

import useLoaded from '@/hooks/useLoaded';

import Accent from '@/components/Accent';
import Layout from '@/components/layout/Layout';
import CustomLink from '@/components/links/CustomLink';
import Seo from '@/components/Seo';
import TechStack from '@/components/TechStack';

export default function AboutPage() {
  const isLoaded = useLoaded();

  return (
    <Layout>
      <Seo
        templateTitle='关于'
        description='BJUT SWIFT（Sharing Wisdom, Innovation & Futuristic Technologies）是北京工业大学学生技术社区，致力于技术分享和知识传播。'
      />

      <main>
        {/* Header */}
        <section
          className={clsx('py-20 md:py-28', isLoaded && 'fade-in-start')}
        >
          <article className='layout'>
            <span
              className='font-display text-xs font-medium uppercase tracking-[0.3em] text-primary-400 dark:text-primary-300'
              data-fade='0'
            >
              关于
            </span>
            <h1
              className='mt-3 font-display text-[clamp(3rem,10vw,8rem)] font-bold leading-[0.85] tracking-tighter'
              data-fade='1'
            >
              BJUT{' '}
              <span className='text-primary-500 dark:text-primary-300'>
                SWIFT
              </span>
            </h1>
            <p
              className='mt-8 max-w-xl text-lg leading-relaxed text-gray-600 dark:text-gray-300 md:text-xl'
              data-fade='2'
            >
              工大学子共建的
              <strong className='text-primary-500 dark:text-primary-400'>
                技术共享平台
              </strong>
              ，愿景是创造开放共享的
              <Accent>技术生态</Accent>
            </p>
          </article>
        </section>

        {/* Divider */}
        <div className='h-px bg-gradient-to-r from-transparent via-primary-300/20 to-transparent' />

        {/* Core Projects */}
        <InView triggerOnce rootMargin='-40% 0px' fallbackInView>
          {({ ref, inView }) => (
            <section
              ref={ref}
              className={clsx(
                'bg-primary-200/40 py-28 dark:bg-white/[0.02]',
                inView && 'fade-in-start'
              )}
            >
              <article className='layout' data-fade='0'>
                <span className='mb-3 block font-display text-xs font-medium tracking-[0.3em] text-primary-400 dark:text-primary-300'>
                  01
                </span>
                <h2 className='text-2xl font-bold md:text-4xl'>
                  <Accent>核心项目</Accent>
                </h2>

                <div className='mt-8 grid gap-6 md:grid-cols-2'>
                  {projects.map((project) => (
                    <div
                      key={project.title}
                      className={clsx(
                        'group rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-600 dark:bg-dark',
                        'transition-shadow duration-200 hover:shadow-lg'
                      )}
                    >
                      <h4 className='flex items-center gap-3 text-xl font-semibold md:text-2xl'>
                        <span className='rounded-lg bg-primary-300/30 p-2.5 text-lg transition-transform duration-200 group-hover:scale-110 dark:bg-primary-400/10'>
                          {project.icon}
                        </span>
                        <CustomLink href={project.href}>
                          {project.title}
                        </CustomLink>
                      </h4>
                      <p className='mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300 md:text-base'>
                        {project.description}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          )}
        </InView>

        {/* Join Us */}
        <InView triggerOnce rootMargin='-40% 0px' fallbackInView>
          {({ ref, inView }) => (
            <section
              ref={ref}
              className={clsx('py-24', inView && 'fade-in-start')}
            >
              <article className='layout' data-fade='0'>
                <span className='mb-3 block font-display text-xs font-medium tracking-[0.3em] text-primary-400 dark:text-primary-300'>
                  02
                </span>
                <h2 className='text-2xl font-bold md:text-4xl'>
                  <Accent>加入我们</Accent>
                </h2>
                <p className='mt-4 max-w-xl text-lg leading-relaxed text-gray-600 dark:text-gray-300'>
                  我们正在构建一个
                  <Accent className='font-semibold'>开放协作</Accent>
                  的技术社区，你的每一个创意都可能成为改变校园的种子。
                </p>

                <a
                  href='mailto:bjutswift.cn@gmail.com'
                  className={clsx(
                    'mt-8 inline-flex items-center gap-3 rounded-xl px-6 py-3',
                    'bg-gradient-to-r from-primary-500 to-primary-400',
                    'font-semibold text-white shadow-sm',
                    'scale-100 hover:scale-[1.03] active:scale-[0.97] motion-safe:transform-gpu',
                    'transition duration-200'
                  )}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='h-5 w-5 text-white/70'
                  >
                    <path d='M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z' />
                    <path d='M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z' />
                  </svg>
                  bjutswift.cn@gmail.com
                </a>

                <p className='mt-4 text-sm text-gray-500 dark:text-gray-400'>
                  期待与你共同打造校园技术生态
                </p>
              </article>
            </section>
          )}
        </InView>

        {/* Tech Stack */}
        <InView triggerOnce rootMargin='-40% 0px' fallbackInView>
          {({ ref, inView }) => (
            <section
              ref={ref}
              className={clsx(
                'bg-primary-200/40 py-24 dark:bg-white/[0.02]',
                inView && 'fade-in-start'
              )}
            >
              <article className='layout' data-fade='0'>
                <span className='mb-3 block font-display text-xs font-medium tracking-[0.3em] text-primary-400 dark:text-primary-300'>
                  03
                </span>
                <h2 className='text-2xl font-bold md:text-4xl'>
                  <Accent>技术栈</Accent>
                </h2>
                <div className='mt-8'>
                  <TechStack />
                </div>
              </article>
            </section>
          )}
        </InView>
      </main>
    </Layout>
  );
}

const projects = [
  {
    icon: '📖',
    title: 'BJUT-Helper',
    href: 'https://helper.bjutswift.cn',
    description:
      '全称为：北京工业大学课程资源共享计划。旨在整合分享全校课程近年的试题、笔记、以及有限开卷等各类学习资料。欢迎前来阅读、贡献本项目！希望本平台能够助你在前人努力的基础上走得更远。',
  },
  {
    icon: '💻',
    title: 'BJUT-CS',
    href: 'https://www.bjutswift.cn/bjut-cs',
    description:
      '北京工业大学 CS 相关知识库与经验分享。受浙江大学和清华大学相关项目启发创立，作为 BJUT-Helper 的拓展项目，专为计算机相关专业的学习资源进行收录。',
  },
  {
    icon: '🎨',
    title: 'BJUT-PPT-Template',
    href: 'https://github.com/bjut-swift/BJUT-PPT-template',
    description:
      '针对北京工业大学视觉形象识别系统，设计了这款 PPT 模版，欢迎北工大学子前来下载使用。提供 4:3 和 16:9 两种大小。同时提供了包括校训、校标、校徽等在内的 BJUT 的 SVG 素材。',
  },
  {
    icon: '📝',
    title: 'BJUT-LaTeX-Template',
    href: 'https://github.com/bjut-swift/BJUTLATEX',
    description:
      '希望借助此模版，使用者能将本就在毕业季不多的精力专注于文字而不是行距、行高、段落等繁琐的格式上。',
  },
];
