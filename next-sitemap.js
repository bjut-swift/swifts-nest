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
};
