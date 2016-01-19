module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-webpack');

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
    webpack: {
      dist: {
        // webpack options
        entry: './lib/index.js',
        module: {
          loaders: [
            { test: /\.json/,
              loader: 'json' }
          ]
        },
        output: {
          path: './dist',
          filename: '<%= pkg.name %>-<%= pkg.version %>.js'
        }
      }
    },
    clean: {
      compiled: {
        src: ['lib', 'dist']
      }
    },
    babel: {
      options: {
        sourceMap: false
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['**/*.js'],
          dest: 'lib/',
          ext: '.js'
        }]
      }
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
          'dist/<%= pkg.name %>-<%= pkg.version %>.min.js': ['dist/<%= pkg.name %>-<%= pkg.version %>.js']
        }
      }
    }
  });

  grunt.registerTask('package', ['concat', 'copy', 'uglify']);
  grunt.registerTask('default', ['package']);

  grunt.registerTask('compile', ['clean:compiled', 'babel:dist', 'webpack:dist', 'uglify']);
  grunt.registerTask('test', ['karma:unit', 'karma:e2e', 'eslint']);
};
