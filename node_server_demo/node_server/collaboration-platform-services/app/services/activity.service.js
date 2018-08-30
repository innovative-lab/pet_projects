var Promise = require("bluebird");
var blogService = require("./blog.service");
var discussionService = require("./discussion.service");
var answerService = require("./answer.service");
var postService = require("./post.service");
var userService = require("./user.service");
var logger = require("../../logger.js");
var constants = require('./constants.js');
var activityModel = require("../dao/activity.model");
var userModel = require("../dao/user.model.js");
var activityMapper = require("./mappers/activity.mapper.js");

/**
 * this is responsible for exporting all the functionalities of activity service
 */
var activityService = {
        /**
  * this method is called on add new blog event.
  */
  newBlogListener: newBlogListener,
    /**
     * this method is called on add blog comment event.
     */
    newBlogCommentListener: newBlogCommentListener,

    /**
     * this method is called on like blog event.
     */
    likeBlogListener: likeBlogListener,
    /**
       * this method is called on unlike blog event.
       */
    unlikeBlogListener: unlikeBlogListener,
    /**
     * tthis method is called on delete blog event.
     */
    deleteBlogCommentListener: deleteBlogCommentListener,

    /**
     * this method is called on edit blog event.
     */
    editBlogListener: editBlogListener,

    /**
     * this method  is called on delete blog event.
     */
    deleteBlogListener: deleteBlogListener,
    /**
    * this method is called on add discussion comment event.
    */
    commentDiscussionListener: commentDiscussionListener,
    /**
  * this method is called on add new discussion event.
  */
    newDiscussionListener: newDiscussionListener,
    /**
     * this method is called on vote discussion event.
     */
    voteDiscussionListener: voteDiscussionListener,
    /**
       * this method is called on unvote discussion event.
       */
    unvoteDiscussionListener: unvoteDiscussionListener,
    /**
     * tthis method is called on delete discussion comment event.
     */
    deleteDiscussionCommentListener: deleteDiscussionCommentListener,

    /**
     * this method is called on edit discussion event.
     */
    editDiscussionListener: editDiscussionListener,

    /**
     * this method  is called on delete discussion event.
     */
    deleteDiscussionListener: deleteDiscussionListener,
    /**
    * this method  is called on new answer event.
    */
    newAnswerListener: newAnswerListener,
    /**
     * this method  is called on edit answer event.
     */
    editAnswerListener: editAnswerListener,

    /**
     * this method  is called on comment on answer event.
     */
    commentAnswerListener: commentAnswerListener,
    /**
    * this method  is called on vote answer event.
    */
    voteAnswerListener: voteAnswerListener,
    /**
     * this method  is called on unvote answer event.
     */
    unvoteAnswerListener: unvoteAnswerListener,
    /**
     * this method  is called on delete comment on answer event.
     */
    deleteAnswerCommentListener: deleteAnswerCommentListener,
    /**
     * this method  is called on delete answer event.
     */
    deleteAnswerListener: deleteAnswerListener,
    /**
    * this method  is called on new  post event.
    */
    newPostListener: newPostListener,
    /**
     * this method  is called on delete post event.
     */
    deletePostListener: deletePostListener,
    /**
* this method is called on like post event.
*/
    likePostListener: likePostListener,
    /**
       * this method is called on unlike post event.
       */
    unlikePostListener: unlikePostListener,
    /**
     * this method to get all activities.
     */
    getAllActivities: getAllActivities
}
/**
 * this method returns all published blogs.
 * @param pageNr, page number
 * @param pageSize, page size
 * @returns mapped activity list.
 */
function getAllActivities(username, pageNr, pageSize) {
    pageNr = (pageNr == undefined) ? 1 : pageNr;
    pageSize = (pageSize == undefined) ? constants.DEFAULT_NO_OF_RESULTS : pageSize;
    return new Promise(function (resolve, reject) {
        userModel.getUserByUsername(username)
            .then(function (userObj) {
                logger.debug("user activity info");
                activityModel.getAllActivities(userObj, (pageNr - 1) * pageSize, pageSize)
                    .then(function (activities) {
                        var activityList = activities.map(function (activity) {
                            return activityMapper.shortActivityMapper(activity, userObj);
                        });
                        resolve(activityList);
                    })
            })
            .catch(function (err) {
                reject(err);
            });
    });
}
/**
 *
 */
