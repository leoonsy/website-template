//конфигурация webpack
const path = require('path');
const baseConfig = require('./webpack.base.config');
const { merge } = require('webpack-merge');
require('dotenv').config();

const mode = process.env.MODE || 'development';
const isDev = mode === 'development';
const isProd = !isDev;

//главная конфигурация для верстки и т.д. (без взаимодействия с сервером)
const mainConfig = merge(baseConfig, {
  entry: {
    main: './src/scripts/main.js',
  },
  output: {
    filename: 'scripts/[name].min.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    watchContentBase: true,
    hot: isDev,
  },
});

module.exports = mainConfig;
