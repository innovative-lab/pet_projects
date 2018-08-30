var userModel = require("../dao/user.model.js");
var blogModel = require("../dao/blog.model.js");
var discussionModel = require("../dao/discussion.model.js");
var answerModel = require("../dao/answer.model.js");
var postModel = require("../dao/post.model.js");
var userMapper = require("./mappers/user.mapper.js");
var constants = require('./constants.js');
var Promise = require("bluebird");
var logger = require('../../logger.js');

var userService = {
    /**
     * Gets the user by username
     */
    getUserByUsername: getUserByUsername,

    /**
     * Creates a new user.
     */
    createUser: createUser,

    /**
     * get all the users.
     */
    getAllUsers: getAllUsers,

    /**
     * get total counts by author.
     */
    getTotalCountsByUser: getTotalCountsByUser,

    /**
     * update the email of user.
     */
    updateEmail: updateEmail,

    /***
     * udpate the profile picture
     */
    updateProfilePic: updateProfilePic,

    /**
     * follow user.
     */
    followUser: followUser,

    /**
     * get following users
     */
    getMyFollowingUsers: getMyFollowingUsers,

    /**
     * Builds the user info from jwt token.
     */
    buildUserInfo: buildUserInfo,
    /**
  * get the most followed user.
  */
    getMostFollowedUsers: getMostFollowedUsers,

    /**
     * Get all users with only user_name, subscribed streams and followings fields
     */
    getAllUsersWithStreamsAndFollowings: getAllUsersWithStreamsAndFollowings
}


function getMostFollowedUsers(pageSize) {
    pageSize = (pageSize == undefined) ? constants.DEFAULT_NO_OF_RESULTS : parseInt(pageSize);
    return new Promise(function (resolve, reject) {
        userModel.getMostFollowedUsers(pageSize).then(function (mostFollowedUsers) {
            mostFollowedUsers = mostFollowedUsers.map(function (mostFollowedUser) {
                mostFollowedUser.user = userMapper.userShortMapper(mostFollowedUser.user);
                return mostFollowedUser;
            });
            resolve(mostFollowedUsers);
        }).catch(function (err) {
            logger.error("could not find most followed user", err.stack);
            reject(err);
        });
    });
}

function updateProfilePic(user, profilePicFileName, profilePicNodeRef) {
    return new Promise(function (resolve, reject) {
        userModel.updateProfilePic(user, profilePicFileName, profilePicNodeRef).then(function (result) {
            resolve(result);
        }).catch(function (err) {
            reject(err);
        })
    })
}


function getUserByUsername(username) {
    return new Promise(function (resolve, reject) {
        userModel.getUserByUsername(username).then(function (user) {
            if (user != null) {
                resolve(userMapper.userDetailsMapper(user));
            } else {
                resolve(user)
            }
        }).catch(function (err) {
            logger.error("could not get user by username", err.stack);
            reject(err);
        });
    });
}

function createUser(user) {

    return new Promise(function (resolve, reject) {
        userModel.createUser(user).then(function (data) {
            logger.info("users ", user);
            resolve(user);
        }).catch(function (err) {
            logger.error("could not create user", err.stack);
            reject(err);
        });
    });
}

/**
 *
 */
function getTotalCountsByUser(username) {
    return new Promise(function (resolve, reject) {
        userModel.getUserByUsername(username).then(function (user) {
            var blogCountPromise = blogModel.getTotalBlogCountsByAuthor(user);
            var discCountPromise = discussionModel.getTotalDiscussionCountsByAuthor(user);
            var ansCountPromise = answerModel.getTotalAnswerCountsByAuthor(user);
            var postCountPromise = postModel.getTotalPostCountByAuthor(user);
            var followersCountPromise = userModel.getUserFollowersCount(user);
            Promise.join(blogCountPromise, discCountPromise, ansCountPromise, postCountPromise, followersCountPromise, function (blogCount, discCount, ansCount, postCount, followersCount) {
                var counts = {};
                counts.answer_counts = ansCount;
                counts.blog_counts = blogCount;
                counts.discussion_counts = discCount;
                counts.post_counts = postCount;
                counts.followers_count = followersCount;
                resolve(counts);
            }).catch(function (err) {
                logger.error("could not get the totalCounts", err.stack);
                reject(err);
            });
        }).catch(function (err) {
            logger.error("could not get the counts for user");
            reject(err);
        })
    });
}

/**
 * get all users.
 */
function getAllUsers() {
    return new Promise(function (resolve, reject) {
        userModel.getAllUsers().then(function (users) {
            resolve(users);
        }).catch(function (err) {
            reject(err);
        });
    })
}

/**
 * update the email address of user.
 */
function updateEmail(user, userEmail) {
    return new Promise(function (resolve, reject) {
        userModel.updateEmail(user, userEmail).then(function (result) {
            resolve(result);
        }).catch(function (err) {
            reject(err);
        })
    });
}

/**
 * follow a user.
 */
function followUser(user, followingUserName, followValue) {
    var isFollow = (followValue != undefined && followValue == 0) ? false : true;
    return new Promise(function (resolve, reject) {
        if (user.user_name != followingUserName) {
            userModel.followUser(user.user_name, followingUserName, isFollow).then(function (result) {
                resolve(result);
            }).catch(function (err) {
                reject(err);
            });
        } else {
            throw new Error("one cannot follow oneself");
        }
    })
}

/**
 * get followed user.
 */
function getMyFollowingUsers(user) {
    return new Promise(function (resolve, reject) {
        userModel.getUsersByUserNames(user.followings)
            .then(function (users) {
                var usersList = []
                for (var i = 0; i < users.length; i++) {
                    var user = userMapper.userDetailsMapper(users[i])
                    usersList.push(user);
                }
                resolve(usersList);
            }).catch(function (err) {
                reject(err);
            });
    })
}

function getEmployeeIdFromUsername(userName) {
    var matchResult = userName.match(/(.+)@mindtree.com/);
    return matchResult[1];
};

function buildUserInfo(decodedToken) {
    var userInfo = {
        employee_id: getEmployeeIdFromUsername(decodedToken.unique_name),
        first_name: decodedToken.given_name,
        last_name: decodedToken.family_name,
        email: null,
        user_name: decodedToken.unique_name,
        status: 'active',
        full_name: decodedToken.name,
        profile_pic_file: {
            ref: null,
            name: null
        },
        followings: [],
        subscribed_streams: []
    };

    return userInfo;
};

function getAllUsersWithStreamsAndFollowings() {
    return new Promise(function (resolve, reject) {
        userModel.getAllUsersWithStreamsAndFollowings()
            .then(function (users) {
                resolve(users);
            }).catch(function (err) {
                reject(err);
            });
    });
}

module.exports = userService;
