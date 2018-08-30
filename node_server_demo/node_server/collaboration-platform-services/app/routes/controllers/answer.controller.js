var logger = require("../../../logger.js");
var Response = new require("../response.js");
var answerService = require("../../services/answer.service.js");

/**
 *
 */
var answerController = {
	/**
	 * post the answer
	 */
	postAnswer : postAnswer,

	/**
	 * Edits answer.
	 */
	editAnswer : editAnswer,
	/**
	 * gets anwers for a particular discussion id.
	 */
	getAnswersForDiscussion : getAnswersForDiscussion,
	/**
	 * comment to a answer.
	 */
	commentOnAnswer : commentOnAnswer,
	/**
	 * vote/unvote the answer
	 */
	voteUnvoteAnswer : voteUnvoteAnswer,

	/**
	 * delete comment for a answer.
	 */
	deleteCommentForAnswer : deleteCommentForAnswer,

	/**
	 * delete answer
	 */
	deleteAnswerById : deleteAnswerById
}


/**
 *
 */
function getAnswersForDiscussion(req, res) {
	var user = req.userInfo;
	var response = new Response();
	var discussionId = req.params.discussionId;
	answerService
		.getAnswersByDiscussionId(user, discussionId)
		.then(
		function (answers) {
			response.data.answers = answers;
			response.status.statusCode = '200';
			response.status.message = 'fetched answers for discussion id';
			res.status(200).send(response);
		}).catch(function (err) {
			logger.error("could not get discussion by id", err);
			response.status.statusCode = '404';
			response.status.message = 'could not get the answers';
			res.status(404).send(response);
		});
}

/**
 *
 */
function postAnswer(req, res) {
	var response = new Response();
	var user = req.userInfo;
	var discussionId = req.params.discussionId;
	var answer = req.body;

	answerService.postAnswer(user, discussionId, answer)
		.then(function () {
			response.status.statusCode = '200';
			response.status.message = 'posted answer for discussion id';
			res.status(200).send(response);
		}).catch(function (err) {
			logger.error("could not post answer", err.stack);
			response.status.statusCode = '500';
			response.status.message = 'could not post answer for discussion';
			res.status(500).send(response);
		});

}

function editAnswer(req, res) {
	var response = new Response();
	var answerId = req.params.answerId;
	var answer = req.body;
	var user = req.userInfo;

	answerService.editAnswer(user, answerId, answer)
		.then(function () {
			response.status.statusCode = '200';
			response.status.message = 'updated answer for answer id';
			res.status(200).send(response);
		}).catch(function (err) {
			logger.error("could not edit answer", err.stack);
			response.status.statusCode = '500';
			response.status.message = 'could not edit answer';
			res.status(500).send(response);
		});
}
/**
 *
 */
function commentOnAnswer(req, res) {
	var response = new Response();
	var answerId = req.params.answerId;
	var commentContent = req.body.comment;
	var user = req.userInfo;

	answerService.addComment(user, answerId, commentContent)
		.then(function (result) {
			response.status.statusCode = '200';
			response.status.message = 'created comment for the answer';
			res.status(200).send(response);
		}).catch(function (err) {
			logger.error("could not post comment", err.stack);
			response.status.statusCode = '500';
			response.status.message = 'could not comment on answer';
			res.status(500).send(response);
		});
}

function voteUnvoteAnswer(req, res) {
	var response = new Response();
	var answerId = req.params.answerId;
	var voteValue = req.params.voteValue;
	var user = req.userInfo;

	answerService.voteUnvoteAnswer(user, answerId, voteValue).then(function () {
		response.status.statusCode = '201';
		response.status.message = 'updated the votes of the answer';
		res.status(200).send(response);
	}).catch(function (err) {
		logger.error("could not add/remove vote", err);
		response.status.statusCode = '500';
		response.status.message = 'could not the vote the answer';
		res.status(500).send(response);
	});

}
/**
 * delete comment on  the Answer.
 */
function deleteCommentForAnswer(req, res) {
	var response = new Response();
	var answerId = req.params.answerId;
	var commentId = req.params.commentId;
	var user = req.userInfo;

	answerService.deleteComment(user, answerId, commentId).then(function () {
		response.status.statusCode = '200';
		response.status.message = 'deleted comments for answers';
		res.status(200).send(response);
	}).catch(function (err) {
		logger.error("could not delete answer", err);
		response.status.statusCode = '500';
		response.status.message = 'could not delete comments for answers';
		res.status(500).send(response);
	});
}

/**
 * Delete An Answer.
 */

function deleteAnswerById(req, res) {
	var response = new Response();
	var answerId = req.params.answerId;
	var user = req.userInfo;

	answerService.deleteAnswer(user, answerId)
		.then(function () {
			response.status.statusCode = '204';
			response.status.message = 'answer deleted successfully';
			res.status(204).send(response);
		})
		.then(undefined, function (err) {
			logger.error("could not delete answer", err.stack);
			response.status.statusCode = '500';
			response.status.message = 'could not delete the answer';
			res.status(500).send(response);
		});
}

module.exports = answerController;
