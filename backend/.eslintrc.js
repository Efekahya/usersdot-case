module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    radix: 'off',
    'no-console': 'warn',
    'linebreak-style': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
      {
        selector: 'variableLike',
        format: ['camelCase', 'PascalCase', 'snake_case'],
        leadingUnderscore: 'allow',
      },
      {
        selector: 'property',
        filter: '__typename',
        format: null,
      },
      {
        selector: 'variable',
        filter: '__typename',
        format: null,
      },
      {
        selector: ['enumMember'],
        format: ['UPPER_CASE'],
      },
    ],
    'import/no-unresolved': 0,
    'import/no-named-as-default': 0,
    'import/namespace': 'off',
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'sibling',
          'parent',
          'index',
          'object',
          'type',
        ],
      },
    ],
  },
};
