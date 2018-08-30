var Promise = require("bluebird");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var logger = require("../../logger.js");
var activitySchema = new Schema({
  "name": {
    type: String,
    required: true
  },
  "isActive": {
    type: Boolean,
    required: false,
    default: 'true'
  },
  "created_by": {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  "data": {
    type: Object,
    default: null
  }
},
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

var Activity = mongoose.model('Activity', activitySchema);
var activity_array = ["NEW-PUBLISHED-BLOG", "NEW-BLOG-COMMENT", "NEW-PUBLISHED-DISCUSSION", "NEW-COMMENT-DISCUSSION", "NEW-ANSWER", "NEW-POST"];

var activityModel = {
  createActivity: createActivity,
  getAllActivities: getAllActivities,
  updateAllActivity: updateAllActivity,
  updateActivity: updateActivity,
  deleteBlogCommentEvent: deleteBlogCommentEvent,
  deleteBlogEvent: deleteBlogEvent,
  deleteDiscussionCommentEvent: deleteDiscussionCommentEvent,
  deleteAnswerCommentEvent: deleteAnswerCommentEvent,
  deletePostEvent: deletePostEvent,
  deleteAnswerEvent: deleteAnswerEvent,
  deleteDiscussionEvent: deleteDiscussionEvent,
  deleteAnswerCommentOnDeleteAnswerEvent: deleteAnswerCommentOnDeleteAnswerEvent,
  deleteBlogCommentOnDeleteBlogEvent: deleteBlogCommentOnDeleteBlogEvent,
  deleteDiscussionCommentonDeleteDiscussionEvent: deleteDiscussionCommentonDeleteDiscussionEvent,
  deleteAnswerOnDiscussionEvent: deleteAnswerOnDiscussionEvent,
  deleteAnswerCommentsOnDeleteDiscussionEvent: deleteAnswerCommentsOnDeleteDiscussionEvent
};

function createActivity(activity) {
  return new Promise(function (resolve, reject) {
  		Activity.create(activity, function (err, data) {
      if (!err) {
        resolve(data);
        logger.debug("create activity model");
      } else {
        reject(err);
      }
  		});
  });
}
/**
* get all published activities in system.
*/
function getAllActivities(user, nrOfActivitiesToBeSkipped, nrOfActivitiesToBeFetched) {
  return new Promise(function (resolve, reject) {
    Activity.find({
      created_by: user._id,
      name: { "$in": activity_array },
      isActive: true
    }).sort({
      created_at: 'desc'
    }).skip(nrOfActivitiesToBeSkipped).limit(nrOfActivitiesToBeFetched).populate(
      'created_by').populate('comments.created_by').exec(
      function (err, activities) {
        if (!err) {
          resolve(activities);
        } else {
          reject(err);
        }
      });
  });
}
function deleteBlogCommentEvent(activityName, activityInfo) {
  var searchQuery = {
    'name': activityName,
    'data.blog_id': activityInfo.blog_id,
    'data.comments.comment_id': activityInfo.comment_id
  };
  var updateQuery = {
    $set: {
      isActive: activityInfo.isActive
    }
  };

  return updateActivity(searchQuery, updateQuery);
}


function deleteBlogEvent(activityName, activityInfo) {
  var searchQuery = {
    'name': activityName,
    'data.blog_id': activityInfo.blog_id
  };
  var updateQuery = {
    $set: {
      isActive: activityInfo.isActive
    }
  };

  return updateActivity(searchQuery, updateQuery);
}
function deleteDiscussionEvent(activityName, activityInfo) {
  var searchQuery = {
    'name': activityName,
    'data.discussion_id': activityInfo.discussion_id
  };
  var updateQuery = {
    $set: {
      isActive: activityInfo.isActive
    }
  };

  return updateActivity(searchQuery, updateQuery);
}

function deleteDiscussionCommentEvent(activityName, activityInfo) {
  var searchQuery = {
    'name': activityName,
    'data.discussion_id': activityInfo.discussion_id,
    'data.comments.comment_id': activityInfo.comment_id
  };
  var updateQuery = {
    $set: {
      isActive: activityInfo.isActive
    }
  };

  return updateActivity(searchQuery, updateQuery);
}

function deleteAnswerCommentsOnDeleteDiscussionEvent(activityName, activityInfo) {
  var searchQuery = {
    'name': activityName,
    'data._id': activityInfo.id
  };
  var updateQuery = {
    $set: {
      isActive: activityInfo.isActive
    }
  };
  return updateAllActivity(searchQuery, updateQuery);
}
function deleteAnswerOnDiscussionEvent(activityName, activityInfo) {
  var searchQuery = {
    'name': activityName,
    'data.discussion_id': activityInfo.discussion_id
  };
  var updateQuery = {
    $set: {
      isActive: activityInfo.isActive
    }
  };
  return updateAllActivity(searchQuery, updateQuery);
}
function deleteDiscussionCommentonDeleteDiscussionEvent(activityName, activityInfo) {
  var searchQuery = {
    'name': activityName,
    'data.discussion_id': activityInfo.discussion_id
  };
  var updateQuery = {
    $set: {
      isActive: activityInfo.isActive
    }
  };

  return updateAllActivity(searchQuery, updateQuery);
}
function deleteBlogCommentOnDeleteBlogEvent(activityName, activityInfo) {
  var searchQuery = {
    'name': activityName,
    'data.blog_id': activityInfo.blog_id
  };
  var updateQuery = {
    $set: {
      isActive: activityInfo.isActive
    }
  };

  return updateAllActivity(searchQuery, updateQuery);
}
function deleteAnswerCommentOnDeleteAnswerEvent(activityName, activityInfo) {
  var searchQuery = {
    'name': activityName,
    'data.answer_id': activityInfo.answer_id
  };
  var updateQuery = {
    $set: {
      isActive: activityInfo.isActive
    }
  };

  return updateAllActivity(searchQuery, updateQuery);
}
function deleteAnswerCommentEvent(activityName, activityInfo) {
  var searchQuery = {
    'name': activityName,
    'data.answer_id': activityInfo.answer_id,
    'data.comments.comment_id': activityInfo.comment_id
  };
  var updateQuery = {
    $set: {
      isActive: activityInfo.isActive
    }
  };

  return updateActivity(searchQuery, updateQuery);
}
function deleteAnswerEvent(activityName, activityInfo) {
  var searchQuery = {
    'name': activityName,
    'data.answers.answer_id': activityInfo.answer_id
  };
  var updateQuery = {
    $set: {
      isActive: activityInfo.isActive
    }
  };

  return updateActivity(searchQuery, updateQuery);
}
function deletePostEvent(activityName, activityInfo) {
  var searchQuery = {
    'name': activityName,
    'data.post_id': activityInfo.post_id
  };
  var updateQuery = {
    $set: {
      isActive: activityInfo.isActive
    }
  };

  return updateActivity(searchQuery, updateQuery);
}
function updateActivity(searchQuery, updateQuery) {

  return new Promise(function (resolve, reject) {
    var options = { new: true };
    Activity.findOneAndUpdate(searchQuery, updateQuery, options, function (err, data) {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
}
function updateAllActivity(searchQuery, updateQuery) {
  return new Promise(function (resolve, reject) {
    Activity.update(searchQuery, updateQuery, { multi: true }, function (err, activity) {
      if (!err) {
        resolve(activity);
      } else {
							 reject(err);
      }
    })
  });
}
module.exports = activityModel;