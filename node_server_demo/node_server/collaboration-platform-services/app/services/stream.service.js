var streamModel = require("../dao/stream.model.js");
var userModel = require("../dao/user.model.js");
var blogModel = require("../dao/blog.model.js");
var discussionModel = require("../dao/discussion.model.js");
var postModel = require("../dao/post.model.js");
var answerModel = require("../dao/answer.model.js");
var constants = require('./constants.js');
var Promise = require("bluebird");
var underscore = require("underscore");
var logger = require('../../logger.js');
var tagValidator = require("./validators/tag.validator.js");
var streamMapper = require('./mappers/stream.mapper.js');
var esServices = require("./search.service.js");


var streamService = {
  /**
   * to create stream
   */
  createStream: createStream,
  /**
   * to subscribe or unsubscribe stream
   */
  subscribeUnsubscribeStream: subscribeUnsubscribeStream,
  /**
   * to get all stream
   */
  getStreams: getStreams,
  /**
   * to get stream by user
   */
  getStreamsByUser: getStreamsByUser,
  /**
   *
   */
  getSubscribedStreamContentForUser: getSubscribedStreamContentForUser,
  /**
   *
   */
  getBlogStreamForUser: getBlogStreamForUser,
  /**
   *
   */
  getDiscussionStreamForUser: getDiscussionStreamForUser,
  /**
   *
   */
  getPostStreamForUser: getPostStreamForUser,
  /**
   *
   */
  getAnswerStreamForUser: getAnswerStreamForUser,

  getMostSubscribedStreams: getMostSubscribedStreams
};


function getBlogStreamForUser(user, blog) {
  var streams = underscore.intersection(blog.tags, user.subscribed_streams);
  var followings = (underscore.contains(user.followings, blog.created_by.user_name) == true) ? blog.created_by.user_name : null;
  var response = null;
  if (streams.length > 0 || followings != null) {
    response = streamMapper.mapBlogToStreamResponse(blog, blog.tags, followings);
  }
  return response;
}


function getDiscussionStreamForUser(user, discussion) {
  var streams = underscore.intersection(discussion.tags, user.subscribed_streams);
  var followings = (underscore.contains(user.followings, discussion.created_by.user_name) == true) ? discussion.created_by.user_name : null;
  var response = null;
  if (streams.length > 0 || followings != null) {
    response = streamMapper.mapDiscussionToStreamResponse(discussion, discussion.tags, followings);
  }
  return response;
}

function getPostStreamForUser(user, post) {
  var streams = underscore.intersection(post.tags, user.subscribed_streams);
  var followings = (underscore.contains(user.followings, post.created_by.user_name) == true) ? post.created_by.user_name : null;
  var response = null;
  if (streams.length > 0 || followings != null) {
    response = streamMapper.mapPostToStreamResponse(user, post, post.tags, followings);
  }
  return response;
}

function getAnswerStreamForUser(user, answer, discussion) {
  var streams = underscore.intersection(answer.tags, user.subscribed_streams);
  var followings = (underscore.contains(user.followings, answer.created_by.user_name) == true) ? answer.created_by.user_name : null;
  var response = null;
  if (streams.length > 0 || followings != null) {
    response = streamMapper.mapAnswerToStreamResponse(answer, discussion, answer.tags, followings);
  }
  return response;
}


/**
 * method to create streams
 */
function createStream(streamName) {
  if(!streamName){
     throw new Error("invalid stream name");
  }
  if (streamName !== null && tagValidator.validateTag(streamName)) {
    return new Promise(function (resolve, reject) {
      streamModel.createStream(streamName).then(function (result) {
        resolve();
      }).catch(function (err) {
        logger.error("could not able to create stream", err.stack);
        reject(err);
      });
    });
  } else {
    throw new Error("invalid stream name");
  }
}

/**
 * method to subscribe or subscribe streams
 */

