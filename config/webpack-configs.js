'use strict';

var _ = require('lodash');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var extend = require('extend');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');

var paths = require('./paths');

var relativeAssets = path.relative(paths.build.root, paths.build.assets);
var relativeImages = path.relative(paths.build.assets, paths.build.images);

// The baseline webpack config to use
var base = {
  cache: true,
  resolve: {
    extensions: ['', '.js', '.scss'],
    alias: {
      'chiton/server': paths.server.root,
      'chiton/ui': paths.ui.root
    }
  },
  sassLoader: {
    includePaths: [paths.ui.scss]
  }
};

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
 * @returns {Object[]}
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
 * @returns {Object[]}
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
 * @returns {Object[]}
 * @private
 */
function imageLoaders(optimize) {
  var rasterLoader = {
    test: /\.(jpg|png)$/,
    loaders: ['url?limit=2500&name=' + relativeImages + '/[hash].[ext]']
  };

  if (optimize) {
    rasterLoader.loaders.push('image-webpack?{interlaced: false, optimizationLevel: 4, pngquant:{quality: "65-90", speed: 4}, progressive: false}');
  }

  return [rasterLoader];
}

/**
 * Return an array of webpack plugins to use
 *
 * @param {boolean} optimize Whether to optimize the assets
 * @returns {Object[]}
 * @private
 */
function globalPlugins(optimize) {
  var plugins = [new ExtractTextPlugin('[hash].css')];

  if (optimize) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      compressor: {warnings: false}
    }));
  }

  return plugins;
}

/**
 * Return an array of PostCSS plugins to use
 *
 * @returns {Object[]}
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
 * Create a webpack plugin that logs the stats of a build to a file
 *
 * @param {string} file The absolute path of the file to receive the stats
 * @returns {function} The plugin function
 */
function statsPlugin(file) {
  return function() {
    this.plugin('done', function(stats) {
      fs.writeFileSync(file, JSON.stringify(stats.toJson(), null, '  '));
    });
  };
}

/**
 * Create a webpack configuration for use on the server
 *
 * @param {ChitonSettings} settings The current settings
 * @returns {object} A server-appropriate webpack configuration
 */
function server(settings) {
  return extend(true, {}, base, {
    context: paths.server.root,
    debug: settings.webpack.debug,
    devtool: false,
    entry: {
      pages: './pages'
    },
    externals: function(context, request, callback) {
      var isNonRelative = /^[^\.]/.test(request);
      var isUiModule = /^chiton\//.test(request);
      return callback(null, isNonRelative && !isUiModule);
    },
    module: {
      loaders: _.flatten([
        imageLoaders(settings.webpack.optimize),
        jsLoaders(),
        sassLoaders()
      ])
    },
    output: {
      filename: '[hash].js',
      libraryTarget: 'commonjs2',
      path: paths.server.ui,
      publicPath: '/' + relativeAssets + '/'
    },
    plugins: globalPlugins(settings.webpack.optimize),
    postcss: postCssPlugins(settings.webpack.optimize),
    target: 'node'
  });
}

/**
 * Create a webpack configuration for use in the browser
 *
 * @param {ChitonSettings} settings The current settings
 * @returns {object} A browser-appropriate webpack configuration
 */
function browser(settings) {
  return extend(true, {}, base, {
    context: paths.ui.js,
    debug: settings.webpack.debug,
    devtool: 'source-map',
    entry: {
      about: './components/about',
      index: './components/index'
    },
    module: {
      loaders: _.flatten([
        imageLoaders(settings.webpack.optimize),
        jsLoaders(),
        sassLoaders()
      ]),
      preLoaders: [
        {
          test: /\.js$/,
          loaders: ['eslint'],
          include: [paths.ui.js]
        }
      ]
    },
    output: {
      filename: '[hash].js',
      path: paths.build.assets,
      publicPath: '/' + relativeAssets + '/'
    },
    plugins: globalPlugins(settings.webpack.optimize).concat([
      statsPlugin(path.join(paths.server.ui, 'build.json'))
    ]),
    postcss: postCssPlugins(settings.webpack.optimize),
    target: 'web'
  });
}

module.exports = {
  browser: browser,
  server: server
};
