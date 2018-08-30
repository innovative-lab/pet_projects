var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    "channel_id": {
        type: String
    },
    "message_id": {
        type: String
    },
    "content": {
        type: String
    },
    "created_by": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    "created_at": {
        type: Date,
        default: Date.now()
    },
    "read_by": [{ type: String }],
    "file": {
        "ref": {
            type: String
        },
        "name": {
            type: String
        }
    }
},
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

var Message = mongoose.model('message', messageSchema);

var messageDao = {
    addMessageInChannel: addMessageInChannel,
    getMessagesForChannel: getMessagesForChannel
}

/**
 * add message to channel
 */
function addMessageInChannel(message) {
    return new Promise(function (resolve, reject) {
        Message.create(message, function (err, data) {
            if (!err) {
                resolve(message);
            } else {
                reject(err);
            }
        })
    })
}

/**
 * get messages of a channel.
 */
function getMessagesForChannel(channelId, timeFrom, nrOfMessagesToBeSkipped, nrOfMessagesToBeFetched) {
    return new Promise(function (resolve, reject) {
        var searchQuery = { channel_id: channelId };
        if ((timeFrom !== undefined) && (timeFrom !== null)) {
            searchQuery.created_at = { $gte: timeFrom };
        }
        Message.find(searchQuery).skip(nrOfMessagesToBeSkipped).limit(nrOfMessagesToBeFetched).populate('created_by').sort({
            created_at: 'desc'
        }).exec(function (err, data) {
            if (!err) {
                var ascendingList = data.reverse();
                resolve(ascendingList);
            } else {
                reject(err);
            }
        })
    })
}


module.exports = messageDao;