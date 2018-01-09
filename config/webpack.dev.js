/* eslint-disable import/no-extraneous-dependencies */

const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = (env = {}) => {
  env.production = false;
  const common = commonConfig(env);

  return merge(common, {
    plugins: [ new webpack.NamedModulesPlugin() ],
    devtool: 'inline-source-map',
    devServer: {
      host: '127.0.0.1',
      contentBase: common.output.path,
      compress: true,
      overlay: true
    }
  });
};
