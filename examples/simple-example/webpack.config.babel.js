import clientConfig from '@vzh/configs/webpack/client.config';

const config = clientConfig({ entry: './index', hash: true, devServer: { publicPath: '/' } });

export default config;
