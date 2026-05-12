import { ApplicationResult } from '@/types/feiyue';

export function generateProgramSlug(
  school: string,
  program: string,
  degree: string
): string {
  return [school, program, degree]
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

type ResultDisplay = {
  emoji: string;
  label: string;
  colorClass: string;
  bgClass: string;
};

const RESULT_MAP: Record<ApplicationResult, ResultDisplay> = {
  admit: {
    emoji: '🟢',
    label: 'Admit',
    colorClass: 'text-green-600 dark:text-green-400',
    bgClass: 'bg-green-100 dark:bg-green-900/30',
  },
  reject: {
    emoji: '🔴',
    label: 'Reject',
    colorClass: 'text-red-600 dark:text-red-400',
    bgClass: 'bg-red-100 dark:bg-red-900/30',
  },
  pending: {
    emoji: '🟡',
    label: 'Pending',
    colorClass: 'text-yellow-600 dark:text-yellow-400',
    bgClass: 'bg-yellow-100 dark:bg-yellow-900/30',
  },
  withdraw: {
    emoji: '🟠',
    label: 'Withdraw',
    colorClass: 'text-orange-600 dark:text-orange-400',
    bgClass: 'bg-orange-100 dark:bg-orange-900/30',
  },
  waitlist: {
    emoji: '🔵',
    label: 'Waitlist',
    colorClass: 'text-blue-600 dark:text-blue-400',
    bgClass: 'bg-blue-100 dark:bg-blue-900/30',
  },
};

export function getResultDisplay(result: ApplicationResult): ResultDisplay {
  return RESULT_MAP[result];
}
