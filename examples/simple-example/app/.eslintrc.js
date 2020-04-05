/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,

  extends: require.resolve('@vzh/configs/eslint/react.eslintrc.js'),

  parserOptions: {
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },

  rules: {
    'react/prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',
  },
};
