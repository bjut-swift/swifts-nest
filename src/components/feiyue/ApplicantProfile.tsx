import clsx from 'clsx';

import Accent from '@/components/Accent';
import UnstyledLink from '@/components/links/UnstyledLink';

import { Applicant } from '@/types/feiyue';

type ApplicantProfileProps = {
  applicant: Applicant;
};

// 部分披露记录统一展示的固定声明（非用户可编辑）
const DISCLOSURE_NOTE =
  '本页面内容由申请人自行维护并授权展示，所列信息经申请人选择性披露，不代表其完整的申请记录。读者参考时建议结合自己的判断。';

export default function ApplicantProfile({ applicant }: ApplicantProfileProps) {
  const { undergraduate, scores, directions, tags } = applicant;
  const displayName = applicant.name;
  const destination = applicant.applications.find((a) => a.final);

  return (
    <div
      className={clsx(
        'dark:bg-dark rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700',
      )}
    >
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <div className='flex flex-wrap items-center gap-2'>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
              {displayName}
            </h1>
            {applicant.disclosure === 'partial' && (
              <span
                className={clsx(
                  'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
                  'border-amber-300 bg-amber-50 text-amber-800',
                  'dark:border-amber-700/60 dark:bg-amber-900/30 dark:text-amber-200',
                )}
              >
                <span aria-hidden='true'>ⓘ</span>
                部分披露
              </span>
            )}
            {applicant.application_via && (
              <ApplicationViaBadge via={applicant.application_via} />
            )}
          </div>
          <p className='mt-1 text-gray-600 dark:text-gray-400'>
            北京工业大学 · {undergraduate.major}
          </p>
          {destination && (
            <p className='mt-2 text-sm'>
              <span className='text-gray-500 dark:text-gray-400'>
                最终去向：
              </span>
              <Accent>
                {destination.program} @ {destination.school}
              </Accent>
            </p>
          )}
        </div>

        <div className='flex flex-wrap gap-2'>
          {directions.map((dir) => (
            <span
              key={dir}
              className={clsx(
                'rounded-full px-2.5 py-0.5 text-xs font-medium',
                'text-primary-600 bg-primary-300/20 dark:bg-primary-300/10 dark:text-primary-300',
              )}
            >
              {dir}
            </span>
          ))}
          {tags.map((tag) => (
            <span
              key={tag}
              className={clsx(
                'rounded-full px-2.5 py-0.5 text-xs font-medium',
                'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
              )}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {applicant.disclosure === 'partial' && (
        <div
          className={clsx(
            'mt-4 rounded-md border-l-2 px-3 py-2 text-sm',
            'border-amber-400 bg-amber-50/60 text-amber-900',
            'dark:border-amber-600 dark:bg-amber-900/20 dark:text-amber-100',
          )}
        >
          <b className='font-semibold'>说明：</b>
          {DISCLOSURE_NOTE}
        </div>
      )}

      {/* Contact & offers */}
      {(applicant.contact || applicant.homepage || applicant.offers) && (
        <div className='mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 dark:text-gray-400'>
          {applicant.contact && (
            <span>
              <b className='text-gray-800 dark:text-gray-200'>联系方式：</b>
              {applicant.contact}
            </span>
          )}
          {applicant.homepage &&
            /^https?:\/\/|^mailto:/.test(applicant.homepage) && (
              <span>
                <b className='text-gray-800 dark:text-gray-200'>主页：</b>
                <UnstyledLink
                  href={applicant.homepage}
                  className='text-primary-400 hover:text-primary-500'
                >
                  {applicant.homepage}
                </UnstyledLink>
              </span>
            )}
          {applicant.offers && applicant.offers.length > 0 && (
            <span>
              <b className='text-gray-800 dark:text-gray-200'>可提供的帮助：</b>
              {applicant.offers.join('、')}
            </span>
          )}
        </div>
      )}

      <div className='mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4'>
        {undergraduate.gpa != null && (
          <InfoItem
            label='GPA'
            value={`${undergraduate.gpa}/${undergraduate.gpa_scale || 4.0}`}
          />
        )}
        {undergraduate.ranking && (
          <InfoItem label='排名' value={undergraduate.ranking} />
        )}
        {scores.toefl && (
          <InfoItem label='TOEFL' value={String(scores.toefl)} />
        )}
        {scores.ielts && (
          <InfoItem label='IELTS' value={String(scores.ielts)} />
        )}
        {scores.gre && <InfoItem label='GRE' value={String(scores.gre)} />}
        {scores.gmat && <InfoItem label='GMAT' value={String(scores.gmat)} />}
        {scores.duolingo && (
          <InfoItem label='Duolingo' value={String(scores.duolingo)} />
        )}
      </div>
    </div>
  );
}

const VIA_META: Record<
  NonNullable<Applicant['application_via']>,
  { label: string; icon: string; classes: string }
> = {
  diy: {
    label: 'DIY',
    icon: '🛠',
    classes:
      'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-700/60 dark:bg-emerald-900/30 dark:text-emerald-200',
  },
  agency: {
    label: '中介',
    icon: '🏢',
    classes:
      'border-sky-300 bg-sky-50 text-sky-800 dark:border-sky-700/60 dark:bg-sky-900/30 dark:text-sky-200',
  },
  mixed: {
    label: '部分中介',
    icon: '⚙️',
    classes:
      'border-violet-300 bg-violet-50 text-violet-800 dark:border-violet-700/60 dark:bg-violet-900/30 dark:text-violet-200',
  },
};

function ApplicationViaBadge({
  via,
}: {
  via: NonNullable<Applicant['application_via']>;
}) {
  const meta = VIA_META[via];
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium',
        meta.classes,
      )}
    >
      <span aria-hidden='true'>{meta.icon}</span>
      {meta.label}
    </span>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className='text-xs text-gray-500 dark:text-gray-400'>{label}</dt>
      <dd className='mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100'>
        {value}
      </dd>
    </div>
  );
}