function newBlogListener(activity) {
    console.log("Inside new blog activity listener");
    return new Promise(function (resolve, reject) {
        var data = activityMapper.newBlogMapper(activity);
        activityModel.createActivity(data).then(function (result) {
            resolve(result);
        }).catch(function (err) {
            logger.error("could not listen to add blog event", err);
            reject(err);
        });
    })
}
/**
 *
 */
function newBlogCommentListener(activity, created_by) {
    return new Promise(function (resolve, reject) {
        var data = activityMapper.blogCommentMapper(activity, created_by);
        activityModel.createActivity(data).then(function (result) {
            logger.debug("activity added to db", created_by);
            resolve(result);
        }).catch(function (err) {
            logger.error("could not listen to add blog comment event", err);
            reject(err);
        });
    })
}

/**
 *
 */
function likeBlogListener(activity, created_by) {
    return new Promise(function (resolve, reject) {
        var data = activityMapper.blogLikeMapper(activity, created_by);
        activityModel.createActivity(data).then(function (result) {
            logger.debug("activity added to db");
            resolve(result);
        }).catch(function (err) {
            logger.error("could not listen to like blog listener", err);
            reject(err);
        });
    })
}
/**
 *
 */
function deleteBlogCommentListener(activity, created_by) {
    return new Promise(function (resolve, reject) {
        var data = activityMapper.blogCommentDeleteMapper(activity, created_by);
        activityModel.createActivity(data).then(function (result) {
            var activityName = "NEW-BLOG-COMMENT";
            var activityInfo = {
                blog_id: result.data.blog_id,
                comment_id: result.data.comments.comment_id,
                isActive: "false"
            }
            activityModel.deleteBlogCommentEvent(activityName, activityInfo).then(function () {
                resolve(result);
            }).catch(function (err) {
                logger.error("could not change status of new comment on blog on comment delete ", err);
                reject(err);
            });
        }).catch(function (err) {
            logger.error("could not listen to delete blog comment listener", err);
            reject(err);
        });
    })
}
/**
 *
 */
function editBlogListener(activity, created_by) {
    return new Promise(function (resolve, reject) {
        var data = activityMapper.blogEditMapper(activity, created_by);
        activityModel.createActivity(data).then(function (result) {
            logger.debug("activity added to db");
            resolve(result);
        }).catch(function (err) {
            logger.error("could not create blog in", err);
            reject(err);
        });
    })
}
/**
 *
 */
function unlikeBlogListener(activity, created_by) {
    return new Promise(function (resolve, reject) {
        var data = activityMapper.blogUnLikeMapper(activity, created_by);
        activityModel.createActivity(data).then(function (result) {
            logger.debug("activity added to db");
            resolve(result);
        }).catch(function (err) {
            logger.error("could not create blog in", err);
            reject(err);
        });
    })
}
/**
 *
 */
function deleteBlogListener(activity, created_by) {
    return new Promise(function (resolve, reject) {
        var data = activityMapper.blogDeleteMapper(activity, created_by);
        activityModel.createActivity(data).then(function (result) {
            var activityName = "NEW-PUBLISHED-BLOG";
            var activityInfo = {
                blog_id: result.data.blog_id,
                isActive: "false"
            }
            activityModel.deleteBlogEvent(activityName, activityInfo).then(function () {
            }).catch(function (err) {
                logger.error("could not change status of new comment on blog on comment delete ", err);
                reject(err);
            });
            var secondaryName = "NEW-BLOG-COMMENT";
            activityModel.deleteBlogCommentOnDeleteBlogEvent(secondaryName, activityInfo).then(function () {
            }).catch(function (err) {
                logger.error("error ", err);
                reject(err);
            });
            resolve(result);
        }).catch(function (err) {
            logger.error("could not create blog in", err);
            reject(err);
        });
    })
}
/**
 *
 */
