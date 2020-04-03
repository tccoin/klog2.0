const path = require('path');
const routes = require('./routes/router');
const fs = require('fs');

// environment
let isDev = process.env.NODE_ENV == 'development';
let buildDir = path.join(__dirname, 'build');
let staticDir = isDev ? __dirname : buildDir;

console.log('isDev:', isDev);

// set response header
swHeader = (request, reply, done) => {
  // some code
  reply.header('service-worker-allowed', '/');
  done();
};

module.exports = (app) => {
  // app
  app.register(require('fastify-multipart'));
  app.register(require('fastify-static'), { root: staticDir });
  app.register(require('fastify-compress'));
  app.addHook('preHandler', swHeader)
  routes(app);
  return app;
};