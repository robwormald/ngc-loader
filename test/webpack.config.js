//var LiveReloadPlugin = require('webpack-livereload-plugin');
var webpack = require('webpack');
var NgCompilerPlugin = require('@angular/ngc-loader').NgCompilerPlugin
var DashboardPlugin = require('webpack-dashboard/plugin');

module.exports = {
  resolve: {
    extensions: ['', '.scss', '.ts', '.js']
  },

  plugins: [
	  NgCompilerPlugin.create({mode: 'jit'}),
  ],

  entry: './src/main.aot.ts',
  output: {
    path: "./dist",
    publicPath: 'dist/',
    filename: "app.js"
  },

  devtool: 'source-map',

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: '@angular/ngc-loader'
      }
    ]
  },

  devServer: {
    historyApiFallback: true
  }
};
