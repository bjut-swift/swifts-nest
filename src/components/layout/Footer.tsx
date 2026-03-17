import { FeedbackFish } from '@feedback-fish/react';
import * as React from 'react';
import { FiMail } from 'react-icons/fi';
import { IconType } from 'react-icons/lib';
import { SiGithub } from 'react-icons/si';

import { trackEvent } from '@/lib/analytics';
import useCopyToClipboard from '@/hooks/useCopyToClipboard';

import Accent from '@/components/Accent';
import UnstyledLink from '@/components/links/UnstyledLink';
import Tooltip from '@/components/Tooltip';

import { feedbackFlag } from '@/constants/env';

export default function Footer() {
  return (
    <footer className='mt-4 pb-2'>
      <main className='layout border-t border-primary-300/20 pt-10 dark:border-primary-300/10'>
        {/* Three-column layout */}
        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
          {/* Column 1: Branding */}
          <div>
            <p className='font-display text-2xl font-bold tracking-tight text-gray-800 dark:text-gray-100 md:text-3xl'>
              BJUT SWIFT
            </p>
            <p className='mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300'>
              Sharing Wisdom, Innovation & Futuristic Technologies —
              工大学子共建的技术共享平台
            </p>
          </div>

          {/* Column 2: Links */}
          <div>
            <p className='font-medium text-gray-800 dark:text-gray-100'>链接</p>
            <ul className='mt-2 space-y-2'>
              {linkColumn.map(({ href, text, tooltip }) => (
                <li key={href}>
                  <Tooltip interactive={false} tipChildren={tooltip}>
                    <UnstyledLink
                      className='animated-underline rounded-sm text-sm font-medium text-gray-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-300 dark:text-gray-200'
                      href={href}
                      onClick={() => {
                        trackEvent(`Footer Link: ${text}`, { type: 'link' });
                      }}
                    >
                      {text}
                    </UnstyledLink>
                  </Tooltip>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Community */}
          <div>
            <p className='font-medium text-gray-800 dark:text-gray-100'>社区</p>
            <ul className='mt-2 space-y-2'>
              {communityColumn.map(({ href, text, tooltip }) => (
                <li key={href}>
                  <Tooltip interactive={false} tipChildren={tooltip}>
                    <UnstyledLink
                      className='animated-underline rounded-sm text-sm font-medium text-gray-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-300 dark:text-gray-200'
                      href={href}
                      onClick={() => {
                        trackEvent(`Footer Link: ${text}`, { type: 'link' });
                      }}
                    >
                      {text}
                    </UnstyledLink>
                  </Tooltip>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact section */}
        <div className='mt-8 flex flex-col items-center'>
          <p className='font-medium text-gray-600 dark:text-gray-300'>
            联系我们
          </p>
          <SocialLinks />
        </div>

        {/* Bottom bar */}
        <div className='mt-8 border-t border-primary-300/20 pt-4 dark:border-primary-300/10'>
          <p className='text-center text-sm text-gray-600 dark:text-gray-300'>
            © BJUT SWIFT {new Date().getFullYear()}
            {feedbackFlag && (
              <>
                {' • '}
                <FeedbackFish
                  projectId={process.env.NEXT_PUBLIC_FEEDBACK_FISH_ID || ''}
                >
                  <button className='rounded-sm hover:text-gray-800 focus:outline-none focus-visible:ring focus-visible:ring-primary-300 dark:hover:text-gray-100'>
                    有反馈？
                  </button>
                </FeedbackFish>
              </>
            )}
          </p>
        </div>
      </main>
    </footer>
  );
}

function SocialLinks() {
  const [copyStatus, setCopyStatus] = React.useState<'idle' | 'copied'>('idle');

  const [copy] = useCopyToClipboard();

  return (
    <div className='mt-2 flex space-x-4'>
      <div className='flex items-center justify-center'>
        <Tooltip
          trigger='mouseenter'
          hideOnClick={false}
          interactive
          html={
            <div className='inline-block rounded-md border bg-white p-2 text-gray-600 shadow-md dark:border-gray-600 dark:bg-dark dark:text-gray-200'>
              {copyStatus === 'idle'
                ? '点击邮件图标复制 '
                : '已复制到剪贴板 🥳'}
              <Accent className='inline-block font-medium'>
                bjutswift.cn@gmail.com
              </Accent>
            </div>
          }
        >
          <button
            onClick={() => {
              copy('bjutswift.cn@gmail.com').then(() => {
                setCopyStatus('copied');
                setTimeout(() => setCopyStatus('idle'), 1500);
              });
            }}
            className='rounded-sm align-middle focus:outline-none focus-visible:ring focus-visible:ring-primary-300'
          >
            <FiMail className='h-7 w-7 align-middle text-gray-600 hover:text-primary-300 dark:text-gray-300 dark:hover:text-primary-300' />
          </button>
        </Tooltip>
      </div>
      {socials.map((social) => (
        <Tooltip
          interactive={false}
          key={social.href}
          tipChildren={social.text}
        >
          <UnstyledLink
            className='inline-flex items-center justify-center rounded-sm focus:outline-none focus-visible:ring focus-visible:ring-primary-300'
            href={social.href}
            onClick={() => {
              trackEvent(`Footer Link: ${social.id}`, { type: 'link' });
            }}
          >
            <social.icon className='my-auto h-6 w-6 align-middle text-gray-600 transition-colors hover:text-primary-300 dark:text-gray-300 dark:hover:text-primary-300' />
          </UnstyledLink>
        </Tooltip>
      ))}
    </div>
  );
}

const linkColumn: { href: string; text: string; tooltip: React.ReactNode }[] = [
  {
    href: 'https://github.com/bjut-swift/swifts-nest',
    text: '源代码',
    tooltip: (
      <>
        这个网站是 <strong>开源</strong> 的！
      </>
    ),
  },
  {
    href: '/design',
    text: '设计',
    tooltip: '网站的色彩搭配',
  },
  {
    href: 'https://www.bjutswift.cn/shorts/writing-guide',
    text: '操作手册',
    tooltip: 'BJUT SWIFT 官网操作手册',
  },
  {
    href: '/statistics',
    text: '统计信息',
    tooltip: '网站统计信息',
  },
];

const communityColumn: {
  href: string;
  text: string;
  tooltip: React.ReactNode;
}[] = [
  {
    href: '/guestbook',
    text: '留言簿',
    tooltip: '我们想听到你的声音',
  },
  {
    href: '/subscribe',
    text: '订阅',
    tooltip: 'RSS 订阅',
  },
  {
    href: 'https://www.bjutswift.cn/rss.xml',
    text: 'RSS',
    tooltip: '添加 BJUT SWIFT 博客到你的订阅源',
  },
  {
    href: 'https://github.com/bjut-swift',
    text: 'GitHub',
    tooltip: '查看我们的 GitHub',
  },
];

type Social = {
  href: string;
  icon: IconType;
  id: string;
  text: React.ReactNode;
};
const socials: Social[] = [
  {
    href: 'https://github.com/bjut-swift',
    icon: SiGithub,
    id: 'Github',
    text: (
      <>
        查看我们的 <Accent className='font-medium'>Github</Accent>
      </>
    ),
  },
];
