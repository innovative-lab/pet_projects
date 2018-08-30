var postService = require('../../services/post.service');
var logger = require("../../../logger.js");
var authMiddleware = require("./auth.middleware");
var blogService = require('../../services/blog.service');
var discussionService = require('../../services/discussion.service');
var answerService = require('../../services/answer.service');
var streamService = require('../../services/stream.service');
var userService = require('../../services/user.service');
var redisConfig = require('../../../config/config').props().redis;
var redis = require('redis');

module.exports = {
  init: init
};

  var pub = redis.createClient(redisConfig.port, redisConfig.host, {});
  var sub = redis.createClient(redisConfig.port, redisConfig.host, {});
      sub.subscribe('#stream#post', '#stream#blog',
      '#stream#discussion', '#stream#answer');

function init(io) {
  var streamNS = io.of('/stream');
  authMiddleware.init(streamNS);

  streamNS.on('connection', function (socket) {
    logger.debug(socket.userInfo.first_name,
      ' connected to stream namespace');

    sub.on("message", function (channel, message) {
      console.log("-------------in on message listener chanel=", channel.toString(), " user=", socket.userInfo.first_name);
      // Convert stringified object to JSON
      var obj = JSON.parse(message);
      // Based on the channel name create the appropriate content
      switch (channel.toString()) {
        case '#stream#post':
          console.log("---------calling createStreamContentForPost");
          createStreamContentForPost(obj);
          break;
        case '#stream#blog':
          createStreamContentForBlog(obj);
          break;
        case '#stream#discussion':
          createStreamContentForDiscussion(obj);
          break;
        case '#stream#answer':
          createStreamContentForAnswer(obj.discussion, obj.answer);
          break;
        default:
      }
    });

    var createStreamContentForPost = function (post) {
      userService.getUserByUsername(socket.userInfo.user_name)
        .then(function (user) {
          var postStreamContent = streamService.getPostStreamForUser(
            user, post);
          if (postStreamContent) {
            console.log("--------sending post content into", socket.userInfo.first_name, "stream");
            socket.emit('content', postStreamContent);
          }
        }).catch(function (err) {
          logger.error("could not get user", err.stack);
        });
    };

    var createStreamContentForBlog = function (blog) {
      userService.getUserByUsername(socket.userInfo.user_name)
        .then(function (user) {
          var blogStreamContent = streamService.getBlogStreamForUser(
            user, blog);
          if (blogStreamContent) {
            socket.emit('content', blogStreamContent);
          }
        }).catch(function (err) {
          logger.error("could not get user", err.stack);
        });
    };

    var createStreamContentForDiscussion = function (discussion) {
      userService.getUserByUsername(socket.userInfo.user_name)
        .then(function (user) {
          var discussionStreamContent = streamService.getDiscussionStreamForUser(
            user, discussion);
          if (discussionStreamContent) {
            socket.emit('content', discussionStreamContent);
          }
        }).catch(function (err) {
          logger.error("could not get user", err.stack);
        });
    };

    var createStreamContentForAnswer = function (discussion, answer) {
      userService.getUserByUsername(socket.userInfo.user_name)
        .then(function (user) {
          var answerStreamContent = streamService.getAnswerStreamForUser(
            user, answer, discussion);
          if (answerStreamContent) {
            socket.emit('content', answerStreamContent);
          }
        }).catch(function (err) {
          logger.error("could not get user", err.stack);
        });
    };
    socket.on('disconnect', function () {
      postService.eventEmitter.removeListener('NEW-POST',
        newPostListener);
        console.log("------------------------new post event emitter is removed");
      blogService.eventEmitter.removeListener('NEW-PUBLISHED-BLOG',
        newPublishedBlogListener);
      discussionService.eventEmitter.removeListener(
        'NEW-PUBLISHED-DISCUSSION', newPublishedDiscussionListener);
      answerService.eventEmitter.removeListener('NEW-ANSWER',
        newAnswerListener);
    });

  });
}

      /* Redis supports only strings, so sending all objects as string */
  var newPostListener = function (post) {
    console.log("-------------publishing for new post event");
    pub.publish('#stream#post', JSON.stringify(post));
    console.log("-------------after post is published");
  };

  var newPublishedBlogListener = function (blog) {
    pub.publish('#stream#blog', JSON.stringify(blog));
  };

  var newPublishedDiscussionListener = function (discussion) {
    pub.publish('#stream#discussion', JSON.stringify(
      discussion));
  };

  var newAnswerListener = function (discussion, answer) {
    var obj = {
      discussion: discussion,
      answer: answer
    };
    pub.publish('#stream#answer', JSON.stringify(obj));
  };

  postService.eventEmitter.addListener('NEW-POST', newPostListener);
  blogService.eventEmitter.addListener('NEW-PUBLISHED-BLOG',
    newPublishedBlogListener);
  discussionService.eventEmitter.addListener('NEW-PUBLISHED-DISCUSSION',
    newPublishedDiscussionListener);
  answerService.eventEmitter.addListener('NEW-ANSWER', newAnswerListener);