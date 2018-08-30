var logger = require("../../../logger.js");
var esConfig = require('../../../config/config').props().es;
var userMapper = require("../../services/mappers/user.mapper.js");
var underscore = require("underscore");
var nodeRefMapper = require("./nodeRef.mapper");

var streamMapper = {
    mapStream: mapStream,
    mapBlogToStreamResponse: mapBlogToStreamResponse,
    mapDiscussionToStreamResponse: mapDiscussionToStreamResponse,
    mapAnswerToStreamResponse: mapAnswerToStreamResponse,
    mapPostToStreamResponse: mapPostToStreamResponse
}

function mapStream(stream, userInfo) {
    var streamResponse = {};
    streamResponse.name = stream.name;
    streamResponse.isSubscribed = userInfo.subscribed_streams.indexOf(stream.name) >= 0;
    return streamResponse;
}

function mapBlogToStreamResponse(blog, streams, followings) {
    var response = {};
    response.type = "blogs";
    response.streams = streams;
    response.followings = followings;
    var blogResponse = {};
    blogResponse.blog_id = blog.blog_id;
    blogResponse.tags = blog.tags;
    blogResponse.created_by = userMapper.userShortMapper(blog.created_by);
    blogResponse.created_at = blog.created_at;
    blogResponse.views = blog.viewed_by.length;
    blogResponse.likesCount = blog.liked_by.length;
    blogResponse.title = blog.title;
    response.data = blogResponse;
    return response;
}

function mapDiscussionToStreamResponse(discussion, streams, followings) {
    var response = {};
    response.type = "discussions";
    response.streams = streams;
    response.followings = followings;
    var discussionResponse = {};
    discussionResponse.discussion_id = discussion.discussion_id;
    discussionResponse.tags = discussion.tags;
    discussionResponse.votesCount = discussion.voted_by.length;
    discussionResponse.answersCount = discussion.answers.length;
    discussionResponse.commentsCount = discussion.comments.length;
    discussionResponse.views = discussion.viewed_by.length;
    discussionResponse.created_at = discussion.created_at;
    discussionResponse.title = discussion.title;
    discussionResponse.status = discussion.status;
    discussionResponse.created_by = userMapper.userShortMapper(discussion.created_by);
    response.data = discussionResponse;
    return response;

}

function mapPostToStreamResponse(user, post, streams, followings) {
    var response = {};
    response.type = "posts";
    response.streams = streams;
    response.followings = followings;
    var postsResponse = {};
    postsResponse.post_id = post.post_id;
    postsResponse.content = post.content;
    postsResponse.tags = post.tags;
    postsResponse.likesCount = post.liked_by.length;
    postsResponse.created_by = userMapper.userShortMapper(post.created_by);
    postsResponse.created_at = post.created_at;
    postsResponse.isLiked = (post.liked_by.indexOf(user.user_name) != -1);
    postsResponse.file = {
        ref: nodeRefMapper.mapNodeRef(post.file.ref),
        name: post.file.name
    };
    response.data = postsResponse;
    return response;
}


function mapAnswerToStreamResponse(answer, discussion, streams, followings) {
    var response = {};
    response.type = "answers";
    response.streams = streams;
    response.followings = followings;
    var answersResponse = {};
    answersResponse.answer_id = answer.answer_id;
    answersResponse.created_at = answer.created_at;
    answersResponse.tags = answer.tags;
    answersResponse.created_by = userMapper.userShortMapper(answer.created_by);
    answersResponse.votesCount = answer.voted_by.length;
    answersResponse.discussion = {
        discussion_id: discussion.discussion_id,
        title: discussion.title
    };
    response.data = answersResponse;
    return response;
}




module.exports = streamMapper;
