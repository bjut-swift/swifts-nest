import clsx from 'clsx';
import { useRouter } from 'next/router';

import FeiyueSearch from '@/components/feiyue/FeiyueSearch';
import UnstyledLink from '@/components/links/UnstyledLink';

const navGroups = [
  [{ href: '/feiyue', label: '申请案例' }],
  [
    { href: '/feiyue/major', label: '按专业' },
    { href: '/feiyue/area', label: '按方向' },
    { href: '/feiyue/program', label: '按项目' },
  ],
  [
    { href: '/feiyue/stats', label: '统计' },
    { href: '/feiyue/contribute', label: '贡献数据' },
  ],
];

export default function FeiyueNav({
  hideSearch,
}: { hideSearch?: boolean } = {}) {
  const router = useRouter();
  const path = router.asPath.split('?')[0];

  const isActive = (href: string) => {
    if (href === '/feiyue') return path === '/feiyue';
    return path.startsWith(href);
  };

  return (
    <div className='space-y-3'>
      <nav className='flex flex-wrap items-center gap-2'>
        {navGroups.map((group, gi) => (
          <div key={gi} className='contents'>
            {gi > 0 && (
              <span className='hidden h-5 border-l border-gray-300 dark:border-gray-600 sm:inline-block' />
            )}
            {group.map(({ href, label }) => {
              const isContribute = href === '/feiyue/contribute';
              const active = isActive(href);
              return (
                <UnstyledLink
                  key={href}
                  href={href}
                  className={clsx(
                    'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'border-primary-400 bg-primary-400/10 text-primary-500 dark:border-primary-300 dark:text-primary-300'
                      : isContribute
                      ? 'border-primary-400 bg-primary-400 text-white hover:bg-primary-500 dark:border-primary-300 dark:bg-primary-300 dark:text-gray-900 dark:hover:bg-primary-200'
                      : 'border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-500 dark:border-gray-700 dark:text-gray-400 dark:hover:border-primary-300 dark:hover:text-primary-300'
                  )}
                >
                  {label}
                </UnstyledLink>
              );
            })}
          </div>
        ))}
      </nav>
      {!hideSearch && <FeiyueSearch />}
    </div>
  );
}
