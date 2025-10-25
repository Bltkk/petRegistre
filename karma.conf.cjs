const path = require('path');

module.exports = function (config) {
  config.set({
    
    frameworks: ['jasmine', 'webpack'],

    
    plugins: [
      require('karma-jasmine'),
      require('karma-webpack'),
      require('karma-chrome-launcher'),
      require('karma-sourcemap-loader'),
      require('karma-spec-reporter'),
    ],

    
   
    files: [
      'spec/**/*.spec.js'
    ],

    
    preprocessors: {
      'spec/**/*.spec.js': ['webpack', 'sourcemap'],
    },

    
    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env', '@babel/preset-react'],
              },
            },
          },
        ],
      },
      resolve: { extensions: ['.js', '.jsx'] },
    },

    
    reporters: ['spec'],
    browsers: ['ChromeHeadless'],


    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: false,
    concurrency: Infinity,
    port: 9876,
  });
};
