import clsx from 'clsx';
import Fuse from 'fuse.js';
import { useRouter } from 'next/router';
import * as React from 'react';
import { FiBookOpen, FiMapPin, FiSearch, FiUser } from 'react-icons/fi';

type SearchEntry = {
  type: 'applicant' | 'program' | 'school';
  title: string;
  subtitle: string;
  aliases: string;
  href: string;
};

const TYPE_LABELS: Record<
  SearchEntry['type'],
  { label: string; Icon: typeof FiUser }
> = {
  applicant: { label: '申请人', Icon: FiUser },
  program: { label: '项目', Icon: FiBookOpen },
  school: { label: '学校', Icon: FiMapPin },
};

export default function FeiyueSearch() {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [searchIndex, setSearchIndex] = React.useState<SearchEntry[]>([]);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    fetch('/api/feiyue-search')
      .then((r) => r.json())
      .then(setSearchIndex)
      .catch(() => undefined);
  }, []);

  const fuse = React.useMemo(
    () =>
      new Fuse(searchIndex, {
        keys: [
          { name: 'title', weight: 2 },
          { name: 'aliases', weight: 2 },
          { name: 'subtitle', weight: 1 },
        ],
        threshold: 0.4,
        includeScore: true,
      }),
    [searchIndex]
  );

  const results = React.useMemo(() => {
    if (!query.trim()) return [];
    return fuse.search(query, { limit: 10 }).map((r) => r.item);
  }, [query, fuse]);

  const grouped = React.useMemo(() => {
    const map: Partial<Record<SearchEntry['type'], SearchEntry[]>> = {};
    for (const r of results) {
      if (!map[r.type]) map[r.type] = [];
      const arr = map[r.type];
      if (arr) arr.push(r);
    }
    return map;
  }, [results]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigate = (href: string) => {
    setOpen(false);
    setQuery('');
    router.push(href);
  };

  return (
    <div ref={ref} className='relative w-full max-w-sm'>
      <div className='relative'>
        <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
        <input
          type='text'
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query.trim() && setOpen(true)}
          placeholder='搜索申请人、项目、学校...'
          className={clsx(
            'w-full rounded-md py-2 pl-9 pr-3 text-sm',
            'border border-gray-300 dark:border-gray-600',
            'bg-white dark:bg-dark',
            'focus:border-primary-300 focus:outline-none focus:ring-0 dark:focus:border-primary-300'
          )}
        />
      </div>

      {open && results.length > 0 && (
        <div
          className={clsx(
            'absolute z-50 mt-1 max-h-80 w-full overflow-y-auto rounded-md border shadow-lg',
            'border-gray-200 bg-white dark:border-gray-700 dark:bg-dark'
          )}
        >
          {(['applicant', 'program', 'school'] as const).map((type) => {
            const items = grouped[type];
            if (!items) return null;
            const { label, Icon } = TYPE_LABELS[type];
            return (
              <div key={type}>
                <div className='flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-400'>
                  <Icon className='h-3 w-3' />
                  {label}
                </div>
                {items.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => navigate(item.href)}
                    className={clsx(
                      'flex w-full flex-col px-3 py-2 text-left',
                      'hover:bg-primary-300/10 dark:hover:bg-primary-300/5'
                    )}
                  >
                    <span className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                      {item.title}
                    </span>
                    <span className='text-xs text-gray-500 dark:text-gray-400'>
                      {item.subtitle}
                    </span>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {open && query.trim() && results.length === 0 && (
        <div
          className={clsx(
            'absolute z-50 mt-1 w-full rounded-md border p-3 text-center text-sm',
            'border-gray-200 bg-white text-gray-500 dark:border-gray-700 dark:bg-dark dark:text-gray-400'
          )}
        >
          未找到相关结果
        </div>
      )}
    </div>
  );
}