function newDiscussionListener(activity) {
    return new Promise(function (resolve, reject) {
        var data = activityMapper.newDiscussionMapper(activity);
        activityModel.createActivity(data).then(function (result) {
            resolve(result);
        }).catch(function (err) {
            logger.error("could not listen to add discussion event", err);
            reject(err);
        });
    })
}
/**
 *
 */
function commentDiscussionListener(activity, created_by) {
    return new Promise(function (resolve, reject) {
        var data = activityMapper.commentDiscussionMapper(activity, created_by);
        activityModel.createActivity(data).then(function (result) {
            logger.debug("activity added to db");
            resolve(result);
        }).catch(function (err) {
            logger.error("could not create blog in", err);
            reject(err);
        });
    })
}
/**
 *
 */
function voteDiscussionListener(activity, created_by) {
    return new Promise(function (resolve, reject) {
        var data = activityMapper.voteDiscussionMapper(activity, created_by);
        activityModel.createActivity(data).then(function (result) {
            logger.debug("activity added to db");
            resolve(result);
        }).catch(function (err) {
            logger.error("could not create blog in", err);
            reject(err);
        });
    })
}
/**
 *
 */
function unvoteDiscussionListener(activity, created_by) {
    return new Promise(function (resolve, reject) {
        var data = activityMapper.unvoteDiscussionMapper(activity, created_by);
        activityModel.createActivity(data).then(function (result) {
            logger.debug("activity added to db");
            resolve(result);
        }).catch(function (err) {
            logger.error("could not create blog in", err);
            reject(err);
        });
    })
}
/**
 *
 */
function deleteDiscussionCommentListener(activity, created_by) {
    return new Promise(function (resolve, reject) {
        var data = activityMapper.deleteDiscussionCommentMapper(activity, created_by);
        activityModel.createActivity(data).then(function (result) {
            var activityName = "NEW-COMMENT-DISCUSSION";
            var activityInfo = {
                discussion_id: result.data.discussion_id,
                comment_id: result.data.comments.comment_id,
                isActive: "false"
            }
            activityModel.deleteDiscussionCommentEvent(activityName, activityInfo).then(function () {
                resolve(result);
            }).catch(function (err) {
                logger.error("could not change status of new comment on blog on comment delete ", err);
                reject(err);
            });
        }).catch(function (err) {
            logger.error("could not create blog in", err);
            reject(err);
        });
    })
}
/**
 *
 */
function editDiscussionListener(activity, created_by) {
    return new Promise(function (resolve, reject) {
        var data = activityMapper.editDiscussionMapper(activity, created_by);
        activityModel.createActivity(data).then(function (result) {
            logger.debug("activity added to db");
            resolve(result);
        }).catch(function (err) {
            logger.error("could not create blog in", err);
            reject(err);
        });
    })
}
/**
 *
 */
function deleteDiscussionListener(activity, created_by) {
    return new Promise(function (resolve, reject) {
        var data = activityMapper.deleteDiscussionMapper(activity, created_by);
        activityModel.createActivity(data).then(function (result) {

            logger.debug("im in deleteDiscussionListener");
            var activityName = "NEW-PUBLISHED-DISCUSSION";
            var activityInfo = {
                discussion_id: result.data.discussion_id,
                isActive: "false"
            }
            activityModel.deleteDiscussionEvent(activityName, activityInfo).then(function () {
            }).catch(function (err) {
                logger.error("could not change status of new comment on blog on comment delete ", err);
                reject(err);
            });
            var discussionComment = "NEW-COMMENT-DISCUSSION";
            activityModel.deleteDiscussionCommentonDeleteDiscussionEvent(discussionComment, activityInfo).then(function () {
            }).catch(function (err) {
                logger.error("error ", err);
                reject(err);
            });
            var answer = "NEW-ANSWER";
            activityModel.deleteAnswerOnDiscussionEvent(answer, activityInfo).then(function () {
                logger.debug("inside new answer on dlete disc");
            }).catch(function (err) {
                logger.error("error ", err);
                reject(err);
            });
            var commentsOnAnswer = "NEW-COMMENT-ANSWER";
            for (var i = 0; i < result.data.answers.length; i++) {
                answerInfo = {
                    id: result.data.answers[i],
                    isActive: "false"
                }
                logger.debug("in disc deleyte ans cmts", answerInfo);
                activityModel.deleteAnswerCommentsOnDeleteDiscussionEvent(commentsOnAnswer, answerInfo).then(function () {
                    logger.debug("deleted comments on ans on disc delete");
                }).catch(function (err) {
                    logger.error("error ", err);
                    reject(err);
                });
            }
            resolve(result);
        }).catch(function (err) {
            logger.error("could not create blog in", err);
            reject(err);
        });
    })
}
/**
 *
 */
