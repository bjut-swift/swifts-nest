import clsx from 'clsx';
import Image from 'next/image';
import * as React from 'react';

import UnstyledLink from '@/components/links/UnstyledLink';
import TechIcons, { TechListType } from '@/components/TechIcons';

import { ProjectFrontmatter } from '@/types/frontmatters';

type ProjectCardProps = {
  project: ProjectFrontmatter;
} & React.ComponentPropsWithoutRef<'li'>;

export default function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <li
      className={clsx(
        'project-card rounded-md md:w-full',
        'border dark:border-gray-600',
        'scale-100 hover:scale-[1.02] active:scale-[0.97] motion-safe:transform-gpu',
        'transition duration-100',
        'motion-reduce:hover:scale-100',
        'animate-shadow',
        className
      )}
    >
      <UnstyledLink
        href={`/projects/${project.slug}`}
        className='flex h-full flex-col items-start rounded-md p-4 focus:outline-none focus-visible:ring focus-visible:ring-primary-300'
      >
        <h4>{project.title}</h4>
        <p className='mb-auto text-sm text-gray-700 dark:text-gray-300'>
          {project.description}
        </p>
        <div className='mt-2'>
          <TechIcons techs={project.techs.split(',') as Array<TechListType>} />
        </div>

        {/* 使用 next/image 组件加载图片 */}
        <div className='pointer-events-none relative mt-3 w-full'>
          <Image
            src={project.banner}
            alt={project.title}
            layout='responsive'
            width={1440}
            height={792}
            objectFit='cover'
            placeholder='blur' // 可选：添加模糊占位符
            blurDataURL='/path/to/blur-placeholder.jpg' // 可选：模糊占位符图片路径
          />
        </div>

        <p className='animated-underline mt-2 inline-block font-medium'>
          See more →
        </p>
      </UnstyledLink>
    </li>
  );
}
