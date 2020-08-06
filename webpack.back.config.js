//конфигурация webpack
const path = require('path')
const baseConfig = require('./webpack.base.config');

//конфигурация для взаимодействия с сервером
const backConfig = {
    ...baseConfig,
    context: path.resolve(__dirname, 'www_src'),
    entry: {
        main: './scripts/main.js'
    },
    output: {
        filename: 'scripts/[name].min.js',
        path: path.resolve(__dirname, 'www_html'),
        publicPath: '/'
    }
};

module.exports = backConfig;