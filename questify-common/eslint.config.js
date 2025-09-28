const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const prettier = require('eslint-plugin-prettier');

module.exports = tseslint.config(
  // Ignore patterns
  {
    ignores: ['build/**/*', 'eslint.config.js'], // Add eslint.config.js to ignore patterns
  },
  // Base configuration
  {
    languageOptions: {
      ecmaVersion: 2016,
      sourceType: 'commonjs',
      globals: { node: true },
      parser: tseslint.parser,
      parserOptions: {
        project: [],
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier: prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
  },
  {
    files: ['eslint.config.js'],
    languageOptions: {
      parserOptions: {
        project: null,
      },
    },
  },
);
