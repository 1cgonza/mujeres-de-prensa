module.exports = {
  stats: {
    colors: true
  },
  entry: {
    'lib/modules/apostrophe-assets/public/js/site': './src/index.js',
    'public/js/places': './src/places.js',
    'public/js/graphics': './src/graphics.js',
    'public/js/all': './src/all.js'
  },
  output: {
    path: __dirname,
    filename: '[name].js'
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
