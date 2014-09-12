var fs = require('fs');

module.exports = function (config) {

    // Use ENV vars on Travis and sauce.json locally to get credentials
    if (!process.env.SAUCE_USERNAME) {
        if (fs.existsSync('sauce.json')) {
            process.env.SAUCE_USERNAME = require('./sauce').username;
            process.env.SAUCE_ACCESS_KEY = require('./sauce').accessKey;
        }
    }

    config.set({
        customLaunchers: {
            'SL_Chrome': {
                base: 'SauceLabs',
                browserName: 'chrome',
                platform: 'Windows 8.1',
                version: '36'
            },
            'SL_Firefox': {
                base: 'SauceLabs',
                browserName: 'firefox',
                platform: 'Windows 8.1',
                version: '31'
            },
            'SL_IE_11': {
                base: 'SauceLabs',
                browserName: 'internet explorer',
                platform: 'Windows 8.1',
                version: '11'
            },
            'SL_Chrome_Android': {
                base: 'SauceLabs',
                browserName: 'Android',
                platform: 'Linux',
                version: '4.4',
                deviceName: 'Android'
            }
        },
        captureTimeout: 120000,
        browserNoActivityTimeout: 30000,
        browserDisconnectTimeout: 10000,
        browserDisconnectTolerance: 2,
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