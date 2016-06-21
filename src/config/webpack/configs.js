'use strict';

var _ = require('lodash');
var autoprefixer = require('autoprefixer');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var cssnano = require('cssnano');
var extend = require('extend');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');

var resolvePaths = require('himation/core/paths').resolve;
var routes = require('himation/config/routes');
var sources = require('himation/config/webpack/sources');
var BuildManifestPlugin = require('himation/config/webpack/plugins/build-manifest');

// The IDs of each build
var BUILD_IDS = {
  server: 'server',
  ui: 'ui'
};

/**
 * Create a webpack config by applying settings on top of a baseline
 *
 * @param {HimationSettings} settings The settings to use for creating the config
 * @param {object} custom Custom settings to add to the baseline
 * @returns {object}
 * @private
 */
function create(settings, custom) {
  var paths = resolvePaths();

  return extend(true, {
    cache: true,
    debug: settings.assets.debug,
    resolve: {
      extensions: ['', '.js', '.scss'],
      alias: {
        'himation/server': paths.server.root,
        'himation/ui': paths.ui.root
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
 * @param {string[]} files Paths to JS files that should be processed
 * @returns {object[]}
 * @private
 */
function jsLoaders(files) {
  return [
    {
      test: /\.js$/,
      include: files,
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

  plugins.push(new BuildManifestPlugin(label, resolvePaths().build.root));
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
 * @param {HimationSettings} settings The current settings
 * @returns {object} A server-appropriate webpack configuration
 */
function server(settings) {
  var paths = resolvePaths();
  var entries = sources.routesToEntryPoints(routes, {
    modules: ['views'],
    root: 'himation'
  });

  return create(settings, {
    context: paths.server.root,
    devtool: false,
    entry: entries,
    externals: function(context, request, callback) {
      var isNonRelative = /^[^\.]/.test(request);
      var isUiModule = /^himation\//.test(request);
      return callback(null, isNonRelative && !isUiModule);
    },
    module: {
      loaders: _.flatten([
        imageLoaders(settings.assets.optimize),
        jsLoaders([paths.server.views, paths.ui.js]),
        sassLoaders()
      ])
    },
    output: {
      filename: '[name].js',
      libraryTarget: 'commonjs2',
      path: paths.build.assets,
      publicPath: '/'
    },
    plugins: globalPlugins(BUILD_IDS.server, settings.assets.optimize),
    target: 'node'
  });
}

/**
 * Create a webpack configuration for rendering the UI in the browser
 *
 * @param {HimationSettings} settings The current settings
 * @returns {object} A browser-appropriate webpack configuration
 */
function ui(settings) {
  var paths = resolvePaths();
  var entries = sources.routesToEntryPoints(routes, {
    modules: ['components', 'pages'],
    root: 'himation'
  });

  var commonsOptions = sources.entryPointsToCommonsChunks(entries);
  var commons = commonsOptions.map(options => new CommonsChunkPlugin(options));

  return create(settings, {
    context: paths.ui.js,
    devtool: 'source-map',
    entry: entries,
    module: {
      loaders: _.flatten([
        imageLoaders(settings.assets.optimize),
        jsLoaders([paths.ui.js]),
        sassLoaders()
      ]),
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
      path: paths.assets,
      publicPath: settings.servers.assets.path
    },
    plugins: commons.concat(globalPlugins(BUILD_IDS.ui, settings.assets.optimize)),
    target: 'web'
  });
}

module.exports = {};
module.exports[BUILD_IDS.server] = server;
module.exports[BUILD_IDS.ui] = ui;
