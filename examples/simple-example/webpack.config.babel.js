import clientConfig from '@js-toolkit/configs/webpack/client.config';

const config = clientConfig({ entry: './index', hash: true, devServer: { publicPath: '/' } });

export default config;
