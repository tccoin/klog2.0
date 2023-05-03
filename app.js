const routes = require('./routes/router');
const fs = require('fs');
const settings = require('./settings');
const path = require('path');

// environment
let staticDir = path.join(__dirname, 'build');
console.log('static directory: ', staticDir);

// set response header
swHeader = (request, reply, done) => {
    // some code
    reply.header('service-worker-allowed', '/');
    done();
};

module.exports = (app) => {
    app.addContentTypeParser('multipart', (req, payload, done) => {
        done();
    });
    app.register(require('fastify-static'), { root: staticDir });
    app.register(require('fastify-compress'));
    app.addHook('preHandler', swHeader);
    routes(app);
    return app;
};