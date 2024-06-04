const { override, overrideDevServer } = require('customize-cra');

const devServerConfig = () => config => {
  return {
    ...config,
    allowedHosts: [
      'localhost',
      'https://www.way-blog.today'
    ],
  };
};

module.exports = {
  webpack: override(),
  devServer: overrideDevServer(devServerConfig())
};
