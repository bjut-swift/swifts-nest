import * as React from 'react';

import clsxm from '@/lib/clsxm';

type TOptionProps = {
  children: React.ReactNode;
  icon?: React.ReactNode;
  placeholder?: string;
  value: string | number | readonly string[] | undefined;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
};

export default function TOption({
  children,
  icon: Icon,
  placeholder,
  onChange,
  value,
}: TOptionProps) {
  return (
    <div className='relative flex items-center'>
      {Icon && (
        <div className='text-typo-secondary pointer-events-none absolute inset-y-0 left-3 flex items-center'>
          {Icon}
        </div>
      )}
      <select
        className={clsxm(
          'text-typo-secondary block rounded-md px-8 text-sm font-semibold',
          'border-none outline-hidden focus:border-none focus:ring-0 focus:outline-hidden',
          'h-9 py-0 md:h-10',
          'focus-visible:ring-primary-400 focus-visible:ring-3',
          'active:bg-primary-100 disabled:bg-primary-100',
        )}
        value={value}
        onChange={onChange}
      >
        {placeholder && (
          <option value='' disabled hidden>
            {placeholder}
          </option>
        )}
        {children}
      </select>
    </div>
  );
}
