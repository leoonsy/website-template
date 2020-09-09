//общая конфигурация webpack
const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
require('dotenv').config();

const mode = process.env.NODE_ENV || 'development';
const isDev = mode === 'development';
const isProd = !isDev;

const plugins = () => {
  const config = [
    new VueLoaderPlugin(),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
        extensions: {
          vue: true,
        },
      },
    }),
  ];

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

const babelOptions = (preset) => {
  const config = {
    presets: [
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'usage',
          debug: true,
          corejs: '3.6.5',
        },
      ],
    ],
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      ['@babel/plugin-proposal-private-methods', { loose: true }],
    ],
  };

  if (preset) {
    config.presets.push(preset);
  }

  return config;
};

const jsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: babelOptions(),
    },
  ];

  if (isDev) {
    loaders.push('eslint-loader');
  }

  return loaders;
};

const baseConfig = {
  mode,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
      {
        test: /\.tsx?$/,
        exclude: [/\/node_modules\//],
        loader: {
          loader: 'babel-loader',
          options: babelOptions([
            '@babel/preset-typescript',
            {
              allExtensions: true,
              onlyRemoveTypeImports: true,
            },
          ]),
        },
      },
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
    ],
  },
  plugins: plugins(),
  devtool: isDev ? 'source-map' : false,
  resolve: {
    extensions: ['.js', '.ts', '.json', '.vue'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimization: optimization(),
};

module.exports = baseConfig;
