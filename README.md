# The power of Gulp.js
Try to think about complicated process of development. Imagine if you work in big 
team and have a lot of projects. You are a programmer so you want only launch computer and start coding. But what if you need to have complicated development 
environment? Imagine if you need setup all projects manually - it looks like
scene from horror movie! Fortunately wise people developed tools like Gulp!
 
## Gulp.js
On gulp main site [https://gulpjs.com] you can read: "gulp is a toolkit for 
automating painful or time-consuming tasks in your development workflow, 
so you can stop messing around and build something.". There is nothing to add - 
perfect description.

## Ok, but why Gulp?
Three main tools for automating workflow are Gulp.js, Grunt.js and Webpack. In 
our opinion it depends on what you feel. For examples, in our projects we use 
Gulp.js for backend and Webpack for frontend, because... we feel comfortable
with them. You need to try every solution to pick perfect one.
 
## Demo
Our input file contains only es6 import, few console logs and lodash functions.
```
import _ from 'lodash';
const example = { name: 'example' };
console.log('Hello in gulp example');
console.log(_.get(example, 'name'));
console.log(_.get(example, 'not_existing_field'));
```
We want to create gulp task that will: 
 - delete old output file,
 - build files (es6 into JavaScript),
 - run watcher with eslint and nodemon
    - watcher -  will watch input file and build output file on every change in code
    - eslint - checks code for syntax errors
    - nodemon - restart envronment on every output file change 
 
We want to delete old files only when gulp start and then build files. After that we 
want to run tasks in parallel. 

How to do it? At first we need to create every task as function:

```
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
```
- clean() will delete output files to assure that we won't use any old files
- make() created for building output files
- watch() is set to watch input directory and if anything changes will run "make" task
- lintWatch() is set to watch input directory and if anything changes will run eslint
- run() will reload application on every change in code

After setting tasks is time to use them. Gulp provides methods ```series``` 
and ```parallel```. For our purpose we will use both of them:
```
const runDev = gulp.series(clean, make, gulp.parallel(run, watch, lintWatch));
gulp.task('run-dev', runDev);
```

runDev is our main development task. At first it will do sequence of methods 
"clean" and "make". After that it will start "run", "watch" and "lintWatch" 
in parallel. Because of that we can run three processes in one console - code 
change will be checked by eslint, builded by babel and run by nodemon. 

To start development environment type ```npm run dev```.

Output file:
```
'use strict';
var _lodash = require('lodash');
var _lodash2 = _interopRequireDefault(_lodash);
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var example = { name: 'example' };
console.log('Hello in gulp example');
console.log(_lodash2.default.get(example, 'name'));
console.log(_lodash2.default.get(example, 'not_existing_field'));
```

Done! Welcome in better automated world :)
