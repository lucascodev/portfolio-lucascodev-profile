import { reactLibrary } from './react-library.mjs';

/** @type {import('eslint').Linter.FlatConfig[]} */
export const next = [
  ...reactLibrary,
  {
    rules: {
      'react/no-unknown-property': 'off',
    },
  },
];
