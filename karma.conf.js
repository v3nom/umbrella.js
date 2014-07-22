module.exports = function(config) {
  config.set({
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