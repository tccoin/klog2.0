'use strict';

const process = require('process');
const del = require('del');
const path = require('path');
const fs = require('fs');
const gulp = require('gulp');
const run = require('gulp-run');
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const settings = require('./settings');
const { workboxConfig } = require('./workbox-config');
const { generateSW } = require('workbox-build');

// promise that waits for stream to end
function waitFor(stream) {
  return new Promise((resolve, reject) => {
    stream.on('end', resolve);
    stream.on('error', reject);
  });
}

function build() {
  const isWin = process.platform === "win32";
  if (isWin) {
    return run('call scripts/build.bat', { verbosity: 3 }).exec();
  } else {
    return run('bash scripts/build.sh', { verbosity: 3 }).exec();
  }
};

function pushOTA() {
  const isWin = process.platform === "win32";
  if (isWin) {
    return run('call scripts/push_ota.bat', { verbosity: 3 }).exec();
  } else {
    return run('bash scripts/push_ota.sh', { verbosity: 3 }).exec();
  }
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

function insertVersion() {
  let promises = [];
  let builds = fs.readdirSync(settings.buildDirectory);
  for (let name of builds) {
    let buildPath = path.join(settings.buildDirectory, name);
    let stat = fs.statSync(buildPath);
    if (stat.isDirectory()) {
      let filepath = path.join(buildPath, 'src', 'page');
      console.log(path.join(filepath, 'klog-userpanel.js'));
      let promise = gulp.src(path.join(filepath, 'klog-userpanel.js'))
        .pipe(replace('{{GLOBAL_VERSION}}', settings.version))
        .pipe(gulp.dest(filepath));
      promises.push(promise);
    }
  }
  return Promise.all(promises);
}

function byeGoogleFont() {
  const files = [
    settings.buildDirectory + '/**/bower_components/font-roboto/roboto.html',
    settings.buildDirectory + '/**/src/klog-app.html'
  ];
  return gulp.src(files)
    .pipe(replace('https://fonts.googleapis.com/', 'https://fonts.loli.net/'))
    .pipe(gulp.dest(settings.buildDirectory));
};

async function workerBuild() {
  const configs = [
    Object.assign({}, workboxConfig, {
      disableDevLogs: false
    }),
    Object.assign({}, workboxConfig, {
      globDirectory: './build/es5-bundled/',
      globPatterns: [],
      swDest: "./build/es5-bundled/sw.js",
      disableDevLogs: true
    }),
    Object.assign({}, workboxConfig, {
      globDirectory: './build/es6-unbundled/',
      globPatterns: [
        "src/*.js",
        "src/lib/*.js"
      ],
      swDest: "./build/es6-unbundled/sw.js",
      disableDevLogs: true
    })
  ];
  for (let config of configs) {
    await generateSW(config).then(({ count, size }) => {
      console.log(`Generated ${config.swDest}, which will precache ${count} files, totaling ${size} bytes.`);
    });
  }

};


exports.build = build;
exports.insert = insertVariable;
exports.version = insertVersion;
exports.google = byeGoogleFont;
exports.sw = workerBuild;
exports.push = pushOTA;
exports.default = gulp.series(build, insertVariable, insertVersion, byeGoogleFont, workerBuild, pushOTA);