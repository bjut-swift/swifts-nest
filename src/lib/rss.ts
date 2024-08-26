import format from 'date-fns/format';
import fs from 'fs';

import { getAllFilesFrontmatter } from '@/lib/mdx.server';

export async function getRssXml() {
  const frontmatters = await getAllFilesFrontmatter('blog');

  const blogUrl = 'https://bjutswift.cn/blog';

  const itemXml = frontmatters
    .filter((fm) => !fm.slug.startsWith('id-'))
    .map(({ slug, title, description, publishedAt, lastUpdated }) =>
      `
    <item>
      <title>${cdata(title)}</title>
      <description>${cdata(description)}</description>
      <link>${blogUrl}/${slug}</link>
      <guid>${blogUrl}/${slug}</guid>
      <pubDate>${format(
        new Date(lastUpdated ?? publishedAt),
        'yyyy-MM-dd'
      )}</pubDate>
    </item>
    `.trim()
    );

  return `
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:blogChannel="${blogUrl}">
      <channel>
        <title>BJUT SWIFT Homepage</title>
        <link>${blogUrl}</link>
        <description>BJUT SWIFT's Official Website</description>
        <language>en</language>
        <ttl>40</ttl>
        ${itemXml.join('\n')}
      </channel>
    </rss>
  `.trim();
}

function cdata(s: string) {
  return `<![CDATA[${s}]]>`;
}

export async function generateRss() {
  const xml = await getRssXml();
  fs.writeFileSync('public/rss.xml', xml);
}