function newAnswerListener(discussion, activity) {
    return new Promise(function (resolve, reject) {
        var data = activityMapper.newAnswerMapper(discussion, activity);
        activityModel.createActivity(data).then(function (result) {
            resolve(result);
        }).catch(function (err) {
            logger.error("could not listen to add answer event", err);
            reject(err);
        });
    })
}
/**
 *
 */
function editAnswerListener(activity, created_by) {
    return new Promise(function (resolve, reject) {
        var data = activityMapper.editAnswerMapper(activity, created_by);
        activityModel.createActivity(data).then(function (result) {
            resolve(result);
        }).catch(function (err) {
            logger.error("could not create blog in", err);
            reject(err);
        });
    })
}
/**
 *
 */
function commentAnswerListener(activity, created_by) {
    return new Promise(function (resolve, reject) {
        var data = activityMapper.commentAnswerMapper(activity, created_by);
        activityModel.createActivity(data).then(function (result) {
            resolve(result);
        }).catch(function (err) {
            logger.error("could not create blog in", err);
            reject(err);
        });
    })
}
/**
 *
 */
function voteAnswerListener(activity, created_by) {
    return new Promise(function (resolve, reject) {
        var data = activityMapper.voteAnswerMapper(activity, created_by);
        activityModel.createActivity(data).then(function (result) {
            resolve(result);
        }).catch(function (err) {
            logger.error("could not create blog in", err);
            reject(err);
        });
    })
}
/**
 *
 */
function unvoteAnswerListener(activity, created_by) {
    return new Promise(function (resolve, reject) {
        var data = activityMapper.unvoteAnswerMapper(activity, created_by);
        activityModel.createActivity(data).then(function (result) {
            resolve(result);
        }).catch(function (err) {
            logger.error("could not create blog in", err);
            reject(err);
        });
    })
}
/**
 *
 */
function deleteAnswerCommentListener(activity, created_by) {
    return new Promise(function (resolve, reject) {
        var data = activityMapper.deleteAnswerCommentMapper(activity, created_by);
        activityModel.createActivity(data).then(function (result) {
            var activityName = "NEW-COMMENT-ANSWER";
            var activityInfo = {
                answer_id: result.data.answer_id,
                comment_id: result.data.comment_id,
                isActive: "false"
            }
            activityModel.deleteAnswerCommentEvent(activityName, activityInfo).then(function () {
                resolve(result);
            }).catch(function (err) {
                logger.error("could not change status of new comment on blog on comment delete ", err);
                reject(err);
            });
        }).catch(function (err) {
            logger.error("could not create blog in", err);
            reject(err);
        });
    })
}
/**
 *
 */
function deleteAnswerListener(activity, created_by) {
    return new Promise(function (resolve, reject) {
        var data = activityMapper.deleteAnswerMapper(activity, created_by);
        activityModel.createActivity(data).then(function (result) {
            var activityName = "NEW-ANSWER";
            var activityInfo = {
                answer_id: result.data.answer_id,
                isActive: "false"
            }
            activityModel.deleteAnswerEvent(activityName, activityInfo).then(function () {
            }).catch(function (err) {
                logger.error("could not change status of new comment on blog on comment delete ", err);
                reject(err);
            });
            var secondaryName = "NEW-COMMENT-ANSWER";
            activityModel.deleteAnswerCommentOnDeleteAnswerEvent(secondaryName, activityInfo).then(function () {
            }).catch(function (err) {
                logger.error("error ", err);
                reject(err);
            });
            resolve(result);
        }).catch(function (err) {
            logger.error("could not create blog in", err);
            reject(err);
        });
    })
}
/**
 *
 */
