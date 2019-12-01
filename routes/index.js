/**
 * dynamic load
 */
const UA = require('ua-device');
const fs = require("fs");

module.exports = function (app, opts, next) {
  app.get('/', (request, reply, next) => {
    let build = 'es5-bundled';
    const ua = new UA(request.headers['user-agent'])
    const b = ua.browser;
    const supportBrowser = {
      'Chrome': 49,
      'Opera': 36,
      'Safari': 10,
      'Edge': 15,
      'Firefox': 51,
      '微信': 7,
    };
    try {

      if (b.name in supportBrowser) {
        if (parseInt(b.version.original.match(/(.*?)\./)[1]) >= supportBrowser[b.name]) {
          build = 'es6-unbundled';
        }
      }
    } catch (err) {
      console.log(err, b);
    }
    console.log('Dynamic load: ' + build, ',', b.name, b.version);
    const stream = fs.createReadStream('build/' + build + '/index.html')
    reply.type('text/html').send(stream);
  });

  next();
}