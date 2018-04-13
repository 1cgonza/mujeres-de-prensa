const path = require('path');
const dist = path.join(__dirname, 'lib/modules/apostrophe-assets/public');

module.exports = {
  entry: ['./src/index.js'],
  output: {
    path: dist,
    filename: 'js/site.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: ['@babel/preset-env'],
            plugins: ['transform-class-properties']
          }
        }
      }
    ]
  }
};
