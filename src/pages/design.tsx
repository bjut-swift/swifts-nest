import clsx from 'clsx';
import { useTheme } from 'next-themes';
import * as React from 'react';

import useLoaded from '@/hooks/useLoaded';

import Accent from '@/components/Accent';
import ThemeButton from '@/components/buttons/ThemeButton';
import ColorSwatch from '@/components/ColorSwatch';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

export default function DesignPage() {
  const { theme } = useTheme();
  const isLoaded = useLoaded();

  return (
    <Layout>
      <Seo templateTitle='网站设计' robots='noindex,nofollow' />

      <main>
        <section className={clsx(isLoaded && 'fade-in-start')}>
          <div className='layout py-12'>
            <h1 data-fade='0'>
              <Accent>网站设计</Accent>
            </h1>

            <p data-fade='1' className='mt-2 text-gray-600 dark:text-gray-300'>
              bjutswift.cn 色彩方案
            </p>

            <div
              data-fade='2'
              className={clsx(
                'mt-8 rounded-sm p-4',
                'border-2 border-dashed border-gray-300 dark:border-gray-600',
              )}
            >
              <div className='flex items-end justify-between'>
                <h2 className='capitalize'>{theme} Mode</h2>
                <ThemeButton />
              </div>

              <p className='mt-1 text-sm text-gray-600 dark:text-gray-300'>
                字体：Inter
              </p>

              <div className='grid sm:grid-cols-2'>
                {THEME_COLORS.map((color) => (
                  <ColorSwatch key={color.title} {...color} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

const THEME_COLORS = [
  {
    title: '白色背景',
    subTitle: '#ffffff',
    colorClassName: 'bg-white',
  },
  {
    title: '深色背景',
    subTitle: '#0e1111',
    colorClassName: 'bg-dark',
  },
  {
    title: '主色 200',
    subTitle: '#dbff00',
    colorClassName: 'bg-primary-200',
  },
  {
    title: '主色 300',
    subTitle: '#00e887',
    colorClassName: 'bg-primary-300',
  },
  {
    title: '主色 400',
    subTitle: '#00e0f3',
    colorClassName: 'bg-primary-400',
  },
  {
    title: '主色 500',
    subTitle: '#00bfff',
    colorClassName: 'bg-primary-500',
  },
  {
    title: '渐变色',
    subTitle: '#00e0f3 to #00bfff',
    colorClassName: 'bg-linear-to-tr/srgb from-primary-300 to-primary-500',
  },
];
