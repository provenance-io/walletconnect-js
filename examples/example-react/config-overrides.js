const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = function override(config) {
  // Pull any existing fallbacks from config, or make a new fallback object
  const fallback = config.resolve.fallback || {};
  // Merge/add new webpack fallbacks
  Object.assign(fallback, {
    crypto: require.resolve('crypto-browserify'),
    buffer: require.resolve('buffer/'),
    stream: require.resolve('stream-browserify'),
    util: require.resolve('util/'),
  });
  // Set new fallback into config
  config.resolve.fallback = fallback;
  // Combine new plugins with any existing plugins
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
    new BundleAnalyzerPlugin({
      openAnalyzer: false,
    }),
  ]);
  // Return updated/modified webpack config
  return config;
};
