var events = require('events');
var eventEmitter = new events.EventEmitter();
var answerDao = {
	/**
* Event emitter for Discussions
*/
    eventEmitter: eventEmitter,
	allAnswers: getAllAnswers,
	getAnswersByDiscussionId: getAnswersByDiscussionId,
	getAnswerById: getAnswerById,
	createAnswer: createAnswer,
	saveAnswer: saveAnswer,
	getTotalAnswerCounts: getTotalAnswerCounts,
	getTotalAnswerCountsByAuthor: getTotalAnswerCountsByAuthor,
	deleteAnswerById: deleteAnswerById,
	deleteAnswerByIds: deleteAnswerByIds,
	getAnswerByObjId: getAnswerByObjId,

	/**
	 * Edits already created answer.
	 */
	editAnswer: editAnswer,

	/**
	 * Add a comment on a answer.
	 */
	addComment: addComment,

	/**
	 * Adds vote for answer
	 */
	addVote: addVote,

	/**
	 *  Removes vote for Answer
	 */
	removeVote: removeVote,

	/**
	 * Deletes the comment from Answer
	 */
	deleteComment: deleteComment,
	/**
	*/
	getAnswersByIds: getAnswersByIds
};

module.exports = answerDao;

var Promise = require("bluebird");
var mongoose = require("mongoose");
var logger = require('../../logger.js');
var Schema = mongoose.Schema;
var discussionModel = require("./discussion.model");
var answerHooks = require("./answer.hooks");
answerHooks.init();

var answerSchema = new Schema({
    "answer_id": {
        type: String,
        unique: true,
        required: true
    },
    "content": {
        type: String,
        required: true
    },
    "created_by": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
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
    "voted_by": [{
        type: String,
        required: true
    }],
    "tags": [{
		type: String,
		required: true
    }]
},
	{ timestamps: { createdAt: 'created_at', updatedAt: "updated_at" } });

var Answer = mongoose.model('answer', answerSchema);

/**
*/
function getAnswersByIds(ids) {
	return new Promise(function (resolve, reject) {
		Answer.find({
			_id: {
				"$in": ids
			}
		}).populate('created_by').exec(function (err, answers) {
			if (!err) {
				resolve(answers)
			} else {
				reject(err)
			}
		});
	});
}

function deleteComment(user, answerId, commentId) {
	var searchQuery = {
		answer_id: answerId
	};
	var updateQuery = {
		$pull: {
			'comments': {
				'comment_id': commentId,
				'created_by': user._id
			}
		}
	};
	var options = { new: false };
	return new Promise(function (resolve, reject) {
		Answer.findOne(searchQuery, function (err, data) {
			if (!err) {
				var commentsArray = data.comments;
				var comment;
				for (var i = 0; i < commentsArray.length; i++) {
					if (commentsArray[i].comment_id === commentId) {
						comment = commentsArray[i];
						break;
					}
				}
				Answer.update(searchQuery, updateQuery, options, function (err, data) {
					if (!err) {
						resolve(comment);
					} else {
						reject(err)
					}
				})
			} else {
				reject(err);
			}
		})
	});
}

function addVote(user, answerId) {
	var searchQuery = {
		$and: [{
			voted_by: {
				$ne: user.user_name
			}
		}, {
				answer_id: answerId
			}]
	};
	var updateQuery = {
		$push: {
			voted_by: user.user_name
		}
	};

	var options = { new: true };
	return new Promise(function (resolve, reject) {
		Answer.findOneAndUpdate(searchQuery, updateQuery, options, function (err, data) {
			if (!err) {
				resolve(data);
			} else {
				reject(err);
			}
		});
	});
}

function removeVote(user, answerId) {
	var searchQuery = {
		$and: [{
			voted_by: user.user_name
		}, {
				answer_id: answerId
			}]
	};
	var updateQuery = {
		$pull: {
			voted_by: user.user_name
		}
	};
	var options = { new: true };
	return new Promise(function (resolve, reject) {
		Answer.findOneAndUpdate(searchQuery, updateQuery, options, function (err, data) {
			if (!err) {
				resolve(data);
			} else {
				reject(err);
			}
		});
	});
}

function addComment(user, answerId, comment) {
	comment.created_at = Date.now();
	var searchQuery = { answer_id: answerId };
	var updateQuery = { $push: { 'comments': comment } };
	var options = { new: true };
	return new Promise(function (resolve, reject) {
		Answer.findOneAndUpdate(searchQuery, updateQuery, options, function (err, data) {
			if (!err) {
				resolve(data);
			} else {
				reject(err);
			}
		});
	});
}

