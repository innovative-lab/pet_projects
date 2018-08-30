
var channelModel = require("../dao/channel.model.js");
var userModel = require("../dao/user.model.js");
var messageModel = require("../dao/message.model.js");
var constants = require('./constants.js');
var Promise = require("bluebird");
var idGenerator = require('../common/id-generator.js');
var channelMapper = require('./mappers/channel.mapper.js');
var messageMapper = require('./mappers/message.mapper.js');
var logger = require("../../logger");


var channelService = {
    /**
     * create new channel
     */
    createChannel: createChannel,
    /**
     * get the channels by users.
     */
    getChannelsByUserName: getChannelsByUserName,
    /**
     * get the channels for logged in user.
     */
    getChannelsByUser: getChannelsByUser,
    /**
     * add new member to channel.
     */
    addUserToChannel: addUserToChannel,
    /**
     * remove user from channel.
     */
    removeUserFromChannel: removeUserFromChannel,
    /**
     * add message in channel.
     */
    addMessageInChannel: addMessageInChannel,
    /**
     * get messages in channel.
     */
    getMessagesByChannel: getMessagesByChannel,
    /**
     * get channel by id.
     */
    getChannelById: getChannelById
}

/**
 * 
 * @param channel , channel which consists of  channel name,
 * @param user, information of the user who is creating the channel
 */
function createChannel(user, channel) {
    channel.channel_id = 'channel' + idGenerator.generateRandomId(10);
    channel.created_by = user._id;

    /**
     * adding the creator of the channel in the members.
     */
    var members = [];
    var member = {};
    member.user = user._id;
    member.created_by = user.user_name;
    member.created_at = Date.now();
    member.isAdmin = true;
    members.push(member);
    channel.members = members;

    return new Promise(function (resolve, reject) {
        channelModel.createChannel(channel).then(function (result) {
            resolve(result);
        }).catch(function (err) {
            reject(err);
        })
    })
}

/**
 * @param username, username of the user for which channels are to be retrieved.
 */
function getChannelsByUserName(username) {
    return new Promise(function (resolve, reject) {
        userModel.getUserByUsername(username).then(function (user) {
            return channelModel.getChannelsByUserId(user._id)
        }).then(function (channels) {
            var channelsList = [];
            for (var i = 0; i < channels.length; i++) {
                var channel = channelMapper.mapChannelToResponse(channels[i]);
                channelsList.push(channel);
            }
            resolve(channelsList);
        }).catch(function (err) {
            reject(err);
        })
    })
}

/**
 * @param user, loggedin user 
 */
function getChannelsByUser(user) {
    return new Promise(function (resolve, reject) {
        channelModel.getChannelsByUserId(user._id).then(function (channels) {
            var channelsList = [];
            for (var i = 0; i < channels.length; i++) {
                var channel = channelMapper.mapChannelToResponse(channels[i]);
                channelsList.push(channel);
            }
            resolve(channelsList);
        }).catch(function (err) {
            reject(err);
        })
    })

}

/**
 * @param usernameTobeAdded, username of user to be added to a channel
 * @param user, user who adds new member
 * @param channelId, channelId to which new member need to be added.
 */
function addUserToChannel(user, usernameTobeAdded, channelId) {

    return new Promise(function (resolve, reject) {
        userModel.getUserByUsername(usernameTobeAdded).then(function (userTobeAdded) {
            this.userTobeAdded = userTobeAdded;
            return channelModel.getChannelById(channelId);
        }).then(function (channel) {
            var isMember = false;
            var hasAdminPrivilges = false;
            channel.members.forEach(function (member) {
                if (member.user._id.toString() === userTobeAdded._id.toString()) {
                    isMember = true;
                }
                if ((member.user._id.toString() === user._id.toString()) && (member.isAdmin === true)) {
                    hasAdminPrivilges = true;
                }
            })
            logger.info("is member part of the channel ", isMember);
            if (!hasAdminPrivilges) {
                throw "No admin privileges to add user"
            }
            else {
                if (isMember) {
                    throw "user is already added"
                } else {
                    var member = {};
                    member.user = userTobeAdded._id;
                    member.created_by = user.user_name;
                    member.created_at = Date.now();
                    member.isAdmin = true;
                    return channelModel.addUserToChannel(channelId, member);
                }
            }
        }).then(function (result) {
            resolve(result);
        }).catch(function (err) {
            logger.error("Error Adding User ", err);
            reject(err);
        })
    });
}

/**
 * @param usernameTobeAdded, username of user to be added to a channel
 * @param user, user who adds new member
 * @param channelId, channelId to which new member need to be added.
 */
function removeUserFromChannel(user, usernameTobeRemoved, channelId) {
    return new Promise(function (resolve, reject) {
        userModel.getUserByUsername(usernameTobeRemoved).then(function (userTobeRemoved) {
            return channelModel.removeUserFromChannel(channelId, userTobeRemoved._id);
        }).then(function (result) {
            resolve(result);
        }).catch(function (err) {
            reject(err);
        })
    });
}

/**
 * 
 */
function addMessageInChannel(user, channelId, message) {
    message.channel_id = channelId;
    message.message_id = 'mes' + idGenerator.generateRandomId(20);
    message.created_by = user._id;
    message.created_at = Date.now();
    if (message.file == undefined) {
        message.file = null;
    }
    return new Promise(function (resolve, reject) {
        messageModel.addMessageInChannel(message).then(function (result) {
            resolve(result);
        }).catch(function (err) {
            reject(err);
        })
    })
}

function getMessagesByChannel(user, channelId, pno, psize) {
    var pageNr = validatePageNr(pno);
    var pageSize = validatePageSize(psize);
    return new Promise(function (resolve, reject) {
        channelModel.getChannelById(channelId).then(function (channel) {
            var memberCreatedAt;
            channel.members.forEach(function (member) {
                if (member.user._id.toString() === user._id.toString()) {
                    memberCreatedAt = member.created_at;
                }
            })
            if (memberCreatedAt !== undefined) {
                messageModel.getMessagesForChannel(channelId, memberCreatedAt, (pageNr - 1) * pageSize, pageSize).then(function (messages) {
                    var messagesList = [];
                    for (var i = 0; i < messages.length; i++) {
                        var message = messageMapper.mapMessageToResponse(messages[i]);
                        messagesList.push(message);
                    }
                    resolve(messagesList);
                })
            }
            else {
                throw "User is not part of the channel"
            }
        }).catch(function (err) {
            logger.error("could not get messages", err.stack);
            reject(err);
        });
    })
}

function getChannelById(channelId) {
    return new Promise(function (resolve, reject) {
        channelModel.getChannelById(channelId).then(function (channel) {
            var channelResponse = channelMapper.mapChannelToResponse(channel);
            resolve(channelResponse);
        }).catch(function (err) {
            reject(err);
        })
    })
}


function validatePageNr(pageNr) {
    if (pageNr == undefined) {
        return 1;
    }
    return pageNr;
}

function validatePageSize(pageSize) {
    if (pageSize == undefined) {
        return constants.DEFAULT_NO_OF_RESULTS;
    }
    return pageSize;
}

module.exports = channelService;