module.exports = {
  overrides: [
    {
      include: './app',
      extends: '@js-toolkit/configs/babel/react.babelrc.js',
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
      ],
    },
    {
      exclude: './app',
      extends: '@js-toolkit/configs/babel/node.babelrc.js',
    },
  ],
};
