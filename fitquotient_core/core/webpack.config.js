const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/main.ts',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    libraryTarget: 'commonjs2',
    library: {
      type: 'commonjs2',
    },
  },
  module: {
    rules: [{ test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ }],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@common': path.resolve(__dirname, 'src/Common/'),
      '@users': path.resolve(__dirname, 'src/Users/'),
      '@llm': path.resolve(__dirname, 'src/Llms/'),
      '@jobs': path.resolve(__dirname, 'src/Jobs/'),
    },
  },
};

// add this at nest-cli.json
// "webpack": true,
// "webpackConfigPath": "webpack.config.js"
