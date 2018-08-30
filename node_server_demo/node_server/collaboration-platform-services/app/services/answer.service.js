var Promise = require("bluebird");
var discussionModel = require("../dao/discussion.model");
var constants = require('./constants.js');
var logger = require('../../logger.js');
var idGenerator = require('../common/id-generator');
var userModel = require("../dao/user.model");
var answerModel = require("../dao/answer.model");
var answerMapper = require('./mappers/answer.mapper.js');
var tagValidator = require("./validators/tag.validator.js");
var events = require('events');
var eventEmitter = new events.EventEmitter();


var answerService = {
  /**
   * Event emitter for Answers
   */
  eventEmitter: eventEmitter,
  /**
   * Posts answer to a discussion
   */
  postAnswer: postAnswer,

  /**
   * Edits the answer
   */
  editAnswer: editAnswer,

  /**
   * Gets answers by discussion id.
   */
  getAnswersByDiscussionId: getAnswersByDiscussionId,

  /**
   * Adds the comment on answer.
   */
  addComment: addComment,

  /**
   * Adds/removes vote on answer.
   */
  voteUnvoteAnswer: voteUnvoteAnswer,

  /**
   * Deletes the comment.
   */
  deleteComment: deleteComment,

  /**
   * Deletes the answer.
   */
  deleteAnswer: deleteAnswer
}

function postAnswer(user, discussionId, answer) {
  if (!user || !answer || !discussionId) {
    throw new Error("invalid input parameters");
  }
  var tagLength = true,
    tagValidation = true;
  for (var i = 0; i < answer.tags.length; i++) {
    if (answer.tags[i].length > constants.LENGTH_OF_EACH_TAG) {
      tagLength = false;
      break;
    }
  }
  for (var i = 0; i < answer.tags.length; i++) {
    if (!tagValidator.validateTag(answer.tags[i])) {
      tagValidation = false;
      break;
    }
  }
  if (answer.tags !== null && answer.content !== null && answer.tags.length <=
    constants.TOTAL_TAG && tagLength && tagValidation && discussionId !== null) {
    var answerId = idGenerator.generateRandomId(5);
    var newAnswer = {
      content: answer.content,
      tags: answer.tags,
      answer_id: answerId,
      created_by: user
    };
    return new Promise(function(resolve, reject) {
      answerModel.saveAnswer(discussionId, newAnswer)
        .then(function(result) {
          var eventData = JSON.parse(JSON.stringify(result));
          eventData.created_by = user;
          discussionModel.getDiscussionById(discussionId).then(function(
            discussion) {
            eventEmitter.emit('NEW-ANSWER', discussion, eventData);
          }).catch(function(err) {
            logger.error("could not get discussion", err.stack);
          });
          resolve();
        }).catch(function(err) {
          logger.error("could not save answer", err.stack);
          reject(err);
        });
    });
  } else {
    throw new Error("invalid answer input");
  }
}

function editAnswer(user, answerId, answer) {
  if (!user || !answerId || !answer) {
    throw new Error("invalid input parameters");
  }
  var tagLength = true,
    tagValidation = true;
  for (var i = 0; i < answer.tags.length; i++) {
    if (answer.tags[i].length > constants.LENGTH_OF_EACH_TAG) {
      tagLength = false;
      break;
    }
  }
  for (var i = 0; i < answer.tags.length; i++) {
    if (!tagValidator.validateTag(answer.tags[i])) {
      tagValidation = false;
      break;
    }
  }
  if (answer.tags !== null && answer.content !== null && answer.tags.length <=
    constants.TOTAL_TAG && tagLength && tagValidation && tagValidation &&
    answerId !== null) {
    return new Promise(function(resolve, reject) {
      answerModel.getAnswerById(answerId).then(function(data) {
        if (!data || (data.created_by._id.toString() !== user._id.toString())) {
          throw new Error();
        }
        answerModel.editAnswer(user, answerId, answer)
          .then(function(data) {
            var eventData = JSON.parse(JSON.stringify(data));
            var created_by = user;
            eventEmitter.emit('EDIT-ANSWER', eventData, created_by);
            resolve();
          }).catch(function(err) {
            logger.error("could not edit answer", err.stack);
            reject(err);
          });
      }).catch(function(err) {
        logger.error("could not find answer", err.stack);
        reject(err);
      });
    })
  } else {
    throw new Error("invalid answer input");
  }
}