function newPostListener(activity) {
    console.log("new post activity listener");
    return new Promise(function (resolve, reject) {
        var data = activityMapper.newPostMapper(activity);
        activityModel.createActivity(data).then(function (result) {
            resolve(result);
        }).catch(function (err) {
            logger.error("could not listen to add post event", err);
            reject(err);
        });
    })
}
/**
 *
 */
function deletePostListener(activity, created_by) {
    return new Promise(function (resolve, reject) {
        var data = activityMapper.deletePostMapper(activity, created_by);
        activityModel.createActivity(data).then(function (result) {
            var activityName = "NEW-POST";
            var activityInfo = {
                post_id: result.data.post_id,
                isActive: "false"
            }
            activityModel.deletePostEvent(activityName, activityInfo).then(function () {
                resolve(result);
            }).catch(function (err) {
                logger.error("could not listen to delete post event ", err);
                reject(err);
            });
        }).catch(function (err) {
            logger.error("could not create blog in", err);
            reject(err);
        });
    })
}
/**
 *
 */
function likePostListener(activity, created_by) {
    return new Promise(function (resolve, reject) {
        var data = activityMapper.likePostMapper(activity, created_by);
        activityModel.createActivity(data).then(function (result) {
            resolve(result);
        }).catch(function (err) {
            logger.error("could not like post", err);
            reject(err);
        });
    })
}
/**
 *
 */
function unlikePostListener(activity, created_by) {
    return new Promise(function (resolve, reject) {
        var data = activityMapper.unlikePostMapper(activity, created_by);
        activityModel.createActivity(data).then(function (result) {
            resolve(result);
        }).catch(function (err) {
            logger.error("could not unlike post", err);
            reject(err);
        });
    })
}
blogService.eventEmitter.addListener('NEW-PUBLISHED-BLOG', newBlogListener);
blogService.eventEmitter.addListener('NEW-BLOG-COMMENT', newBlogCommentListener);
blogService.eventEmitter.addListener('LIKE-BLOG', likeBlogListener);
blogService.eventEmitter.addListener('DELETE-BLOG-COMMENT', deleteBlogCommentListener);
blogService.eventEmitter.addListener('EDIT-BLOG', editBlogListener);
blogService.eventEmitter.addListener('UNLIKE-BLOG', unlikeBlogListener);
blogService.eventEmitter.addListener('DELETE-BLOG', deleteBlogListener);

discussionService.eventEmitter.addListener('NEW-PUBLISHED-DISCUSSION', newDiscussionListener);
discussionService.eventEmitter.addListener('NEW-COMMENT-DISCUSSION', commentDiscussionListener);
discussionService.eventEmitter.addListener('VOTE-DISCUSSION', voteDiscussionListener);
discussionService.eventEmitter.addListener('UNVOTE-DISCUSSION', unvoteDiscussionListener);
discussionService.eventEmitter.addListener('DELETE-COMMENT-DISCUSSION', deleteDiscussionCommentListener);
discussionService.eventEmitter.addListener('EDIT-DISCUSSION', editDiscussionListener);
discussionService.eventEmitter.addListener('DELETE-DISCUSSION', deleteDiscussionListener);

answerService.eventEmitter.addListener('NEW-ANSWER', newAnswerListener);
answerService.eventEmitter.addListener('EDIT-ANSWER', editAnswerListener);
answerService.eventEmitter.addListener('NEW-COMMENT-ANSWER', commentAnswerListener);
answerService.eventEmitter.addListener('VOTE-ANSWER', voteAnswerListener);
answerService.eventEmitter.addListener('UNVOTE-ANSWER', unvoteAnswerListener);
answerService.eventEmitter.addListener('DELETE-ANSWER-COMMENT', deleteAnswerCommentListener);
answerService.eventEmitter.addListener('DELETE-ANSWER', deleteAnswerListener);

postService.eventEmitter.addListener('NEW-POST', newPostListener);
postService.eventEmitter.addListener('DELETE-POST', deletePostListener);
postService.eventEmitter.addListener('LIKE-POST', likePostListener);
postService.eventEmitter.addListener('UNLIKE-POST', unlikePostListener);

module.exports = activityService;
