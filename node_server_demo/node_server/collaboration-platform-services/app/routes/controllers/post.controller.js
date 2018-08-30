var postService = require('../../services/post.service');
var Response = require("../response.js");
var logger = require("../../../logger.js");
var Promise = require("bluebird");

var postController = {
	/**
	 * add post.
	 */
    addPost : addPost,
	/**
	 * get all the users.
	 */
    getAllPosts : getAllPosts,
	/**
	 * returns the userinfo.
	 */
    likeUnlikePost : likeUnlikePost,
    /**
	 * update the profile pics noderef and filename.
	 */
    deletePost : deletePost
}

/**
 *
 */
function addPost(req, res) {
    var response = new Response();
    var user = req.userInfo;
    postService.createPost(user, req.body).then(function (result) {
        response.status.statusCode = '200';
        response.status.message = 'created the post';
        res.status(200).send(response);
    }).catch(function (err) {
        response.status.statusCode = '500';
        response.status.message = 'couldnot add the post ' + err;
        res.status(500).send(response);
    })
}

/**
 *
 */
function getAllPosts(req, res) {
    var response = new Response();
    var pageNr = req.query.pno;
    var pageSize = req.query.psize;
    var user = req.userInfo;
    postService.getAllPosts(user, pageNr, pageSize).then(function (posts) {
        response.data.posts = posts;
        response.status.statusCode = '200';
        response.status.message = 'fetched posts';
        res.status(200).send(response);
    }).catch(function (err) {
        logger.error("unable to get all posts", err);
        response.status.statusCode = '500';
        response.status.message = 'could not get all the posts ' + err;
        res.status(500).send(response);
    })
}

/**
 *
 */
function likeUnlikePost(req, res) {
    var response = new Response();
    var user = req.userInfo;
    var postId = req.params.postId;
    var likeValue = req.params.likeValue;
    postService.updatePostLikes(user, postId, likeValue).then(function (result) {
        response.status.statusCode = '200';
        response.status.message = 'updated likes successfully';
        res.status(200).send(response);
    }).catch(function (err) {
        logger.error("unable to like/unlike posts", err);
        response.status.statusCode = '500';
        response.status.message = 'unable to like/unlike posts';
        res.status(500).send(response);
    })
}

/**
 *
 */
function deletePost(req, res) {
    var response = new Response();
    var user = req.userInfo;
    var postId = req.params.postId;
    postService.deletePost(user, postId).then(function (result) {
        response.status.statusCode = '200';
        response.status.message = 'deleted the post';
        res.status(200).send(response);
    }).catch(function (err) {
        logger.error("unable to delete the post", err);
        response.status.statusCode = '500';
        response.status.message = 'unable to delete the post';
        res.status(500).send(response);
    })
}

module.exports = postController;
