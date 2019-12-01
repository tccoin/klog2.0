/**
 * routes
 */
module.exports = function (app) {
  // app.get('/index', function (req, reply) {
  //   const stream = fs.createReadStream('build/es5-bundled/index.html')
  //   reply.type('text/html').send(stream);
  //   // reply.send({ hello: 'world' });
  //   // reply.sendFile('build/es5-bundled/index.html');
  //   // reply.end();
  // });
  app.register(require('./index'));
  app.register(require('./upload'), { prefix: '/upload' });
  app.register(require('./storage'), { prefix: '/storage' });
  // app.setNotFoundHandler(require('./notfound'));
};