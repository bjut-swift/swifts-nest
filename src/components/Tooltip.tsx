import Tippy from '@tippyjs/react/headless';
import clsx from 'clsx';
import * as React from 'react';

type TooltipTextProps = {
  tipChildren?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  spanClassName?: string;
  withUnderline?: boolean;
};

export default function Tooltip({
  tipChildren,
  children,
  className,
  spanClassName,
  withUnderline = false,
}: TooltipTextProps) {
  return (
    <Tippy
      interactive
      render={(attrs) => (
        <div
          className={clsx(
            className,
            'dark:bg-dark rounded-lg bg-white px-3 py-2 text-sm text-gray-600 dark:text-gray-200',
            'border border-gray-200 shadow-lg dark:border-gray-700',
            'animate-in fade-in-0 zoom-in-95',
          )}
          tabIndex={-1}
          {...attrs}
        >
          {tipChildren}
        </div>
      )}
    >
      {withUnderline ? (
        <span
          className={clsx(spanClassName, 'underline')}
          style={{ textDecorationStyle: 'dotted' }}
        >
          {children}
        </span>
      ) : (
        <span>{children}</span>
      )}
    </Tippy>
  );
}
