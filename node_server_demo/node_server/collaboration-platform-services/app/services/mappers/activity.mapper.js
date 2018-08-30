var userMapper = require("./user.mapper");
var nodeRefMapper = require("./nodeRef.mapper.js");
var activityMapper = {
    newBlogMapper : newBlogMapper,
    blogCommentMapper : blogCommentMapper,
    blogLikeMapper : blogLikeMapper,
    blogCommentDeleteMapper : blogCommentDeleteMapper,
    blogEditMapper : blogEditMapper,
    blogUnLikeMapper : blogUnLikeMapper,
    blogDeleteMapper : blogDeleteMapper,
    newDiscussionMapper : newDiscussionMapper,
    commentDiscussionMapper : commentDiscussionMapper,
    voteDiscussionMapper : voteDiscussionMapper,
    unvoteDiscussionMapper : unvoteDiscussionMapper,
    deleteDiscussionCommentMapper : deleteDiscussionCommentMapper,
    editDiscussionMapper : editDiscussionMapper,
    deleteDiscussionMapper : deleteDiscussionMapper,
    newAnswerMapper : newAnswerMapper,
    editAnswerMapper : editAnswerMapper,
    commentAnswerMapper : commentAnswerMapper,
    voteAnswerMapper : voteAnswerMapper,
    unvoteAnswerMapper : unvoteAnswerMapper,
    deleteAnswerCommentMapper : deleteAnswerCommentMapper,
    deleteAnswerMapper : deleteAnswerMapper,
    newPostMapper : newPostMapper,
    deletePostMapper : deletePostMapper,
    likePostMapper : likePostMapper,
    unlikePostMapper : unlikePostMapper,
    shortActivityMapper : shortActivityMapper
}
/**
 *  @activity activity object to be mapped
 *  @user user of the API
 */
