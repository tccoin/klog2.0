const path = require('path');
const fs = require('fs');

// environment
let isDev = process.env.NODE_ENV == 'development';
let buildDir = path.join(__dirname, 'build');
let staticDir = isDev ? __dirname : buildDir;

console.log(staticDir);

// build index.html
fs.readFile('settings.json', 'utf8', (err, data) => {
  // load settings
  if (err) {
    console.log('settings.json not found.');
    settings = {
      appId: "",
      appKey: ""
    };
  }
  else {
    settings = JSON.parse(data);
  }
  // build function
  let buildIndex = (path, build) => {
    file = fs.openSync(path, 'r+');
    data = fs.readFileSync(file, encoding = 'utf8');
    data = data.replace('$GLOBAL_APPID', settings['appId']);
    data = data.replace('$GLOBAL_APPKEY', settings['appKey']);
    data = data.replace('$GLOBAL_BASE', build ? '/' + build + '/' : '/');
    fs.writeFile(file, data, (err) => { if (err) console.log('error when replacing settings'); });
  };
  // dev
  buildIndex(path.join(__dirname, 'index.html'), null);
  // builds
  builds = fs.readdirSync(buildDir);
  for (let build of builds) {
    let stat = fs.statSync(path.join(buildDir, build));
    if (stat.isDirectory()) {
      buildIndex(path.join(buildDir, build, 'index.html'), build);
    }
  }
});

console.log('(index.html) Build complete!');