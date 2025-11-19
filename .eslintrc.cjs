/* eslint-disable */
module.exports = {
  root: true,
  ignorePatterns: [
    'dist/',
    'node_modules/',
    'cypress/',
    'e2e/',
    'server/',
    'speech-to-text/',
    '.idea/',
    '.vscode/',
    '*.config.js',
    '*.conf.js',
    '*.iml',
    '*.md',
    '*.zip',
    '*.yml'
  ],
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module'
      },
      plugins: ['@typescript-eslint', '@angular-eslint'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@angular-eslint/recommended',
        'prettier'
      ],
      rules: {
        // temp 
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/member-ordering': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-member-accessibility': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-shadow': 'off',
        '@typescript-eslint/no-unused-expressions': 'off',
        '@typescript-eslint/consistent-type-imports': 'off',
        '@angular-eslint/prefer-inject': 'off',
        '@angular-eslint/contextual-lifecycle': 'off',
        '@angular-eslint/no-async-lifecycle-method': 'off',
        '@angular-eslint/component-class-suffix': 'warn',
        '@angular-eslint/directive-class-suffix': 'warn',

        // warnings for now 
        'no-console': ['warn', { allow: ['log', 'warn', 'error'] }],
        'no-debugger': 'warn',
        'no-duplicate-imports': 'warn',
        'prefer-const': 'warn',
        'eqeqeq': ['warn', 'smart'],
        'quotes': 'off',
        'semi': 'off',
        'max-len': 'off',
        'sort-imports': 'off'
      }
    },
    {
      files: ['*.html'],
      extends: ['plugin:@angular-eslint/template/recommended'],
      rules: {
        // Turn off template rules temp
        '@angular-eslint/template/eqeqeq': 'off',
        '@angular-eslint/template/no-negated-async': 'off'
      }
    }
  ]
};
