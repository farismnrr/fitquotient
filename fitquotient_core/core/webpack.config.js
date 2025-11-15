const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/main.ts',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js',
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ }],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@common': path.resolve(__dirname, 'src/Common/'),
      '@users': path.resolve(__dirname, 'src/Users/'),
    },
  },
};

// add this at nest-cli.json
// "webpack": true,
// "webpackConfigPath": "webpack.config.js"
