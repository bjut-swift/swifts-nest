import clsx from 'clsx';
import { InferGetStaticPropsType } from 'next';
import * as React from 'react';
import { HiCalendar, HiEye } from 'react-icons/hi';

import { getFromSessionStorage } from '@/lib/helper.client';
import { getTags, sortByDate, sortDateFn } from '@/lib/mdx.client';
import { getAllFilesFrontmatter } from '@/lib/mdx.server';
import useInjectContentMeta from '@/hooks/useInjectContentMeta';
import useLoaded from '@/hooks/useLoaded';

import Accent from '@/components/Accent';
import BlogCard from '@/components/content/blog/BlogCard';
import SubscribeCard from '@/components/content/blog/SubscribeCard';
import ContentPlaceholder from '@/components/content/ContentPlaceholder';
import Tag, { SkipNavTag } from '@/components/content/Tag';
import StyledInput from '@/components/form/StyledInput';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import SortListbox, { SortOption } from '@/components/SortListbox';

import { BlogFrontmatter, InjectedMeta } from '@/types/frontmatters';

const sortOptions: Array<SortOption> = [
  {
    id: 'date',
    name: 'Sort by date',
    icon: HiCalendar,
  },
  {
    id: 'views',
    name: 'Sort by views',
    icon: HiEye,
  },
];

export default function IndexPage({
  posts,
  tags,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  /** Lazy init from session storage to preserve preference on revisit */
  const [sortOrder, setSortOrder] = React.useState<SortOption>(
    () => sortOptions[Number(getFromSessionStorage('blog-sort')) || 0]
  );
  // const [isEnglish] = React.useState<boolean>(true);
  const isLoaded = useLoaded();

  const populatedPosts = useInjectContentMeta('blog', posts);

  //#region  //*=========== Search ===========
  const [search, setSearch] = React.useState<string>('');
  const [filteredPosts, setFilteredPosts] = React.useState<
    Array<BlogFrontmatter & InjectedMeta>
  >(() => [...posts]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  React.useEffect(() => {
    const results = populatedPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.description.toLowerCase().includes(search.toLowerCase()) ||
        // Check if splitted search contained in tag
        search
          .toLowerCase()
          .split(' ')
          .every((tag) => post.tags.includes(tag))
    );

    if (sortOrder.id === 'date') {
      results.sort(sortDateFn);
      sessionStorage.setItem('blog-sort', '0');
    } else if (sortOrder.id === 'views') {
      results.sort((a, b) => (b?.views ?? 0) - (a?.views ?? 0));
      sessionStorage.setItem('blog-sort', '1');
    }

    setFilteredPosts(results);
  }, [search, sortOrder.id, populatedPosts]);
  //#endregion  //*======== Search ===========

  const englishPosts = filteredPosts.filter((p) => !p.slug.startsWith('id-'));

  //#region  //*=========== Tag ===========
  const toggleTag = (tag: string) => {
    // If tag is already there, then remove
    if (search.includes(tag)) {
      setSearch((s) =>
        s
          .split(' ')
          .filter((t) => t !== tag)
          ?.join(' ')
      );
    } else {
      // append tag
      setSearch((s) => (s !== '' ? `${s.trim()} ${tag}` : tag));
    }
  };

  /** Currently available tags based on filtered posts */
  const filteredTags = getTags(englishPosts);

  /** Show accent if not disabled and selected  */
  const checkTagged = (tag: string) => {
    return (
      filteredTags.includes(tag) &&
      search.toLowerCase().split(' ').includes(tag)
    );
  };
  //#endregion  //*======== Tag ===========

  return (
    <Layout>
      <Seo templateTitle='专栏分享' description='我们想传的更远的一些声音。' />

      <main>
        <section className={clsx(isLoaded && 'fade-in-start')}>
          <div className='layout py-12'>
            <h1 className='text-3xl md:text-5xl' data-fade='0'>
              <Accent>专栏分享</Accent>
            </h1>
            <p className='mt-2 text-gray-600 dark:text-gray-300' data-fade='1'>
              我们想传的更远的一些声音。
            </p>
            <StyledInput
              data-fade='2'
              className='mt-4'
              placeholder='Search...'
              onChange={handleSearch}
              value={search}
              type='text'
            />
            <div
              className='mt-2 flex flex-wrap items-baseline justify-start gap-2 text-sm text-gray-600 dark:text-gray-300'
              data-fade='3'
            >
              <span className='font-medium'>筛选主题：</span>
              <SkipNavTag>
                {tags.map((tag) => (
                  <Tag
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    disabled={!filteredTags.includes(tag)}
                  >
                    {checkTagged(tag) ? <Accent>{tag}</Accent> : tag}
                  </Tag>
                ))}
              </SkipNavTag>
            </div>
            <div
              className='relative z-10 mt-4 flex flex-col items-end gap-4 text-gray-600 dark:text-gray-300 md:mt-8'
              data-fade='4'
            >
              <SortListbox
                selected={sortOrder}
                setSelected={setSortOrder}
                options={sortOptions}
              />
            </div>
            <ul
              className='mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3'
              data-fade='5'
            >
              {englishPosts.length > 0 ? (
                englishPosts.map((post) => (
                  <BlogCard
                    key={post.slug}
                    post={post}
                    checkTagged={checkTagged}
                  />
                ))
              ) : (
                <ContentPlaceholder />
              )}
            </ul>
            <SubscribeCard className='mt-8' />
          </div>
        </section>
      </main>
    </Layout>
  );
}

export async function getStaticProps() {
  const files = await getAllFilesFrontmatter('blog');
  const posts = sortByDate(files);

  // Accumulate tags and remove duplicate
  const tags = getTags(posts);

  return { props: { posts, tags } };
}
