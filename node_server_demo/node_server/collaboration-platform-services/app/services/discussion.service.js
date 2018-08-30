var Promise = require("bluebird");
var discussionModel = require("../dao/discussion.model");
var constants = require('./constants.js');
var discussionMapper = require('./mappers/discussion.mapper.js');
var tagValidator = require("./validators/tag.validator.js");
var logger = require('../../logger.js');
var idGenerator = require('../common/id-generator');
var userModel = require("../dao/user.model");
var answerModel = require("../dao/answer.model");
var events = require('events');
var eventEmitter = new events.EventEmitter();

var discussionService = {
  /**
   * Event emitter for Discussions
   */
  eventEmitter: eventEmitter,
  /**
   * Gets all published discussions
   */
  getPublishedDiscussions: getPublishedDiscussions,

  /**
   * Gets the details of a discussion
   */
  viewDiscussion: viewDiscussion,

  /**
   * Creates a new discussion.
   */
  createDiscussion: createDiscussion,

  /**
   * Post a comment on discussion.
   */
  postCommentToDiscussion: postCommentToDiscussion,

  /**
   * Add or removes user's vote on discussion.
   */
  voteUnvoteDiscussion: voteUnvoteDiscussion,

  /**
   * Removes a comment from a discussion
   */
  removeCommentInDiscussion: removeCommentInDiscussion,

  /**
   * Edits the discussion.
   */
  editDiscussion: editDiscussion,

  /**
   * Get user's published discussions
   */
  getPublishedDiscussionsOfUser: getPublishedDiscussionsOfUser,

  /**
   * Get user's all discussions
   */
  getAllDiscussionsOfUser: getAllDiscussionsOfUser,

  /**
   * Deletes a discussion.
   */
  deleteDiscussion: deleteDiscussion
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

function getPublishedDiscussions(user, pageNr, pageSize) {
  pageNr = validatePageNr(pageNr);
  pageSize = validatePageSize(pageSize);
  return new Promise(function(resolve, reject) {
    discussionModel
      .getDiscussionsByStatus((pageNr - 1) * pageSize, pageSize, constants.PUBLISHED)
      .then(
        function(discussions) {
          var discussionList = discussions.map(function(discussion) {
            return discussionMapper.shortDiscussionMapper(discussion,
              user);
          });
          resolve(discussionList);
        })
      .catch(function(err) {
        logger.error("could not get discussions", err.stack);
        reject(err);
      });
  });
}

function viewDiscussion(user, discussionId, viewValue) {
  var isIncrement = (viewValue != undefined && viewValue == 0) ? false : true;
  return new Promise(function(resolve, reject) {
    discussionModel.getDiscussionById(discussionId).
    then(function(discussion) {
      if (isIncrement) {
        discussionModel.updateDiscussionView(user, discussionId).
        then(function(updatedDiscussion) {
          resolve(discussionMapper.detailedDiscussionMapper(
            discussion, user));
        }).catch(function(err) {
          logger.error("could not update discussion view", err.stack);
          reject(err);
        });
      } else {
        resolve(discussionMapper.detailedDiscussionMapper(discussion,
          user));
      }
    }).catch(function(err) {
      logger.error("could not get discussion by id", err.stack);
      reject(err);
    });
  });
}

function createDiscussion(user, discussion) {
  if (!user || !discussion) {
    throw new Error("invalid input parameters");
  }
  var tagLength = true,
    tagValidation = true;
  for (var i = 0; i < discussion.tags.length; i++) {
    if (discussion.tags[i].length > constants.LENGTH_OF_EACH_TAG) {
      tagLength = false;
      break;
    }
  }
  for (var i = 0; i < discussion.tags.length; i++) {
    if (!tagValidator.validateTag(discussion.tags[i])) {
      tagValidation = false;
      break;
    }
  }
  if (discussion.title !== null && discussion.tags !== null && discussion.content !==
    null && tagValidation && discussion.tags.length <= constants.TOTAL_TAG &&
    tagLength && discussion.title.length < constants.DISCUSSION_TITLE_LENGTH) {
    return new Promise(function(resolve, reject) {
      var discussionId = 'discuss' + idGenerator.generateRandomId(10);
      discussion.created_by = user._id;
      discussion.discussion_id = discussionId;
      discussionModel.createDiscussion(discussion)
        .then(function(result) {
          if (result.status == constants.PUBLISHED) {
            var eventData = JSON.parse(JSON.stringify(result));
            eventData.created_by = user;
            eventEmitter.emit('NEW-PUBLISHED-DISCUSSION', eventData);
          }
          resolve(result);
        }).catch(function(err) {
          logger.error("could not add discussion", err.stack);
          reject(err);
        });
    });
  } else {
    throw new Error("invalid discussion input");
  }
}

function postCommentToDiscussion(user, discussionId, commentContent) {
  var commentId = idGenerator.generateRandomId(5);
  var comment = {};
  comment.comment_id = commentId;
  comment.content = commentContent;
  comment.created_by = user;
  return new Promise(function(resolve, reject) {
    discussionModel.addComment(user, discussionId, comment)
      .then(function(result) {
        comment.title = result.title;
        var eventData = JSON.parse(JSON.stringify(comment));
        eventData.discussion_id = result.discussion_id;
        eventData._id = result._id;
        var created_by = user;
        eventEmitter.emit('NEW-COMMENT-DISCUSSION', eventData, created_by);
        resolve();
      }).catch(function(err) {
        logger.error("could not post comment", err.stack);
        reject(err);
      });
  });
}

function voteUnvoteDiscussion(user, discussionId, voteValue) {
  var isVoting = (voteValue != undefined && voteValue == 0) ? false : true;
  return new Promise(function(resolve, reject) {
    if (isVoting) {
      discussionModel
        .addVote(user, discussionId)
        .then(
          function(discussion) {
            var eventData = JSON.parse(JSON.stringify(discussion));
            var created_by = user;
            eventEmitter.emit('VOTE-DISCUSSION', eventData, created_by);
            resolve()
          }).catch(function(err) {
          logger.error("could not vote the discussion", err.stack);
          reject(err);
        });
    } else {
      discussionModel
        .removeVote(user, discussionId)
        .then(
          function(discussion) {
            var eventData = JSON.parse(JSON.stringify(discussion));
            var created_by = user;
            eventEmitter.emit('UNVOTE-DISCUSSION', eventData, created_by);
            resolve();
          }).catch(function(err) {
          logger.error("could not unvote the discussion", err.stack);
          reject(err);
        });
    }
  });
}

function removeCommentInDiscussion(user, discussionId, commentId) {
  return new Promise(function(resolve, reject) {

    discussionModel.getCommentById(discussionId, commentId)
      .then(function(comment) {
        if (comment.created_by.toString() == user._id.toString()) {
          discussionModel
            .deleteComment(user, discussionId, commentId)
            .then(
              function(discussion) {
                var eventData = JSON.parse(JSON.stringify(discussion));
                eventData.discussion_id = discussionId;
                var created_by = user;
                eventEmitter.emit('DELETE-COMMENT-DISCUSSION', eventData,
                  created_by);
                resolve();
              }).catch(function(err) {
              logger.error("could not delete the comment", err.stack);
              reject(err);
            });
        } else {
          throw new Error(
            "you dont have permission to delete others comments");
        }
      })
      .catch(function(err) {
        logger.error("could not get comment by id", err);
        reject(err);
      });
  });
}

function editDiscussion(user, discussionId, discussion) {
  if (!user || !discussionId || !discussion) {
    throw new Error("invalid input parameters");
  }
  var tagLength = true,
    tagValidation = true;
  for (var i = 0; i < discussion.tags.length; i++) {
    if (discussion.tags[i].length > constants.LENGTH_OF_EACH_TAG) {
      tagLength = false;
      break;
    }
  }
  for (var i = 0; i < discussion.tags.length; i++) {
    if (!tagValidator.validateTag(discussion.tags[i])) {
      tagValidation = false;
      break;
    }
  }
  if (discussion.title !== null && discussion.tags !== null && discussion.content !==
    null && tagValidation && discussion.tags.length <= constants.TOTAL_TAG &&
    tagLength && discussion.title.length < constants.DISCUSSION_TITLE_LENGTH) {
    return new Promise(function(resolve, reject) {
      discussionModel.getDiscussionById(discussionId).
      then(function(data) {
        if (data.status == constants.PUBLISHED && discussion.status ==
          constants.DRAFT) {
          reject(new Error());
        }
        if (data.created_by._id.toString() === user._id.toString()) {
          discussionModel.editDiscussion(discussionId, discussion).then(
            function(discussion) {
              var eventData = JSON.parse(JSON.stringify(discussion));
              var created_by = user;
              eventEmitter.emit('EDIT-DISCUSSION', eventData,
                created_by);
              resolve();
            }).catch(function(err) {
            logger.error("could not edit discussion", err.stack);
            reject(err);
          });
        } else {
          reject(new Error());
        }
      });
    });
  } else {
    throw new Error("invalid discussion input");
  }
}

function getPublishedDiscussionsOfUser(user, username, pageNr, pageSize) {
  pageNr = validatePageNr(pageNr);
  pageSize = validatePageSize(pageSize);
  return new Promise(function(resolve, reject) {
    userModel.getUserByUsername(username)
      .then(function(userObj) {
        discussionModel.getDiscussionsByUser(userObj, constants.PUBLISHED, (
              pageNr - 1) * pageSize,
            pageSize)
          .then(function(discussions) {
            var discussionList = discussions.map(function(discussion) {
              return discussionMapper.shortDiscussionMapper(
                discussion, user);
            });
            resolve(discussionList);
          }).catch(function(err) {
            logger.error("could not get discussions", err.stack);
            reject(err);
          });
      }).catch(function(err) {
        logger.error("could not get user", err.stack);
        reject(err);
      });
  });
}

function getAllDiscussionsOfUser(user, pageNr, pageSize) {
  pageNr = validatePageNr(pageNr);
  pageSize = validatePageSize(pageSize);
  return new Promise(function(resolve, reject) {
    discussionModel.getDiscussionsByUser(user, null, (pageNr - 1) *
        pageSize,
        pageSize, user._id)
      .then(function(discussions) {
        var discussionList = discussions.map(function(discussion) {
          return discussionMapper.shortDiscussionMapper(discussion,
            user);
        });
        resolve(discussionList);
      }).catch(function(err) {
        logger.error("could not get discussions", err.stack);
        reject(err);
      });
  });
}

function deleteDiscussion(user, discussionId) {
  return new Promise(function(resolve, reject) {
    discussionModel.getDiscussionById(discussionId).
    then(function(discussion) {
        if (discussion.created_by._id.toString() === user._id.toString()) {
            discussionModel.deleteDiscussionById(discussionId).then(
                function(result) {
                  var eventData = JSON.parse(JSON.stringify(result));
                  var created_by = user;
                  eventEmitter.emit('DELETE-DISCUSSION', eventData,
                    created_by);
                  resolve();
                  logger.debug('Delete discussion with id ',
                    discussionId);
                })
              .catch(function(err) {
                logger.error("could not delete discussion", err.stack);
                reject(err);
              });
        } else {
          throw new Error(
            "you dont have permission to delete others discussion");
        }
      })
      .catch(function(err) {
        logger.error("could not find discussion", err.stack);
        reject(err);
      });
  });
}

module.exports = discussionService;
