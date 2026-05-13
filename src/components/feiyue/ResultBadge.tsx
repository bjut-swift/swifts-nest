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
  if (isFinal) {
    return (
      <span
        className={clsx(
          'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
          'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
        )}
      >
        ✅ Chosen
      </span>
    );
  }

  const { emoji, label, colorClass, bgClass } = getResultDisplay(result);

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        colorClass,
        bgClass,
      )}
    >
      {emoji} {label}
    </span>
  );
}
