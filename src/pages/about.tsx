/* eslint-disable unused-imports/no-unused-imports */
import clsx from 'clsx';
import * as React from 'react';

import { trackEvent } from '@/lib/analytics';
import useLoaded from '@/hooks/useLoaded';

import Accent from '@/components/Accent';
import FeishuDocEmbed from '@/components/FeishuDocEmbed';
import CloudinaryImg from '@/components/images/CloudinaryImg';
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

      <main>
        <section className={clsx(isLoaded && 'fade-in-start')}>
          <div className='layout pt-20'>
            <h2 data-fade='0'>关于</h2>
            <h1 className='mt-1' data-fade='1'>
              <Accent>BJUT-SWIFT</Accent>
            </h1>
            <div className='mt-4' data-fade='2'>
              <article className='prose dark:prose-invert'>
                <p data-fade='3'>
                  本组织由工大学生自发组成，愿景是分享智慧、创新和未来技术（S.W.I.F.T.）{' '}
                </p>
                <p data-fade='3'>
                  欢迎查看我们的{' '}
                  <CustomLink href='https://github.com/bjut-swift'>
                    GitHub 主页
                  </CustomLink>{' '}
                  来深入了解我们的工作。
                </p>
                <FeishuDocEmbed docUrl='https://fafmkoqaxys.feishu.cn/docx/WqsqdqB6dof3AAxzjmncux8KnTd' />
              </article>
              <h3 className='mt-12' data-fade='8'>
                本站所用的技术栈
              </h3>
              <figure className='mt-8' data-fade='9'>
                <TechStack />
              </figure>
            </div>
          </div>
        </section>

        <section>
          <div className='layout mt-16'>
            <h2>Contact</h2>
            <article className='prose mt-4 dark:prose-invert'>
              <p>
                我们需要大家的力量，随时欢迎联系我们以申请加入组织、发起立项、反馈意见。
              </p>
            </article>
          </div>
        </section>
      </main>
    </Layout>
  );
}
