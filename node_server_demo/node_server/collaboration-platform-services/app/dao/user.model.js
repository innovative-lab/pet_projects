var Promise = require("bluebird");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var logger = require('../../logger');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var userSchema = new Schema({
    "user_name": {
        type: String,
        required: true,
        unique: true
    },
    "employee_id": {
        type: String,
        required: true
    },
    "first_name": {
        type: String,
        required: true
    },
    "last_name": {
        type: String,
        required: true
    },
    "email": {
        type: String,
        required: false
    },
    "status": {
        type: String,
        required: true
    },
    "full_name": {
        type: String,
        required: true
    },
    "profile_pic_file": {
        "ref": {
            type: String,
            default: null
        },
        "name": {
            type: String,
            default: null
        }
    },
    "followings": [{
        type: String,
        required: false
    }],
    "subscribed_streams": [{
        type: String,
        required: false
    }]
},
    { timestamps: { createdAt: 'created_at', updatedAt: "updated_at" } });

var User = mongoose.model('user', userSchema);

var userDao = {
    /**
* Event emitter for Blogs
*/
    eventEmitter: eventEmitter,
    getUserByUsername: getUserByUsername,
    searchUsers: searchUsers,
    createUser: createUser,
    getAllUsers: getAllUsers,
    getUserByObjectId: getUserByObjectId,
    updateUser: updateUser,
    updateEmail: updateEmail,
    updateProfilePic: updateProfilePic,
    /**
     * update the followings.
     */
    followUser: followUser,
    /**
     * get the users by usernames
     */
    getUsersByUserNames: getUsersByUserNames,
    subscribeStream: subscribeStream,
    unsubscribeStream: unsubscribeStream,
    /**
     * Gets the count of user's followers
     */
    getUserFollowersCount: getUserFollowersCount,
    getMostFollowedUsers: getMostFollowedUsers,
    getMostSubscribedStreams: getMostSubscribedStreams,
    getAllUsersWithStreamsAndFollowings: getAllUsersWithStreamsAndFollowings
};
module.exports = userDao;
var userHooks = require("./user.hooks");
userHooks.init();
function getUserByUsername(username) {
    return new Promise(function (resolve, reject) {
        User.findOne({
            user_name: username
        }, function (err, user) {
            if (!err) {
                resolve(user);
            } else {
                reject(err);
            }
        });
    });
};

function getAllUsers() {
    return new Promise(function (resolve, reject) {
        User.find({}, function (err, user) {
            if (!err) {
                resolve(user);
            } else {
                reject(err);
            }
        });
    });
};

function searchUsers(searchString) {
    return new Promise(function (resolve, reject) {
        User.find({
            $text: {
                $search: searchString
            }
        }).exec(function (err, data) {
            if (!err) {
                consoel
                resolve(data);
            } else {
                reject(err);
            }
        });
    });
}

function createUser(user) {
    return new Promise(function (resolve, reject) {
        User.findOneAndUpdate({
            user_name: user.user_name
        }, user, {
                upsert: true,
                new: true
            }, function (err, data) {
                if (!err) {
                    var eventData = JSON.parse(JSON.stringify(data));
                    eventEmitter.emit('USER_UPDATED', eventData);
                    resolve(data);
                } else {
                    reject(err);
                }
            });
    });
}

function getUserByObjectId(id) {
    return new Promise(function (resolve, reject) {
        User.findOne({
            _id: id
        }, function (err, user) {
            if (!err) {
                resolve(user);
            } else {
                reject(err);
            }
        });
    });
}


function updateUser(searchQuery, updateQuery) {

    return new Promise(function (resolve, reject) {
        var options = {
            new: true
        };
        User.findOneAndUpdate(searchQuery, updateQuery, options, function (err, data) {
            if (!err) {
                resolve(data);
            } else {
                reject(err);
            }
        });
    });
}

function updateEmail(user, userEmail) {
    return new Promise(function (resolve, reject) {
        var searchQuery = {};
        var updateQuery = {};
        searchQuery = {
            user_name: user.user_name
        };
        updateQuery = {
            $set: {
                email: userEmail
            }
        };
        var options = {
            new: true
        };
        User.findOneAndUpdate(searchQuery, updateQuery, options, function (err, data) {
            if (!err) {
                var eventData = JSON.parse(JSON.stringify(data));
                eventEmitter.emit('USER_UPDATED', eventData);
                resolve(data);
            } else {
                reject(err);
            }
        });
    });
}

function updateProfilePic(user, profilePicFileName, profilePicNodeRef) {

    return new Promise(function (resolve, reject) {
        var searchQuery = {
            _id: user._id
        };
        var updateQuery = {
            $set: {
                profile_pic_file: {
                    name: profilePicFileName,
                    ref: profilePicNodeRef
                }
            }
        };
        var options = {
            new: true
        };
        User.findOneAndUpdate(searchQuery, updateQuery, options, function (err, data) {
            if (!err) {
                resolve(data);
            } else {
                reject(err);
            }
        });
    });
}


