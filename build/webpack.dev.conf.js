'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,
  output: {
    path: config.dev.assetsRoot,
    filename: utils.assetsPath('js/[name].js'),
    chunkFilename: utils.assetsPath('js/[id].js')
  },
  // these devServer options should be customized in /config/index.js
  // devServer: {
  //   clientLogLevel: 'warning',
  //   historyApiFallback: true,
  //   hot: true,
  //   compress: true,
  //   host: HOST || config.dev.host,
  //   port: PORT || config.dev.port,
  //   open: config.dev.autoOpenBrowser,
  //   overlay: config.dev.errorOverlay
  //     ? { warnings: false, errors: true }
  //     : false,
  //   publicPath: config.dev.assetsPublicPath,
  //   proxy: config.dev.proxyTable,
  //   quiet: true, // necessary for FriendlyErrorsPlugin
  //   watchOptions: {
  //     poll: config.dev.poll,
  //   }
  // },
  watch: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.dev.filename,
      template: config.dev.template,
      inject: true,
      favicon: resolve('favicon.ico'),
      title: 'vue-element-admin',
      path: config.dev.assetsPublicPath + config.dev.assetsSubDirectory,
      chunksSortMode: 'dependency'
    }),
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks (module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),
    // split echarts into its own file
    new webpack.optimize.CommonsChunkPlugin({
      async: 'echarts',
      minChunks(module) {
        var context = module.context;
        return context && (context.indexOf('echarts') >= 0 || context.indexOf('zrender') >= 0);
      }
    }),
    // split xlsx into its own file
    new webpack.optimize.CommonsChunkPlugin({
      async: 'xlsx',
      minChunks(module) {
        var context = module.context;
        return context && (context.indexOf('xlsx') >= 0);
      }
    }),
     // split codemirror into its own file
     new webpack.optimize.CommonsChunkPlugin({
      async: 'codemirror',
      minChunks(module) {
        var context = module.context;
        return context && (context.indexOf('codemirror') >= 0);
      }
    }),

    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = devWebpackConfig


