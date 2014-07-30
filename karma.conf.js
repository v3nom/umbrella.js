module.exports = function(config) {
  config.set({
    customLaunchers: {
      'SL_Chrome': {
        base: 'SauceLabs',
        browserName: 'chrome'
      },
      'SL_Firefox': {
        base: 'SauceLabs',
        browserName: 'firefox'
      }
    },
    captureTimeout: 120000,
    sauceLabs: {
      testName: 'UmbrellaJS cross-browser unit testing',
      recordScreenshots: false
    },
    frameworks: ['jasmine'],
    files: [{
      pattern: 'lib/q.js',
      included: true
    }, {
      pattern: 'build/umbrella.js',
      included: true
    }, {
      pattern: 'test/**/*.test.js',
      included: true
    }]
  })
};