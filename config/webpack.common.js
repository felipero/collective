/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const StyleLintPlugin = require('stylelint-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminMozjpeg = require('imagemin-mozjpeg');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const GoogleFontsPlugin = require("google-fonts-webpack-plugin");
const webpack = require('webpack');
const { GenerateSW } = require('workbox-webpack-plugin');

const PATHS = {
  app: path.join(__dirname, '..', "app"),
  swRegister: path.join(__dirname, '..', "app", "sw-register.js"),
  build: path.join(__dirname, '..', "dist"),
};

module.exports = env => {
  const isProduction = env.production === true;

  return {
    entry: {
      app: PATHS.app,
      swRegister: PATHS.swRegister,
      vendor: ['material-design-lite/material']
    },
    output: {
      path: PATHS.build,
      filename: "[name].cl.[chunkhash:8].js"
    },
    plugins: [
      new ExtractTextPlugin("stylesheets/[name].cl.[contenthash:8].css"),
      new StyleLintPlugin({}),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor'
      }),
      new GoogleFontsPlugin({
        fonts: [
          { family: "Roboto", variants: [ "400", "700italic" ] }
        ],
        filename: 'stylesheets/fonts.cl.'+ Math.random().toString(36).substring(2, 10) + '.css',
        path: '/fonts/',
        formats: [ "woff2", "woff", "svg" ]
      }),
      new HtmlWebpackPlugin({
        title: "",
        template: 'app/templates/index.html',
        minify: { html5: true, removeComments: isProduction, collapseWhitespace: isProduction, preserveLineBreaks: isProduction, decodeEntities: true }
      }),
      new CopyWebpackPlugin([
        'app/manifest.json',
        'app/robots.txt',
        'app/favicon.ico',
        { from: 'app/images/touch', to: 'images/touch'}
      ]),
      new ImageminPlugin({
        test: /\.(jpe?g|png|gif|svg)$/i,
        disable: !isProduction,
        pngquant: {
          quality: '25-40'
        },
        plugins: [
          imageminMozjpeg({
            quality: 80,
            progressive: true
          })
        ]
      }),
      new GenerateSW({
        skipWaiting: true,
        clientsClaim: true,
        cacheId: 'collective',
        dontCacheBustUrlsMatching: /\.cl\.\w{8}\./
      })
    ],
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/i,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              minified: !isProduction,
            }
          }
        },
        {
          test: /\.(scss|sass|css)$/i,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [
              {
                loader: 'css-loader',
                options: {
                  minimize: isProduction,
                  sourceMap: !isProduction,
                  importLoaders: 1
                }
              },
              {
                loader: "sass-loader",
                options: {
                  sourceMap: !isProduction
                }
              }
            ]
          })
        },
        {
          test: /\.(png|jpg|gif)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000,
                outputPath: '/images/',
                name: "[name].cl.[hash:8].[ext]"
              }
            }
          ]
        },
        {
          test: /\.svg/,
          use: {
            loader: 'svg-url-loader',
            options: {
              stripdeclarations: true,
              limit: 15000,
              outputPath: '/images/',
              name: "[name].cl.[hash:8].[ext]"
            }
          }
        },
        {
          test: /\.(eot|ttf|woff|woff2)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000,
                outputPath: '/fonts/',
                name: "[name].cl.[hash:8].[ext]"
              }
            }
          ]
        },
        {
          test: /\.js$/i,
          exclude: /node_modules/,
          loader: "eslint-loader",
          options: {
            failOnWarning: isProduction,
            failOnError: isProduction,
            emitWarning: !isProduction,
            formatter: require("eslint-friendly-formatter")
          }
        }
      ]
    }
  };
};
