module.exports = function (request, reply, next) {
    if (reply && !reply.headersSent) {
        reply.code(404);
        reply.send('(|||ﾟДﾟ)');
    }
};