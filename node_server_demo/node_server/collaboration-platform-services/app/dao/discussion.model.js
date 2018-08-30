var events = require('events');
var eventEmitter = new events.EventEmitter();
var discussionDao = {
  /**
 * Event emitter for Discussions
 */
  eventEmitter: eventEmitter,
  getDiscussionsByStatus: getDiscussionsByStatus,
  getDiscussionById: getDiscussionById,
  createDiscussion: createDiscussion,
  saveDiscussion: saveDiscussion,
  getTotalDiscussionCounts: getTotalDiscussionCounts,
  getTotalDiscussionCountsByAuthor: getTotalDiscussionCountsByAuthor,
  getDiscussionsByUser: getDiscussionsByUser,
  deleteDiscussionById: deleteDiscussionById,
  /**
   * Returns the count of all published discussions in system and count of published/draft discussions by author
   */
  countAllNAuthorDiscussions: countAllNAuthorDiscussions,
  getDiscussionByObjId: getDiscussionByObjId,
  getDiscussionByAnswerId: getDiscussionByAnswerId,

  /**
   * Edits a already created discussion.
   */
  editDiscussion: editDiscussion,

  /**
   * updates the discussion's viewed by collection
   */
  updateDiscussionView: updateDiscussionView,

  /**
   * Adds a comment to a discussion.
  */
  addComment: addComment,

  /**
   * Add user's vote to discussion
   */
  addVote: addVote,

  /**
  * Remove user's vote from discussion
  */
  removeVote: removeVote,

  /**
   * Deletes a comment from discussion
   */
  deleteComment: deleteComment,

  /**
   * Adds answer id into discussion
   */
  addAnswerId: addAnswerId,

  /**
   * Removes answer id from discussion
   */
  removeAnswerId: removeAnswerId,

  getDiscussionByIdWithAnswerIds: getDiscussionByIdWithAnswerIds,
  /**
  *
  */
  getDiscussionsByIds: getDiscussionsByIds,

  getCommentById: getCommentById
};

module.exports = discussionDao;