function editAnswer(user, answerId, answer) {
	var searchQuery = {
		answer_id: answerId
	};
	var updateQuery = {
		$set: {
			content: answer.content,
			tags: answer.tags
		}
	};

	var options = { new: true };
	return new Promise(function (resolve, reject) {
		Answer.findOneAndUpdate(searchQuery, updateQuery, options, function (err, data) {
			if (!err) {
				var eventData = JSON.parse(JSON.stringify(data));
                eventEmitter.emit('ANSWER_UPDATED', eventData);
				resolve(data);
			} else {
				reject(err);
			}
		});
	});
}

function getAnswerByObjId(_id) {
	return new Promise(function (resolve, reject) {
		Answer.findOne({
			_id: _id
		}).populate('created_by')
			.exec(function (err, answer) {
				if (!err) {
					resolve(answer);
				} else {
					reject(err);
				}
			});
	});
}

/**
 *
 */
function saveAnswer(discussionId, newAnswer) {
	var answer = new Answer();
	answer.content = newAnswer.content;
	answer.tags = newAnswer.tags;
	answer.created_by = newAnswer.created_by;
	answer.answer_id = newAnswer.answer_id;

	return new Promise(function (resolve, reject) {
		answer.save(discussionId, function (err, data) {
			if (!err) {
				discussionModel.addAnswerId(discussionId, answer).then(function (err, answer) {
					var eventData = JSON.parse(JSON.stringify(data));
                    eventEmitter.emit('ANSWER_CREATED', eventData);
					console.log("Data", data);
					resolve(data);
				}).catch(function (err) {
					logger.error("could not add answer to the discussion", err.stack);
					reject(err);
				});

			} else {
				reject(err);
			}
		});
	});
}

function getAnswerById(answerId) {
	return new Promise(function (resolve, reject) {
		Answer.findOne({
			answer_id: answerId
		}).populate('created_by').populate('comments.created_by').exec(
			function (err, answer) {
				if (!err) {
					resolve(answer);
				} else {
					reject(err);
				}
			});
	});

}

/**
 * get Answer by Id
 */
function getAnswersByDiscussionId(discussionId) {
	return new Promise(function (resolve, reject) {
		discussionModel.getDiscussionByIdWithAnswerIds(discussionId)
			.then(
            function (data) {
				Answer.find({
					'_id': {
						$in: data.answers
					}
				}).populate('comments.created_by')
					.populate('created_by')
					.exec(function (err, answers) {
						if (!err) {
							resolve(answers);
						} else {
							reject(err);
						}

					});
            })
            .catch(function (err) {
                logger.error("could not get discussion", err.stack);
                reject(err);
            });
	});
}

/**
 * save the Answer.
 */
function createAnswer(answer) {
	return new Promise(function (resolve, reject) {
		Answer.create(answer, function (err) {
			if (!err) {
				resolve(answer);
			} else {
				reject(err);
			}
		});
	});
}
/**
 * get Total Count Of the Answers Posted.
 */
function getTotalAnswerCounts() {
	return new Promise(function (resolve, reject) {
		Answer.count({
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
 * get Total Count Of  Answers AnsweredBy by the User.
 */
function getTotalAnswerCountsByAuthor(user) {
	return new Promise(function (resolve, reject) {
		Answer.find(
			{
				created_by: user._id
			}
		).count({
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
 * get all the Answers.
 */
function getAllAnswers() {
	return new Promise(function (resolve, reject) {
		Answer.find({}).populate('created_by').populate('comments.created_by')
			.exec(function (err, Answers) {
				if (!err) {
					resolve(Answers);
				} else {
					reject(err);
				}
			});
	});
}


function deleteAnswerById(answerId) {
	return new Promise(function (resolve, reject) {
		Answer.findOne({ answer_id: answerId }, function (err, answerDoc) {
			if (!err) {
				answerDoc.remove(function (err, data) {
					if (!err) {
						var eventData = JSON.parse(JSON.stringify(data));
                        eventEmitter.emit('ANSWER_DELETED', eventData);
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
 *
 */
function deleteAnswerByIds(answerIds) {
	return new Promise(function (resolve, reject) {
		Answer.find({
			_id: {
				$in: answerIds
			}
		}, function (err, answerDocs) {
			if (!err) {
				var answerPromises = [];
				for (var i = 0; i < answerDocs.length; i++) {
					var answerPromise = new Promise(function (resolve, reject) {
						answerDocs[i].remove(function (err, data) {
							if (!err) {
								var eventData = JSON.parse(JSON.stringify(data));
								eventEmitter.emit('ANSWER_DELETED', eventData);
								logger.debug('Answer deleted with id ', data._id.toString());
								resolve(data);
							} else {
								logger.error('Unable to delete answer with id ', data._id.toString(), err);
								reject(err);
							}
						});
					});
					answerPromises.push(answerPromise);
				}
				Promise.all(answerPromises).then(function (data) {
					logger.debug(answerDocs.length + ' answers deleted');
					resolve();
				}).catch(function (err) {
					logger.error('Unable to delete all answers', err);
					reject(err);
				});
			} else {
				reject(err);
			}
		});
	});
}
