import path from "path";
import config from './config.js';
import webpack from 'webpack';

import CleanWebpackPlugin from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

module.exports = {
  entry: path.resolve(config.themeRoot, "src/scripts/theme.js"),

  plugins: [
    new CleanWebpackPlugin('dist', {root: config.themeRoot,}),

    new CopyWebpackPlugin([
      { from: 'src/assets', to: '../assets' },
      { from: 'src/config', to: '../config' },
      { from: 'src/layout', to: '../layout' },
      { from: 'src/locales', to: '../locales' },
      { from: 'src/sections', to: '../sections' },
      { from: 'src/snippets', to: '../snippets' },
      { from: 'src/templates', to: '../templates' }
    ]),

    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: function (module) {
        // This prevents stylesheet resources with the .css or .scss extension
        // from being moved from their original chunk to the vendor chunk
        if(module.resource && (/^.*\.(css|scss)$/).test(module.resource)) {
          return false;
        }
        return module.context && module.context.indexOf("node_modules") !== -1;
      }
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: "manifest",
      minChunks: Infinity
    })
  ],

  output: {
    filename: '[name].js',
    path: path.resolve(config.themeRoot, "dist/assets")
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: path.resolve(config.themeRoot, './node_modules/@shopify/slate-tools/node_modules/babel-preset-env')
          }
        }
      }
    ]
  },

  resolveLoader: {
    modules: [
      "./node_modules/@shopify/slate-tools/node_modules"
    ],
  }
}