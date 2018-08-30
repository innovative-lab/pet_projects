var events = require('events');
var eventEmitter = new events.EventEmitter();
var blogDao = {
	/**
   * Event emitter for Blogs
   */
    eventEmitter: eventEmitter,
    /**
	 * get blog by blogid.
	 */
	getBlogById: getBlogById,
    /**
	 * get total blog counts.
	 */
	getTotalBlogCounts: getTotalBlogCounts,
	/**
	 * get the count of the blogs for a user.
	 */
	getTotalBlogCountsByAuthor: getTotalBlogCountsByAuthor,
	/**
	 * get blogs for set of tags.
	 */
	blogsByTags: blogsByTags,
	/**
	 * get blogs grouped by category.
	 */
	categoriesWithBlogCount: categoriesWithBlogCount,
    /**
	 * get blogs which are tagged for tags.
	 */
	getAllBlogsWithTags: getAllBlogsWithTags,
	/**
	 * create a blog.
	 */
	createBlog: createBlog,
	/**
	 * returns the count of all and author blogs
	 */
	countAllNAuthorBlogs: countAllNAuthorBlogs,
    /**
	 * delete the blog.
	 */
    deleteBlog: deleteBlog,
    /**
	 * get all published and drafted blogs.
	 */
    getPublicNDraftBlogsByUser: getPublicNDraftBlogsByUser,
    /**
	 * get the blogs by mongodbs object id
	 */
	getBlogByObjId: getBlogByObjId,
	/**
	 * get all the blogs which are published
	 */
	getBlogsByStatus: getBlogsByStatus,
	/**
	 * update the blog views.
	 */
	updateBlogViews: updateBlogViews,
	/**
	 * update the blog likes.
	 */
	likeBlog: likeBlog,
	/**
     * update the blog likes.
    */
	unlikeBlog: unlikeBlog,
	/**
	 * update the blog info such as title,content etc.,
	 */
	updateBlogInfo: updateBlogInfo,
	/**
	 * update the comments of the blogs.
	 */
	addBlogComment: addBlogComment,
	/**
	 * delete the comments of the blog iff commented author is trying to delete.
	 */
	deleteBlogComment: deleteBlogComment,

	/**
	*
	*/
	getBlogsByIds: getBlogsByIds,

	/**
	 * Get a comment by commend id and blog id
	 */
	getCommentById: getCommentById
};
module.exports = blogDao;

