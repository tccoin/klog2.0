'use strict';

const del = require('del');
const path = require('path');
const fs = require('fs');
const gulp = require('gulp');
const run = require('gulp-run');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const settings = require('./settings');

// promise that waits for stream to end
function waitFor(stream) {
  return new Promise((resolve, reject) => {
    stream.on('end', resolve);
    stream.on('error', reject);
  });
}

function build() {
  return run('polymer build').exec();
};

function insertVariable() {
  const insert = (filepath, base, filename) => {
    console.log(path.join(filepath, 'index.html'));
    filename = filename || 'index.html';
    return gulp.src(path.join(filepath, 'index.html'))
      .pipe(rename(filename))
      .pipe(replace('{{GLOBAL_APPID}}', settings.appId))
      .pipe(replace('{{GLOBAL_APPKEY}}', settings.appKey))
      .pipe(replace('{{GLOBAL_BASE}}', base))
      .pipe(gulp.dest(filepath));
  };
  let promises = [];
  let builds = fs.readdirSync(settings.buildDirectory);
  for (let name of builds) {
    let stat = fs.statSync(path.join(settings.buildDirectory, name));
    if (stat.isDirectory()) {
      let promise = insert(path.join(settings.buildDirectory, name), `/${name}/`);
      promises.push(promise);
    }
  }
  promises.push(insert('.', '/', 'index-debug.html'));
  return Promise.all(promises);
};

function byeGoogleFont() {
  const files = [
    settings.buildDirectory + '/**/bower_components/font-roboto/roboto.html',
    settings.buildDirectory + '/**/src/klog-app.html'
  ];
  return gulp.src(files)
    .pipe(replace('https://fonts.googleapis.com/', 'https://fonts.loli.net/'))
    .pipe(gulp.dest(settings.buildDirectory));
};

function fixServiceWorkerPath() {
  const insert = (filepath, base) => {
    console.log(base + 'src/');
    return gulp.src(filepath + '/service-worker.js')
      .pipe(replace('src/', base + 'src/'))
      .pipe(replace('[["index.html"', '[["' + base + 'index.html"'))
      .pipe(gulp.dest(filepath));
  };
  let promises = [];
  let builds = fs.readdirSync(settings.buildDirectory);
  for (let name of builds) {
    let stat = fs.statSync(path.join(settings.buildDirectory, name));
    if (stat.isDirectory()) {
      let promise = insert(path.join(settings.buildDirectory, name), `${name}/`);
      promises.push(promise);
    }
  }
  return Promise.all(promises);
};


exports.build = build;
exports.insert = insertVariable;
exports.google = byeGoogleFont;
exports.sw = fixServiceWorkerPath;
exports.default = gulp.series(build, insertVariable, byeGoogleFont);