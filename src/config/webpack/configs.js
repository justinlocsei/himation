'use strict';

var autoprefixer = require('autoprefixer');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var cssnano = require('cssnano');
var extend = require('extend');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var flatten = require('lodash/flatten');
var os = require('os');
var path = require('path');
var StyleLintPlugin = require('stylelint-webpack-plugin');
var webpack = require('webpack');
var WriteFilePlugin = require('write-file-webpack-plugin');

var BuildManifestPlugin = require('himation/config/webpack/plugins/build-manifest');
var paths = require('himation/core/paths');
var routes = require('himation/config/routes');
var settings = require('himation/core/settings');
var sources = require('himation/config/webpack/sources');

// The IDs of each build
var BUILD_IDS = {
  server: 'server',
  ui: 'ui'
};

// A blacklist of modules that will not be included in server-side builds
var SERVER_MODULE_BLACKLIST = [
  'himation/config',
  'himation/core',
  'himation/email',
  'himation/server'
];

// Core.js polyfills to enable in the browser
var POLYFILLS = [
  'es5',
  'fn/array/find',
  'fn/promise'
];

/**
 * Create a webpack config by applying settings on top of a baseline
 *
 * @param {object} custom Custom settings to add to the baseline
 * @returns {object}
 * @private
 */
function create(custom) {
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
 * @param {boolean} compress Whether to compress the files
 * @returns {object[]}
 * @private
 */
function sassLoaders(compress) {
  var loaders = ['css?-minimize', 'postcss', 'sass'];
  if (!compress) {
    loaders = useSourcemaps(loaders);
  }

  return [
    {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract('style', loaders)
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
        cacheDirectory: path.join(os.tmpdir(), 'himation-babel'),
        compact: !preserve,
        plugins: babelPlugins,
        presets: ['es2015', 'react'],
        retainLines: !!preserve
      }
    },
    {
      test: /\.json$/,
      loader: 'json'
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
    var rasterCompression = {
      interlaced: false,
      mozjpeg: {
        quality: 65
      },
      optimizationLevel: 4,
      pngquant: {
        quality: '65-90',
        speed: 4
      },
      progressive: true
    };
    rasterLoader.loaders.push('image-webpack?' + JSON.stringify(rasterCompression));
  }

  var svgLoader = {
    test: /\.svg$/,
    loaders: ['file?name=[hash].[ext]']
  };

  if (optimize) {
    var svgCompression = {
      svgo: {
        plugins: [
          {removeViewBox: false}
        ]
      }
    };
    svgLoader.loaders.push('image-webpack?' + JSON.stringify(svgCompression));
  }

  var icoLoader = {
    test: /\.ico$/,
    loader: 'file?name=[hash].[ext]'
  };

  return [rasterLoader, svgLoader, icoLoader];
}

/**
 * Return an array of webpack plugins to use
 *
 * @param {string} label The label for the build
 * @param {boolean} optimize Whether to optimize assets
 * @param {boolean} compress Whether to compress the files
 * @returns {object[]}
 * @private
 */
function globalPlugins(label, optimize, compress) {
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
      compressor: {warnings: false},
      comments: false,
      sourceMap: false
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
      discardComments: {removeAll: true},
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
 * Add a loader to produce a custom Modernizr build
 *
 * @param {object} config A webpack configuration
 * @param {boolean} compress Whether to compress the build
 * @returns {object} The updated configuration file
 */
function addModernizrBuild(config, compress) {
  var loaders = ['raw'];
  if (compress) { loaders.push('uglify'); }
  loaders.push(path.join(paths.src, 'config', 'webpack', 'loaders', 'modernizr.js'));

  config.module.loaders.push({
    test: /\.modernizrrc$/,
    loaders: loaders
  });

  config.resolve.alias['modernizr-build$'] = path.join(paths.root, '.modernizrrc');

  if (compress) {
    config['uglify-loader'] = {
      comments: false,
      sourceMap: false
    };
  }

  return config;
}

/**
 * Create a webpack configuration for use on the server
 *
 * This produces compiled ES3 JS files that are used exclusively for server-side
 * rendering, allowing us to skip optimization, even for production builds.
 *
 * @returns {object} A server-appropriate webpack configuration
 */
function server() {
  var entries = sources.routesToEntryPoints(routes, {
    directory: paths.server.root,
    modules: ['views'],
    root: 'himation'
  });

  var isExternalModule = new RegExp('^(' + SERVER_MODULE_BLACKLIST.join('|') + ')($|/)');
  var optimize = settings.assets.optimize;

  var config = create({
    context: paths.server.root,
    devtool: false,
    entry: entries,
    externals: function(context, request, callback) {
      return callback(null, isExternalModule.test(request));
    },
    module: {
      loaders: flatten([
        imageLoaders(optimize),
        jsLoaders([paths.server.views, paths.ui.js], true, optimize),
        sassLoaders(optimize)
      ])
    },
    output: {
      filename: '[name].js',
      libraryTarget: 'commonjs2',
      path: paths.build.assets,
      publicPath: settings.servers.assets.publicUrl
    },
    plugins: globalPlugins(BUILD_IDS.server, optimize, false),
    target: 'node'
  });

  config = addModernizrBuild(config, optimize);
  return forceFileWriting(config);
}

/**
 * Create a webpack configuration for rendering the UI in the browser
 *
 * This produces the publicy visible assets and client-facing JS code.
 *
 * @returns {object} A browser-appropriate webpack configuration
 */
function ui() {
  var optimizeAssets = settings.assets.optimize;

  var entries = sources.routesToEntryPoints(routes, {
    dependencies: POLYFILLS.map(name => 'core-js/' + name),
    directory: paths.ui.js,
    modules: ['pages'],
    root: 'himation'
  });

  var commonsOptions = sources.entryPointsToCommonsChunks(entries, {optimize: optimizeAssets});
  var commons = commonsOptions.map(options => new CommonsChunkPlugin(options));

  var config = create({
    context: paths.ui.js,
    devtool: optimizeAssets ? 'hidden-source-map' : 'source-map',
    entry: entries,
    module: {
      loaders: flatten([
        imageLoaders(optimizeAssets),
        jsLoaders([paths.src], false, false),
        sassLoaders(optimizeAssets)
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
    plugins: commons.concat(globalPlugins(BUILD_IDS.ui, optimizeAssets, optimizeAssets)),
    target: 'web'
  });

  config = addModernizrBuild(config, optimizeAssets);
  return forceFileWriting(config);
}

module.exports = {};
module.exports[BUILD_IDS.server] = server;
module.exports[BUILD_IDS.ui] = ui;
