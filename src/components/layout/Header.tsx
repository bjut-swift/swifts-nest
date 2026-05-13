import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import * as React from 'react';
import { HiMenuAlt4, HiX } from 'react-icons/hi';

import Accent from '@/components/Accent';
import ThemeButton from '@/components/buttons/ThemeButton';
import UnstyledLink from '@/components/links/UnstyledLink';

type HeaderProps = {
  large?: boolean;
};

export default function Header({ large = false }: HeaderProps) {
  //#region  //*=========== Route Functionality ===========
  const router = useRouter();
  /** Ex: /projects/petrolida-2021 -> ['', 'projects', 'petrolida-2021'] */
  const arrOfRoute = router.route.split('/');
  const baseRoute = '/' + arrOfRoute[1];
  //#endregion  //*======== Route Functionality ===========

  //#region  //*=========== Scroll Shadow ===========
  const [onTop, setOnTop] = React.useState<boolean>(true);
  React.useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setOnTop(window.pageYOffset === 0);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  //#endregion  //*======== Scroll Shadow ===========

  //#region  //*=========== Mobile Menu ===========
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const mobileMenuRef = React.useRef<HTMLDivElement>(null);

  // Close on route change
  React.useEffect(() => {
    const handleRouteChange = () => setMobileMenuOpen(false);
    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);
  //#endregion  //*======== Mobile Menu ===========

  return (
    <header
      className={clsx(
        'sticky top-0 z-50 transition-shadow',
        !onTop && 'shadow-xs',
      )}
    >
      {/* Skip Navigation */}
      <a
        href='#skip-nav'
        className={clsx(
          'rounded-xs p-2 transition',
          'font-medium text-black dark:text-white',
          'dark:bg-dark bg-white',
          'group dark:hover:text-primary-300',
          'focus:ring-primary-300 focus:ring-3 focus:outline-hidden',
          'absolute top-4 left-4',
          '-translate-y-16 focus:translate-y-0',
        )}
      >
        <Accent>Skip to main content</Accent>
      </a>

      {/* Gradient List */}
      <div className='from-primary-300 via-primary-400 to-primary-300 h-[3px] bg-linear-to-r' />

      <div
        ref={mobileMenuRef}
        className='dark:bg-dark bg-white transition-colors dark:text-white'
      >
        <nav
          className={clsx(
            'layout flex items-center justify-between py-4',
            large && 'lg:max-w-272',
          )}
        >
          {/* Desktop nav links (hidden on mobile) */}
          <ul className='hidden items-center justify-between space-x-3 text-xs md:flex md:space-x-4 md:text-base'>
            {links.map(({ href, label }) => (
              <li key={`${href}${label}`}>
                <UnstyledLink
                  href={href}
                  className={clsx(
                    'rounded-xs py-2 transition-colors',
                    'font-medium text-black dark:text-white',
                    'group dark:hover:text-primary-300',
                    'focus-visible:ring-primary-300 focus:outline-hidden focus-visible:ring-3',
                  )}
                >
                  <span
                    className={clsx(
                      'transition-colors',
                      'bg-primary-300/0 group-hover:bg-primary-300/20 dark:group-hover:bg-primary-300/0',
                      href === baseRoute &&
                        'bg-primary-300/50! dark:from-primary-300 dark:to-primary-400 dark:bg-linear-to-tr/srgb dark:bg-clip-text dark:text-transparent',
                    )}
                  >
                    {label}
                  </span>
                </UnstyledLink>
              </li>
            ))}
          </ul>

          {/* Mobile hamburger button (visible below md) */}
          <button
            className={clsx(
              'rounded-xs p-2 md:hidden',
              'font-medium text-black dark:text-white',
              'focus-visible:ring-primary-300 focus:outline-hidden focus-visible:ring-3',
              'hover:bg-primary-300/20 dark:hover:bg-primary-300/10',
              'transition-colors',
            )}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <HiX className='h-6 w-6' />
            ) : (
              <HiMenuAlt4 className='h-6 w-6' />
            )}
          </button>

          <ThemeButton />
        </nav>

        {/* Mobile menu dropdown */}
        <Transition
          show={mobileMenuOpen}
          as={React.Fragment}
          enter='transition ease-out duration-200'
          enterFrom='opacity-0 -translate-y-2'
          enterTo='opacity-100 translate-y-0'
          leave='transition ease-in duration-150'
          leaveFrom='opacity-100 translate-y-0'
          leaveTo='opacity-0 -translate-y-2'
        >
          <div className='border-t border-gray-200 md:hidden dark:border-gray-700'>
            <ul className='layout flex flex-col space-y-1 py-4'>
              {links.map(({ href, label }) => (
                <li key={`mobile-${href}${label}`}>
                  <UnstyledLink
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={clsx(
                      'block rounded-xs px-3 py-2 transition-colors',
                      'font-medium text-black dark:text-white',
                      'group dark:hover:text-primary-300',
                      'hover:bg-primary-300/10',
                      'focus-visible:ring-primary-300 focus:outline-hidden focus-visible:ring-3',
                    )}
                  >
                    <span
                      className={clsx(
                        'transition-colors',
                        'bg-primary-300/0 group-hover:bg-primary-300/20 dark:group-hover:bg-primary-300/0',
                        href === baseRoute &&
                          'bg-primary-300/50! dark:from-primary-300 dark:to-primary-400 dark:bg-linear-to-tr/srgb dark:bg-clip-text dark:text-transparent',
                      )}
                    >
                      {label}
                    </span>
                  </UnstyledLink>
                </li>
              ))}
            </ul>
          </div>
        </Transition>
      </div>
    </header>
  );
}

const links = [
  { href: '/', label: '主页' },
  { href: '/blog', label: '分享' },
  { href: '/projects', label: '项目' },
  { href: '/shorts', label: '教程' },
  { href: '/feiyue', label: '飞跃' },
  { href: '/about', label: '关于' },
];