function shortActivityMapper(activity, user) {
    var activityResponse = {};
    activityResponse.name = activity.name;
    activityResponse.content = activity.data;
    activityResponse.created_by = userMapper.userDetailsMapper(activity.created_by);
    activityResponse.created_at = activity.created_at;
    return activityResponse;
}
function newBlogMapper(activity) {
    var blogResponse = {};
    blogResponse.name = "NEW-PUBLISHED-BLOG";
    blogResponse.created_by = activity.created_by;
    blogResponse.data = {
        _id: activity._id.toString(),
        blog_id: activity.blog_id,
        title: activity.title,
        tags: activity.tags,
        created_at: activity.created_at
    };
    return blogResponse;
}
function blogCommentMapper(activity, created_by) {
    var blogCommentResponse = {};
    blogCommentResponse.name = "NEW-BLOG-COMMENT";
    blogCommentResponse.created_by = created_by;
    blogCommentResponse.data = {
        blog_id: activity.blog_id,
        _id: activity._id.toString(),
        title : activity.title,
        comments:
        {
            comment_id: activity.comment_id,
            created_at: activity.created_at,
            created_by: activity.created_by,
            content: activity.content
        }
    };
    return blogCommentResponse;
}
function blogLikeMapper(activity, created_by) {
    var blogLikeResponse = {};
    blogLikeResponse.name = "LIKE-BLOG";
    blogLikeResponse.created_by = created_by;
    blogLikeResponse.data = {
        blog_id: activity.blog_id,
        _id: activity._id.toString()
    };
    return blogLikeResponse;
}
function blogCommentDeleteMapper(activity, created_by) {
    var blogCommentDeleteResponse = {};
    blogCommentDeleteResponse.name = "DELETE-BLOG-COMMENT";
    blogCommentDeleteResponse.created_by = created_by;
    blogCommentDeleteResponse.data =  {
        blog_id: activity.blog_id,
        comments:
        {
            comment_id: activity.comment_id,
            created_at: activity.created_at,
            created_by: activity.created_by,
            content: activity.content
        }
    };
    return blogCommentDeleteResponse;
}
function blogEditMapper(activity, created_by) {
    var blogEditResponse = {};
    blogEditResponse.name = "EDIT-BLOG";
    blogEditResponse.created_by = created_by;
    blogEditResponse.data =
        {
            blog_id: activity.blog_id,
            _id: activity._id.toString(),
            title: activity.title,
            content: activity.content,
            created_by: activity.created_by,
            tags: activity.tags,
            status: activity.status
        };
    return blogEditResponse;
}
function blogUnLikeMapper(activity, created_by) {
    var blogUnlikeResponse = {};
    blogUnlikeResponse.name = "UNLIKE-BLOG";
    blogUnlikeResponse.created_by = created_by;
    blogUnlikeResponse.data = {
        blog_id: activity.blog_id,
        _id: activity._id.toString()
    };;
    return blogUnlikeResponse;
}
function blogDeleteMapper(activity, created_by) {
    var blogDeleteResponse = {};
    blogDeleteResponse.name = "DELETE-BLOG";
    blogDeleteResponse.created_by = created_by;
    blogDeleteResponse.data = activity;
    return blogDeleteResponse;
}
function newDiscussionMapper(activity) {
    var discussionResponse = {};
    discussionResponse.name = "NEW-PUBLISHED-DISCUSSION";
    discussionResponse.created_by = activity.created_by;
    discussionResponse.data = {
        _id: activity._id.toString(),
        discussion_id: activity.discussion_id,
        title: activity.title,
        tags : activity.tags,
        created_at: activity.created_at
    };
    return discussionResponse;
}
function commentDiscussionMapper(activity, created_by) {
    var discussionCommentResponse = {};
    discussionCommentResponse.name = "NEW-COMMENT-DISCUSSION";
    discussionCommentResponse.created_by = created_by;
    discussionCommentResponse.data = {
        discussion_id: activity.discussion_id,
        title: activity.title,
        _id: activity._id.toString(),
        comments:
        {
            comment_id: activity.comment_id,
            created_at: activity.created_at,
            created_by: activity.created_by,
            content: activity.content
        }
    };
    return discussionCommentResponse;
}
function voteDiscussionMapper(activity, created_by) {
    var discussionVoteResponse = {};
    discussionVoteResponse.name = "VOTE-DISCUSSION";
    discussionVoteResponse.created_by = created_by;
    discussionVoteResponse.data = {
        discussion_id: activity.discussion_id,
        _id: activity._id.toString()
    };;
    return discussionVoteResponse;
}
function unvoteDiscussionMapper(activity, created_by) {
    var discussionUnvoteResponse = {};
    discussionUnvoteResponse.name = "DISCUSSION-UNVOTE";
    discussionUnvoteResponse.created_by = created_by;
    discussionUnvoteResponse.data = {
        discussion_id: activity.discussion_id,
        _id: activity._id.toString()
    };
    return discussionUnvoteResponse;
}
function deleteDiscussionCommentMapper(activity, created_by) {
    var discussionDeleteCommentResponse = {};
    discussionDeleteCommentResponse.name = "DELETE-COMMENT-DISCUSSION";
    discussionDeleteCommentResponse.created_by = created_by;
    discussionDeleteCommentResponse.data = {
        discussion_id: activity.discussion_id,
        comments:
        {
            comment_id: activity.comment_id,
            created_at: activity.created_at,
            created_by: activity.created_by,
            content: activity.content
        }
    };
    return discussionDeleteCommentResponse;
}
function editDiscussionMapper(activity, created_by) {
    var discussionEditResponse = {};
    discussionEditResponse.name = "EDIT-DISCUSSION";
    discussionEditResponse.created_by = created_by;
    discussionEditResponse.data = {
        discussion_id: activity.discussion_id,
        _id: activity._id.toString(),
        title: activity.title,
        content: activity.content,
        created_by: activity.created_by,
        tags: activity.tags,
        status: activity.status
    };
    return discussionEditResponse;
}
function deleteDiscussionMapper(activity, created_by) {
    var discussionDeleteResponse = {};
    discussionDeleteResponse.name = "DELETE-DISCUSSION";
    discussionDeleteResponse.created_by = created_by;
    discussionDeleteResponse.data = activity;
    return discussionDeleteResponse;
}
function newAnswerMapper(discussion, activity) {
    var discussionResponse = {};
    discussionResponse.name = "NEW-ANSWER";
    discussionResponse.created_by = activity.created_by;
    discussionResponse.data = {
        answers : {
            answer_id: activity.answer_id,
            _id: activity._id.toString(),
            tags : activity.tags,
            created_at: activity.created_at
        },
        discussion_id: discussion.discussion_id,
        title: discussion.title
    };
    return discussionResponse;
}
function editAnswerMapper(activity, created_by) {
    var editAnswerResponse = {};
    editAnswerResponse.name = "EDIT-ANSWER";
    editAnswerResponse.created_by = created_by;
    editAnswerResponse.data = {
        answer_id: activity.answer_id,
        _id: activity._id.toString(),
        content: activity.content,
        created_by: activity.created_by,
        tags: activity.tags
    };;
    return editAnswerResponse;
}
function commentAnswerMapper(activity, created_by) {
    var commentAnswerResponse = {};
    commentAnswerResponse.name = "NEW-COMMENT-ANSWER";
    commentAnswerResponse.created_by = created_by;
    commentAnswerResponse.data = {
        answer_id: activity.answer_id,
        _id: activity._id.toString(),
        comments:
        {
            comment_id: activity.comment_id,
            created_at: activity.created_at,
            created_by: activity.created_by,
            content: activity.content
        }
    };
    return commentAnswerResponse;
}
function voteAnswerMapper(activity, created_by) {
    var voteAnswerResponse = {};
    voteAnswerResponse.name = "VOTE-ANSWER";
    voteAnswerResponse.created_by = created_by;
    voteAnswerResponse.data = {
        answer_id: activity.answer_id,
        _id: activity._id.toString()
    };
    return voteAnswerResponse;
}
function unvoteAnswerMapper(activity, created_by) {
    var unvoteAnswerResponse = {};
    unvoteAnswerResponse.name = "UNVOTE-ANSWER";
    unvoteAnswerResponse.created_by = created_by;
    unvoteAnswerResponse.data = {
        answer_id: activity.answer_id,
        _id: activity._id.toString()
    };
    return unvoteAnswerResponse;
}
function deleteAnswerCommentMapper(activity, created_by) {
    var deleteAnswerCommentResponse = {};
    deleteAnswerCommentResponse.name = "DELETE-ANSWER-COMMENT";
    deleteAnswerCommentResponse.created_by = created_by;
    deleteAnswerCommentResponse.data = activity;
    return deleteAnswerCommentResponse;
}
function deleteAnswerMapper(activity, created_by) {
    var deleteAnswerResponse = {};
    deleteAnswerResponse.name = "DELETE-ANSWER";
    deleteAnswerResponse.created_by = created_by;
    deleteAnswerResponse.data = activity;
    return deleteAnswerResponse;
}
function newPostMapper(activity) {
    var postResponse = {};
    var isLiked = false;
    postResponse.name = "NEW-POST";
    postResponse.created_by = activity.created_by;
    postResponse.data = {
        post_id: activity.post_id,
        content: activity.content,
        tags: activity.tags,
        _id : activity._id,
        likesCount: activity.liked_by.length,
        created_at: activity.created_at,
        isLiked: isLiked,
        file: {
            name: activity.file.name,
            ref: nodeRefMapper.mapNodeRef(activity.file.ref)
        }
    };
    return postResponse;
}
function deletePostMapper(activity, created_by) {
    var deletePostResponse = {};
    deletePostResponse.name = "DELETE-POST";
    deletePostResponse.created_by = created_by;
    deletePostResponse.data = activity;
    return deletePostResponse;
}
function likePostMapper(activity, created_by) {
    var likePostResponse = {};
    likePostResponse.name = "LIKE-POST";
    likePostResponse.created_by = created_by;
    likePostResponse.data =
        {
            post_id: activity.post_id,
            _id: activity._id.toString()
        };
    return likePostResponse;
}
function unlikePostMapper(activity, created_by) {
    var unlikePostResponse = {};
    unlikePostResponse.name = "UNLIKE-POST";
    unlikePostResponse.created_by = created_by;
    unlikePostResponse.data =
        {
            post_id: activity.post_id,
            _id: activity._id.toString()
        };
    return unlikePostResponse;
}
module.exports = activityMapper;