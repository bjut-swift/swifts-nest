import * as React from 'react';

import Accent from '@/components/Accent';
import Layout from '@/components/layout/Layout';
import CustomLink from '@/components/links/CustomLink';
import Seo from '@/components/Seo';

export default function GuestbookPage() {
  return (
    <Layout>
      <Seo
        templateTitle='留言簿'
        description='欢迎留下任何想说的话——留言、感谢、建议。'
      />

      <main>
        <section className=''>
          <div className='layout py-20'>
            <h1>
              <Accent>留言簿</Accent>
            </h1>
            <p className='mt-2 text-gray-700 dark:text-gray-200'>
              这是一个留言簿，欢迎您留下任何想说的话—信息、感谢、建议。
              <CustomLink href='https://github.com/bjut-swift/swifts-nest/discussions'>
                GitHub Discussions
              </CustomLink>
            </p>
          </div>
        </section>
      </main>
    </Layout>
  );
}
