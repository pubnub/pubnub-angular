module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-karma');

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
    eslint: {
      target: ['src/**/*.js']
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
          'src/mocks.js',
          'src/pubnub-angular.postfix'
        ],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    copy: {
      main: {
        src: 'dist/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>-v<%= pkg.version %>.js',
      },
    },
    uglify: {
      dist: {
        options: {
          sourceMap: true,
          maxLineLen: 120,
          mangle: {
            expect: []
          }
        },
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>'],
          'dist/<%= pkg.name %>-v<%= pkg.version %>.min.js': ['<%= concat.dist.dest %>'],
        }
      }
    }
  });

  grunt.registerTask('package', ['concat', 'copy', 'uglify']);
  grunt.registerTask('default', ['package']);

  grunt.registerTask('test', ['karma:unit', 'karma:e2e', 'eslint']);
};