var Promise = require("bluebird");
var logger = require('../../logger.js');
var discussionHooks = require("./discussion.hooks");
var answerModel = require("./answer.model");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
discussionHooks.init();
var discussionSchema = new Schema({
  "discussion_id": {
    type: String
  },
  "title": {
    type: String,
    required: true
  },
  "created_by": {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  "content": {
    type: String,
    required: true
  },
  "comments": [{
    "comment_id": {
      type: String
    },
    "content": {
      type: String
    },
    "created_by": {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    "created_at": {
      type: Date,
      default: Date.now()
    }
  }],
  "voted_by": [{
    type: String,
    required: true
  }],
  "tags": [{
    type: String,
    required: true
  }],
  "viewed_by": [{
    type: String,
    default: 0
  }],
  "answers": [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'answer',
    required: true
  }
  ],
  "status": {
    type: String,
    enum: ['DRAFT', 'PUBLISHED'],
    required: true,
    default: 'PUBLISHED'
  }
},
  { timestamps: { createdAt: 'created_at', updatedAt: "updated_at" } });

var Discussion = mongoose.model('Discussion', discussionSchema);


function getDiscussionsByIds(ids) {
  return new Promise(function (resolve, reject) {
    Discussion.find({
      _id: {
        "$in": ids
      }
    }).populate('created_by').exec(function (err, discussions) {
      if (!err) {
        resolve(discussions);
      } else {
        reject(err)
      }
    });
  });
}

function removeAnswerId(answerId) {
  var searchQuery = {
				answers: answerId
  };
  var updateQuery = {
				$pull: {
      answers: answerId
				}
  };
  return new Promise(function (resolve, reject) {
    var options = { new: true };
    Discussion.findOneAndUpdate(searchQuery, updateQuery, options, function (err, data) {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
}

function addAnswerId(discussionId, answer) {
  var searchQuery = {
				discussion_id: discussionId
  };
  var updateQuery = {
				$push: {
      answers: answer._id
				}
  };
  return new Promise(function (resolve, reject) {
    var options = { new: true };
    Discussion.findOneAndUpdate(searchQuery, updateQuery, options, function (err, data) {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
}

function deleteComment(user, discussionId, commentId) {
  var searchQuery = {
    discussion_id: discussionId
  };
  var updateQuery = {
    $pull: {
      'comments': {
        'comment_id': commentId,
        'created_by': user._id
      }
    }
  };
  var options = { new: false };
  return new Promise(function (resolve, reject) {
    Discussion.findOne(searchQuery, function (err, discussion) {
      if (!err) {
        var commentsArray = discussion.comments;
        var comment;
        for (var i = 0; i < commentsArray.length; i++) {
          if (commentsArray[i].comment_id === commentId) {
            comment = commentsArray[i];
            break;
          }
        }
        Discussion.update(searchQuery, updateQuery, options, function (err, discussion) {
          if (!err) {
            resolve(comment);
          } else {
            reject(err)
          }
        })
			   } else {
        reject(err);
			   }
    })
  });
}

function addVote(user, discussionId) {
  var searchQuery = {
    $and: [{
      voted_by: {
        $ne: user.user_name
      }
    }, {
        discussion_id: discussionId
      }]
  };
  var updateQuery = {
    $push: {
      voted_by: user.user_name
    }
  };
  return new Promise(function (resolve, reject) {
    var options = { new: true };
    Discussion.findOneAndUpdate(searchQuery, updateQuery, options, function (err, data) {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
}

function removeVote(user, discussionId) {
  var searchQuery = {
    $and: [{
      voted_by: user.user_name
    }, {
        discussion_id: discussionId
      }]
  };
  var updateQuery = {
    $pull: {
      voted_by: user.user_name
    }
  };
  return new Promise(function (resolve, reject) {
    var options = { new: true };
    Discussion.findOneAndUpdate(searchQuery, updateQuery, options, function (err, data) {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
}

function addComment(user, discussionId, comment) {
  comment.created_at = Date.now();
  var searchQuery = { discussion_id: discussionId };
  var updateQuery = { $push: { 'comments': comment } };
  return new Promise(function (resolve, reject) {
    var options = { new: true };
    Discussion.findOneAndUpdate(searchQuery, updateQuery, options, function (err, data) {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
}

function updateDiscussionView(user, discussionId) {
  var searchQuery = {
    $and: [{
      viewed_by: {
        $ne: user.user_name
      }
    }, {
        discussion_id: discussionId
      }]
  };
  var updateQuery = {
    $push: {
      viewed_by: user.user_name
    }
  };

  return new Promise(function (resolve, reject) {
    var options = { new: true };
    Discussion.findOneAndUpdate(searchQuery, updateQuery, options, function (err, data) {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
}

function editDiscussion(discussionId, updatedDiscussion) {
  var discussion_title = updatedDiscussion.title;
  var discussion_content = updatedDiscussion.content;
  var discussion_tags = updatedDiscussion.tags;
  var discussionStatus = updatedDiscussion.status;

  var searchQuery = {
    discussion_id: discussionId
  };
  var updateQuery = {
    $set: {
      title: discussion_title,
      content: discussion_content,
      tags: discussion_tags,
      status: discussionStatus
    }
  };

  return new Promise(function (resolve, reject) {
    var options = { new: true };
    Discussion.findOneAndUpdate(searchQuery, updateQuery, options, function (err, data) {
      if (!err) {
        var eventData = JSON.parse(JSON.stringify(data));
        eventEmitter.emit('DISCUSSION_UPDATED', eventData);
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
}

function getDiscussionByObjId(id) {
  return new Promise(function (resolve, reject) {
    Discussion.findById(id, function (err, discussion) {
      if (!err) {
        resolve(discussion);
      } else {
        reject(err);
      }
    });
  });
}

/**
 *
 */
function saveDiscussion(discussion) {
  return new Promise(function (resolve, reject) {
    discussion.save(function (err, Discussion) {
      if (!err) {
        resolve(Discussion);
      } else {
        reject(err);
      }
    });
  });
}

/**
 * get Discussion by Id
 */
function getDiscussionById(discussionId) {
  return new Promise(function (resolve, reject) {
    Discussion.findOne({
      discussion_id: discussionId
    })
      .populate('created_by')
      .populate('comments.created_by')
      .exec(function (err, discussion) {
        if (!err) {
          resolve(discussion);
        } else {
          reject(err);
        }
      });
  });
}

function getDiscussionByIdWithAnswerIds(discussionId) {
  return new Promise(function (resolve, reject) {
    Discussion.findOne({
      discussion_id: discussionId
    }, 'answers')
      .exec(function (err, discussion) {
        if (!err) {
          resolve(discussion);
        } else {
          reject(err);
        }
      });
  });
}
/**
 * save the Discussion.
 */
function createDiscussion(discussion) {
  return new Promise(function (resolve, reject) {
    Discussion.create(discussion, function (err, data) {
      if (!err) {
        var eventData = JSON.parse(JSON.stringify(data));
        eventEmitter.emit('DISCUSSION_CREATED', eventData);
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
}
/**
 * get Total Count Of The Discussions PUBLISHED.
 */
function getTotalDiscussionCounts() {
  return new Promise(function (resolve, reject) {
    Discussion.count({
      status: "PUBLISHED"
    }, function (err, count) {
      if (!err) {
        resolve(count);
      } else {
        reject(err);
      }
    });
  });
}

/**
 * get Total Count Of  Discussions PostedBy by the User.
 */
function getTotalDiscussionCountsByAuthor(user) {
  return new Promise(function (resolve, reject) {
    Discussion.find()
      .and([{
        created_by: user._id
      }, {
          status: "PUBLISHED"
        }]).count({
          status: "PUBLISHED"
        }, function (err, count) {

          if (!err) {
            resolve(count);
          } else {
            reject(err);
          }
        });

  });
}
/**
 * get all the Discussions.
 */
function getDiscussionsByStatus(nrOfDiscussionsToBeSkipped,
  nrOfDiscussionsToBeFetched, status) {
  var query = {
    status: status
  };

  return new Promise(function (resolve, reject) {
    Discussion.find(query).skip(nrOfDiscussionsToBeSkipped).limit(
      nrOfDiscussionsToBeFetched)
      .sort({
        created_at: 'desc'
      }).populate('created_by')
      .exec(function (err, discussions) {
        if (!err) {
          resolve(discussions);
        } else {
          reject(err);
        }
      });
  });
}


function getDiscussionsByUser(user, status, nrOfDiscussionsToBeSkipped,
  nrOfDiscussionsToBeFetched) {
  var searchQuery = {
    created_by: user._id
  };
  if (status) {
    searchQuery.status = status;
  }
  return new Promise(function (resolve, reject) {
    Discussion.find(searchQuery).skip(nrOfDiscussionsToBeSkipped).limit(nrOfDiscussionsToBeFetched)
      .sort({
        created_at: 'desc'
      }).populate('created_by').exec(
      function (err, discussions) {
        if (!err) {
          resolve(discussions);
        } else {
          reject(err);
        }
      });
  });
}

function deleteDiscussionById(discussionId) {
  return new Promise(function (resolve, reject) {
    getDiscussionById(discussionId).
      then(function (discussion) {
          answerModel.deleteAnswerByIds(discussion.answers).then(function (
            answersCount) {
            Discussion.findOne({ discussion_id: discussionId }, function (err, discussionDoc) {
              if (!err) {
                discussionDoc.remove(function (err, data) {
                  if (!err) {
                    var eventData = JSON.parse(JSON.stringify(data));
                    eventEmitter.emit('DISCUSSION_DELETED', eventData);
                    resolve(data);
                  } else {
                    reject(err);
                  }
                });
              } else {
                reject(err);
              }
            })
              .catch(function (err) {
                logger.error("could not delete discussion", err.stack);
                reject(err);
              });
          }).catch(function (err) {
            logger.error("could not delete answers", err.stack);
            reject(err);
          });
 
      })
      .catch(function (err) {
        logger.error("could not find discussion", err.stack);
        reject(err);
      });
  });
}

/**
 * Fetched a Discussion document based on given answer id.
 */
function getDiscussionByAnswerId(answerId) {
  return new Promise(function (resolve, reject) {
    Discussion.findOne({
      answers: answerId
    })
      .exec(function (err, discussion) {
        if (!err) {
          resolve(discussion);
        } else {
          logger.error("Error occurred while retrieving discussion by answer id. ", err.stack)
          reject(err);
        }
      });
  });
}

function countAllNAuthorDiscussions(userId) {
  return new Promise(function (resolve, reject) {

    Discussion.aggregate(
      [
        {
          "$group": {
            "_id": null,
            "all_published_count": { "$sum": { "$cond": [{ $eq: ["$status", 'PUBLISHED'] }, 1, 0] } },
            "my_draft_count": {
              "$sum": {
                "$cond": [{
                  $and: [{ $eq: ["$status", 'DRAFT'] },
                    { $eq: ["$created_by", userId] }
                  ]
                }, 1, 0]
              }
            },
            "my_published_count": {
              "$sum": {
                "$cond": [{
                  $and: [{ $eq: ["$status", 'PUBLISHED'] },
                    { $eq: ["$created_by", userId] }
                  ]
                }, 1, 0]
              }
            }
          }
        }
      ],
      function (err, counts) {
        if (!err) {
          var countResponse = {
            all_published_count: 0,
            my_draft_count: 0,
            my_published_count: 0
          };
          if (counts[0]) {
            countResponse.all_published_count = counts[0].all_published_count;
            countResponse.my_draft_count = counts[0].my_draft_count;
            countResponse.my_published_count = counts[0].my_published_count;
          }
          resolve(countResponse);
        } else {
          reject(err);
        }
      }
    );

  });
}

function getCommentById(discussionId, commentId) {
  var searchQuery = {
    'discussion_id': discussionId,
    'comments.comment_id': commentId
  }
  return new Promise(function (resolve, reject) {
    Discussion.findOne(searchQuery, { 'comments.$': 1 }, function (err, result) {
      if (!err) {
        resolve(result.comments[0]);
      } else {
        reject(err);
      }
    });
  });
}
