#!/usr/bin/env node

const fastify = require('fastify');
const app = require('./app');
const http2 = require('http2');
const fs = require('fs');
const tls = require('tls');
const settings = require('./settings');

if (!settings.tls) {
    const httpserver = app(fastify({ maxParamLength: 200 }));
    httpserver.listen(3001, '0.0.0.0', (err, address) => {
        if (err) {
            console.log(err);
            process.exit(1);
        }
        console.log(`server listening on ${address}`);
    });
} else {
    const logger = require('pino')();
    const opt = {
        logger: false,
        http2: true,
        maxParamLength: 200,
        https: {
            allowHTTP1: true,
            key: fs.readFileSync('certs/krrr.party/krrr.party.key'),
            cert: fs.readFileSync('certs/krrr.party/krrr.party.crt'),
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
    http2server.listen(3000, '0.0.0.0', (err, address) => {
        if (err) {
            console.log(err);
            process.exit(1);
        }
        console.log(`server listening on ${address}`);
    });
}