const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './lib/umd.js',
  output: {
    filename: 'walletconnect-js.min.js',
    library: {
      name: 'wcjs',
      type: 'umd',
    },
    path: path.resolve(__dirname, 'umd'),
  },
  mode: 'production',
  optimization: {
    minimize: true,
  },
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
      {
        test: /\.(js|jsx)$/i,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env']],
          },
        },
      },
    ],
  },
};
