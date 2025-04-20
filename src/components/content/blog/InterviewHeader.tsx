import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react';

interface InterviewHeaderProps {
  author: string;
  authorRole: string;
  authorAvatarUrl?: string;
  authorHomepage?: string;
  interviewee?: string;
  intervieweeRole?: string;
  intervieweeAvatarUrl?: string;
  intervieweeHomepage?: string;
}

export function InterviewHeader({
  author,
  authorRole,
  authorAvatarUrl,
  authorHomepage,
  interviewee,
  intervieweeRole,
  intervieweeAvatarUrl,
  intervieweeHomepage,
}: InterviewHeaderProps) {
  const AvatarWrapper = ({
    href,
    children,
  }: {
    href?: string;
    children: React.ReactNode;
  }) => {
    if (href) {
      return (
        <Link
          href={href}
          target='_blank'
          rel='noopener noreferrer'
          className='block'
          legacyBehavior
        >
          {children}
        </Link>
      );
    }
    return <>{children}</>;
  };

  return (
    <div className='my-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 p-4 shadow-sm'>
      {/* 作者信息 */}
      <div className='flex items-start gap-3'>
        <AvatarWrapper href={authorHomepage}>
          <div className='relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-2 border-gray-200 bg-white shadow-sm transition-colors hover:border-blue-300 sm:h-16 sm:w-16'>
            {authorAvatarUrl ? (
              <Image
                src={authorAvatarUrl}
                alt={`${author}的头像`}
                className='object-cover'
                width={64}
                height={64}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
              />
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 transform text-gray-400 sm:h-8 sm:w-8'
              >
                <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
                <circle cx='12' cy='7' r='4' />
              </svg>
            )}
          </div>
        </AvatarWrapper>

        <div className='flex min-h-[48px] flex-1 flex-col justify-center sm:min-h-[64px]'>
          <div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
            <span className='rounded-full bg-[#002fa7]/10 px-2.5 py-0.5 text-sm font-medium text-[#002fa7] sm:px-3 sm:py-1 sm:text-base'>
              采访人
            </span>
            <span className='text-base font-semibold text-gray-900 sm:text-lg'>
              {author}
            </span>
            {authorRole && (
              <span className='text-sm text-gray-600 sm:text-base'>
                · {authorRole}
              </span>
            )}
          </div>
        </div>
      </div>
      {/* 分隔线 */}
      {interviewee && <div className='my-3 border-t border-gray-200' />}
      {/* 受访者信息 */}
      {interviewee && (
        <div className='flex items-start gap-3'>
          <AvatarWrapper href={intervieweeHomepage}>
            <div className='relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-2 border-gray-200 bg-white shadow-sm transition-colors hover:border-blue-300 sm:h-16 sm:w-16'>
              {intervieweeAvatarUrl ? (
                <Image
                  src={intervieweeAvatarUrl}
                  alt={`${interviewee}的头像`}
                  className='object-cover'
                  width={64}
                  height={64}
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                  }}
                />
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 transform text-gray-400 sm:h-8 sm:w-8'
                >
                  <path d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2' />
                  <circle cx='12' cy='7' r='4' />
                </svg>
              )}
            </div>
          </AvatarWrapper>

          <div className='flex min-h-[48px] flex-1 flex-col justify-center sm:min-h-[64px]'>
            <div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
              <span className='rounded-full bg-[#e32636]/10 px-2.5 py-0.5 text-sm font-medium text-[#e32636] sm:px-3 sm:py-1 sm:text-base'>
                受访者
              </span>
              <span className='text-base font-semibold text-gray-900 sm:text-lg'>
                {interviewee}
              </span>
              {intervieweeRole && (
                <span className='text-sm text-gray-600 sm:text-base'>
                  · {intervieweeRole}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
