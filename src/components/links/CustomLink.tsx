import clsxm from '@/lib/clsxm';

import UnstyledLink, { UnstyledLinkProps } from './UnstyledLink';

export default function CustomLink({
  children,
  className = '',
  ...rest
}: UnstyledLinkProps) {
  return (
    <UnstyledLink
      {...rest}
      className={clsxm(
        'animated-underline custom-link inline-flex items-center font-medium',
        'focus-visible:ring-primary-300 focus:outline-hidden focus-visible:ring-3',
        'border-dark border-b border-dotted hover:border-black/0',
        className,
      )}
    >
      <span className='dark:from-primary-300 dark:to-primary-400 dark:bg-linear-to-tr/srgb dark:bg-clip-text dark:text-transparent'>
        {children}
      </span>
    </UnstyledLink>
  );
}
