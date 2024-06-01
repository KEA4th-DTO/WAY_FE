const { override, overrideDevServer } = require('customize-cra');

const devServerConfig = () => config => {
  return {
    ...config,
    allowedHosts: [
      'localhost',
      'http://210.109.54.44/'
    ],
  };
};

module.exports = {
  webpack: override(),
  devServer: overrideDevServer(devServerConfig())
};
