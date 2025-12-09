module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build', // Changes that affect the build system
        'chore', // Other changes that don't modify src or test files
        'ci', // Continuous Integration / Deployment changes
        'docs', // Documentation only changes
        'feat', // New feature
        'fix', // Bug fix
        'perf', // Performance improvements
        'refactor', // Code change that neither fixes a bug nor adds a feature
        'revert', // Revert a previous commit (automatically created by git revert)
        'style', // Formatting, missing semi colons, etc.
        'test', // Adding or updating tests
      ],
    ],
    'scope-empty': [2, 'never'], // Require a scope
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']], // Subject must not be sentence-case, start-case, pascal-case or upper-case
  },
};
