var Promise = require("bluebird");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var logger = require("../../logger");

var channelSchema = new Schema({
    "channel_id": {
        type: String,
        required: true,
        unique: true
    },
    "channel_name": {
        type: String,
        required: true
    },
    "members": [{
        "user": {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        "created_by": {
            type: String
        },
        "created_at": {
            type: Date,
            default: Date.now()
        },
        "isAdmin": {
            type: Boolean
        }
    }],
    "created_by": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }
},
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

var Channel = mongoose.model('channel', channelSchema);

/**
 * 
 */
var channelDao = {
    /**
     * create channel.
     */
    createChannel: createChannel,
    /**
     * get the channels of a user by username
     */
    getChannelsByUserId: getChannelsByUserId,
    /**
     * add new members to the channel.
     */
    addUserToChannel: addUserToChannel,
    /**
     * remove user from channel.
     */
    removeUserFromChannel: removeUserFromChannel,
    /**
     * get channel by id
     */
    getChannelById: getChannelById
};


/**
 * 
 */
function createChannel(channel) {
    return new Promise(function (resolve, reject) {
        Channel.create(channel, function (err, data) {
            if (!err) {
                resolve(data);
            } else {
                reject(err);
            }
        })
    })
}

/**
 * 
 */
function getChannelsByUserId(userId) {
    return new Promise(function (resolve, reject) {
        Channel.find({ 'members.user': userId }).populate('members.user').exec(function (err, data) {
            if (!err) {
                resolve(data);
            } else {
                reject(err);
            }
        })
    })

}

/**
 * 
 */
function addUserToChannel(channelId, member) {
    return new Promise(function (resolve, reject) {
        var searchQuery = {
            $and: [{
                'members.user': {
                    $ne: member.user
                }
            }, {
                    channel_id: channelId
                }]
        };
        var updateQuery = { $push: { 'members': member } };
        var options = { new: true };
        Channel.findOneAndUpdate(searchQuery, updateQuery, options, function (err, data) {
            if (!err) {
                resolve(data);
            } else {
                reject(err);
            }
        })
    })
}

/**
 * @param useridToBeRemoved, user id to be removed.
 */
function removeUserFromChannel(channelId, useridToBeRemoved) {
    return new Promise(function (resolve, reject) {
        var searchQuery = {
            $and: [{
                'members.user': useridToBeRemoved
            }, {
                    channel_id: channelId
                }]
        };
        var updateQuery = {
            $pull: {
                'members': {
                    'user': useridToBeRemoved
                }
            }
        };
        var options = { new: true };
        Channel.findOneAndUpdate(searchQuery, updateQuery, options, function (err, data) {
            if (!err) {
                resolve(data);
            } else {
                reject(err);
            }
        })
    })
}


function getChannelById(channelId) {
    return new Promise(function (resolve, reject) {
        Channel.findOne({ channel_id: channelId }).populate('members.user').exec(function (err, channel) {
            if (!err) {
                resolve(channel);
            } else {
                reject(err);
            }
        })
    })
}

module.exports = channelDao;