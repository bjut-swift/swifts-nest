import clsx from 'clsx';

import { getResultDisplay } from '@/lib/feiyue.client';

import { ApplicationResult } from '@/types/feiyue';

type ResultBadgeProps = {
  result: ApplicationResult;
  isFinal?: boolean;
};

export default function ResultBadge({
  result,
  isFinal = false,
}: ResultBadgeProps) {
  const { emoji, label, colorClass, bgClass } = getResultDisplay(result);

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        colorClass,
        bgClass
      )}
    >
      {isFinal ? '⭐' : emoji} {label}
    </span>
  );
}
