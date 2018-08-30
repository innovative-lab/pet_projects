var blogModel = require("../dao/blog.model.js");
var userModel = require("../dao/user.model.js");
var tagValidator = require("./validators/tag.validator.js");
var blogMapper = require('./mappers/blog.mapper.js');
var constants = require('./constants.js');
var logger = require('../../logger.js');
var idGenerator = require('../common/id-generator.js');
var events = require('events');
var eventEmitter = new events.EventEmitter();

/**
 * this is responsible for exporting all the functionalities of blog service
 */
var blogService = {
    /**
     * Event emitter for Blogs
     */
    eventEmitter: eventEmitter,
    /**
     * this method returns all published blogs.
     */
    getAllPublishedBlogs: getAllPublishedBlogs,

    /**
     * this method returns blog by blogId.
     */
    getBlogById: getBlogById,

    /**
     * this method likes or unlikes the blog.
     */
    updateBlogLikes: updateBlogLikes,

    /**
     * this method creates the blog.
     */
    createBlog: createBlog,

    /**
     * this method add the comments to the blog.
     */
    addBlogComment: addBlogComment,

    /**
     * delete comment for blog id.
     */
    deleteCommentForBlog: deleteCommentForBlog,

    /**
     * edit blog.
     */
    editBlog: editBlog,

    /**
     * get blogs for loggedin user.
     */
    getBlogsForLoggedInUser: getBlogsForLoggedInUser,

    /**
     * delete the blog.
     */
    deleteBlog: deleteBlog,

}

/**
 * this method returns all published blogs.
 * @param pageNr, page number
 * @param pageSize, page size
 * @returns mapped blog list.
 */
function getAllPublishedBlogs(user, pageNr, pageSize) {
    pageNr = (pageNr == undefined) ? 1 : pageNr;
    pageSize = (pageSize == undefined) ? constants.DEFAULT_NO_OF_RESULTS : pageSize;
    if (!user || (parseInt(pageNr) != pageNr) || (parseInt(pageSize) != pageSize)) {
        throw new Error("invalid input parameters");
    }
    return new Promise(function (resolve, reject) {
        blogModel.getBlogsByStatus((pageNr - 1) * pageSize, pageSize, constants.PUBLISHED).then(function (blogs) {
            var blogList = blogs.map(function (blog) {
                return blogMapper.shortBlogMapper(blog, user);
            });
            resolve(blogList);
        }).catch(function (err) {
            reject(err);
        });
    });
}

/**
 *
 */
function getBlogById(user, blogId, viewValue) {
    if (!user || !blogId) {
        throw new Error("invalid input parameters");
    }
    var isIncrement = (viewValue != undefined && viewValue == 0) ? false : true;
    return new Promise(function (resolve, reject) {
        // Updating the blog views and retreiving the blog details are done independently (aync)
        if (isIncrement) {
            blogModel.updateBlogViews(blogId, user.user_name).then(function (data) {
            }).catch(function (err) {
                logger.error("could not update the blog views", err.stack);
            });
        }

        blogModel.getBlogById(blogId).then(function (blog) {
            var blogResult = blogMapper.detailedBlogMapper(blog, user);
            resolve(blogResult);
        }).catch(function (err) {
            logger.error("could not find the blog", err.stack);
            reject(err);
        });
    });
}

/**
 *
 */
function updateBlogLikes(user, blogId, likeValue) {
    if (!user || !blogId) {
        throw new Error("invalid input parameters");
    }
    var isLiking = (likeValue != undefined && likeValue == 0) ? false : true;
    return new Promise(function (resolve, reject) {
        if (isLiking) {
            blogModel
                .likeBlog(user, blogId)
                .then(
                function (blog) {
                    var eventData = JSON.parse(JSON.stringify(blog));
                    var created_by = user;
                    eventEmitter.emit('LIKE-BLOG', eventData, created_by);
                    resolve()
                }).catch(function (err) {
                    logger.error("could not like the blog", err.stack);
                    reject(err);
                });
        }
        else {
            blogModel
                .unlikeBlog(user, blogId)
                .then(
                function (blog) {
                    var eventData = JSON.parse(JSON.stringify(blog));
                    var created_by = user;
                    eventEmitter.emit('UNLIKE-BLOG', eventData, created_by);
                    resolve();
                }).catch(function (err) {
                    logger.error("could not unlike the blog", err.stack);
                    reject(err);
                });
        }
    })
}

/**
 *
 */
function createBlog(user, blog) {
    if (!user || !blog) {
        throw new Error("invalid input parameters");
    }
    var tagLength = true, tagValidation = true;
    for (var i = 0; i < blog.tags.length; i++) {
        if (blog.tags[i].length > constants.LENGTH_OF_EACH_TAG) {
            tagLength = false;
            break;
        }
    }
    for (var i = 0; i < blog.tags.length; i++) {
        if (!tagValidator.validateTag(blog.tags[i])) {
            tagValidation = false;
            break;
        }
    }
    if (blog.title !== null && blog.tags !== null && blog.content !== null && blog.tags.length <= constants.TOTAL_TAG && tagLength && tagValidation && blog.title.length < constants.BLOG_TITLE_LENGTH) {
        blog.blog_id = 'blog_' + idGenerator.generateRandomId(10);
        blog.created_by = user._id;
        return new Promise(function (resolve, reject) {
            blogModel.createBlog(blog).then(function (result) {
                if (result.status == constants.PUBLISHED) {
                    var eventData = JSON.parse(JSON.stringify(result));
                    eventData.created_by = user;
                    eventEmitter.emit('NEW-PUBLISHED-BLOG', eventData);
                }
                resolve();
            }).catch(function (err) {
                logger.error("could not create blog in", err);
                reject(err);
            });
        })
    } else {
        throw new Error("invalid blog input");
    }



}

