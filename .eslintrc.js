module.exports = {
  root: true,
  extends: require.resolve('@js-toolkit/configs/eslint/ts.react.eslintrc.js'),
  rules: {
    'react/prop-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
