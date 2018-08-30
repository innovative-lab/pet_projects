var logger = require("../../../logger.js");
var authMiddleware = require("./auth.middleware");
var notificationService = require("../../services/notification.service.js");
var redisConfig = require('../../../config/config').props().redis;
var redis = require('redis');

module.exports = {
  init: init
};

    var pub = redis.createClient(redisConfig.port, redisConfig.host, {});
    var sub = redis.createClient(redisConfig.port, redisConfig.host, {});
    sub.subscribe("#notification#room-invitation");

function init(io) {
  var notificationNS = io.of('/notification');
  authMiddleware.init(notificationNS);

  notificationNS.on('connection', function (socket) {

    sub.on("message", function (channel, message) {
      //Convert stringified object to JSON
      var obj = JSON.parse(message);
      //Based on the channel name create the appropriate content
      switch (channel.toString()) {
        case '#notification#room-invitation':
        console.log("inside the room invitation notification",socket.userInfo.user_name);
          redisListenerForInvitation(obj);
          break;
      }
    });

    var redisListenerForInvitation = function (eventData) {
      if (socket.userInfo.user_name == eventData.user_name) {
        console.log("-----------------------------emiting socket for invitation",eventData.user_name);
        socket.emit('meeting-invitation', eventData.content);
      }
    };

    socket.on('disconnect', function () {
      notificationService.eventEmitter.removeListener('MEETING-INVITE',
        meetingInviteListener);
    });

  });
}
    /* Redis supports only strings, so sending all objects as string */
    var meetingInviteListener = function (eventData) {
      pub.publish('#notification#room-invitation', JSON
        .stringify(eventData));
        console.log("--------------after publish notification");
    };

    notificationService.eventEmitter.addListener('MEETING-INVITE',
      meetingInviteListener);