function followUser(userName, follwerUserName, isFollow) {

    var searchQuery = {};
    var updateQuery = {};
    if (isFollow) {
        searchQuery = {
            $and: [{
                followings: {
                    $ne: follwerUserName
                }
            }, {
                    user_name: userName
                }]
        };

        updateQuery = {
            $push: {
                followings: follwerUserName
            }
        };
    } else {
        searchQuery = {
            $and: [{
                followings: follwerUserName
            }, {
                    user_name: userName
                }]
        };
        updateQuery = {
            $pull: {
                followings: follwerUserName
            }
        };
    }
    return new Promise(function (resolve, reject) {
        var options = {
            new: true
        };
        User.findOneAndUpdate(searchQuery, updateQuery, options, function (err, data) {
            if (!err) {
                resolve(data);
            } else {
                reject(err);
            }
        });
    })
}


function getUsersByUserNames(userNames) {
    return new Promise(function (resolve, reject) {
        User.find({
            'user_name': {
                $in: userNames
            }
        }, function (err, followedUsers) {
            if (!err) {
                resolve(followedUsers);
            } else {
                reject(err);
            }
        });
    })
}

function subscribeStream(streamName, user) {
    var searchQuery = {
        $and: [{
            subscribed_streams: {
                $ne: streamName
            }
        }, {
                user_name: user.user_name
            }]
    };
    var updateQuery = {
        $push: {
            'subscribed_streams': streamName
        }
    };
    var options = {
        new: true
    };
    return new Promise(function (resolve, reject) {
        User.findOneAndUpdate(searchQuery, updateQuery, options, function (err, data) {
            if (!err) {
                resolve(data);
            } else {
                reject(err);
            }
        });
    });
}

function unsubscribeStream(streamName, user) {
    var searchQuery = {
        $and: [{
            subscribed_streams: streamName
        }, {
                user_name: user.user_name
            }]
    };
    var updateQuery = {
        $pull: {
            'subscribed_streams': streamName
        }
    };

    var options = {
        new: true
    };
    return new Promise(function (resolve, reject) {
        User.findOneAndUpdate(searchQuery, updateQuery, options, function (err, data) {
            if (!err) {
                resolve(data);
            } else {
                reject(err);
            }
        });
    });
}

function getUserFollowersCount(user) {
    return new Promise(function (resolve, reject) {
        User.find({
            followings: user.user_name
        })
            .count({}, function (err, count) {
                if (!err) {
                    resolve(count);
                } else {
                    reject(err);
                }
            });
    });
}

function getMostFollowedUsers(resultSize) {
    return new Promise(function (resolve, reject) {
        User.aggregate(
            [
                { $unwind: "$followings" },
                { $group: { _id: "$followings", followers_count: { $sum: 1 } } },
                { $sort: { followers_count: -1 } }
            ]).limit(resultSize).exec(
            function (err, result) {
                if (!err) {
                    var userNames = [];
                    var mostFollowedUserDetails = JSON.parse(JSON.stringify(result));
                    result.forEach(function (resultRow) {
                        userNames.push(resultRow._id);
                    });
                    getUsersByUserNames(userNames).then(function (usersResult) {
                        usersResult.forEach(function (userDetails) {
                            for (var i = 0; i < mostFollowedUserDetails.length; i++) {
                                if (mostFollowedUserDetails[i]._id === userDetails.user_name) {
                                    mostFollowedUserDetails[i].user = userDetails;
                                    delete mostFollowedUserDetails[i]._id;
                                    break;
                                }
                            }
                        });
                        resolve(mostFollowedUserDetails);
                    }).catch(function (err) {
                        reject(err);
                    });
                } else {
                    reject(err);
                }
            }
            );
    });
}

function getMostSubscribedStreams(resultSize) {
    return new Promise(function (resolve, reject) {
        User.aggregate(
            [
                { $unwind: "$subscribed_streams" },
                { $group: { _id: "$subscribed_streams", subscribers_count: { $sum: 1 } } },
                { $sort: { subscribers_count: -1 } }
            ]).limit(resultSize).exec(
            function (err, result) {
                if (!err) {
                    var mostSubscribedStreams = result.map(function (resultRow) {
                        return {
                            stream: {
                                name: resultRow._id
                            },
                            subscribers_count: resultRow.subscribers_count
                        }
                    });
                    resolve(mostSubscribedStreams);
                } else {
                    reject(err);
                }
            }
            );
    });
}

function getAllUsersWithStreamsAndFollowings() {
    return new Promise(function (resolve, reject) {
        User.find({}, 'user_name followings subscribed_streams', function (err, users) {
            if (!err) {
                resolve(users);
            } else {
                reject(err);
            }
        });
    });
}
