const webpack = require('webpack');
const path = require('path');

const config = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  mode: "development",
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 8000,
  },
  module: {
    rules: [
      {
        test: /\.js$/, // регулярное выражение для идентификации файлов, которые будут использовать загрузчик
        exclude: /node_modules/, // файлы, которые будут проигнорированы загрузчиком
        use: {
          loader: "babel-loader" // имя загрузчика
        }
      }
    ]
  }


};

module.exports = config;
