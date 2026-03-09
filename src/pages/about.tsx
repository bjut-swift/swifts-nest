/* eslint-disable unused-imports/no-unused-imports */
import clsx from 'clsx';
import * as React from 'react';

import { trackEvent } from '@/lib/analytics';
import useLoaded from '@/hooks/useLoaded';

import Accent from '@/components/Accent';
import CloudinaryImg from '@/components/images/CloudinaryImg';
import LaTeX from '@/components/LaTeX';
import Layout from '@/components/layout/Layout';
import CustomLink from '@/components/links/CustomLink';
import Seo from '@/components/Seo';
import TechStack from '@/components/TechStack';
import Tooltip from '@/components/Tooltip';

export default function AboutPage() {
  const isLoaded = useLoaded();

  return (
    <Layout>
      <Seo
        templateTitle='About'
        description='Sharing Wisdom, Innovation & Futuristic Technologies (S.W.I.F.T.)'
      />

      <main className='mx-auto max-w-5xl px-4'>
        {/* 品牌头图部分 */}
        <section
          className={clsx('relative py-24', isLoaded && 'fade-in-start')}
        >
          <div className='space-y-8 text-center'>
            <h2
              data-fade='0'
              className='text-4xl font-bold text-gray-900 dark:text-gray-50'
            >
              关于
            </h2>
            <h1 className='mt-4 text-7xl font-bold' data-fade='1'>
              <Accent className='bg-gradient-to-r from-primary-500 to-primary-400 bg-clip-text text-transparent'>
                BJUT SWIFT
              </Accent>
            </h1>
            <div data-fade='2' className='mx-auto max-w-2xl'>
              <p className='text-xl leading-relaxed text-gray-600 dark:text-gray-300'>
                工大学子共建的
                <em className='font-semibold text-primary-500 dark:text-primary-400'>
                  技术共享平台
                </em>
                <br />
                愿景是创造开放共享的
                <Accent className='underline decoration-primary-400 decoration-wavy'>
                  技术生态
                </Accent>
              </p>
            </div>
          </div>
        </section>

        {/* 项目展示部分 */}
        <section className='py-20'>
          <div className='relative overflow-hidden rounded-3xl'>
            <div className='absolute inset-0 bg-gradient-to-br from-primary-300/20 via-primary-200/10 to-primary-400/20 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800' />
            <div className='relative px-8 py-12'>
              <div className='mb-16 text-center'>
                <h3 className='text-4xl font-bold'>
                  <Accent>核心项目</Accent>
                </h3>
              </div>

              <div className='mx-auto grid max-w-4xl gap-8 md:grid-cols-2'>
                <div className='group rounded-2xl bg-white/70 p-6 transition-all duration-300 hover:shadow-lg dark:bg-gray-800/70'>
                  <h4 className='flex items-center gap-3 text-2xl font-semibold'>
                    <span className='rounded-xl bg-primary-300/30 p-3 transition-transform group-hover:scale-110 dark:bg-primary-400/10'>
                      📖
                    </span>
                    <CustomLink href='https://helper.bjutswift.cn'>
                      BJUT-Helper
                    </CustomLink>
                  </h4>
                  <p className='mt-4 text-gray-600 dark:text-gray-300'>
                    全称为：北京工业大学课程资源共享计划。
                    <br />
                    旨在整合分享全校课程近年的试题、笔记、以及有限开卷等各类学习资料。欢迎前来阅读、贡献本项目！
                    <br />
                    希望本平台能够助你在前人努力的基础上走得更远。
                  </p>
                </div>

                <div className='group rounded-2xl bg-white/70 p-6 transition-all duration-300 hover:shadow-lg dark:bg-gray-800/70'>
                  <h4 className='flex items-center gap-3 text-2xl font-semibold'>
                    <span className='rounded-xl bg-primary-300/30 p-3 transition-transform group-hover:scale-110 dark:bg-primary-400/10'>
                      💻
                    </span>
                    <CustomLink href='https://bjutswift.cn/bjut-cs'>
                      BJUT-CS
                    </CustomLink>
                  </h4>
                  <p className='mt-4 text-gray-600 dark:text-gray-300'>
                    北京工业大学 CS 相关知识库与经验分享。
                    <br />
                    受浙江大学和清华大学相关项目启发创立，作为 BJUT-Helper
                    的拓展项目，专为计算机相关专业的学习资源进行收录。
                  </p>
                </div>

                <div className='group rounded-2xl bg-white/70 p-6 transition-all duration-300 hover:shadow-lg dark:bg-gray-800/70'>
                  <h4 className='flex items-center gap-3 text-2xl font-semibold'>
                    <span className='rounded-xl bg-primary-300/30 p-3 transition-transform group-hover:scale-110 dark:bg-primary-400/10'>
                      🎨
                    </span>
                    <CustomLink href='https://github.com/bjut-swift/BJUT-PPT-template'>
                      BJUT-PPT-Template
                    </CustomLink>
                  </h4>
                  <p className='mt-4 text-gray-600 dark:text-gray-300'>
                    针对
                    <CustomLink href='https://www.bjut.edu.cn/dxwh/gdbs1.htm'>
                      北京工业大学视觉形象识别系统
                    </CustomLink>
                    ，设计了这款 PPT 模版，欢迎北工大学子前来下载使用。提供 4:3
                    和 16:9 两种大小。
                    <br />
                    同时，在{' '}
                    <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>
                      \BJUT 矢量图
                    </code>{' '}
                    路径下提供了包括校训、校标、校徽等在内的 BJUT 的 svg
                    素材，可以二次开发使用。
                  </p>
                </div>

                <div className='group rounded-2xl bg-white/70 p-6 transition-all duration-300 hover:shadow-lg dark:bg-gray-800/70'>
                  <h4 className='flex items-center gap-3 text-2xl font-semibold'>
                    <span className='rounded-xl bg-primary-300/30 p-3 transition-transform group-hover:scale-110 dark:bg-primary-400/10'>
                      📝
                    </span>
                    <CustomLink href='https://github.com/bjut-swift/BJUTLATEX'>
                      BJUT-<LaTeX>\LaTeX</LaTeX>-Template
                    </CustomLink>
                  </h4>
                  <p className='mt-4 text-gray-600 dark:text-gray-300'>
                    希望借助此模版，使用者能将本就在毕业季不多的精力专注于文字而不是行距、行高、段落等繁琐的格式上。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 联系方式 */}
        <section className='py-20'>
          <div className='mx-auto max-w-2xl text-center'>
            <div
              className={clsx(
                'rounded-3xl border border-gray-200 bg-white/70 dark:border-gray-600 dark:bg-gray-800/60',
                'shadow-sm transition-shadow duration-300 hover:shadow-md',
                'overflow-hidden'
              )}
            >
              <div className='space-y-6 px-4 py-12 sm:px-8'>
                <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-50'>
                  加入我们
                </h2>

                <p className='text-lg leading-relaxed text-gray-600 dark:text-gray-300'>
                  我们正在构建一个
                  <Accent className='font-semibold'>开放协作</Accent>
                  的技术社区
                  <br />
                  你的每一个创意都可能成为改变校园的种子
                </p>

                <a
                  href='mailto:bjutswift.cn@gmail.com'
                  className={clsx(
                    'inline-flex items-center gap-3 rounded-2xl px-6 py-4 sm:px-8',
                    'bg-gradient-to-r from-primary-500 to-primary-400',
                    'font-semibold text-white shadow-sm',
                    'transform transition-all duration-300',
                    'hover:scale-[1.03] hover:shadow-md',
                    'active:scale-95'
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
                  <span className='text-sm sm:text-base'>
                    bjutswift.cn@gmail.com
                  </span>
                </a>

                <p className='mt-4 text-sm text-gray-500 dark:text-gray-400'>
                  期待与你共同打造校园技术生态
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 技术栈展示 */}
        <section className='py-20'>
          <div className='text-center'>
            <h3 className='mb-12 text-4xl font-bold'>
              <Accent>技术栈</Accent>
            </h3>
            <div className='relative rounded-3xl bg-gradient-to-br from-primary-300/20 via-primary-200/10 to-primary-400/20 p-12 shadow-sm dark:from-gray-800 dark:via-gray-900 dark:to-gray-800'>
              <div className='relative'>
                <TechStack />
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
