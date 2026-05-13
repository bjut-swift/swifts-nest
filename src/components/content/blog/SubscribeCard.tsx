import clsx from 'clsx';
import * as React from 'react';

import Accent from '@/components/Accent';
import ButtonLink from '@/components/links/ButtonLink';

type SubscribeCardProps = {
  className?: string;
  title?: string;
  description?: string;
};

export default function SubscribeCard({
  className,
  title,
  description,
}: SubscribeCardProps) {
  return (
    <div
      className={clsx('rounded-sm border p-4 dark:border-gray-600', className)}
    >
      <h3>
        <Accent>{title ?? 'RSS 订阅'}</Accent>
      </h3>
      <p className='mt-2 text-gray-700 dark:text-gray-300'>
        {description ??
          '订阅 RSS 源，及时获取最新文章更新。不错过任何一篇技术分享 😉'}
      </p>
      <ButtonLink className='mt-2' href='/rss.xml'>
        订阅 RSS
      </ButtonLink>
    </div>
  );
}
