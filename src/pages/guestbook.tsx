import * as React from 'react';

import Accent from '@/components/Accent';
import Layout from '@/components/layout/Layout';
import CustomLink from '@/components/links/CustomLink';
import Seo from '@/components/Seo';

export default function GuestbookPage() {
  return (
    <Layout>
      <Seo
        templateTitle='Guestbook'
        description='Leave whatever you like to say—message, appreciation, suggestions.'
      />

      <main>
        <section className=''>
          <div className='layout py-20'>
            <h1>
              <Accent>Guestbook</Accent>
            </h1>
            <p className='mt-2 text-gray-700 dark:text-gray-200'>
              这是一个留言簿，欢迎您留下任何想说的话—信息、感谢、建议。
              <CustomLink href='https://github.com/bjut-swift/swifts-nest/discussions'>
                AMA discussion
              </CustomLink>
            </p>
          </div>
        </section>
      </main>
    </Layout>
  );
}
