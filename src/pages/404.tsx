import * as React from 'react';
import { RiAlarmWarningFill } from 'react-icons/ri';

import CustomLink from '@/components/links/CustomLink';
import Seo from '@/components/Seo';

export default function NotFoundPage() {
  return (
    <>
      <Seo templateTitle='页面未找到' robots='noindex,nofollow' />

      <main>
        <section className='bg-dark'>
          <div className='layout flex min-h-screen flex-col items-center justify-center text-center text-white'>
            <RiAlarmWarningFill
              size={60}
              className='drop-shadow-glow animate-flicker text-yellow-300'
            />
            <h1 className='mt-8'>页面未找到</h1>
            <CustomLink className='mt-4' href='/'>
              返回首页
            </CustomLink>
          </div>
        </section>
      </main>
    </>
  );
}
