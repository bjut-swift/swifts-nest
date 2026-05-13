import clsx from 'clsx';

import UnstyledLink, { UnstyledLinkProps } from './UnstyledLink';

export type ButtonLinkProps = {
  variant?: 'default' | 'primary';
} & UnstyledLinkProps;

export default function ButtonLink({
  children,
  className = '',
  variant = 'default',
  ...rest
}: ButtonLinkProps) {
  return (
    <UnstyledLink
      {...rest}
      className={clsx(
        'inline-flex rounded-sm px-4 py-2 font-bold',
        'border border-gray-300 shadow-xs dark:border-gray-600',
        'focus-visible:ring-primary-300 focus:outline-hidden focus-visible:ring-3',
        'scale-100 hover:scale-[1.03] active:scale-[0.97] motion-safe:transform-gpu',
        'motion-reduce:hover:scale-100 motion-reduce:hover:brightness-90',
        'transition duration-100',
        'animate-shadow',
        {
          'dark:bg-dark bg-white text-gray-800 disabled:bg-gray-200 dark:text-gray-100 dark:disabled:bg-gray-700':
            variant === 'default',
          'border-primary-300 bg-primary-300 text-dark hover:bg-primary-300/90 dark:border-primary-300 dark:bg-primary-300 dark:text-dark dark:hover:bg-primary-300/90':
            variant === 'primary',
        },
        className,
      )}
    >
      {children}
    </UnstyledLink>
  );
}
