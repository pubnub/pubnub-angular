module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: '\n'
            },
            dist: {
                src: [
                    'src/pubnub-angular.suffix',
                    'src/validator.js',
                    'src/config.js',
                    'src/service.js',
                    'src/wrapper.js',
                    'src/helpers.js',
                    'src/mocks.js',
                    'src/pubnub-angular.postfix'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        uglify: {
            dist: {
                options: {
                    sourceMap: true,
                    maxLineLen: 80,
                    mangle: {
                        expect: []
                    }
                },
                files: {
                    'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },
        test: {
            end2end: 'karma.e2e.conf.js',
            unit: 'karma.unit.conf.js'
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask('package', ['concat', 'uglify']);
    grunt.registerTask('default', ['package']);
    grunt.registerTask('test:e2e', 'Run Karma e2e tests', ['test:e2e']);
    grunt.registerTask('test:unit', 'Run Karma unit tests', ['test:unit']);
};
