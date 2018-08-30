var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var logger = require("../../logger.js");
var events = require('events');
var eventEmitter = new events.EventEmitter();

var streamSchema = new Schema({
    "name": {
        type: String,
        required: true,
        unique: true
    }
}, {
        timestamps: {
            createdAt: 'created_at', updatedAt: "updated_at"
        }
    });


var Stream = mongoose.model('Stream', streamSchema);

var streamDao = {
    /**
* Event emitter for Blogs
*/
    eventEmitter: eventEmitter,
    createStream: createStream,
    getStreams: getStreams,
    saveAllStreams: saveAllStreams
};
module.exports = streamDao;
var streamHooks = require("./stream.hooks");
streamHooks.init();
/**
 * @param stream, stream object consists of all the info regarding stream.
 */
function createStream(streamName) {
    return new Promise(function (resolve, reject) {
        Stream.findOneAndUpdate({ name: streamName }, { $setOnInsert: { name: streamName } }, { upsert: true, new: true }, function (err, doc) {
            if (!err) {
                var eventData = JSON.parse(JSON.stringify(doc));
                eventEmitter.emit('STREAM_UPDATED', eventData);
                resolve(doc);
            } else {
                logger.error("could not insert stream", err);
                reject(err);
            }
        });
    });
}

/**
 * @param nrOfStreamsToBeSkipped, nrOfStreamsToBeSkipped is the number of stream  has to skip
 * @param nrOfStreamsToBeFetched, nrOfStreamsToBeFetched is the number  of stream  has to fetch
 */
function getStreams(nrOfStreamsToBeSkipped, nrOfStreamsToBeFetched) {
    return new Promise(function (resolve, reject) {
        var query = {};
        Stream.find(query)
            .sort({
                created_at: 'desc'
            })
            .skip(nrOfStreamsToBeSkipped)
            .limit(nrOfStreamsToBeFetched)
            .exec(function (err, stream) {
                if (!err) {
                    resolve(stream);
                } else {
                    reject(err);
                }
            });
    });
}

/**
 * adding multiple streams at a timestamps
 * upsert:true makes the new insert if not exists otherwise updates the existing documents.
 */
function saveAllStreams(streams) {
    return new Promise(function (resolve, reject) {
        var count = 0;
        streams.forEach(function (stream) {
            count++;
            Stream.findOneAndUpdate(stream, { $setOnInsert: { name: stream.name } }, { upsert: true, new: true }, function (err, doc) {
                if (count === streams.length) {
                    var eventData = JSON.parse(JSON.stringify(doc));
                    eventEmitter.emit('STREAM_UPDATED', eventData);
                    resolve(doc);
                } else if (err) {
                    logger.error("could not insert streams", err);
                    reject(err);
                }
            });
        });
    });

}


