import { ReactNode } from 'react';
import { HiLightBulb } from 'react-icons/hi';

interface KeyInsightProps {
  title?: string;
  children: ReactNode;
}

export function KeyInsight({
  title = '关键点总结',
  children,
}: KeyInsightProps) {
  return (
    <div className='my-1 border-l-3 border-blue-500 bg-blue-50 py-1 pr-1 pl-1'>
      <div className='flex items-center pt-1 pb-0 pl-3'>
        <HiLightBulb className='h-6 w-6 shrink-0 text-blue-600' />
        <div className='my-auto ml-2 text-lg font-semibold text-blue-900'>
          {title}
        </div>
      </div>
      <div className='mt-0 pl-3 text-blue-800'>{children}</div>
    </div>
  );
}
