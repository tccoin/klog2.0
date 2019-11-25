module.exports = function (request, reply, next) {
  if (reply && !reply.headersSent) {
    reply.redirect('/#/404');
  }
};