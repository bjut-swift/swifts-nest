import clsx from 'clsx';

type StatsCardProps = {
  label: string;
  value: string | number;
  subtitle?: string;
};

export default function StatsCard({ label, value, subtitle }: StatsCardProps) {
  return (
    <div
      className={clsx(
        'rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-dark'
      )}
    >
      <dt className='text-sm text-gray-500 dark:text-gray-400'>{label}</dt>
      <dd className='mt-1 text-3xl font-bold text-gray-900 dark:text-gray-100'>
        {value}
      </dd>
      {subtitle && (
        <p className='mt-1 text-xs text-gray-400 dark:text-gray-500'>
          {subtitle}
        </p>
      )}
    </div>
  );
}
