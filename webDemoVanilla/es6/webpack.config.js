const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devServer: {
    static: './public',
    hot: true,
    open: true,
    port: 3000,
    watchFiles: ['src/**/*'],
  },
  devtool: 'eval-cheap-source-map',
  entry: './src/index.js',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public'),
    clean: true,
  },
  plugins: [
    // Work around for Buffer is undefined:
    // https://github.com/webpack/changelog-v5/issues/10
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new HtmlWebpackPlugin({
      title: 'WalletConnect-JS | Vanilla ES6 Demo',
      template: 'src/index.html',
      inject: false,
    }),
  ],
  resolve: {
    extensions: ['.js'],
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      buffer: require.resolve('buffer/'),
      util: require.resolve('util/'),
      stream: require.resolve('stream-browserify'),
    },
  },
  watchOptions: {
    aggregateTimeout: 200,
    poll: 1000,
    ignored: '**/node_modules',
  },
};
