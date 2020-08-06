//конфигурация webpack
const path = require('path')
const baseConfig = require('./webpack.base.config');

//главная конфигурация для верстки и т.д. (без взаимодействия с сервером)
const mainConfig = {
    ...baseConfig,
    context: path.resolve(__dirname, 'src'),
    entry: {
        main: './scripts/main.js'
    },
    output: {
        filename: 'scripts/[name].min.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        watchContentBase: true
    }
};

module.exports = mainConfig;