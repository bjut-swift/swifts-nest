import clsx from 'clsx';
import * as React from 'react';
import {
  SiNextdotjs,
  SiPrisma,
  SiReact,
  SiReactquery,
  SiTailwindcss,
  SiTypescript,
} from 'react-icons/si';

import CustomLink from '@/components/links/CustomLink';
import Tooltip from '@/components/Tooltip';

export default function TechStack() {
  return (
    <div className='flex space-x-2 md:space-x-4'>
      {stacks.map((tech) => (
        <Tooltip key={tech.id} tipChildren={<p>{tech.tooltip}</p>}>
          <tech.icon
            key={tech.id}
            className={clsx(
              'h-8 w-8 md:h-10 md:w-10',
              'text-gray-600 hover:text-primary-300 dark:text-gray-200 dark:hover:text-primary-300',
              'transition-colors'
            )}
          />
        </Tooltip>
      ))}
    </div>
  );
}

const stacks = [
  {
    id: 'nextjs',
    icon: SiNextdotjs,
    tooltip: (
      <>
        <CustomLink href='https://nextjs.org'>Next.js</CustomLink>,
        一个功能强大且灵活的React框架。它提供了静态生成、动态路径和内置API等功能，极大地提高了开发效率和网站性能。
      </>
    ),
  },
  {
    id: 'react',
    icon: SiReact,
    tooltip: (
      <>
        <CustomLink href='https://reactjs.org/'>React</CustomLink>,
        一个流行的前端库。它提供了声明式编程模型，帮助开发者快速构建用户界面。
      </>
    ),
  },
  {
    id: 'typescript',
    icon: SiTypescript,
    tooltip: (
      <>
        <CustomLink href='https://www.typescriptlang.org/'>
          TypeScript
        </CustomLink>
        ,
        一个静态类型检查的JavaScript超集。它可以帮助开发者编写更安全、更可维护的代码。
      </>
    ),
  },
  {
    id: 'tailwind',
    icon: SiTailwindcss,
    tooltip: (
      <>
        <CustomLink href='https://tailwindcss.com/'>Tailwind CSS</CustomLink>,
        一个实用性极高的CSS框架。它提供了大量的预定义类，可以快速实现样式的重用和自定义。
      </>
    ),
  },
  {
    id: 'react-query',
    icon: SiReactquery,
    tooltip: (
      <>
        <CustomLink href='https://tanstack.com/'>TanStack Query</CustomLink>,
        一个功能强大的React Hooks
        库。它提供了数据获取和缓存的解决方案，提高了应用程序的性能和用户体验。
      </>
    ),
  },
  {
    id: 'prisma',
    icon: SiPrisma,
    tooltip: (
      <>
        <CustomLink href='https://www.prisma.io/'>Prisma</CustomLink>,
        一个简单易用的ORM工具。它提供了简洁的数据模型定义和查询API，帮助开发者快速构建数据层。
      </>
    ),
  },
];
