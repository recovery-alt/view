module.exports = {
  root: true,
  env: { node: true },
  parserOptions: { ecmaVersion: 2020 },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    'vue/name-property-casing': ['error', 'kebab-case'],
    'vue/component-definition-name-casing': ['error', 'kebab-case'],
  },
  overrides: [
    {
      files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/**/*.spec.{j,t}s?(x)'],
      env: { jest: true },
    },
  ],
};
