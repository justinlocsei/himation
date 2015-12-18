'use strict';

var _ = require('lodash');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var webpack = require('webpack');

var environments = require('./environments');
var paths = require('./paths');

/**
 * Enable source maps on a chain of loaders
 *
 * @param {string[]} loaders The names of all loaders to use
 * @returns {string} The chained loaders with source maps enabled
 * @private
 */
function useSourcemaps(loaders) {
  return loaders.map(function(loader) {
    var joiner = (loader.indexOf('?') === -1) ? '?' : '&';
    return loader + joiner + 'sourceMap';
  }).join('!');
}

/**
 * Load the webpack configuration for an environment
 *
 * @param {string} environment The name of an environment
 * @returns {Object} The environment's webpack configuration
 */
function load(environment) {
  var custom = _.extend({
    config: {},
    images: [],
    plugins: [],
    postcss: []
  }, environments.tailor(environment, {
    development: function() {
      return {
        config: {
          debug: true
        }
      };
    },
    production: function() {
      return {
        images: [
          'image-webpack?{interlaced: false, optimizationLevel: 4, pngquant:{quality: "65-90", speed: 4}, progressive: false}'
        ],
        plugins: [
          new webpack.optimize.UglifyJsPlugin({
            compressor: {
              warnings: false
            }
          }),
          new webpack.NoErrorsPlugin()
        ],
        postcss: [
          cssnano({
            autoprefixer: false,
            zindex: false
          })
        ]
      };
    }
  }, {}));

  var relativeAssets = path.relative(paths.build.base, paths.build.assets);
  var relativeImages = path.relative(paths.build.assets, paths.build.images);

  return _.extend({
    cache: true,
    context: paths.ui.js,
    devtool: 'source-map',
    entry: {
      about: './components/about.jsx',
      index: './components/index.jsx'
    },
    module: {
      loaders: [
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract('style', useSourcemaps(['css?-minimize', 'postcss', 'sass']))
        },
        {
          test: /\.js$/,
          include: [paths.ui.js],
          loader: 'babel',
          query: {
            cacheDirectory: true,
            plugins: ['transform-strict-mode']
          }
        },
        {
          text: /\.jsx$/,
          include: [paths.ui.components],
          loader: 'babel',
          query: {
            cacheDirectory: true,
            plugins: ['transform-runtime'],
            presets: ['react']
          }
        },
        {
          test: /\.(jpg|png)$/,
          loaders: [
            'url?limit=2500&name=' + relativeImages + '/[hash].[ext]'
          ].concat(custom.images)
        }
      ],
      preLoaders: [
        {
          test: /\.js$/,
          loaders: ['eslint'],
          include: [paths.ui.js]
        }
      ]
    },
    output: {
      chunkFilename: '[id].js',
      filename: '[name].js',
      path: paths.build.assets,
      publicPath: '/' + relativeAssets + '/'
    },
    plugins: [
      new ExtractTextPlugin('[name].css')
    ].concat(custom.plugins),
    postcss: [
      autoprefixer({
        browsers: ['last 2 versions'],
        remove: false
      })
    ].concat(custom.postcss),
    resolve: {
      extensions: ['', '.js', '.scss'],
      alias: {
        'chiton/server': paths.server,
        'chiton/ui': paths.ui.base
      }
    },
    sassLoader: {
      includePaths: [paths.ui.scss]
    }
  }, custom.config);
}

module.exports = {
  load: load
};
