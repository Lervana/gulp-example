const del = require('del');
const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const nodemon = require('gulp-nodemon');

const inputPath = 'example/input';
const outputPath = 'example/output';

function clean() {
  return del(outputPath);
}

function make() {
  return gulp.src([inputPath + '/index.js'])
    .pipe(babel({ 'presets': ['env'] }))
    .pipe(gulp.dest(outputPath));
}

function watch() {
  return gulp.watch([inputPath + '/index.js'], make);
}

function lintWatch() {
  return gulp.src(inputPath)
    .pipe(eslint())
    .pipe(eslint.result((result)=> {
      if (result.messages.length !== 0 || result.warningCount !== 0 || result.errorCount !== 0) {
        console.log(`ESLint result: ${result.filePath}`);
        console.log(`# Messages: ${result.messages.length}`);
        console.log(`# Warnings: ${result.warningCount}`);
        console.log(`# Errors: ${result.errorCount}`);
      }
    }))
    .pipe(eslint.failAfterError());
}

function run() {
  nodemon({
    script: outputPath + '/index.js',
    ext: 'js',
    watch: outputPath
  });
}

const runDev = gulp.series(clean, make, gulp.parallel(run, watch, lintWatch));
gulp.task('run-dev', runDev);
