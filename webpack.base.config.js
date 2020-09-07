//общая конфигурация webpack
const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserWebpackPlugin = require('terser-webpack-plugin');
require('dotenv').config();

const mode = process.env.MODE || 'development';
const isDev = mode === 'development';
const isProd = !isDev;
const filename = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);

const plugins = () => {
  const config = [new VueLoaderPlugin()];

  if (isProd) {
    config.push(new BundleAnalyzerPlugin());
  }

  return config;
};

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  };

  if (isProd) {
    config.minimizer = [new TerserWebpackPlugin()];
  }

  return config;
};

const baseConfig = {
  mode,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/\/node_modules\//],
        loader: 'babel-loader',
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
    ],
  },
  plugins: plugins(),
  devtool: isDev ? 'source-map' : false,
  resolve: {
    extensions: ['.js', '.json', '.vue'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimization: optimization(),
};

module.exports = baseConfig;
