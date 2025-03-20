module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      ['blog', 'proj', 'lib', 'package', 'tutorial', 'post'],
    ],
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'chore',
        'style',
        'refactor',
        'ci',
        'test',
        'perf',
        'revert',
        'vercel',
        'lint',
        'husky',
        'update',
      ],
    ],
  },
};
