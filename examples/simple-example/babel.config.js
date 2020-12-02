module.exports = {
  overrides: [
    {
      include: './app',
      extends: '@vzh/configs/babel/react.babelrc.js',
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
      ],
    },
    {
      exclude: './app',
      extends: '@vzh/configs/babel/node.babelrc.js',
    },
  ],
};