var Promise = require("bluebird");
var constants = require('../services/constants.js');
var logger = require('../../logger.js');
var mongoose = require("mongoose");
var blogHooks = require("./blog.hooks");
var Schema = mongoose.Schema;
blogHooks.init();
var blogSchema = new Schema({
    "blog_id": {
        type: String,
        required: true,
        unique: true
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
    "liked_by": [{
        type: String,
        required: true
    }],
    "tags": [{
        type: String,
        required: true
    }],
    "viewed_by": [{
        type: String,
        required: true
    }]
    ,
    "status": {
		type: String,
		enum: ['DRAFT', 'PUBLISHED'],
		required: true,
		default: 'PUBLISHED'
    }
},
	{ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

var Blog = mongoose.model('Blog', blogSchema);

function getBlogsByIds(ids) {

	return new Promise(function (resolve, reject) {
		Blog.find({
			_id: {
				"$in": ids
			}
		}).populate("created_by").exec(function (err, blogs) {
			if (!err) {
				resolve(blogs);
			} else {
				reject(err)
			}
		});
	});
}

/**
 * This method deletes the comments only it is commented by the same user.
 * @param blogId, blog id of the comment to be deleted
 * @param commentId, comment id to be deleted
 * @param _id, mongodb's generated id.
 * @returns result such as modified rows etc..,
 */
function deleteBlogComment(blogId, commentId, _id) {
	var searchQuery = {
		'blog_id': blogId,
		'comments.comment_id': commentId,
		'comments.created_by': _id
	}
	var updateQuery = {
		$pull: {
			'comments': {
				'comment_id': commentId
			}
		}
	};
	var options = { new: false };

	return new Promise(function (resolve, reject) {
		Blog.findOne(searchQuery, function (err, blog) {
			if (!err) {
				var commentsArray = JSON.parse(JSON.stringify(blog.comments));
				var comment;
				for (var i = 0; i < commentsArray.length; i++) {
					if (commentsArray[i].comment_id === commentId) {
						comment = commentsArray[i];
						blog.comments.splice(i, 1);
						break;
					}
				}
				Blog.update(searchQuery, updateQuery, options, function (err, blog) {
					if (!err) {
						resolve(comment);
					} else {
						reject(err)
					}
				})
			} else {
				reject(err);
			}
		});
	});
}

/**
 * This method adds the comments to the blog collection
 * @param blogId, blogId for which comment to be added.
 * @param commentContent, commented text
 * @returns result such as modified rows etc..,
 */
function addBlogComment(blogId, comment) {
   	var searchQuery = { blog_id: blogId };
	var updateQuery = { $push: { 'comments': comment } };

	var options = { new: true };

	return new Promise(function (resolve, reject) {
		Blog.findOneAndUpdate(searchQuery, updateQuery, options, function (err, blog) {
			if (!err) {
				resolve(blog);
			} else {
				reject(err)
			}
		});
	});
}

/**
 * This method updates the blog content,title,tags
 * @param blogId , blog id for which blog details to be updated
 * @param blogInfo , bloginfo is a object which consists of title,content,tags,status
 * @returns result such as modified rows etc..,
 */
function updateBlogInfo(blogId, blogInfo) {
	var searchQuery = { "blog_id": blogId };
	var updateQuery = {
		$set: {
			title: blogInfo.title,
			content: blogInfo.content,
			tags: blogInfo.tags,
			status: blogInfo.status
		}
	};
	var options = { new: true };

	return new Promise(function (resolve, reject) {
		Blog.findOneAndUpdate(searchQuery, updateQuery, options, function (err, blog) {
			if (!err) {
				var eventData = JSON.parse(JSON.stringify(blog));
				eventEmitter.emit('BLOG_UPDATED', eventData);
				resolve(blog);
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
 * @param isLiking , isLiking = true ,if user liked the blog : false,if user unliked the blog
 * @returns result such as modified rows etc..,
 */
function unlikeBlog(user, blogId) {

	var searchQuery = {};
	var updateQuery = {};
	searchQuery = {
		$and: [{
			liked_by: user.user_name
		}, {
				blog_id: blogId
			}]
	};
	updateQuery = {
		$pull: {
			liked_by: user.user_name
		}
	};
	var options = { new: true };

	return new Promise(function (resolve, reject) {
		Blog.findOneAndUpdate(searchQuery, updateQuery, options, function (err, blog) {
			if (!err) {
				resolve(blog);
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
 * @param isLiking , isLiking = true ,if user liked the blog : false,if user unliked the blog
 * @returns result such as modified rows etc..,
 */
function likeBlog(user, blogId) {

	var searchQuery = {};
	var updateQuery = {};
	searchQuery = {
		$and: [{
			liked_by: {
				$ne: user.user_name
			}
		}, {
				blog_id: blogId
			}]
	};
	updateQuery = {
		$push: {
			liked_by: user.user_name
		}
	};

	var options = { new: true };

	return new Promise(function (resolve, reject) {
		Blog.findOneAndUpdate(searchQuery, updateQuery, options, function (err, blog) {
			if (!err) {
				resolve(blog);
			} else {
				reject(err)
			}
		});
	});
}

/**
 * This method updates the blog viewed_by.
 * @param blogId , blog id for which blog viewed_by to be updated
 * @param userName , username of the user (ex:MXXXXXXX@mindtree.com)
 * @returns result such as modified rows etc..,
 */
function updateBlogViews(blogId, userName) {
	var searchQuery = {
		$and: [{
			viewed_by: {
				$ne: userName
			}
		}, {
				blog_id: blogId
			}]
	};
	var updateQuery = {
		$push: {
			viewed_by: userName
		}
	};
	var options = { new: true };

	return new Promise(function (resolve, reject) {
		Blog.findOneAndUpdate(searchQuery, updateQuery, options, function (err, blog) {
			if (!err) {
				resolve(blog);
			} else {
				reject(err)
			}
		});
	});
}

/**
 * this method fetches paginated blog results.
 * @param nrOfBlogsToBeSkipped, blogs to be skipped
 * @param nrOfBlogsToBeFetched, blog results to be fetched
 * @returns the published blogs.
 */
function getBlogsByStatus(nrOfBlogsToBeSkipped, nrOfBlogsToBeFetched, status) {
	return new Promise(function (resolve, reject) {
		var query = { status: status };
		var populateFields = 'created_by';
        Blog.find(query)
			.sort({ created_at: 'desc' })
			.populate(populateFields)
			.skip(nrOfBlogsToBeSkipped)
			.limit(nrOfBlogsToBeFetched)
			.exec(function (err, blog) {
				if (!err) {
					resolve(blog);
				} else {
					reject(err);
				}
			})
	})
}

/**
 * this method returns blog by object id.
 * @parma _id, mongodb's generated blog id.
 */
function getBlogByObjId(id) {
	return new Promise(function (resolve, reject) {
		Blog.findOne({
			_id: id
		}).populate('created_by')
			.exec(function (err, blog) {
				if (!err) {
					resolve(blog);
				} else {
					reject(err);
				}
			});
	});
}

/**
 * get Blog by Id
 */
function getBlogById(blogId, filterColumns) {
	if (filterColumns === null) {
		filterColumns = {};
	}
	return new Promise(function (resolve, reject) {
		Blog.findOne({
			blog_id: blogId
		}, filterColumns).populate('created_by').populate('comments.created_by')
			.exec(function (err, blog) {
				if (!err) {
					resolve(blog);
				} else {
					reject(err);
				}
			});
	});
}

/**
 * save the blog.
 */
function createBlog(blog) {
	return new Promise(function (resolve, reject) {
		Blog.create(blog, function (err, data) {
			if (!err) {
				var eventData = JSON.parse(JSON.stringify(data));
				eventEmitter.emit('BLOG_CREATED', eventData);
				resolve(data);
			} else {
				reject(err);
			}
		});
	});
}
/**
 * get Total Count Of  published blogs in system.
 */
function getTotalBlogCounts() {
	return new Promise(function (resolve, reject) {
		Blog.count({
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
 * get Total Count Of  published blogs by the User.
 */
function getTotalBlogCountsByAuthor(user) {
	return new Promise(function (resolve, reject) {
		Blog.find()
			.and([{
				created_by: user._id
			}, {
					status: "PUBLISHED"
				}]).count({}, function (err, count) {
					if (!err) {
						resolve(count);
					} else {
						reject(err);
					}
				});
	});
}

/**
 * get all published blogs in system.
 */
function getAllBlogs(nrOfBlogsToBeSkipped, nrOfBlogsToBeFetched) {
	return new Promise(function (resolve, reject) {
		var query = {};
		query.status = 'PUBLISHED';
		Blog.find(query).sort({
			created_at: 'desc'
		}).skip(nrOfBlogsToBeSkipped).limit(nrOfBlogsToBeFetched).populate(
			'created_by').populate('comments.created_by').exec(
			function (err, blogs) {
				if (!err) {
					resolve(blogs);
				} else {
					reject(err);
				}
			});
	});
}

/**
 * get all published + draft blogs for a user.
 */
function getPublicNDraftBlogsByUser(userId, nrOfBlogsToBeSkipped,
	nrOfBlogsToBeFetched) {

	return new Promise(function (resolve, reject) {
		Blog.find({
			created_by: userId
		}).skip(nrOfBlogsToBeSkipped).limit(nrOfBlogsToBeFetched).sort({
			created_at: 'desc'
		}).populate(
			'created_by').exec(
			function (err, blogs) {
				if (!err) {
					resolve(blogs);
				} else {
					reject(err);
				}
			});
	});
}

function blogsByTags(tags, nrOfBlogsToBeSkipped, nrOfBlogsToBeFetched) {
	return new Promise(function (resolve, reject) {

		Blog.find({
			tags: {
				"$in": tags
			}
		}).skip(nrOfBlogsToBeSkipped).limit(nrOfBlogsToBeFetched).sort({
			created_at: 'desc'
		}).populate(
			'created_by').populate('comments.created_by').exec(
			function (err, blogs) {
				if (!err) {
					resolve(blogs);
				} else {
					reject(err);
				}
			});
	});
}

function categoriesWithBlogCount(categories) {
	var i = -1;
	return new Promise(function (resolve, reject) {
		var resultList = [];
		var categoriesList = [];
		var next = function () {
			i++;
			if (i < categories.length) {
				Blog.count({
					tags: {
						"$in": categories[i].tags
					}
				}, function (err, blogsCount) {
					var categoriesResponse = {};
					categoriesResponse.category = categories[i].category;
					categoriesResponse.description = categories[i].description;
					categoriesResponse.number_of_posts = blogsCount;
					categoriesResponse.tags = categories[i].tags;
					categoriesList.push(categoriesResponse);
					if (err) {
						reject(err);
					} else {
						next();
					}
				});
			} else {
				resolve(categoriesList);
			}
		};
		next();
	});
}

function getAllBlogsWithTags() {
	return new Promise(function (resolve, reject) {
		Blog.find({}, 'tags').exec(function (err, blogs) {
			if (!err) {
				resolve(blogs);
			} else {
				reject(err);
			}
		});
	});
}

/**
 *
 */
function deleteBlog(blogId) {
	return new Promise(function (resolve, reject) {
		Blog.findOne({ blog_id: blogId }, function (err, blogDoc) {
            if (!err) {
				blogDoc.remove(function (err, data) {
					if (!err) {
						var eventData = JSON.parse(JSON.stringify(data));
                        eventEmitter.emit('BLOG_DELETED', eventData);
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

function countAllNAuthorBlogs(userId) {
	return new Promise(function (resolve, reject) {

		Blog.aggregate(
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

function getCommentById(blogId, commentId) {
	var searchQuery = {
		'blog_id': blogId,
		'comments.comment_id': commentId
	}
	return new Promise(function (resolve, reject) {
		Blog.findOne(searchQuery, { 'comments.$': 1 }, function (err, result) {
			if (!err) {
				resolve(result.comments[0]);
			} else {
				reject(err);
			}
		});
	});
}