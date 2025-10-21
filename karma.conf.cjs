/* eslint-disable */
const path = require('path');


module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],              // ← adapter de Jasmine
    files: [
      { pattern: 'spec/**/*.spec.js', watched: false }, // ← tus tests
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
            test: /\.[jt]sx?$/i,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                // usa .babelrc si existe; si no, aplica estos presets
                presets: [
                  ['@babel/preset-env', { targets: 'defaults' }],
                  ['@babel/preset-react', { runtime: 'automatic' }],
                ],
              },
            },
          },
        ],
      },
      resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
          '@': path.resolve(__dirname, 'src'),
        },
      },
    },

    reporters: ['progress'],

    // ⬇️ CAMBIO CLAVE: usar Chrome visible para capturar el navegador
    browsers: ['Chrome'],                 // o 'ChromeNoSandbox' (ver customLaunchers)
    singleRun: false,                     // deja la ventana abierta
    autoWatch: true,                      // mira cambios en tests

    // Útil en algunos entornos si Chrome no arranca por sandbox
    customLaunchers: {
      ChromeNoSandbox: {
        base: 'Chrome',
        flags: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
      },
    },

    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-webpack'),
      require('karma-sourcemap-loader'),
    ],

    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    concurrency: Infinity,
  });
};



