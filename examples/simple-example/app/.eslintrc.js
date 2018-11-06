module.exports = {
  extends: require.resolve('@vzh/configs/eslint/react.eslintrc.js'),
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', './app/src'],
      },
    },
  },
  rules: {
    'react/prop-types': 'off',
  },
};
