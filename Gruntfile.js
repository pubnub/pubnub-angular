module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        karma: {
            e2e: {
                configFile: 'karma.e2e.conf.js',
                singleRun: true,
                browsers: ['PhantomJS']
            },
            unit: {
                configFile: 'karma.unit.conf.js',
                singleRun: true,
                browsers: ['PhantomJS']
            }
        },
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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('package', ['concat', 'uglify']);
    grunt.registerTask('default', ['package']);

    grunt.registerTask('test', ['karma:unit', 'karma:e2e'])
};
