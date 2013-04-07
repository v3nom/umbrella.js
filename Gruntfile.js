// 1. Compile Typescript to JavaScript, output to temp directory
// 2. Run Jasmine unit tests
// 3. Bump version
// 3. Run requirejs optimizer from temp directory, output to build directory
// 
module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        typescript: {
            base: {
                src: ['src/**/*.ts'],
                dest: ['tmp'],
                options: {
                    module: 'amd',
                    target: 'es5'
                }
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: './tmp/src/',
                    out: 'build/umbrella.js',
                    name: 'Umbrella/init',
                    optimize: 'uglify'//'uglify'
                }
            }
        },
        rm: {
            tmp: {
                dir: 'tmp'
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true,
                browsers: ['Firefox']
            }
        }
    });

    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-rm');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('default', ['typescript', 'requirejs', 'karma', 'rm']);
};