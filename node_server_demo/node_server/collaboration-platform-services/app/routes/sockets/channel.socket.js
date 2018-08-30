var logger = require("../../../logger.js");
var authMiddleware = require("./auth.middleware");
var channelService = require("../../services/channel.service.js");
var userService = require('../../services/user.service');
var nodeRefMapper = require("../../services/mappers/nodeRef.mapper.js");
var redisConfig = require('../../../config/config').props().redis;
var redis = require('redis');

module.exports = {
  init: init
};

    var pub = redis.createClient(redisConfig.port, redisConfig.host, {});
    var sub = redis.createClient(redisConfig.port, redisConfig.host, {});
    sub.subscribe("#channel#channel-joined","#channel#leave-room");

function init(io) {
  var channelNS = io.of('/channel');
  authMiddleware.init(channelNS);
  channelNS.on('connection', function (socket) {

    logger.debug(socket.userInfo.first_name,
      ' connected to channel namespace');

    sub.on("message", function (channel, message) {
      //Convert stringified object to JSON
      var obj = JSON.parse(message);
      //Based on the channel name create the appropriate content
      switch (channel.toString()) {
        case '#channel#channel-joined':
        console.log("------------channel joined switch",socket.userInfo.first_name);
          redisListenerForChannelJoined(obj);
          break;
        case '#channel#leave-room':
          console.log("------------channel left switch",socket.userInfo.first_name);
          redisListenerForRemoveUser(obj);
          break;
      }
    });

    socket.on('disconnect', function () {
      logger.debug(socket.userInfo.first_name, " disconnected");
    });

    /* Whenever user connects to channel namespace, below code fetches all channels user is part of
     and make user's socket join the room associated with channel*/
    channelService.getChannelsByUser(socket.userInfo)
      .then(function (channels) {
        channels.forEach(function (channel) {
          logger.debug(socket.userInfo.first_name, " joining room ",
            channel.channel_id);
          socket.join(channel.channel_id);
        });
      }).catch(function (err) {
        logger.error("Error getting channels by user", err);
      });

    /* Redis supports only strings, so sending all objects as string */
    socket.on('history', function (data) {
      channelService.getMessagesByChannel(socket.userInfo, data.channel_id,
        data.pno, data.psize)
        .then(function (messages) {
          var history = {
            messages: messages,
            channel_id: data.channel_id
          };
          socket.emit("history-response", history);
        }).catch(function (err) {
          logger.error("Error getting messages by channel", err);
        });
    });

    //Listens for a new chat message
    socket.on('new-message', function (data) {
      var newMsg = {
        content: data.msg.content,
        file: data.msg.file ? {
          ref: nodeRefMapper.mapNodeRef(data.msg.file.ref),
          name: data.msg.file.name
        } : null
      };
      //Save message to database
      channelService.addMessageInChannel(socket.userInfo, data.channel_id,
        newMsg)
        .then(function (result) {
          channelNS.in(data.channel_id).emit('message-received', {
            content: result.content,
            file: result.file,
            message_id: result.message_id,
            created_at: result.created_at,
            created_by: socket.userInfo.user_name,
            channel_id: result.channel_id
          });
        }).catch(function (err) {
          logger.error("Error adding message", err);
        });
    });

    socket.on('new-channel', function (data) {
      channelService.getChannelsByUser(socket.userInfo)
        .then(function (channels) {
          channels.forEach(function (channel) {
            if (!channelNS.adapter.rooms[channel.channel_id]) {
              socket.join(channel.channel_id);
              socket.emit('channel-joined', {
                channel: channel
              });
            }
          });
        }).catch(function (err) {
          logger.error("Error getting channels by user", err);
        });
    });

    socket.on('add-user', function (data) {
      userService.getUserByUsername(data.user_name)
        .then(function (user) {
          channelNS.in(data.channel_id).emit('user-added', {
            user: {
              user_name: user.user_name,
              first_name: user.first_name,
              last_name: user.last_name,
              profile_pic_file: user.profile_pic_file
            },
            channel_id: data.channel_id
          });
        }).catch(function (err) {
          logger.error("could not get user", err.stack);
        });
      pub.publish('#channel#channel-joined', JSON.stringify(data));
      console.log("-------------publish channel joined");
    });

    socket.on('remove-user', function (data) {
      channelNS.in(data.channel_id).emit('user-removed', {
        user_name: data.user_name,
        channel_id: data.channel_id
      });
      pub.publish('#channel#leave-room', JSON.stringify(data));
     console.log("-------------publish channel left");
    });

    var redisListenerForChannelJoined = function (data) {
      if (socket.userInfo.user_name === data.user_name) {
        channelService.getChannelById(data.channel_id)
          .then(function (channel) {
            socket.emit("channel-joined", {
              channel: channel
            });
            socket.join(data.channel_id);
          }).catch(function (err) {
            logger.error("Error getting channel by id", err);
          });
      }
    };

    var redisListenerForRemoveUser = function (data) {
      if (socket.userInfo.user_name === data.user_name) {
        socket.leave(data.channel_id);
      }
    };

  });
}