function subscribeUnsubscribeStream(user, streamName, subscribeValue) {
  var isSubscribing = (subscribeValue != undefined && subscribeValue == 0) ? false : true;
  return new Promise(function (resolve, reject) {
    createStream(streamName)
      .then(function (result) {
        logger.debug("stream created if not present");
        if (isSubscribing) {
          userModel.subscribeStream(streamName, user).then(function (result) {
            resolve();
          }).catch(function (err) {
            logger.error("subscription failed", err.stack);
            reject(err);
          });
        } else {
          userModel.unsubscribeStream(streamName, user).then(function (result) {
            resolve();
          }).catch(function (err) {
            logger.error("unsubscription failed", err.stack);
            reject(err);
          });
        }
      }).catch(function (err) {
        logger.error("could not create stream", err.stack);
        reject(err);
      });

  });
}

/**
 * method to get all streams
 */
function getStreams(user, pageNr, pageSize) {
  pageNr = pageNr ? pageNr : 1;
  pageSize = pageSize ? pageSize : constants.DEFAULT_NO_OF_RESULTS;
  return new Promise(function (resolve, reject) {
    streamModel.getStreams((pageNr - 1) * pageSize, pageSize)
      .then(function (result) {
        var mapperResponse = result.map(function (streamObj) {
          return streamMapper.mapStream(streamObj, user);
        });
        resolve(mapperResponse);
      }).catch(function (err) {
        logger.error("could not get the streams");
        reject(err);
      });
  });
}

/**
 * method to get all streams related to the user.
 */
function getStreamsByUser(user) {
  return new Promise(function (resolve, reject) {
    resolve(user.subscribed_streams);
  });
}

/**
 * get subscribed content for an user.
 */
function getSubscribedStreamContentForUser(user, tags, followers, pageNr, pageSize) {
  var filteredTags = convertToArray(tags);
  var filteredFollowers = convertToArray(followers);
  pageNr = validatePageNr(pageNr);
  pageSize = validatePageSize(pageSize);
  logger.info("filterd tags", filteredTags);
  logger.info("filterd followers", filteredFollowers);
  if (tags == undefined && followers == undefined) {
    logger.info("both undefined");
    return getStreamsContentUserSubscribedTo(user, pageNr, pageSize)
  } else if (tags == undefined && followers != undefined) {
    logger.info("filteredFollowers defined");
    return getStreamsContentUserFollowingTo(user, filteredFollowers, pageNr, pageSize);
  } else if (tags != undefined && followers == undefined) {
    logger.info("tags defined  ", filteredTags);
    return getStreamsContentUserStreamsSubscribedTo(user, filteredTags, pageNr, pageSize);
  } else {
    logger.info("both defined");
    return getFilteredSubscribedContentTo(user, filteredTags, filteredFollowers, pageNr, pageSize);
  }
}


function getStreamsContentUserSubscribedTo(user, pageNr, pageSize) {
  return new Promise(function (resolve, reject) {
    var streams = user.subscribed_streams;
    var followings = user.followings;
    esServices.searchAllDocumentsByTagsOrAuthor(streams, followings, pageNr, pageSize)
      .then(function (ids) {
        return getAllContentByIds(user, ids, followings, streams);
      }).then(function (result) {
        resolve(result);
      }).then(undefined, function (err) {
        reject(err);
      })
  });
}

function getStreamsContentUserFollowingTo(user, followings, pageNr, pageSize) {
  return new Promise(function (resolve, reject) {
    var streams = [];
    esServices.searchAllDocumentsByUsers(followings, pageNr, pageSize)
      .then(function (ids) {
        return getAllContentByIds(user, ids, followings, streams);
      }).then(function (result) {
        resolve(result);
      }).then(undefined, function (err) {
        reject(err);
      })
  });
}

function getStreamsContentUserStreamsSubscribedTo(user, streams, pageNr, pageSize) {
  return new Promise(function (resolve, reject) {
    var followings = [];
    esServices.searchAllDocumentsByTags(streams, pageNr, pageSize)
      .then(function (ids) {
        return getAllContentByIds(user, ids, followings, streams);
      }).then(function (result) {
        resolve(result);
      }).then(undefined, function (err) {
        reject(err);
      })
  });
}

