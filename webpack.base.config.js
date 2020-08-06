//общая конфигурация webpack
const path = require('path')
const webpack = require('webpack');
require('dotenv').config();

const mode = process.env.MODE || 'development';
const isDevelopment = mode === 'development';

const baseConfig = {
    mode,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/\/node_modules\//, /.min/],
                loader: 'babel-loader'
            },
        ]
    },
    devtool: isDevelopment ? 'eval-source-map' : false
};

module.exports = baseConfig;