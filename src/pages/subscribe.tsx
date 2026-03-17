import * as React from 'react';

import Accent from '@/components/Accent';
import SubscribeCard from '@/components/content/blog/SubscribeCard';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

export default function SubscribePage() {
  return (
    <Layout>
      <Seo
        templateTitle='订阅'
        description='通过邮件订阅，第一时间获取最新文章推送。'
      />

      <main>
        <section className=''>
          <div className='layout flex flex-col items-center py-20 text-center'>
            <h1>
              订阅 <Accent>BJUT SWIFT</Accent>
            </h1>
            <SubscribeCard className='mt-8 text-left' />
          </div>
        </section>
      </main>
    </Layout>
  );
}
