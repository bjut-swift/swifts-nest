import clsx from 'clsx';

import Accent from '@/components/Accent';
import UnstyledLink from '@/components/links/UnstyledLink';

import { Applicant } from '@/types/feiyue';

type ApplicantProfileProps = {
  applicant: Applicant;
};

export default function ApplicantProfile({ applicant }: ApplicantProfileProps) {
  const { undergraduate, scores, directions, tags } = applicant;
  const displayName = applicant.name;
  const destination = applicant.applications.find((a) => a.final);

  return (
    <div
      className={clsx(
        'rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-dark',
      )}
    >
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
            {displayName}
          </h1>
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