function getFilteredSubscribedContentTo(user, streams, followings, pageNr, pageSize) {
  return new Promise(function (resolve, reject) {
    esServices.searchAllDocumentsByTagsAndAuthor(streams, followings, pageNr, pageSize)
      .then(function (ids) {
        return getAllContentByIds(user, ids, followings, streams);
      }).then(function (result) {
        resolve(result);
      }).then(undefined, function (err) {
        reject(err);
      })
  });
}

function getAnswersByIdsWithDiscussion(ids) {
  return new Promise(function (resolve, reject) {
    answerModel.getAnswersByIds(ids).then(function (answers) {
      answers = JSON.parse(JSON.stringify(answers));
      var discussionPromises = [];
      for (var i = 0; i < answers.length; i++) {
        discussionPromises[i] = discussionModel.getDiscussionByAnswerId(answers[i]._id);
      }
      Promise.all(discussionPromises).then(
        function (discussions) {
          for (var i = 0; i < answers.length; i++) {
            answers[i].discussion = discussions[i];
          }
          resolve(answers);
        }).catch(function (err) {
          reject(err);
        })
    }).catch(function (err) {
      reject(err);
    })
  })
}

function getAllContentByIds(user, ids, followings, streams) {
  var blogModelPromise = blogModel.getBlogsByIds(ids.blog_ids);
  var discussionModelPromise = discussionModel.getDiscussionsByIds(ids.discussion_ids);
  var answerModelPromise = getAnswersByIdsWithDiscussion(ids.answer_ids);
  var postModelPromise = postModel.getPostsByIds(ids.post_ids);
  return new Promise(function (resolve, reject) {
    Promise.join(blogModelPromise, discussionModelPromise, answerModelPromise, postModelPromise, function (blogs, discussions, answers, posts) {
      //concatenate the blogs,answers,discussions,posts
      var response = [];
      var blogList = blogs.map(function (blog) {
        return streamMapper.mapBlogToStreamResponse(blog, streams, followings);
      });
      var discussionList = discussions.map(function (discussion) {
        return streamMapper.mapDiscussionToStreamResponse(discussion, streams, followings);
      });
      var postList = posts.map(function (post) {
        return streamMapper.mapPostToStreamResponse(user, post, streams, followings);
      });
      var answerList = answers.map(function (answer) {
        return streamMapper.mapAnswerToStreamResponse(answer, answer.discussion, streams, followings);
      });
      var res = response.concat(blogList, discussionList, postList, answerList);
      var sortedList = res.sort(function (obj1, obj2) {
        return (new Date(obj2.data.created_at) - new Date(obj1.data.created_at));
      });
      resolve(sortedList);
    }).catch(function (err) {
      logger.error("could not get the stream content", err.stack);
      reject(err);
    });

  })
}

function validatePageNr(pageNr) {
  if (pageNr == undefined) {
    return 1;
  }
  return pageNr;
}

function validatePageSize(pageSize) {
  if (pageSize == undefined) {
    return constants.DEFAULT_NO_OF_RESULTS;
  }
  return pageSize;
}

function convertToArray(input) {
  var array = [];
  if (Array.isArray(input)) {
    array = input;
  } else {
    array.push(input);
  }
  return array;
}

function getMostSubscribedStreams(pageSize) {
  pageSize = (pageSize == undefined) ? constants.DEFAULT_NO_OF_RESULTS : parseInt(pageSize);
  return new Promise(function (resolve, reject) {
    userModel.getMostSubscribedStreams(pageSize).then(function (mostSubscribedStreams) {
      resolve(mostSubscribedStreams);
    }).catch(function (err) {
      logger.error("could not retrieve most subscribed streams", err.stack);
      reject(err);
    });
  });
}
module.exports = streamService;
