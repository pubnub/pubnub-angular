module.exports = function (grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-simple-mocha');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    karma: {
      suite: {
        configFile: 'karma.conf.js'
      }
    },
    simplemocha: {
      release: {
        src: ['test/release/**/*.js']
      }
    },
    eslint: {
      target: ['src/**/*.js']
    },
    webpack: {
      dist: {
        // webpack options
        entry: './src/index.js',
        module: {
          loaders: [
            { test: /\.json/, loader: 'json' },
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
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
        src: ['dist']
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

  grunt.registerTask('compile', ['clean:compiled', 'webpack:dist', 'uglify', 'simplemocha:release']);
  grunt.registerTask('test', ['karma:suite', 'eslint']);

  grunt.registerTask('default', ['compile']);

};
