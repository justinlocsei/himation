'use strict';

var _ = require('lodash');
var autoprefixer = require('autoprefixer');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var cssnano = require('cssnano');
var extend = require('extend');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');

var paths = require('chiton/core/paths');
var BuildStatsPlugin = require('chiton/config/webpack-plugins/build-stats');

// The IDs of each build
var BUILD_IDS = {
  server: 'server',
  ui: 'ui'
};

/**
 * Create a webpack config by applying settings on top of a baseline
 *
 * @param {ChitonSettings} settings The settings to use for creating the config
 * @param {object} custom Custom settings to add to the baseline
 * @returns {object}
 * @private
 */
function create(settings, custom) {
  return extend(true, {
    cache: true,
    debug: settings.assets.debug,
    module: {
      loaders: _.flatten([
        imageLoaders(settings.assets.optimize),
        jsLoaders(),
        sassLoaders()
      ])
    },
    resolve: {
      extensions: ['', '.js', '.scss'],
      alias: {
        'chiton/server': paths.server,
        'chiton/ui': paths.ui.root
      }
    },
    postcss: postCssPlugins(settings.assets.optimize),
    sassLoader: {
      includePaths: [paths.ui.scss]
    }
  }, custom);
}

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
 * Return an array of loaders for Sass files
 *
 * @returns {object[]}
 * @private
 */
function sassLoaders() {
  return [
    {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract('style', useSourcemaps(['css?-minimize', 'postcss', 'sass']))
    }
  ];
}

/**
 * Return an array of loaders for JS files
 *
 * @returns {object[]}
 * @private
 */
function jsLoaders() {
  return [
    {
      test: /\.js$/,
      include: [paths.ui.js],
      loader: 'babel',
      query: {
        cacheDirectory: true,
        plugins: ['transform-runtime'],
        presets: ['es2015', 'react']
      }
    }
  ];
}

/**
 * Return an array of loaders for image files
 *
 * @param {boolean} optimize Whether to optimize the images
 * @returns {object[]}
 * @private
 */
function imageLoaders(optimize) {
  var rasterLoader = {
    test: /\.(jpg|png)$/,
    loaders: ['url?limit=2500&name=images/[hash].[ext]']
  };

  if (optimize) {
    var compression = {
      interlaced: false,
      optimizationLevel: 4,
      pngquant: {
        quality: '65-90',
        speed: 4
      },
      progressive: false
    };
    rasterLoader.loaders.push('image-webpack?' + JSON.stringify(compression));
  }

  return [rasterLoader];
}

/**
 * Return an array of webpack plugins to use
 *
 * @param {string} label The label for the build
 * @param {boolean} optimize Whether to optimize the assets
 * @returns {object[]}
 * @private
 */
function globalPlugins(label, optimize) {
  var plugins = [new ExtractTextPlugin('[name]-[hash].css')];

  if (optimize) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      compressor: {warnings: false}
    }));
  }

  plugins.push(new BuildStatsPlugin(label, paths.build.root));
  plugins.push(new webpack.NoErrorsPlugin());

  return plugins;
}

/**
 * Return an array of PostCSS plugins to use
 *
 * @returns {object[]}
 * @param {boolean} optimize Whether to optimize the CSS
 * @private
 */
function postCssPlugins(optimize) {
  var plugins = [
    autoprefixer({
      browsers: ['last 2 versions'],
      remove: false
    })
  ];

  if (optimize) {
    plugins.push(cssnano({
      autoprefixer: false,
      zindex: false
    }));
  }

  return plugins;
}

/**
 * Create a webpack configuration for use on the server
 *
 * @param {ChitonSettings} settings The current settings
 * @returns {object} A server-appropriate webpack configuration
 */
function server(settings) {
  return create(settings, {
    context: paths.server,
    devtool: false,
    entry: {
      pages: './pages'
    },
    externals: function(context, request, callback) {
      var isNonRelative = /^[^\.]/.test(request);
      var isUiModule = /^chiton\//.test(request);
      return callback(null, isNonRelative && !isUiModule);
    },
    output: {
      filename: '[name].js',
      libraryTarget: 'commonjs2',
      path: paths.build.server,
      publicPath: '/'
    },
    plugins: globalPlugins(BUILD_IDS.server, settings.assets.optimize),
    target: 'node'
  });
}

/**
 * Create a webpack configuration for rendering the UI in the browser
 *
 * @param {ChitonSettings} settings The current settings
 * @returns {object} A browser-appropriate webpack configuration
 */
function ui(settings) {
  return create(settings, {
    context: paths.ui.js,
    devtool: 'source-map',
    entry: {
      about: './components/pages/about',
      index: './components/pages/index'
    },
    module: {
      preLoaders: [
        {
          test: /\.js$/,
          loader: 'eslint',
          include: [paths.ui.js]
        }
      ]
    },
    output: {
      filename: '[name]-[hash].js',
      path: paths.build.ui,
      publicPath: '/'
    },
    plugins: [
      new CommonsChunkPlugin({
        name: 'commons',
        filename: 'commons-[hash].js'
      })
    ].concat(globalPlugins(BUILD_IDS.ui, settings.assets.optimize)),
    target: 'web'
  });
}

module.exports = {};
module.exports[BUILD_IDS.server] = server;
module.exports[BUILD_IDS.ui] = ui;
