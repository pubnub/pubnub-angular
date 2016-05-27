/* global gulp */

import gulp from 'gulp';
import gulpClean from 'gulp-clean';
import gulpLint from 'gulp-eslint';
import gulpWebpack from 'gulp-webpack';
import gulpUglify from 'gulp-uglify';
import gulpRename from 'gulp-rename';

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


gulp.task('uglify', ['webpack'], () => {
  gulp.src('/dist/pubnub-angular.js')
    .pipe(gulpUglify({ mangle: true, compress: true }))
    .pipe(gulpRename('pubnub-angular.min.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('compile', ['clean', 'lint', 'webpack', 'uglify']);
