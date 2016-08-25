'use strict';

var autoprefixer = require('autoprefixer');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var cssnano = require('cssnano');
var extend = require('extend');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var flatten = require('lodash/flatten');
var path = require('path');
var StyleLintPlugin = require('stylelint-webpack-plugin');
var webpack = require('webpack');
var WriteFilePlugin = require('write-file-webpack-plugin');

var resolvePaths = require('himation/core/paths').resolve;
var routes = require('himation/config/routes');
var sources = require('himation/config/webpack/sources');
var BuildManifestPlugin = require('himation/config/webpack/plugins/build-manifest');

// The IDs of each build
var BUILD_IDS = {
  server: 'server',
  ui: 'ui'
};

// Modules that cannot be include in a server-side build
var SERVER_MODULE_BLACKLIST = ['request'];

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
        'himation/images': paths.ui.images,
        'himation/server': paths.server.root,
        'himation/styles': paths.ui.scssFiles,
        'himation/ui': paths.ui.js
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
 * @param {boolean} preserve Whether to preserve the original code, if possible
 * @param {boolean} optimize Whether to optimize the code through transforms
 * @returns {object[]}
 * @private
 */
function jsLoaders(files, preserve, optimize) {
  const babelPlugins = [
    'transform-runtime',
    'transform-object-rest-spread'
  ];

  if (optimize) {
    babelPlugins.push('transform-react-constant-elements');
    babelPlugins.push('transform-react-inline-elements');
  }

  return [
    {
      test: /\.js$/,
      include: files,
      loader: 'babel',
      query: {
        cacheDirectory: true,
        compact: !preserve,
        plugins: babelPlugins,
        presets: ['es2015', 'react'],
        retainLines: !!preserve
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
    loaders: ['image-size?name=[hash].[ext]']
  };

  if (optimize) {
    var compression = {
      interlaced: false,
      optimizationLevel: 4,
      pngquant: {
        quality: '65-90',
        speed: 4
      },
      progressive: true
    };
    rasterLoader.loaders.push('image-webpack?' + JSON.stringify(compression));
  }

  var fallbackLoader = {
    test: /\.(ico|svg)$/,
    loader: 'file?name=[hash].[ext]'
  };

  return [rasterLoader, fallbackLoader];
}

/**
 * Return an array of webpack plugins to use
 *
 * @param {string} label The label for the build
 * @param {boolean} optimize Whether to optimize assets
 * @param {HimationSettings} settings Settings for the current build
 * @param {boolean} compress Whether to compress the files
 * @returns {object[]}
 * @private
 */
function globalPlugins(label, optimize, settings, compress) {
  var paths = resolvePaths();
  var extractTo = compress ? '[name]-[contenthash].css' : '[name]-[id].css';
  var plugins = [new ExtractTextPlugin(extractTo)];

  plugins.push(new StyleLintPlugin({
    configFile: path.join(paths.root, '.stylelintrc'),
    context: paths.ui.scss,
    files: '**/*.scss',
    syntax: 'scss'
  }));

  plugins.push(new BuildManifestPlugin(label, paths.build.root));
  plugins.push(new webpack.NoErrorsPlugin());

  var definitions = {
    __WEBPACK_DEF_HIMATION_CONFIG: JSON.stringify({
      debug: settings.debug,
      environment: settings.environment,
      googleAnalyticsId: settings.googleAnalyticsId,
      rootUrl: settings.servers.app.publicUrl,
      sentryDsn: settings.errors.track && settings.errors.sentryDsnPublic
    }),
    __WEBPACK_DEF_HIMATION_DEBUG: JSON.stringify(settings.debug)
  };

  if (optimize) {
    definitions['process.env.NODE_ENV'] = JSON.stringify('production');
  }

  plugins.push(new webpack.DefinePlugin(definitions));

  if (compress) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      compressor: {warnings: false}
    }));
  }

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
      browsers: ['last 2 versions', 'Safari >= 7', 'iOS >= 7'],
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
 * Modify a webpack configuration to ensure that files are written to disk
 *
 * @param {object} config A webpack configuration
 * @returns {object} The updated configuration file
 */
function forceFileWriting(config) {
  config.devServer = config.devServer || {};
  config.devServer.outputPath = config.output.path;

  config.plugins = config.plugins || [];
  config.plugins.push(new WriteFilePlugin({log: false}));

  return config;
}

/**
 * Create a webpack configuration for use on the server
 *
 * This produces compiled ES3 JS files that are used exclusively for server-side
 * rendering, allowing us to skip optimization, even for production builds.
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

  var externalCheck = new RegExp('^(' + SERVER_MODULE_BLACKLIST.join('|') + ')($|\/)');
  var optimize = settings.assets.optimize;

  var config = create(settings, {
    context: paths.server.root,
    devtool: false,
    entry: entries,
    externals: function(context, request, callback) {
      return callback(null, externalCheck.test(request));
    },
    module: {
      loaders: flatten([
        imageLoaders(optimize),
        jsLoaders([paths.server.views, paths.ui.js], true, optimize),
        sassLoaders()
      ])
    },
    output: {
      filename: '[name].js',
      libraryTarget: 'commonjs2',
      path: paths.build.assets,
      publicPath: settings.servers.assets.publicUrl
    },
    plugins: globalPlugins(BUILD_IDS.server, optimize, settings, false),
    target: 'node'
  });

  return forceFileWriting(config);
}

/**
 * Create a webpack configuration for rendering the UI in the browser
 *
 * This produces the publicy visible assets and client-facing JS code.
 *
 * @param {HimationSettings} settings The current settings
 * @returns {object} A browser-appropriate webpack configuration
 */
function ui(settings) {
  var paths = resolvePaths();
  var optimizeAssets = settings.assets.optimize;
  var entries = sources.routesToEntryPoints(routes, {
    modules: ['pages'],
    root: 'himation'
  });

  var commonsOptions = sources.entryPointsToCommonsChunks(entries, {optimize: optimizeAssets});
  var commons = commonsOptions.map(options => new CommonsChunkPlugin(options));

  var config = create(settings, {
    context: paths.ui.js,
    devtool: 'source-map',
    entry: entries,
    module: {
      loaders: flatten([
        imageLoaders(optimizeAssets),
        jsLoaders([paths.src], false, false),
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
      filename: settings.assets.optimize ? '[name]-[hash].js' : '[name].js',
      path: settings.assets.distDir,
      publicPath: settings.servers.assets.publicUrl
    },
    plugins: commons.concat(globalPlugins(BUILD_IDS.ui, optimizeAssets, settings, optimizeAssets)),
    target: 'web'
  });

  return forceFileWriting(config);
}

module.exports = {};
module.exports[BUILD_IDS.server] = server;
module.exports[BUILD_IDS.ui] = ui;
