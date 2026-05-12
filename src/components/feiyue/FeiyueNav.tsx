import clsx from 'clsx';
import { useRouter } from 'next/router';

import UnstyledLink from '@/components/links/UnstyledLink';

const navItems = [
  { href: '/feiyue', label: '申请案例' },
  { href: '/feiyue/major', label: '按专业' },
  { href: '/feiyue/area', label: '按方向' },
  { href: '/feiyue/program', label: '按项目' },
  { href: '/feiyue/stats', label: '统计' },
  { href: '/feiyue/contribute', label: '贡献数据' },
];

export default function FeiyueNav() {
  const router = useRouter();
  const path = router.asPath.split('?')[0];

  const isActive = (href: string) => {
    if (href === '/feiyue') return path === '/feiyue';
    return path.startsWith(href);
  };

  return (
    <nav className='flex flex-wrap gap-2'>
      {navItems.map(({ href, label }) => (
        <UnstyledLink
          key={href}
          href={href}
          className={clsx(
            'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
            isActive(href)
              ? 'border-primary-400 bg-primary-400/10 text-primary-500 dark:border-primary-300 dark:text-primary-300'
              : 'border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-500 dark:border-gray-700 dark:text-gray-400 dark:hover:border-primary-300 dark:hover:text-primary-300'
          )}
        >
          {label}
        </UnstyledLink>
      ))}
    </nav>
  );
}
