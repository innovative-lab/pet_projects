var blogModel = require("../dao/blog.model.js");
var discussionModel = require("../dao/discussion.model.js");
var answerModel = require("../dao/answer.model.js");
var postModel = require("../dao/post.model.js");
var Promise = require("bluebird");
var logger = require('../../logger');

/**
 * 
 */
var dashboardService = {
    /**
     * get all the counts of blogs,discussions,answers.
     */
    getTotalCounts : getTotalCounts,
    /**
     * get count of all blogs and blogs for a user.
     */
    getAllNAuthorBlogCounts : getAllNAuthorBlogCounts,
    /**
     * get count of all discussions and discussions for user.
     */
    getAllNAuthorDiscCounts : getAllNAuthorDiscCounts

}

/**
 * 
 */
function getTotalCounts() {
    var blogCountPromise = blogModel.getTotalBlogCounts();
    var discCountPromise = discussionModel.getTotalDiscussionCounts();
    var ansCountPromise = answerModel.getTotalAnswerCounts();
    var postCountPromise = postModel.getTotalPostCounts();
    return Promise.join(blogCountPromise, discCountPromise, ansCountPromise,postCountPromise, function (blogCount, discCount, ansCount,postCount) {
        var count = {};
        count.answer_counts = ansCount;
        count.blog_counts = blogCount;
        count.discussion_counts = discCount;
        count.post_counts=postCount;
        return count;
    }).catch(function (err) {
        logger.error("could not get the totalCounts", err.stack);
        throw "errr";
    })
}

/**
 * 
 */
function getAllNAuthorBlogCounts(user) {
    return new Promise(function (resolve, reject) {
        blogModel.countAllNAuthorBlogs(user._id).then(function (counts) {
            resolve(counts);
        }).catch(function (err) {
            logger.error("could not get the count", err);
            reject(err);
        });
    })
}

/**
 * 
 */
function getAllNAuthorDiscCounts(user) {
    return new Promise(function (resolve, reject) {
        discussionModel.countAllNAuthorDiscussions(user._id).then(function (counts) {
            resolve(counts);
        }).catch(function (err) {
            logger.error("could not get the count", err)
            reject(err);
        });
    })
}

module.exports = dashboardService;