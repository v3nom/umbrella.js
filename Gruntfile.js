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
                src: 'src/Umbrella/init.ts',
                dest: 'build/umbrella.js',
                options: {
                    target: 'es5'
                }
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true,
                browsers: ['Firefox']
            }
        },
        closurecompiler: {
            optimize: {
                files: {
                    "build/umbrella.min.js": [path.resolve('build/umbrella.js')]
                },
                options: {
                    "compilation_level": "SIMPLE_OPTIMIZATIONS"
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-closurecompiler');

    grunt.registerTask('wrapFn', 'Wrap library in a function', function () {
        var fileName = path.resolve('build/umbrella.js');
        var fileStart = '(function(){';
        var fileEnd = '})()';
        var file = grunt.file.read(fileName);
        var newFile = [fileStart, file, fileEnd];
        grunt.file.write(fileName, newFile.join(''));
    });

    grunt.registerTask('default', ['typescript', 'wrapFn', 'closurecompiler', 'karma']);
    grunt.registerTask('test', ['karma']);
};