function getAnswersByDiscussionId(user, discussionId) {
  return new Promise(function(resolve, reject) {
    answerModel
      .getAnswersByDiscussionId(discussionId)
      .then(
        function(answers) {
          var answersList = answers.map(function(ans) {
            return answerMapper.detailedAnswerMapper(ans, user)
          });
          resolve(answersList);
        }).then(undefined, function(err) {
        logger.error("could not get answres", err.stack);
        reject(err);
      });
  })
}

function addComment(user, answerId, commentContent) {
  var commentId = idGenerator.generateRandomId(5);
  var comment = {
    comment_id: commentId,
    content: commentContent,
    created_by: user
  };
  return new Promise(function(resolve, reject) {
    answerModel.addComment(user, answerId, comment)
      .then(function(result) {
        var eventData = JSON.parse(JSON.stringify(comment));
        var created_by = user;
        eventData.answer_id = result.answer_id.toString();
        eventData._id = result._id.toString();
        eventEmitter.emit('NEW-COMMENT-ANSWER', eventData, created_by);
        resolve();
      }).then(undefined, function(err) {
        logger.error("could not post comment", err.stack);
        reject(err);
      });
  })
}

function voteUnvoteAnswer(user, answerId, voteValue) {
  var isVoting = (voteValue != undefined && voteValue == 0) ? false : true;
  return new Promise(function(resolve, reject) {
    if (isVoting) {
      answerModel
        .addVote(user, answerId)
        .then(
          function(answer) {
            var eventData = JSON.parse(JSON.stringify(answer));
            var created_by = user;
            eventEmitter.emit('VOTE-ANSWER', eventData, created_by);
            resolve()
          }).catch(function(err) {
          logger.error("could not vote the answer", err.stack);
          reject(err);
        });
    } else {
      answerModel
        .removeVote(user, answerId)
        .then(
          function(answer) {
            var eventData = JSON.parse(JSON.stringify(answer));
            var created_by = user;
            eventEmitter.emit('UNVOTE-ANSWER', eventData, created_by);
            resolve();
          }).catch(function(err) {
          logger.error("could not unvote the answer", err.stack);
          reject(err);
        });
    }
  })
}

function deleteComment(user, answerId, commentId) {
  return new Promise(function(resolve, reject) {
    answerModel
      .deleteComment(user, answerId, commentId)
      .then(
        function(answer) {
          var eventData = JSON.parse(JSON.stringify(answer));
          eventData.answer_id = answerId;
          var created_by = user;
          eventEmitter.emit('DELETE-ANSWER-COMMENT', eventData, created_by);
          resolve();
        }).catch(function(err) {
        logger.error("could not delete the comment", err.stack);
        reject(err);
      });
  });
}

function deleteAnswer(user, answerId) {
  return new Promise(function(resolve, reject) {
    answerModel.getAnswerById(answerId).then(function(data) {
        if (data.created_by._id.toString() === user._id.toString()) {
          discussionModel.removeAnswerId(data._id)
            .then(function(discussion) {
              answerModel.deleteAnswerById(answerId).then(function(data) {
                  var eventData = JSON.parse(JSON.stringify(data));
                  var created_by = user;
                  eventEmitter.emit('DELETE-ANSWER', eventData,
                    created_by);
                  resolve();
                  logger.debug('Answer delete with id ', answerId);
                })
                .catch(function(err) {
                  logger.error("unable to delete answer", err);
                  reject(err);
                });
            }).catch(function(err) {
              logger.error("could not update discussion", err.stack);
              reject(err);
            });
        } else {
          throw new Error(
            "you dont have permission to delete others answer");
        }
      })
      .catch(function(err) {
        logger.error("could not find answer", err.stack);
        reject(err);
      });
  });
}

module.exports = answerService;
