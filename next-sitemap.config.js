const fs = require('fs');
const matter = require('gray-matter');
const path = require('path');

const contentDir = path.join(__dirname, 'src', 'contents');

/**
 * Read frontmatter date from MDX content files
 */
function getContentDate(urlPath) {
  const blogMatch = urlPath.match(/^\/blog\/(.+)$/);
  const projectMatch = urlPath.match(/^\/projects\/(.+)$/);
  const shortsMatch = urlPath.match(/^\/shorts\/(.+)$/);

  let filePath;
  if (blogMatch) {
    filePath = path.join(contentDir, 'blog', `${blogMatch[1]}.mdx`);
  } else if (projectMatch) {
    filePath = path.join(contentDir, 'projects', `${projectMatch[1]}.mdx`);
  } else if (shortsMatch) {
    filePath = path.join(contentDir, 'library', `${shortsMatch[1]}.mdx`);
  }

  if (filePath && fs.existsSync(filePath)) {
    try {
      const { data } = matter(fs.readFileSync(filePath, 'utf-8'));
      return data.lastUpdated || data.publishedAt;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.bjutswift.cn',
  generateRobotsTxt: true,
  changefreq: false,
  priority: false,
  exclude: ['/dev/*', '/trf/*', '/sandbox/*', '/design', '/404'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'CCBot', disallow: '/' },
      { userAgent: 'anthropic-ai', disallow: '/' },
    ],
  },
  transform: async (config, urlPath) => {
    const date = getContentDate(urlPath);
    return {
      loc: urlPath,
      lastmod: date ? new Date(date).toISOString() : undefined,
    };
  },
};
