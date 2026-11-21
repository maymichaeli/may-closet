const prettier = require('eslint-config-prettier/flat');

module.exports = [
  prettier,
  {
    rules: {
      curly: ['error', 'all'],
    },
  },
];
