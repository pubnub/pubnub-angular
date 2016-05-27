/* global gulp */
/* eslint prefer-template: 0 */

import gulp from 'gulp';
import gulpClean from 'gulp-clean';
import gulpLint from 'gulp-eslint';
import gulpWebpack from 'gulp-webpack';
import gulpUglify from 'gulp-uglify';
import gulpRename from 'gulp-rename';
import gulpMocha from 'gulp-mocha';
import runSequence from 'run-sequence';

import karma from 'karma';

import webpackConfig from './webpack.config';

gulp.task('clean', () =>
  gulp.src(['dist'], { read: false })
    .pipe(gulpClean())
);

gulp.task('lint', () =>
  gulp.src(['src/**/*.js'])
    .pipe(gulpLint())
    .pipe(gulpLint.format())
    .pipe(gulpLint.failAfterError())
);


gulp.task('webpack', ['clean', 'lint'], () => {
  gulp.src('src/index.js')
    .pipe(gulpWebpack(webpackConfig))
    .pipe(gulp.dest('./dist'));
});

gulp.task('test_release', () => {
  gulp.src('test/release/**/*.test.js', { read: false })
    .pipe(gulpMocha({ reporter: 'spec' }));
});

gulp.task('uglify', ['webpack'], () => {
  gulp.src('/dist/pubnub-angular.js')
    .pipe(gulpUglify({ mangle: true, compress: true }))
    .pipe(gulpRename('pubnub-angular.min.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('compile', ['clean', 'lint', 'webpack', 'uglify']);

gulp.task('test_client', (done) => {
  new karma.Server({ configFile: __dirname + '/karma.conf.js' }, done)
    .start();
});

gulp.task('test', (done) => {
  runSequence('test_client', 'test_release', done);
});
