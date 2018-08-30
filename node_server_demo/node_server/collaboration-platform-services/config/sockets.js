var io = require('socket.io');
var logger = require("../logger.js");
var authMiddleware = require("../app/routes/sockets/auth.middleware");
var streamSocket = require("../app/routes/sockets/stream.socket");
var channelSocket = require("../app/routes/sockets/channel.socket");
var notificationSocket = require("../app/routes/sockets/notification.socket");
var redis = require('socket.io-redis');
var redisConfig = require('./config').props().redis;

var sockets = {
  init: init
};

function init(server) {
  // var pub = redisClient(redisConfig.port, redisConfig.host, {
  //   return_buffers: true
  //   // auth_pass: "Welcome123"
  // });
  // var sub = redisClient(redisConfig.port, redisConfig.host, {
  //   return_buffers: true
  //   // auth_pass: "Welcome123"
  // });
  io = io(server, {
    path: '/collab-services-ws'
  });
  // io.adapter(redis({
  //   pubClient: pub,
  //   subClient: sub,
  //   key: 'collab-services-ws'
  // }));
  io.adapter(redis({
    host: redisConfig.host,
    port: redisConfig.port,
    key: 'collab-services-ws'
  }));
  authMiddleware.init(io.of('/'));
  io.on('connection', function(socket) {
    //console.log('\n\nIO Adapter content',io);
    socket.on('disconnect', function() {
      logger.debug("user ", socket.userInfo.first_name, " disconnected");
    });
  });
  streamSocket.init(io);
  channelSocket.init(io);
  notificationSocket.init(io);
}

module.exports = sockets;
