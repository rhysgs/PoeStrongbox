'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var concat = require('gulp-concat');
var uglifyJs = require('gulp-uglifyjs');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var Locals = require('./modules/Config').Locals;

var version = require('./package.json').version;

gulp.task('app', function () {
  runSequence(['concat-app']);
  runSequence(['sass-app']);
});

gulp.task('concat-app', function () {
  var task = gulp.src([
    //vendor scripts
    './client_src/vendor-js/moment.js',
    './client_src/vendor-js/ng/angular.js',
    './client_src/vendor-js/ng/angular-animate.js',
    './client_src/vendor-js/ng/angular-aria.js',
    './client_src/vendor-js/ng/angular-material.js',
    './client_src/vendor-js/ng/angular-ui-router.js',
    './client_src/vendor-js/ng/ngStorage.js',
    //the angular app
    './client_src/app/app.js',
    './client_src/app/md-theme.js',
    './client_src/app/check-domain.js',
    //directives
    './client_src/app/**/*.dir.js',
    //controllers
    './client_src/app/**/*.ctrl.js',
    //factories
    './client_src/app/**/*.fac.js'
  ])
    .pipe(concat('app-bundle.js'));
  if (Locals.isLive) {
    console.log('UglifyJS because we goin live baby!');
    task = task.pipe(uglifyJs('app-bundle.js'));
  }
  task = task.pipe(gulp.dest(`./client/${version}/`));
  return task;
});

gulp.task('sass-app', function () {
  return gulp.src('./client_src/sass/app/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 5 versions'],
      cascade: false
    }))
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(rename(function (path) {
      path.basename = 'app-styles';
    }))
    .pipe(gulp.dest(`./client/${version}/`));
});