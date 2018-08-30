var userMapper = require("./user.mapper");


var answerMapper = {
    detailedAnswerMapper : detailedAnswerMapper,
    answerWithDiscussionMapper : answerWithDiscussionMapper
}

function detailedAnswerMapper(answer, user) {
    var answersResponse = {};
    answersResponse.answer_id = answer.answer_id;
    answersResponse.content = answer.content;
    answersResponse.votesCount = answer.voted_by.length;
    answersResponse.created_at = answer.created_at;
    answersResponse.comments = answer.comments.map(function (comment) {
        return {
            comment_id: comment.comment_id,
            content: comment.content,
            created_by: userMapper.userShortMapper(comment.created_by),
            created_at: comment.created_at
        };
    });
    answersResponse.tags = answer.tags;
    answersResponse.isVoted = answer.voted_by.indexOf(user.user_name) >= 0;
    answersResponse.created_by = userMapper.userShortMapper(answer.created_by);
    return answersResponse;
}

function answerWithDiscussionMapper(answer, discussion, user) {
    var answersResponse = {};
    answersResponse.answer_id = answer.answer_id;
    answersResponse.content = answer.content;
    answersResponse.votesCount = answer.voted_by.length;
    answersResponse.created_at = answer.created_at;
    answersResponse.tags = answer.tags;
    answersResponse.isVoted = answer.voted_by.indexOf(user.user_name) >= 0;
    answersResponse.created_by = userMapper.userShortMapper(answer.created_by);
    answersResponse.discussion = {
        discussion_id: discussion.discussion_id,
        title: discussion.title
    };
    return answersResponse;
}

module.exports = answerMapper;