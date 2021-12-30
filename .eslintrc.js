module.exports = {
  root: true,
  env: { node: true },
  parser: 'vue-eslint-parser',
  parserOptions: { ecmaVersion: 2020, parser: '@typescript-eslint/parser' },
  extends: [
    'plugin:jsx-a11y/recommended',
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 1 : 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 1 : 0,
    '@typescript-eslint/no-explicit-any': 0,
    'vue/require-default-prop': process.env.NODE_ENV === 'production' ? 1 : 0,
    'vue/no-mutating-props': process.env.NODE_ENV === 'production' ? 1 : 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    'vue/multi-word-component-names': 0,
    'vue/name-property-casing': ['error', 'kebab-case'],
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
      env: { jest: true },
    },
    {
      files: ['packages/*/src/**/*.vue'],
      rules: {
        'no-undef': 'off',
      },
    },
  ],
};
