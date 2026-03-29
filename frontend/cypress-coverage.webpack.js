console.log('>>> CUSTOM WEBPACK CONFIG LOADED <<<');

module.exports = {
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        loader: '@jsdevtools/coverage-istanbul-loader',
        options: { esModules: true },
        enforce: 'post',
        include: require('path').resolve(__dirname, 'src'),
        exclude: [/node_modules/, /\.spec\.ts$/, /\.d\.ts$/]
      }
    ]
  }
};
