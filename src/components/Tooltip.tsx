import Tippy from '@tippyjs/react';
import clsx from 'clsx';
import * as React from 'react';

import 'tippy.js/dist/tippy.css';

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
      content={
        <div
          className={clsx(
            className,
            'dark:bg-dark inline-block rounded-md bg-white p-2 text-gray-600 shadow-md dark:text-gray-200',
            'border dark:border-gray-600',
          )}
        >
          {tipChildren}
        </div>
      }
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
