module.exports = {
  env: {
    node: true,
    browser: true,
  },
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    '@typescript-eslint',
    'import',
    'simple-import-sort',
    'react-hooks',
    'react',
    'prettier',
  ],
  rules: {
    // plugin rules
    'import/extensions': ['error', 'ignorePackages', { ts: 'never', tsx: 'never' }],
    'import/prefer-default-export': 'off',
    'simple-import-sort/imports': 'error',
    'prettier/prettier': 'error',

    // basic rules
    'max-classes-per-file': 'off',
    'class-methods-use-this': 'off',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

    // typescript conflicting rules
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],

    // react
    'react/jsx-filename-extension': ['warn', { extensions: ['.tsx'] }],
    'react/prop-types': 'off',
    'react/require-default-props': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/no-unescaped-entities': 'off',
  },
  settings: {
    'import/resolver': {
      // this loads <rootdir>/tsconfig.json to eslint
      typescript: {},
    },
  },
};
