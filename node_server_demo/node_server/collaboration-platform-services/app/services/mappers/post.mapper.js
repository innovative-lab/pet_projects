var userMapper = require("./user.mapper");
var nodeRefMapper = require("./nodeRef.mapper.js");

var postMapper =  {
    detailedPostMapper : detailedPostMapper
}

function detailedPostMapper(post, user) {
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
    return postsResponse;
}

module.exports = postMapper;
