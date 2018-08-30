var events = require('events');
var eventEmitter = new events.EventEmitter();
var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var postSchema = new Schema({
  "post_id": {
    type: String,
    required: true,
    unique: true
  },
  "content": {
    type: String,
    required: true
  },
  "created_by": {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  "liked_by": [{
    type: String,
    required: true
  }],
  "tags": [{
    type: String,
    required: true
  }],
  "file": {
    "ref": {
      type: String,
      default: null
    },
    "name": {
      type: String,
      default: null
    }
  }
}, {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });


var Post = mongoose.model('Post', postSchema);

var postDao = {
  /**
 * Event emitter for Blogs
 */
  eventEmitter: eventEmitter,
  /**
   * create post.
   */
  createPost: createPost,
  /**
   * delete post
   */
  deletePost: deletePost,
  /**
   *  like post
   */
  likePost: likePost,
  /**
 * unlike post
 */
  unLikePost: unLikePost,
  /**
   * get all the posts.
   */
  getAllPosts: getAllPosts,
  /**
   * get post by mongodb's id.
   */
  getPostByObjId: getPostByObjId,
  /**
   * get post by id.
   */
  getPostById: getPostById,
  /**
   *
   */
  getPostsByIds: getPostsByIds,

  /**
 * get total count of posts in the system.
 */
  getTotalPostCounts: getTotalPostCounts,
  /**
   * get count of posts posted by user
   */
  getTotalPostCountByAuthor: getTotalPostCountByAuthor
};
module.exports = postDao;
var postHooks = require("./post.hooks");
postHooks.init();
/**
 * get post by id.
 */
function getPostById(postId) {
  return new Promise(function (resolve, reject) {
    Post.findOne({
      post_id: postId
    }).populate(
      'created_by').exec(
      function (err, post) {
        if (!err) {
          resolve(post);
        } else {
          reject(err);
        }
      });
  });
}

function getPostsByIds(ids) {
  return new Promise(function (resolve, reject) {
    Post.find({
      _id: {
        "$in": ids
      }
    }).populate('created_by').exec(function (err, posts) {
      if (!err) {
        resolve(posts);
      } else {
        reject(err)
      }
    });
  });
}


/**
 * @param post, post object consists of all the info regarding post.
 */
function createPost(post) {
  return new Promise(function (resolve, reject) {
    Post.create(post, function (err, data) {
      if (!err) {
        var eventData = JSON.parse(JSON.stringify(data));
        eventEmitter.emit('POST_CREATED', eventData);
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
}

/**
 * get Total Count Of  Posts in system.
 */
function getTotalPostCounts() {
  return new Promise(function (resolve, reject) {
    Post.count({
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
 * @param userId,userid of user who is deleting
 * @param postId,post id of post to be deleted.
 */
function deletePost(postId) {
  return new Promise(function (resolve, reject) {
    Post.findOne({
      post_id: postId,
    }, function (err, post) {
      if (!err) {
        post.remove(function (err, data) {
          if (!err) {
            var eventData = JSON.parse(JSON.stringify(data));
            eventEmitter.emit('POST_DELETED', eventData);
            resolve(data);
          } else {
            reject(err);
          }
        });
      } else {
        reject(err);
      }
    });
  });
}


/**
 * This method updates the blog liked_by
 * @param postId , post id for which post liked_by to be updated
 * @param user , user(ex:MXXXXXXX@mindtree.com)
 * @returns result such as modified rows etc..,
 */
function unLikePost(user, postId) {

  var searchQuery = {};
  var updateQuery = {};
		searchQuery = {
    $and: [{
      liked_by: user.user_name
    }, {
        post_id: postId
      }]
		};
		updateQuery = {
    $pull: {
      liked_by: user.user_name
    }
		};
  var options = { new: true };

  return new Promise(function (resolve, reject) {
    Post.findOneAndUpdate(searchQuery, updateQuery, options, function (err, post) {
      if (!err) {
        resolve(post);
      } else {
        reject(err)
      }
    });
  });
}

/**
 * This method updates the blog liked_by
 * @param blogId , blog id for which blog liked_by to be updated
 * @param userName , username of the user (ex:MXXXXXXX@mindtree.com)
 * @returns result such as modified rows etc..,
 */
function likePost(user, postId) {

  var searchQuery = {};
  var updateQuery = {};
		searchQuery = {
    $and: [{
      liked_by: {
        $ne: user.user_name
      }
    }, {
        post_id: postId
      }]
		};
		updateQuery = {
    $push: {
      liked_by: user.user_name
    }
		};

  var options = { new: true };

  return new Promise(function (resolve, reject) {
    Post.findOneAndUpdate(searchQuery, updateQuery, options, function (err, post) {
      if (!err) {
        resolve(post);
      } else {
        reject(err)
      }
    });
  });
}
/**
 * get all the posts paginated
 */
function getAllPosts(nrOfBlogsToBeSkipped, nrOfBlogsToBeFetched) {
  return new Promise(function (resolve, reject) {
    Post.find({}).sort({
      created_at: 'desc'
    }).skip(nrOfBlogsToBeSkipped).limit(nrOfBlogsToBeFetched).populate(
      'created_by').exec(
      function (err, posts) {
        if (!err) {
          resolve(posts);
        } else {
          reject(err);
        }
      });
  });
}

/**
 * get the post by mongodb's id
 */
function getPostByObjId(id) {
  return new Promise(function (resolve, reject) {
    Post.find({
      _id: id
    }).populate(
      'created_by').exec(
      function (err, posts) {
        if (!err) {
          resolve(posts);
        } else {
          reject(err);
        }
      });
  });
}

function getTotalPostCountByAuthor(user) {
  return new Promise(function (resolve, reject) {
    Post.find({
      created_by: user._id
    })
      .count({}, function (err, count) {
        if (!err) {
          resolve(count);
        } else {
          reject(err);
        }
      });
  });
}


