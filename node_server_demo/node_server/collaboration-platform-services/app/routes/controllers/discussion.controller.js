var Response = new require("../response.js");
var logger = require('../../../logger.js');
var config = require("../../../config/config").props().discussions;
var discussionService = require('../../services/discussion.service');

/**
 * declaring the all the functionalities.
 *
 * @returns
 */
var discussionController =  {
	/**
	 * get all the discussions.
	 */
	discussions : getAllDiscussions,
	/**
	 * Gets a discussion for viewing
	 */
	viewDiscussion : viewDiscussion,
	/**
	 * add the discussion.
	 */
	createDiscussion : createDiscussion,
	/**
	 * post comment to the discussion.
	 */
	postComment : postCommentToDiscussion,
	/**
	 * up vote the discussion.
	 */
	voteUnvoteDiscussion : voteUnvoteDiscussion,
	/**
	 * delete comment to the discussion.
	 */
	deleteComment : deleteCommentInDiscussion,
	/**
	 * edit a discussion.
	 */
	editDiscussion : editDiscussion,
	/**
	 *
	 */
	getPublishedDiscussionsOfUser : getPublishedDiscussionsOfUser,
	/**
	 * Get discussions for logged-in user
	 */
	getAllDiscussionsForLoggedInUser : getAllDiscussionsForLoggedInUser,
	/**
	 * Delete discussion
	 */
	deleteDiscussionById : deleteDiscussionById
}

/**
 * Edits a already created discussion.
 */

function editDiscussion(req, res) {
	var response = new Response();
	var discussionId = req.query.discussionId;
	var user = req.userInfo;
	discussionService.editDiscussion(user, discussionId, req.body).
		then(function () {
			response.status.statusCode = '200';
			response.status.message = 'edited discussion successfully';
			res.status(200).send(response);
		})
		.catch(function (err) {
			logger.error("could not edit discussion", err.stack);
			response.status.statusCode = '500';
			response.status.message = 'could not edit the discussion';
			res.status(500).send(response);
		});
}
/**
 * create Discussion
 */
function createDiscussion(req, res) {
	var user = req.userInfo;
	var discussion = req.body;
	var response = new Response();

	discussionService.createDiscussion(user, discussion)
		.then(function (data) {
			response.status.statusCode = '201';
			response.status.message = 'created discussion successfully';
			res.status(201).send(response);
		}).catch(function (err) {
			logger.error("could not add discussion", err.stack);
			response.status.statusCode = '500';
			response.status.message = 'could not add discussion';
			res.status(500).send(response);
		});
}

/**
 * get all the Forums.
 */
function getAllDiscussions(req, res) {
	var pageNr = req.query.pno;
	var pageSize = req.query.psize;
	var user = req.userInfo;

	var response = new Response();

	discussionService
		.getPublishedDiscussions(user, pageNr, pageSize)
		.then(function (discussionList) {
			response.data.discussions = discussionList;
			response.status.statusCode = '200';
			response.status.message = 'fetched all discussions';
			res.status(200).send(response);
		})
		.catch(function (err) {
			logger.error("could not find discussions", err.stack);
			response.status.statusCode = '500';
			response.status.message = 'could not find discussions';
			res.status(500).send(response);
		});
}

/**
 * Gets a discussion for viewing.
 */
function viewDiscussion(req, res) {
	var user = req.userInfo;
	var response = new Response();
	var discussionId = req.params.discussionId;
	var viewValue = req.query.viewValue;
	discussionService.viewDiscussion(user, discussionId, viewValue).
		then(function (discussion) {
			response.data.discussion = discussion;
			response.status.statusCode = '200';
			response.status.message = 'fetch discussion for a particular id';
			res.status(200).send(response);
		}).catch(function (err) {
			logger.error("could not get discussion by id", err);
			response.status.statusCode = '404';
			response.status.message = 'could not get the discussion by id';
			res.status(500).send(response);
		});
}

