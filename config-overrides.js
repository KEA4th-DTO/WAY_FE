const { override, overrideDevServer } = require('customize-cra');

const devServerConfig = () => config => {
  return {
    ...config,
    allowedHosts: [
      'localhost',
      '.yourdomain.com'
    ],
  };
};

module.exports = {
  webpack: override(),
  devServer: overrideDevServer(devServerConfig())
};
