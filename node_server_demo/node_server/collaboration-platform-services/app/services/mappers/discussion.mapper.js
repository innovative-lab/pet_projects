var userMapper = require("./user.mapper");

var discussionMapper = {
    shortDiscussionMapper : shortDiscussionMapper,
    detailedDiscussionMapper : detailedDiscussionMapper
}

/**
 * @discussion discussion object to be mapped
 *  @user user of the API
 */
function shortDiscussionMapper(discussion, user) {
    var discussionResponse = {};
    discussionResponse.discussion_id = discussion.discussion_id;
    discussionResponse.content = discussion.content;
    discussionResponse.tags = discussion.tags;
    discussionResponse.votesCount = discussion.voted_by.length;
    discussionResponse.answersCount = discussion.answers.length;
    discussionResponse.commentsCount = discussion.comments.length;
    discussionResponse.views = discussion.viewed_by.length;
    discussionResponse.created_at = discussion.created_at;
    discussionResponse.title = discussion.title;
    discussionResponse.status = discussion.status;
    discussionResponse.created_by = userMapper.userShortMapper(discussion.created_by);
    return discussionResponse;
}

/**
 * @discussion discussion object to be mapped
 *  @user user of the API
 */
function detailedDiscussionMapper(discussion, user) {
    var discussionDetailResponse = {};
    discussionDetailResponse.discussion_id = discussion.discussion_id;
    discussionDetailResponse.content = discussion.content;
    discussionDetailResponse.tags = discussion.tags;
    discussionDetailResponse.votesCount = discussion.voted_by.length;
    discussionDetailResponse.commentsCount = discussion.comments.length;
    discussionDetailResponse.comments = discussion.comments.map(function (comment) {
        return {
            comment_id: comment.comment_id,
            content: comment.content,
            created_by: userMapper.userShortMapper(comment.created_by),
            created_at: comment.created_at
        };
    });
    discussionDetailResponse.views = discussion.viewed_by.length;
    discussionDetailResponse.created_at = discussion.created_at;
    discussionDetailResponse.title = discussion.title;
    discussionDetailResponse.status = discussion.status;
    discussionDetailResponse.isVoted = discussion.voted_by.indexOf(user.user_name) >= 0;
    discussionDetailResponse.created_by = userMapper.userShortMapper(discussion.created_by);
    return discussionDetailResponse;
}

module.exports = discussionMapper;