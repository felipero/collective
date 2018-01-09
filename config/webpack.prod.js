/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');
const merge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const OptimizeJsPlugin = require("optimize-js-plugin");
const commonConfig = require('./webpack.common.js');

module.exports = env => {
  const common = commonConfig(env);

  return merge(common, {
    plugins: [
      new CleanWebpackPlugin([common.output.path], {root: path.join(__dirname, '..')}),
      new OptimizeJsPlugin({ sourceMap: false }),
      new UglifyJSPlugin()
    ]
  });
};