/**
 *
 */
function addBlogComment(user, blogId, commentContent) {
    if (!user || !blogId || !commentContent) {
        throw new Error("invalid input parameters");
    }
    var comment = {};
    var commentId = idGenerator.generateRandomId(5);
    comment.comment_id = commentId;
    comment.content = commentContent;
    comment.created_by = user._id;
    comment.created_at = Date.now();

    return new Promise(function (resolve, reject) {
        blogModel.addBlogComment(blogId, comment)
            .then(function (result) {
                comment.title = result.title;
                var eventData = JSON.parse(JSON.stringify(comment));
                var created_by = user;
                eventData.blog_id = result.blog_id;
                eventData._id = result._id.toString();
                eventEmitter.emit('NEW-BLOG-COMMENT', eventData, created_by);
                resolve();
            }).then(undefined, function (err) {
                logger.error("could not insert comments", err.stack);
                reject(err);
            });
    })
}

function deleteCommentForBlog(user, blogId, commentId) {
    if (!user || !blogId || !commentId) {
        throw new Error("invalid input parameters");
    }
    return new Promise(function (resolve, reject) {
        blogModel.getCommentById(blogId, commentId)
            .then(function (comment) {
                if (comment.created_by.toString() == user._id.toString()) {
                    blogModel.deleteBlogComment(blogId, commentId, user._id)
                        .then(function (result) {
                            var eventData = JSON.parse(JSON.stringify(result));
                            eventData.blog_id = blogId;
                            var created_by = user;
                            eventEmitter.emit('DELETE-BLOG-COMMENT', eventData, created_by, blogId);
                            resolve();
                        }).then(undefined, function (err) {
                            logger.error("could not delete the comment", err);
                            reject(err);
                        });
                } else {
                    throw new Error("you dont have permission to delete others comments");
                }
            })
            .catch(function (err) {
                logger.error("could not get comment by id", err);
                reject(err);
            });
    });
}

function editBlog(user, blogInfo, blogId) {
    if (!user || !blogInfo || !blogId) {
        throw new Error("invalid input parameters");
    }
    var tagLength = true, tagValidation = true;
    for (var i = 0; i < blogInfo.tags.length; i++) {
        if (blogInfo.tags[i].length > constants.LENGTH_OF_EACH_TAG) {
            tagLength = false;
            break;
        }
    }
    for (var i = 0; i < blogInfo.tags.length; i++) {
        if (!tagValidator.validateTag(blogInfo.tags[i])) {
            tagValidation = false;
            break;
        }
    }
    if (blogInfo.title !== null && blogInfo.tags !== null && blogInfo.content !== null && blogInfo.tags.length <= constants.TOTAL_TAG && tagLength && tagValidation && blogInfo.title.length < constants.BLOG_TITLE_LENGTH) {
        return new Promise(function (resolve, reject) {
            blogModel.getBlogById(blogId).
                then(function (data) {
                    /**
                     * validation to check null values of the updated blog.
                     */
                    Object.keys(blogInfo).forEach(function (property) {
                        if (blogInfo[property] === undefined) {
                            throw property + " is undefined";
                        }
                    });

                    if (data.status === constants.PUBLISHED && blogInfo.status === constants.DRAFT) {
                        throw "cannot draft the blog which is already published";
                    }
                    if (data.created_by._id.toString() === user._id.toString()) {
                        return blogModel.updateBlogInfo(blogId, blogInfo);
                    } else {
                        throw "author is not same as editor"
                    }
                }).
                then(function (data) {
                    var eventData = JSON.parse(JSON.stringify(data));
                    var created_by = user;
                    eventEmitter.emit('EDIT-BLOG', eventData, created_by);
                    resolve();
                })
                .catch(function (err) {
                    reject(err);
                });
        })
    } else {
        throw new Error("invalid blog input");
    }

}

function getBlogsForLoggedInUser(user, pageNr, pageSize) {
    pageNr = (pageNr == undefined) ? 1 : pageNr;
    pageSize = (pageSize == undefined) ? constants.DEFAULT_NO_OF_RESULTS : pageSize;
    if (!user || (parseInt(pageNr) != pageNr) || (parseInt(pageSize) != pageSize)) {
        throw new Error("invalid input parameters");
    }
    return new Promise(function (resolve, reject) {
        blogModel.getPublicNDraftBlogsByUser(user._id, (pageNr - 1) * pageSize, pageSize)
            .then(function (blogs) {
                var blogList = blogs.map(function (blog) {
                    return blogMapper.shortBlogMapper(blog, blog.created_by);
                });
                resolve(blogList);
            }).catch(function (err) {
                logger.error("unable to get the blog written by user", err);
                reject(err);
            });
    })
}

function deleteBlog(user, blogId) {
    if (!user || !blogId) {
        throw new Error("invalid input parameters");
    }

    return new Promise(function (resolve, reject) {
        blogModel.getBlogById(blogId).
            then(function (data) {
                if (data.created_by._id.toString() != user._id
                    .toString()) {
                    throw new Error("No other user except the author can delete blog");
                }
                blogModel.deleteBlog(blogId)
                    .then(function (result) {
                        var eventData = JSON.parse(JSON.stringify(result));
                        var created_by = user;
                        eventEmitter.emit('DELETE-BLOG', eventData, created_by);
                        resolve();
                    })
                    .catch(function (err) {
                        logger.error("could not delete blog", err.stack);
                        reject(err);
                    });
            })
            .catch(function (err) {
                logger.error("unable to find blog", err);
                reject(err);
            });
    })
}


module.exports = blogService;
