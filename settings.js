const path = require('path');
const local = process.env.NODE_ENV == 'development';
const serveBuild = true;

exports.appId = 'nna3GjtCul4qbfaIofuhDtE8-MdYXbMMI';
exports.appKey = 'L37rInrbeo0nVMtwFqG9yC50';
exports.buildDirectory = 'build';
exports.tls = !local;
exports.serveBuild = serveBuild;
exports.staticDir = !serveBuild ? __dirname : path.join(__dirname, 'build');