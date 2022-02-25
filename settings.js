const path = require('path');
const local = true;
const serveBuild = false;

exports.appId = 'nna3GjtCul4qbfaIofuhDtE8-MdYXbMMI';
exports.appKey = 'L37rInrbeo0nVMtwFqG9yC50';
exports.buildDirectory = 'build';
exports.tls = !local;
exports.serveBuild = serveBuild;
exports.staticDir = !serveBuild ? __dirname : path.join(__dirname, 'build');