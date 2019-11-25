const path = require('path');
const routes = require('./routes');
const bodyParser = require('body-parser');
const fs = require('fs');

// environment
let isDev = process.env.NODE_ENV == 'development';
let buildDir = path.join(__dirname, 'build', 'es5-bundled');
let staticDir = isDev ? __dirname : buildDir;

// generate index.html
fs.readFile('settings.json', 'utf8', (err, data) => {
  let settings;
  if (err) {
    console.log('appId and appKey are not set in `settings.json`.');
    settings = {
      appId: "",
      appKey: ""
    };
  }
  else {
    settings = JSON.parse(data);
  }
  let indexPath = path.join(staticDir, 'index.html');
  fs.readFile(indexPath, 'utf8', (err, data) => {
    data = data.replace('$GLOBAL_APPID', settings['appId']);
    data = data.replace('$GLOBAL_APPKEY', settings['appKey']);
    fs.writeFile(indexPath, data, (err) => { if (err) console.log('error when replacing settings'); });
  });
});

console.log('isDev:', isDev);

module.exports = (app) => {
  // app
  app.register(require('fastify-multipart'));
  app.register(require('fastify-static'), { root: staticDir });
  app.register(require('fastify-compress'));
  routes(app);
  return app;
};