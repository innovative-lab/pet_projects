var userMapper = require("./user.mapper");

var blogMapper =  {
    /**
     * maps the blog object from monogdb to required fields for the response.
     */
    shortBlogMapper : shortBlogMapper,
    /**
     * maps the blog object to mongodb to required fields
     */
    detailedBlogMapper : detailedBlogMapper
}

/**
 *  @blog blog object to be mapped
 *  @user user of the API
 */
function shortBlogMapper(blog, user) {
    var blogResponse = {};
    blogResponse.blog_id = blog.blog_id;
    blogResponse.content = blog.content;
    blogResponse.tags = blog.tags;
    blogResponse.likesCount = blog.liked_by.length;
    blogResponse.commentsCount = blog.comments.length;
    blogResponse.created_by = userMapper.userShortMapper(blog.created_by);
    blogResponse.views = blog.viewed_by.length;
    blogResponse.created_at = blog.created_at;
    blogResponse.title = blog.title;
    blogResponse.status = blog.status;
    return blogResponse;
}

/**
 * @blog blog object to be mapped
 *  @user user of the API
 */
function detailedBlogMapper(blog, user) {
    var blogDetailResponse = {};
    blogDetailResponse.blog_id = blog.blog_id;
    blogDetailResponse.content = blog.content;
    blogDetailResponse.tags = blog.tags;
    blogDetailResponse.likesCount = blog.liked_by.length;
    blogDetailResponse.commentsCount = blog.comments.length;
    blogDetailResponse.comments = blog.comments.map(function (comment) {
        return {
            comment_id: comment.comment_id,
            content: comment.content,
            created_by: userMapper.userShortMapper(comment.created_by),
            created_at: comment.created_at
        };
    });
    blogDetailResponse.created_by = userMapper.userShortMapper(blog.created_by);
    blogDetailResponse.views = blog.viewed_by.length;
    blogDetailResponse.created_at = blog.created_at;
    blogDetailResponse.title = blog.title;
    blogDetailResponse.status = blog.status;
    blogDetailResponse.isLiked = blog.liked_by.indexOf(user.user_name) >= 0;
    return blogDetailResponse;
}


module.exports = blogMapper;
