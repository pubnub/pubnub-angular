/* global gulp */
/* eslint prefer-template: 0, prefer-arrow-callback: 0 import/no-extraneous-dependencies: 0 */

import gulp from 'gulp';
import gulpClean from 'gulp-clean';
import gulpLint from 'gulp-eslint';
import gulpWebpack from 'webpack-stream';
import gulpUglify from 'gulp-uglify';
import gulpRename from 'gulp-rename';
import gulpMocha from 'gulp-mocha';
import runSequence from 'run-sequence';
import gzip from 'gulp-gzip';
import path from 'path';
import karma from 'karma';

import webpackConfig from './webpack.config';
import packageJSON from './package.json';

let version = require('./package.json').version;

gulp.task('clean', function () {
  return gulp.src(['dist', 'upload'], { read: false }).pipe(gulpClean());
});

gulp.task('lint', function () {
  return gulp.src(['src/**/*.js'])
    .pipe(gulpLint())
    .pipe(gulpLint.format())
    .pipe(gulpLint.failAfterError());
});

gulp.task('webpack', function () {
  return gulp.src('src/index.js')
    .pipe(gulpWebpack(webpackConfig))
    .pipe(gulp.dest('./dist'))
    .pipe(gulpRename('pubnub-angular.' + version + '.js'));
});

gulp.task('uglify', function () {
  return gulp.src('./dist/pubnub-angular.js')
    .pipe(gulp.dest('./dist'))
    .pipe(gulpUglify({ mangle: true, compress: true }))
    .pipe(gulpRename('pubnub-angular.min.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('include-sourcemaps', function () {
  return gulp.src('dist/pubnub-angular.js.map')
    .pipe(gulpRename('pubnub-angular.min.js.map'))
    .pipe(gulp.dest('./dist'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('clean-original-sourcemap', function () {
  return gulp.src(['dist/pubnub-angular.js.map'], { read: false }).pipe(gulpClean());
});

gulp.task('test_release', function () {
  return gulp.src('test/release/**/*.test.js', { read: false })
    .pipe(gulpMocha({ reporter: 'spec' }));
});

gulp.task('test_client-pubnub-v3', function (done) {
  new karma.Server({ configFile: path.join(__dirname, '/karma.conf.pubnub-v3.js') }, done)
    .start();
});

gulp.task('create_version', function () {
  return gulp.src('dist/pubnub-angular.js')
    .pipe(gulpRename('pubnub-angular-' + packageJSON.version + '.js'))
    .pipe(gulp.dest('upload/normal'));
});

gulp.task('create_version_min', function () {
  return gulp.src('dist/pubnub-angular.min.js')
    .pipe(gulpRename('pubnub-angular-' + packageJSON.version + '.min.js'))
    .pipe(gulp.dest('upload/normal'));
});

gulp.task('create_version_gzip', function () {
  return gulp.src('upload/normal/*.js')
    .pipe(gzip({ append: false }))
    .pipe(gulp.dest('upload/gzip'));
});

gulp.task('test_client-pubnub-v4', function (done) {
  new karma.Server({ configFile: path.join(__dirname, '/karma.conf.pubnub-v4.js') }, done)
    .start();
});

gulp.task('test_client', function (done) {
  runSequence('test_client-pubnub-v3', 'test_client-pubnub-v4', done);
});

gulp.task('prepare_upload', function (done) {
  runSequence('create_version', 'create_version_min', 'create_version_gzip', done);
});

gulp.task('compile', function (done) {
  runSequence('clean', 'webpack', 'uglify', 'include-sourcemaps', 'clean-original-sourcemap', 'prepare_upload', done);
});

gulp.task('test', (done) => {
  runSequence('test_client', 'test_release', 'lint', done);
});
