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
      const supportBrowser = {
        'Chrome': 49,
        'Android Chrome': 49,
        'Opera': 36,
        'Safari': 10,
        'Edge': 15,
        'Firefox': 51,
        '微信': 7,
      };
      try {
        if (b.name in supportBrowser) {
          if (b.version && parseInt(b.version.original.match(/(.*?)\./)[1]) >= supportBrowser[b.name]) {
            build = 'build/es6-unbundled';
          }
        }
      } catch (err) {
        console.log(err, b);
      }
      if (isDev) { build = '.'; }
      console.log('Dynamic load: ' + build, ',', b.name, b.version);
      let stream = fs.createReadStream(build + '/index.html')
      reply.type('text/html').send(stream);
    }
  });

  next();
}