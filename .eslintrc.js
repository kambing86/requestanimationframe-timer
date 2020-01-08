module.exports = {
  extends: [
    'airbnb-base',
    'prettier',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  plugins: ['@typescript-eslint/tslint', 'prettier'],
  parserOptions: {
    project: 'tsconfig.json',
  },
  rules: {
    '@typescript-eslint/ban-ts-ignore': ['warn'],
    '@typescript-eslint/camelcase': ['off'],
    '@typescript-eslint/explicit-function-return-type': ['off'],
    '@typescript-eslint/explicit-member-accessibility': ['off'],
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/tslint/config': [
      'warn',
      {
        lintFile: './tslint.json',
      },
    ],
    'comma-dangle': ['error', 'always-multiline'],
    'no-console': ['warn'],
    'spaced-comment': ['error', 'always', { markers: ['/'] }],
    'import/no-unresolved': ['off'],
    'func-names': ['off'],
    'import/prefer-default-export': ['off'],
    'import/extensions': ['off'],
    'no-restricted-syntax': [
      'error',
      {
        selector: 'ForInStatement',
        message:
          'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        selector: 'LabeledStatement',
        message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
    ],
  },
};
