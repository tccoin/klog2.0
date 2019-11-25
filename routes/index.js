/**
 * routes
 */

module.exports = function (app) {
  app.register(require('./upload'), { prefix: '/upload' });
  app.register(require('./storage'), { prefix: '/storage' });
  app.setNotFoundHandler(require('./notfound'));
};