/**
 * post comment to a discussion
 */
function postCommentToDiscussion(req, res) {
	var response = new Response();
	var discussionId = req.params.discussionId;
	var commentContent = req.body.comment;
	var user = req.userInfo;

	discussionService.postCommentToDiscussion(user, discussionId, commentContent)
		.then(function () {
			response.status.statusCode = '201';
			response.status.message = 'fetched comments for the discussions';
			res.status(201).send(response);
		}).catch(function (err) {
			logger.error("could not post comment", err.stack);
			response.status.statusCode = '500';
			response.status.message = 'could not post comment';
			res.status(500).send(response);
		});
}

/**
 * vote or unvote the Discussion.
 */
function voteUnvoteDiscussion(req, res) {
	var response = new Response();
	var discussionId = req.params.discussionId;
	var voteValue = req.params.voteValue;
	var user = req.userInfo;

	discussionService
		.voteUnvoteDiscussion(user, discussionId, voteValue)
		.then(
		function () {
			response.status.statusCode = '200';
			response.status.message = 'updated the votes of the discussion';
			res.status(200).send(response);
		}).catch(function (err) {
			logger.error("could not vote the discussion", err.stack);
			response.status.statusCode = '500';
			response.status.message = 'could not vote the discussion';
			res.status(500).send(response);
		});
}

/**
 * delete comment on  the Discussion.
 */
function deleteCommentInDiscussion(req, res) {
	var response = new Response();
	var discussionId = req.params.discussionId;
	var commentId = req.params.commentId;
	var user = req.userInfo;

	discussionService
		.removeCommentInDiscussion(user, discussionId, commentId)
		.then(
		function () {
			response.status.statusCode = '200';
			response.status.message = 'comment deleted successfully';
			res.status(200).send(response);
		}).catch(function (err) {
			logger.error("could not delete the comment", err.stack);
			response.status.statusCode = '500';
			response.status.message = 'could not delete the comment';
			res.status(500).send(response);
		});
}

/**
 * get the discussions for user.
 */
function getPublishedDiscussionsOfUser(req, res) {
	var pageNr = req.query.pno;
	var pageSize = req.query.psize;
	var userName = req.params.userName;
	var response = new Response();
	var user = req.userInfo;

	discussionService.getPublishedDiscussionsOfUser(user, userName, pageNr, pageSize)
		.then(function (discussionList) {
			response.data.discussions = discussionList;
			response.status.statusCode = '200';
			response.status.message = 'fetched discussions written by user';
			res.status(200).send(response);
		}).catch(function (err) {
			response.status.statusCode = '404';
			response.status.message = 'unable to get the discussions writtern by user';
			res.status(200).send(response);
		});

}

function getAllDiscussionsForLoggedInUser(req, res) {
	var pageNr = req.query.pno;
	var pageSize = req.query.psize;
	var response = new Response();
	var user = req.userInfo;

	discussionService.getAllDiscussionsOfUser(user, pageNr, pageSize)
		.then(function (discussionList) {
			response.data.discussions = discussionList;
			response.status.statusCode = '200';
			response.status.message = 'fetched discussions written by user';
			res.status(200).send(response);
		}).catch(function (err) {
			response.status.statusCode = '404';
			response.status.message = 'unable to get the discussions writtern by user';
			res.status(200).send(response);
		});
}

function deleteDiscussionById(req, res) {
	var response = new Response();
	var discussionId = req.params.discussionId;
	var user = req.userInfo;

	discussionService.deleteDiscussion(user, discussionId).
		then(function () {
			response.status.statusCode = '204';
			response.status.message = 'discussion deleted successfully';
			res.status(204).send(response);
		})
		.catch(function (err) {
			logger.error("could not delete discussion", err.stack);
			response.status.statusCode = '500';
			response.status.message = 'could not delete the discussion post';
			res.status(500).send(response);
		});
}

module.exports = discussionController;
