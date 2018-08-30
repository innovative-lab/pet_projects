var constants = require('./constants.js');
var logger = require('../../logger.js');
var postModel = require("../dao/post.model.js");
var postMapper = require("./mappers/post.mapper.js");
var idGenerator = require('../common/id-generator.js');
var events = require('events');
var tagValidator = require("./validators/tag.validator.js");
var eventEmitter = new events.EventEmitter();
/**
 * this is responsible for exporting all the functionalities of blog service
 */
var postService = {
    /**
    * Event emitter for Posts
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
     * update likes of the post
     */
    updatePostLikes: updatePostLikes,
    /**
     * get all the posts.
     */
    getAllPosts: getAllPosts

}


/**
 * @param post, post object consists of all the info regarding post.
 */
function createPost(user, postInfo) {
    if (!user || !postInfo) {
        throw new Error("invalid input parameters");
    }
    var tagLength = true, tagValidation = true;
    for (var i = 0; i < postInfo.tags.length; i++) {
        if (postInfo.tags[i].length > constants.LENGTH_OF_EACH_TAG) {
            tagLength = false;
            break;
        }
    }
    for (var i = 0; i < postInfo.tags.length; i++) {
        if (!tagValidator.validateTag(postInfo.tags[i])) {
            tagValidation = false;
            break;
        }
    }
    if (postInfo.content !== null && postInfo.tags !== null && postInfo.tags.length <= constants.TOTAL_TAG && tagLength && tagValidation && postInfo.content.length < constants.POST_CONTENT_LENGTH) {
        var post = {};
        post.post_id = 'post_' + idGenerator.generateRandomId(10);
        post.created_by = user._id;
        post.content = postInfo.content;
        if (postInfo.fileName != undefined && postInfo.fileNoderef != undefined) {
            var file = { "ref": postInfo.fileNoderef, "name": postInfo.fileName }
            post.file = file;
        }
        post.tags = postInfo.tags;
        return new Promise(function (resolve, reject) {
            postModel.createPost(post)
                .then(function (result) {
                    var eventData = JSON.parse(JSON.stringify(result));
                    eventData.created_by = user;
                     console.log("------------------------- Before emittttttttttt event");
                    eventEmitter.emit('NEW-POST', eventData);
                    console.log("------------------------- Emiting post event",post.tags);
                    resolve(result);
                }).catch(function (err) {
                    reject(err);
                })
        });
    } else {
        throw new Error("invalid post input");
    }

}

/**
 * @param userId,userid of user who is deleting
 * @param postId,post id of post to be deleted.
 */
function deletePost(user, postId) {
    return new Promise(function (resolve, reject) {
        postModel.getPostById(postId).
            then(function (data) {
                if (data.created_by._id.toString() != user._id
                    .toString()) {
                    throw new Error("you dont have permission to delete others post");
                }
                postModel.deletePost(postId)
                    .then(function (result) {
                        var eventData = JSON.parse(JSON.stringify(result));
                        var created_by = user;
                        eventEmitter.emit('DELETE-POST', eventData, created_by);
                        resolve();
                    })
                    .catch(function (err) {
                        logger.error("could not delete post", err.stack);
                        reject(err);
                    });
            })
            .catch(function (err) {
                logger.error("unable to find post", err);
                reject(err);
            });
    })
}

/**
 * @param postId, post id of post
 * @param userName, username of user who performs like operation
 * @param isLiking, true or false based on whether unliking or unliking.
 */
function updatePostLikes(user, postId, likeValue) {
    var isLiking = (likeValue != undefined && likeValue == 0) ? false : true;
    return new Promise(function (resolve, reject) {
        if (isLiking) {
            postModel
                .likePost(user, postId)
                .then(
                function (post) {
                    var eventData = JSON.parse(JSON.stringify(post));
                    var created_by = user;
                    eventEmitter.emit('LIKE-POST', eventData, created_by);
                    logger.debug("post like", eventData);
                    resolve()
                }).catch(function (err) {
                    logger.error("could not like the blog", err.stack);
                    reject(err);
                });
        }
        else {
            postModel
                .unLikePost(user, postId)
                .then(
                function (post) {
                    var eventData = JSON.parse(JSON.stringify(post));
                    var created_by = user;
                    eventEmitter.emit('UNLIKE-POST', eventData, created_by);
                    resolve();
                }).catch(function (err) {
                    logger.error("could not unlike the post", err.stack);
                    reject(err);
                });
        }
    })
}

/**
 * get all the posts paginated
 */
function getAllPosts(user, pageNr, pageSize) {
    pageNr = validatePageNr(pageNr);
    pageSize = validatePageSize(pageSize);
    var nrOfResultsToBeSkipped = (pageNr - 1) * pageSize;
    var nrOfResults = pageSize;
    return new Promise(function (resolve, reject) {
        postModel.getAllPosts(nrOfResultsToBeSkipped, nrOfResults).then(function (posts) {
            var postsList = [];
            for (var i = 0; i < posts.length; i++) {
                var post = postMapper.detailedPostMapper(posts[i], user);
                postsList.push(post);
            }
            resolve(postsList);
        }).catch(function (err) {
            logger.error("coulnot fetch all posts");
            reject(err);
        });
    });
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

module.exports = postService;
