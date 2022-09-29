const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./lib/umd.js",
  output: {
    filename: "walletconnect-js.min.js",
    library: {
      name: "wcjs",
      type: "umd",
    },
    path: path.resolve(__dirname, "umd"),
  },
  mode: "production",
  optimization: {
    minimize: true,
  },
  plugins: [
    // Work around for Buffer is undefined:
    // https://github.com/webpack/changelog-v5/issues/10
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(js|jsx)$/i,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env"]],
            plugins: [
              "@babel/plugin-proposal-class-properties",
              "@babel/plugin-proposal-nullish-coalescing-operator",
              "@babel/plugin-proposal-object-rest-spread",
              "@babel/plugin-proposal-optional-chaining",
              "@babel/plugin-transform-object-assign",
              "@babel/plugin-transform-react-constant-elements",
              "@babel/plugin-transform-runtime",
              "@babel/plugin-transform-modules-commonjs",
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      buffer: require.resolve("buffer/"),
      util: require.resolve("util/"),
      stream: require.resolve("stream-browserify"),
    },
  },
};
