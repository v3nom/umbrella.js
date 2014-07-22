// 1. Compile Typescript to JavaScript, output to temp directory
// 2. Run Jasmine unit tests
// 3. Bump version
// 3. Run requirejs optimizer from temp directory, output to build directory
var path = require('path');

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        typescript: {
            base: {
                src: 'src/Umbrella/**/*.ts',
                dest: 'tmp/',
                options: {
                    module: 'amd',
                    target: 'es5'
                }
            }
        },
        karma: {
            travis: {
                configFile: 'karma.conf.js',
                singleRun: true,
                browsers: ['Firefox']
            },
            dev: {
                configFile: 'karma.conf.js',
                singleRun: true,
                browsers:['Chrome','Firefox']
            }
        },
        requirejs: {
            prod: {
                options: {
                    baseUrl: 'tmp/src/',
                    name: 'Umbrella/almond',
                    include: ['Umbrella/init'],
                    insertRequire: ['Umbrella/init'],
                    out: 'build/umbrella.js',
                    preserveLicenseComments: false,
                    wrap: {
                        start: "(function (root, factory) {if (typeof define === 'function' && define.amd) {define(factory);} else {root.Umbrella = factory();}}(this, function () {",
                        end: "return require('Umbrella/init').Init;}));"
                    },
                    optimize: 'uglify'//'uglify'
                }
            },
            dev: {
                options: {
                    baseUrl: 'tmp/src/',
                    name: 'Umbrella/almond',
                    include: ['Umbrella/init'],
                    insertRequire: ['Umbrella/init'],
                    out: 'build/umbrella.js',
                    preserveLicenseComments: false,
                    wrap: {
                        start: "(function (root, factory) {if (typeof define === 'function' && define.amd) {define(factory);} else {root.Umbrella = factory();}}(this, function () {",
                        end: "return require('Umbrella/init').Init;}));"
                    },
                    optimize: 'none'
                }
            },
            debug: {
                options: {
                    baseUrl: 'tmp/src/',
                    name: 'Umbrella/almond',
                    include: ['Umbrella/init'],
                    insertRequire: ['Umbrella/init'],
                    out: 'build/umbrella.debug.js',
                    preserveLicenseComments: false,
                    wrap: {
                        start: "(function (root, factory) {if (typeof define === 'function' && define.amd) {define(factory);} else {root.Umbrella = factory();}}(this, function () {",
                        end: "return require('Umbrella/init').Init;}));"
                    },
                    optimize: 'none'
                }
            }
        },
        copy: {
            main: {
                files: [
                    { src: 'src/Umbrella/almond.js', dest: 'tmp/' }
                ]
            }
        },
        rm: {
            tmp: 'tmp/'
        }
    });

    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerMultiTask('rm', 'Remove file', function () {
        grunt.file.delete(this.data);
    });

    grunt.registerTask('buildDev', ['typescript', 'copy', 'requirejs:dev', 'rm:tmp']);
    grunt.registerTask('build', ['typescript', 'copy', 'requirejs:prod', 'requirejs:debug', 'rm:tmp']);
    grunt.registerTask('test', ['karma:travis']);
    grunt.registerTask('testDev', ['buildDev','karma:dev']);

    grunt.registerTask('default', ['build', 'test']);
};