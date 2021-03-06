//конфигурация webpack
const path = require('path');
require('dotenv').config();
const config = process.env.CONFIG || 'main';
const mode = process.env.NODE_ENV || 'development';

console.log(`Режим: ${mode}`);
console.log(`Конфигурация: ${config}`);

module.exports = require(`./webpack.${config}.config`);
