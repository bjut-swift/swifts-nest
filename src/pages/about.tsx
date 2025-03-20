/* eslint-disable unused-imports/no-unused-imports */
import clsx from 'clsx';
import * as React from 'react';

import { trackEvent } from '@/lib/analytics';
import useLoaded from '@/hooks/useLoaded';

import Accent from '@/components/Accent';
import FeishuDocEmbed from '@/components/FeishuDocEmbed';
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
          <div className='absolute inset-0 -z-10'>
            <div className='absolute inset-0 bg-gradient-to-br from-blue-500/30 via-cyan-500/20 to-sky-600/30 opacity-30 blur-3xl' />
            <div className='bg-noise absolute inset-0 opacity-20' />
          </div>
          <div className='space-y-8 text-center'>
            <h2
              data-fade='0'
              className='text-4xl font-bold text-gray-900 dark:text-gray-50'
            >
              关于 <span className='animate-wiggle inline-block'>👋</span>
            </h2>
            <h1 className='mt-4 text-7xl font-bold' data-fade='1'>
              <Accent className='bg-gradient-to-r from-blue-800 to-purple-600 bg-clip-text text-transparent'>
                BJUT SWIFT
              </Accent>
            </h1>
            <div data-fade='2' className='mx-auto max-w-2xl'>
              <p className='text-xl leading-relaxed text-gray-600 dark:text-gray-300'>
                工大学子共建的
                <em className='font-semibold text-blue-500'>技术共享平台</em>
                <br />
                愿景是创造开放共享的
                <Accent className='underline decoration-blue-500 decoration-wavy'>
                  技术生态
                </Accent>
              </p>
            </div>
          </div>
        </section>

        {/* 项目展示部分 */}
        <section className='py-20'>
          <div className='relative overflow-hidden rounded-3xl'>
            <div className='absolute inset-0 bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800' />
            <div className='bg-noise absolute inset-0 opacity-10' />
            <div className='relative px-8 py-12'>
              <div className='mb-16 text-center'>
                <h3 className='text-4xl font-bold'>
                  <span className='bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-300'>
                    核心项目 📚
                  </span>
                </h3>
              </div>

              <div className='mx-auto grid max-w-4xl gap-8 md:grid-cols-2'>
                <div className='group rounded-2xl bg-white/70 p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:bg-gray-800/70'>
                  <h4 className='flex items-center gap-3 text-2xl font-semibold'>
                    <span className='rounded-xl bg-blue-100 p-3 transition-transform group-hover:scale-110 dark:bg-blue-900/30'>
                      📖
                    </span>
                    <CustomLink
                      href='https://helper.bjutswift.cn'
                      className='text-blue-600 dark:text-blue-400'
                    >
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

                <div className='group rounded-2xl bg-white/70 p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:bg-gray-800/70'>
                  <h4 className='flex items-center gap-3 text-2xl font-semibold'>
                    <span className='rounded-xl bg-blue-100 p-3 transition-transform group-hover:scale-110 dark:bg-blue-900/30'>
                      🎨
                    </span>
                    <CustomLink
                      href='https://github.com/bjut-swift/BJUT-PPT-template'
                      className='text-blue-600 dark:text-blue-400'
                    >
                      BJUT-PPT-Template
                    </CustomLink>
                  </h4>
                  <p className='mt-4 text-gray-600 dark:text-gray-300'>
                    针对
                    <CustomLink href='https://www.bjut.edu.cn/dxwh/gdbs1.htm'>
                      北京工业大学视觉形象识别系统
                    </CustomLink>
                    ，设计了这款PPT模版，欢迎北工大学子前来下载使用。提供4:3和16:9两种大小。
                    <br />
                    同时，在{' '}
                    <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>
                      \BJUT矢量图
                    </code>{' '}
                    路径下提供了包括校训、校标、校徽等在内的BJUT的svg素材，可以二次开发使用。
                  </p>
                </div>

                <div className='group rounded-2xl bg-white/70 p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:bg-gray-800/70'>
                  <h4 className='flex items-center gap-3 text-2xl font-semibold'>
                    <span className='rounded-xl bg-blue-100 p-3 transition-transform group-hover:scale-110 dark:bg-blue-900/30'>
                      📝
                    </span>
                    <CustomLink
                      href='https://github.com/bjut-swift/BJUTLATEX'
                      className='text-blue-600 dark:text-blue-400'
                    >
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

        {/* 联系方式 - 暗色模式智能光效版 */}
        <section className='group relative py-20'>
          {/* 完全重新设计的光效系统 */}
          <div className='absolute left-1/2 top-1/2 -z-10 max-h-[200%] max-w-[200%] -translate-x-1/2 -translate-y-1/2'>
            {/* 中心光晕 - 大范围发散 */}
            <div className='absolute left-1/2 top-1/2 max-h-[60vh] max-w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-blue-500/5 via-cyan-400/5 to-purple-500/5 opacity-0 blur-[100px] transition-opacity duration-700 group-hover:opacity-100 dark:from-blue-500/20 dark:via-cyan-400/15 dark:to-purple-500/20'></div>

            {/* 左上光晕 */}
            <div className='absolute left-[40%] top-[40%] h-[30vh] w-[30vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 opacity-0 blur-[80px] transition-opacity duration-700 group-hover:opacity-70 dark:bg-blue-500/15'></div>

            {/* 右下光晕 */}
            <div className='absolute left-[60%] top-[60%] h-[25vh] w-[25vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-500/5 opacity-0 blur-[60px] transition-opacity duration-700 group-hover:opacity-70 dark:bg-cyan-400/15'></div>

            {/* 动态脉冲光晕 */}
            <div className='absolute left-1/2 top-1/2 h-[40vh] w-[40vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-400/10 opacity-0 blur-[80px] transition-opacity duration-500 group-hover:opacity-0 dark:animate-pulse dark:from-blue-500/20 dark:to-cyan-400/20 dark:group-hover:opacity-80'></div>
          </div>

          <div className='relative z-10 mx-auto max-w-2xl px-4'>
            <div
              className={clsx(
                'relative bg-white/70 backdrop-blur-2xl dark:bg-gray-800/60',
                'rounded-3xl border border-gray-200 dark:border-cyan-400/20',
                'shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/30',
                'transition-all duration-500 hover:-translate-y-2',
                'overflow-hidden',
                'group-hover:dark:border-cyan-400/40',
                'group-hover:border-blue-200'
              )}
            >
              <div className='bg-grid-blue-500/[0.02] dark:bg-grid-cyan-400/[0.02] absolute inset-0' />

              <div className='space-y-6 px-4 py-12 text-center sm:px-8'>
                {/* 星芒图标容器 */}
                <div className='inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2 shadow-lg transition-shadow duration-300 hover:shadow-cyan-400/20'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='h-6 w-6 animate-sparkle text-amber-300 dark:text-cyan-300'
                  >
                    <path
                      fillRule='evenodd'
                      d='M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <h2 className='text-2xl font-bold text-white'>
                    加入创新之旅
                  </h2>
                </div>

                <p className='text-lg leading-relaxed text-gray-600 dark:text-gray-300'>
                  我们正在构建一个
                  <span className='whitespace-nowrap bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text font-semibold text-transparent'>
                    开放协作
                  </span>
                  的技术社区
                  <br />
                  你的每一个创意都可能成为改变校园的种子
                </p>

                <div className='relative mx-auto max-w-fit'>
                  <a
                    href='mailto:bjutswift.cn@gmail.com'
                    className={clsx(
                      'inline-flex items-center gap-3 rounded-2xl px-6 py-4 sm:px-8',
                      'bg-gradient-to-r from-blue-600/90 to-cyan-500/90',
                      'font-semibold text-white shadow-lg',
                      'transform transition-all duration-300',
                      'hover:scale-[1.03] hover:shadow-xl hover:shadow-cyan-500/30',
                      'active:scale-95',
                      'dark:shadow-cyan-400/20 dark:hover:shadow-cyan-400/40'
                    )}
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      viewBox='0 0 24 24'
                      fill='currentColor'
                      className='h-5 w-5 text-cyan-200'
                    >
                      <path d='M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z' />
                      <path d='M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z' />
                    </svg>
                    <span className='text-sm sm:text-base'>
                      bjutswift.cn@gmail.com
                    </span>
                  </a>

                  <div className='absolute -right-2 -top-2 opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:opacity-100 sm:-right-4 sm:-top-4'>
                    <div className='relative h-6 w-6 animate-float sm:h-8 sm:w-8'>
                      <div className='absolute inset-0 rounded-full bg-cyan-400' />
                      <div className='absolute inset-0 rounded-full bg-white/30 backdrop-blur-sm' />
                    </div>
                  </div>
                </div>

                <p className='mt-4 text-sm text-gray-500 dark:text-cyan-100/80'>
                  期待与你共同打造校园技术生态 ✨
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 技术栈展示 */}
        <section className='py-20'>
          <div className='text-center'>
            <h3 className='mb-12 text-4xl font-bold'>
              <span className='bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-300'>
                技术栈
              </span>
              <div className='mt-4 inline-block animate-bounce'>⚡</div>
            </h3>
            <div className='relative rounded-3xl bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 p-12 shadow-lg dark:from-gray-800 dark:via-gray-900 dark:to-gray-800'>
              <div className='bg-noise absolute inset-0 opacity-10' />
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
