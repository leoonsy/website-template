require('dotenv').config();

module.exports = {
  root: true,

  env: {
    node: true,
    browser: true,
    es2021: true,
  },

  rules: {
    'no-console': process.env.MODE === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.MODE === 'production' ? 'warn' : 'off',
    'no-empty': [
      'error',
      {
        allowEmptyCatch: true,
      },
    ],
    'no-unused-vars': 'warn',
  },
  parserOptions: {
    parser: 'babel-eslint',
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },

  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:vue/recommended',
  ],
};
