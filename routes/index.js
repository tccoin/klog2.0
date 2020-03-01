/**
 * dynamic load
 */
const UA = require('ua-device');
const fs = require("fs");

const isDev = process.env.NODE_ENV == 'development';

module.exports = function (app, opts, next) {
  app.get('/', (request, reply, next) => {
    if (isDev) {
      let stream = fs.createReadStream('index-debug.html')
      reply.type('text/html').send(stream);
    } else {
      let build = 'build/es5-bundled';
      const ua = new UA(request.headers['user-agent'])
      const b = ua.browser;

      const supportBrowser = ['Chrome', 'Android Chrome', 'Opera', 'Safari', 'Edge', 'Firefox', '微信', 'Sogou Explorer'];
      if (supportBrowser.indexOf(b.name) > -1) {
        build = 'build/es6-unbundled';
      }
      console.log('Dynamic load: ' + build, ',', b.name, b.version);
      let stream = fs.createReadStream(build + '/index.html')
      reply.type('text/html').send(stream);
    }
  });

  next();
}