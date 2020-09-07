//конфигурация webpack
const path = require('path');
const baseConfig = require('./webpack.base.config');
const { merge } = require('webpack-merge');
require('dotenv').config();

const mode = process.env.MODE || 'development';
const isDev = mode === 'development';
const isProd = !isDev;

//конфигурация для взаимодействия с сервером
const backConfig = merge(baseConfig, {
  context: path.resolve(__dirname, 'www_src'),
  entry: {
    main: './scripts/main.js',
  },
  output: {
    filename: 'scripts/[name].min.js',
    path: path.resolve(__dirname, 'www_html'),
    publicPath: '/',
  },
});

module.exports = backConfig;
