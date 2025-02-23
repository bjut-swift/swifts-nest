import clsx from 'clsx';
import * as React from 'react';

type AccentType = React.ComponentPropsWithoutRef<'span'>;

export default function Accent({ children, className }: AccentType) {
  return (
    <span
      className={clsx(
        'transition-colors',
        'from-primary-300/300 bg-gradient-to-tr via-primary-300/40 to-primary-400/40',
        'dark:from-primary-300 dark:to-primary-400 dark:bg-clip-text dark:text-transparent',
        className
      )}
    >
      {children}
    </span>
  );
}
