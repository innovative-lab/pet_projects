function setup(router, controllers) {
    /**
     * routes related to Blog.
     */
    router.get('/collab-services/apis/blogs', controllers.blogController.blogs);
    router.get('/collab-services/apis/blogs/:id', controllers.blogController.blogsById);
    router.post('/collab-services/apis/blogs/:blogId/comment', controllers.blogController.postComment);
    router.post('/collab-services/apis/blogs/:blogId/likeUnlike/:likeValue', controllers.blogController.likeUnlikeBlog);
    router.post('/collab-services/apis/blogs', controllers.blogController.createBlogPost);
    router.put('/collab-services/apis/blogs', controllers.blogController.editBlog);
    router.delete('/collab-services/apis/blogs/:blogId/comment/:commentId',controllers.blogController.deleteComment);
    router.get('/collab-services/apis/blogs/user/me', controllers.blogController.getBlogsForLoggedInUser);
    router.delete('/collab-services/apis/blogs/:id', controllers.blogController.deleteBlog);

    /**
     * routes related to user.
     */
    router.post('/collab-services/apis/users', controllers.userController.addUserInfo);
    router.get('/collab-services/apis/users', controllers.userController.getAllUsers);
    router.get('/collab-services/apis/userinfo', controllers.userController.getUserInfo);
    router.put('/collab-services/apis/userinfo/email', controllers.userController.updateEmail);
    router.put('/collab-services/apis/userinfo/profilepic', controllers.userController.updateProfilePic);
    router.get('/collab-services/apis/users/counts', controllers.userController.getTotalCountsByAuthor);
    router.post('/collab-services/apis/users/:username/followUnfollow/:followValue', controllers.userController.followUser);
    router.get('/collab-services/apis/users/followings', controllers.userController.getMyFollowingUsers);
    router.get('/collab-services/apis/users/mostFollowed', controllers.userController.getMostFollowedUsers);

    /**
     * routes related to admin
     */
    router.post('/collab-services/apis/categories/extract-tags', controllers.categoryController.extractTagsForContent);

    /**
     * routes related to discussion.
     */
    router.get('/collab-services/apis/discussions', controllers.discussionController.discussions);
    router.get('/collab-services/apis/discussions/:discussionId', controllers.discussionController.viewDiscussion);
    router.post('/collab-services/apis/discussions', controllers.discussionController.createDiscussion);
    router.put('/collab-services/apis/discussions', controllers.discussionController.editDiscussion);
    router.post('/collab-services/apis/discussions/:discussionId/comment',controllers.discussionController.postComment);
    router.post('/collab-services/apis/discussions/:discussionId/voteUnVote/:voteValue',controllers.discussionController.voteUnvoteDiscussion);
    router.delete('/collab-services/apis/discussions/:discussionId/comment/:commentId',controllers.discussionController.deleteComment);
    router.get('/collab-services/apis/discussions/user/me', controllers.discussionController.getAllDiscussionsForLoggedInUser);
    router.get('/collab-services/apis/discussions/user/:userName', controllers.discussionController.getPublishedDiscussionsOfUser);
    router.delete('/collab-services/apis/discussions/:discussionId', controllers.discussionController.deleteDiscussionById);

    /**
     * routes related to answers.
     */
    router.get('/collab-services/apis/answers/discussion/:discussionId',controllers.answerController.getAnswersForDiscussion);
    router.post('/collab-services/apis/answers/discussion/:discussionId',controllers.answerController.postAnswer);
    router.post('/collab-services/apis/answers/:answerId/comment', controllers.answerController.commentOnAnswer);
    router.post('/collab-services/apis/answers/:answerId/voteUnVote/:voteValue',controllers.answerController.voteUnvoteAnswer);
    router.delete('/collab-services/apis/answers/:answerId/comment/:commentId',controllers.answerController.deleteCommentForAnswer);
    router.put('/collab-services/apis/answers/:answerId', controllers.answerController.editAnswer);
    router.delete('/collab-services/apis/answers/:answerId', controllers.answerController.deleteAnswerById);

    /**
     * routes related to searches
     */
    router.get('/collab-services/apis/search/users', controllers.searchController.searchUsers);
    router.get('/collab-services/apis/search/blogs', controllers.searchController.searchBlogs);
    router.get('/collab-services/apis/search/discussions', controllers.searchController.searchDiscussions);
    router.get('/collab-services/apis/search', controllers.searchController.searchAll);
    router.get('/collab-services/apis/search/streams', controllers.searchController.searchStreams);
    /**
     * alfresco related services
     */
    router.get('/collab-services/apis/cms/uploadUrl', controllers.alfrescoController.alfrescoUploadUrl);
    router.get('/collab-services/apis/cms/downloadUrl/noderef/:noderef', controllers.alfrescoController.alfrescoUrlForFileDownload);

    /**
     * routes related to dashboard
     */
    router.get('/collab-services/apis/dashboard/counts', controllers.dashboardController.getTotalCounts);
    router.get('/collab-services/apis/dashboard/blogs/counts', controllers.dashboardController.getAllNAuthorBlogCounts);
    router.get('/collab-services/apis/dashboard/discussions/counts', controllers.dashboardController.getAllNAuthorDiscCounts);
    /**
     * routes related to Notifications
     */
    router.post('/collab-services/apis/notification/conferenceInvitation', controllers.notificationController.inviteUserForConference);

    /**
     * routes related to posts
     */
    router.post('/collab-services/apis/posts', controllers.postController.addPost);
    router.get('/collab-services/apis/posts', controllers.postController.getAllPosts);
    router.delete('/collab-services/apis/posts/:postId', controllers.postController.deletePost);
    router.post('/collab-services/apis/posts/:postId/likeUnlike/:likeValue',controllers.postController.likeUnlikePost);
    /**
     * routes related to streams
     */
    router.post('/collab-services/apis/streams/:streamName', controllers.streamController.create);
    router.get('/collab-services/apis/streams', controllers.streamController.getAllStreams);
    router.get('/collab-services/apis/streams/user/me', controllers.streamController.getStreamsByUser);
    router.put('/collab-services/apis/streams/:streamName/subscribeUnsubscribe/:isSubscribed', controllers.streamController.subscribeUnsubscribe);
    router.get('/collab-services/apis/streams/content/user/me', controllers.streamController.getSubscribedStreamContentForUser);
    router.get('/collab-services/apis/streams/mostSubscribed', controllers.streamController.getMostSubscribedStreams);
    router.get('/collab-services/apis/streams/mostUsed/counts', controllers.streamController.getMostUsedStreamsCount);

    /**
     * 
     */
    router.post('/collab-services/apis/channels',controllers.channelController.createChannel);
    router.get('/collab-services/apis/channels/user/:username',controllers.channelController.getChannelsByUser);
    router.get('/collab-services/apis/channels/me',controllers.channelController.getChannelsByLoggedInUser);
    router.post('/collab-services/apis/channels/:channelId/user/:username',controllers.channelController.addUserToChannel);
    router.delete('/collab-services/apis/channels/:channelId/user/:username',controllers.channelController.removeUserFromChannel);
    router.post('/collab-services/apis/channels/:channelId/messages',controllers.channelController.addMessageInChannel);
    router.get('/collab-services/apis/channels/:channelId/messages',controllers.channelController.getMessagesByChannel);
    router.get('/collab-services/apis/channels/:channelId/details',controllers.channelController.getChannelById);

    /**
     * routes related to activities
     */
        router.get('/collab-services/apis/activities/user/:username', controllers.activityController.activities);
    /**
    * routes related to Preview
    */
        router.get('/collab-services/apis/link/preview', controllers.linkPreviewController.linkPreview);
}


exports.setup = setup;
