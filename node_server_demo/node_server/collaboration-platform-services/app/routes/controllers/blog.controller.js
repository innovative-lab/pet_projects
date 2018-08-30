var blogService = require("../../services/blog.service");
var logger = require("../../../logger.js");
var Response = require("../response.js");
/**
 * Controller to do CRUD operations on blog.
 */
var blogController = {

	/**
	 * to get all blogs.
	 */
	blogs: getAllBlogs,
	/**
	 * to get blogs by id.
	 */
	blogsById: getBlogById,
	/**
	 * to like the blog
	 */
	likeUnlikeBlog: likeUnlikeBlog,
	/**
	 * create the blog post.
	 */
	createBlogPost: createBlogPost,
	/**
	 * post a comment for a blog.
	 */
	postComment: postCommentForBlog,
	/**
	 * delete a comment for a blog.
	 */
	deleteComment: deleteCommentForBlog,
	/**
	 * edit a blog.
	 */
	editBlog: editBlog,

	/**
	 * get all blogs (published and drafts) for logged in users
	 */
	getBlogsForLoggedInUser: getBlogsForLoggedInUser,

	/**
	 * delete a blog
	 */
	deleteBlog: deleteBlog
}

/**
 * get all the blogs request url : /collab-services/blogs
 */
function getAllBlogs(req, res) {
	var pageNr = req.query.pno;
	var pageSize = req.query.psize;
	var response = new Response();
	var user = req.userInfo;

    blogService.getAllPublishedBlogs(user, pageNr, pageSize).then(function (blogs) {
		response.data.blogs = blogs;
		response.status.statusCode = '200';
		response.status.message = 'fetched the blogs';
		res.status(200).send(response);
	}).catch(function (err) {
		logger.error("unable to fetch the blogs", err);
		response.status.statusCode = '500';
		response.status.message = 'unable to fetch blogs ' + err;
		res.status(500).send(response);
	})
}

/**
 * req = { "blog_id":"", "comment":"", "user_id:"" }
 */
function postCommentForBlog(req, res) {
	var response = new Response();
	var blogId = req.params.blogId;
	logger.debug("Got request post a comment on blog blogId=", blogId);
	var commentContent = req.body.comment;
	var user = req.userInfo;
	blogService.addBlogComment(user, blogId, commentContent)
		.then(function () {
			response.status.statusCode = '201';
			response.status.message = 'Comment posted successfully.';
			res.status(201).send(response);
		}).then(undefined, function (err) {
			logger.error("could not insert comment", err);
			response.status.statusCode = '500';
			response.status.message = 'could not insert the comment';
			res.status(500).send(response);
		});
}


/**
 * req = { "blog_id":"", "comment_id":"", "user_id:"" }
 */
function deleteCommentForBlog(req, res) {
	var response = new Response();
	var blogId = req.params.blogId;
	var commentId = req.params.commentId;
	var user = req.userInfo;
	blogService.deleteCommentForBlog(user, blogId, commentId)
		.then(function () {
			response.status.statusCode = '200';
			response.status.message = 'successfully deleted comment';
			res.status(200).send(response);
		}).then(undefined, function (err) {
			logger.error("could not delete the comment", err);
			response.status.statusCode = '500';
			response.status.message = 'could not delete the comment -' + err;
			res.status(500).send(response);
		});
}


/**
 * get blog by id. request url : /collab-services/blogs/:blog_id
 */
function getBlogById(req, res) {
	var blogId = req.params.id;
	logger.debug("Got request to get blog by blogId=", blogId);
	var user = req.userInfo;
	var viewValue = req.query.viewValue;
	var response = new Response();
    blogService.getBlogById(user, blogId, viewValue).then(function (blog) {
		response.data.blog = blog;
		response.status.statusCode = '200';
		response.status.message = 'fetched blog successfully';
		res.status(200).send(response);
	}).catch(function (err) {
		logger.error("could not find the blog", err.stack);
		response.status.statusCode = '500';
		response.status.message = 'could not find the blog';
		res.status(500).send(response);
	})
}


/**
 *
 */
function likeUnlikeBlog(req, res) {
	var response = new Response();
	var blogId = req.params.blogId;
	logger.debug("Got request to like/unlike blog blogId=", blogId);
	var likeValue = req.params.likeValue;
	var user = req.userInfo;
	blogService.updateBlogLikes(user, blogId, likeValue).then(function (result) {
		logger.debug("modified the blog likes");
        response.status.statusCode = '200';
		response.status.message = 'like unlike success';
		res.status(200).send(response);
	}).catch(function (err) {
		logger.error("could not like the blog", err);
		response.status.statusCode = '500';
		response.status.message = 'could not like/unlike the blog';
		res.status(500).send(response);
	})
}

/**
 * Edit A Blog.
 */

function editBlog(req, res) {
	var response = new Response();
	var blogId = req.query.blogId;
	var user = req.userInfo;
	var blogInfo = req.body;
	blogService.editBlog(user, blogInfo, blogId).then(function () {
		response.status.statusCode = '200';
		response.status.message = 'edited blog post successfully';
		res.status(200).send(response);
    }).catch(function (err) {
		logger.error("could not edit blog", err);
		response.status.statusCode = '500';
		response.status.message = 'could not edit the blog post ' + err;
		res.status(500).send(response);

	})
}

/**
 * create blog req { title:"Intro to node", created_by:"user_id", //stored when he
 * logs in content:"demystifying the node", category:["technlogy"],
 * tags:["javascript","node","server-side"] }
 */
function createBlogPost(req, res) {
	var response = new Response();
	var user = req.userInfo;
    var blog = req.body;
	blogService.createBlog(user, blog).then(function () {
        response.status.statusCode = '201';
		response.status.message = 'created blog post successfully';
		res.status(201).send(response);
	}).catch(function (err) {
		logger.error("could not create blog", err);
		response.status.statusCode = '500';
		response.status.message = 'could not create the blog post';
		res.status(500).send(response);
	})
}

function getBlogsForLoggedInUser(req, res) {
	var pageNr = req.query.pno;
	var pageSize = req.query.psize;

	var response = new Response();
	var user = req.userInfo;
	blogService.getBlogsForLoggedInUser(user, pageNr, pageSize)
		.then(function (blogs) {
			response.data.blogs = blogs;
			response.status.statusCode = '200';
			response.status.message = 'fetched blogs written by user';
			res.status(200).send(response);
		}).catch(function (err) {
			logger.error("unable to get the blog written by user", err);
			response.status.statusCode = '404';
			response.status.message = 'unable to get the blogs written by user' + err;
			res.status(201).send(response);
		});
}

/**
 * Delete A Blog.
 */
function deleteBlog(req, res) {
	var response = new Response();
	var blogId = req.params.id;
	var user = req.userInfo;
	blogService.deleteBlog(user, blogId).then(function () {
		response.status.statusCode = '204';
		response.status.message = 'blog deleted successfully';
		res.status(204).send(response);
	}).catch(function (err) {
        logger.error("could not delete blog", err.stack);
		response.status.statusCode = '500';
		response.status.message = 'could not delete the blog post';
		res.status(500).send(response);
	})
}

module.exports = blogController;
