import fs from 'fs';

import { sortByDate } from '@/lib/mdx.client';
import { getAllFilesFrontmatter } from '@/lib/mdx.server';

export async function generateContentJson() {
  const [blogs, projects, library] = await Promise.all([
    getAllFilesFrontmatter('blog'),
    getAllFilesFrontmatter('projects'),
    getAllFilesFrontmatter('library'),
  ]);

  const data = {
    updatedAt: new Date().toISOString(),
    blog: sortByDate(blogs)
      .filter((fm) => !fm.slug.startsWith('id-'))
      .map(({ slug, title, description, publishedAt, tags }) => ({
        slug,
        title,
        description,
        publishedAt,
        tags,
        url: `https://www.bjutswift.cn/blog/${slug}`,
      })),
    projects: projects.map(
      ({ slug, title, description, techs, github, link }) => ({
        slug,
        title,
        description,
        techs,
        github,
        link,
        url: `https://www.bjutswift.cn/projects/${slug}`,
      }),
    ),
    library: library.map(({ slug, title, description, tags }) => ({
      slug,
      title,
      description,
      tags,
      url: `https://www.bjutswift.cn/shorts/${slug}`,
    })),
  };

  fs.writeFileSync('public/content.json', JSON.stringify(data, null, 2));
}
