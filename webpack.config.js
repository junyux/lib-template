const path = require('path');
const packageConfig = require('./package.json');

function getPackageName (str) {
  return str.replace(/^@\w+\//g, '');
}

function toCamelCase (str) {
  return str.replace(/-([a-z])/ig, (s, p1) => p1.toUpperCase());
}

const packageName = getPackageName(packageConfig.name);
const libraryName = toCamelCase(packageName);

module.exports = function (env = {}) {
  return {
    mode: env.mode,
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: `${packageName}.js`,
      library: libraryName,
      libraryTarget: 'umd'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules\/.*/,
          use: {
            loader: 'babel-loader'
          }
        }
      ]
    },
    devServer: {
      contentBase: path.join(__dirname, env.server || '.'),
      port: 9090,
      hot: true
    }
  };
};
