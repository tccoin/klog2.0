#!/usr/bin/env node

const fastify = require('fastify');
const app = require('./app');
const http2 = require('http2');
const fs = require("fs");
const tls = require('tls');

//environment
const isDev = process.env.NODE_ENV == 'development';

const httpserver = app(fastify());
httpserver.listen(80, '0.0.0.0', err => {
  if (err) throw err;
  console.log('HTTP2 listening on port 80');
});

if (!isDev) {
  const opt = {
    http2: true,
    https: {
      key: fs.readFileSync('/etc/letsencrypt/live/krrr.party/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/krrr.party/cert.pem'),
      SNICallback: (servername, callback) => {
        if (servername === 'klog.app') {
          let ctx = tls.createSecureContext({
            key: fs.readFileSync('certs/klog.app/klog.app.key'),
            cert: fs.readFileSync('certs/klog.app/klog.app.crt')
          });
          return callback(null, ctx);
        }
        return callback();
      }
    }
  };
  const http2server = app(fastify(opt));
  http2server.listen(443, '0.0.0.0', err => {
    if (err) throw err;
    console.log('HTTP2 listening on port 443');
  });
}