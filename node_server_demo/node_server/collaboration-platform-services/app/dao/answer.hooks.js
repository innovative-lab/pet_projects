var logger = require('../../logger');
var userModel = require("./user.model");
var discussionModel = require("./discussion.model");
var answerModel = require("./answer.model");
var esServices = require('./elasticsearch/es-apis');
var elMapper = require('./elasticsearch/el-mapper');
var esConfig = require('../../config/config').props().es;
var Promise = require("bluebird");
var streamModel = require("./stream.model.js");

module.exports.init = function () {
    function onSave(doc) {
        logger.debug('Answer document ' + doc._id + ' is created.');

        // Saving all tags as streams
        streamModel.saveAllStreams(extractStreams(doc))
            .then(function (result) {
                logger.debug("Streams created from tags of answer ", doc._id);
            }).catch(function (err) {
                logger.error("could not create streams", err);
            });

        // Updating elasticsearch
        var authorPromise = userModel.getUserByObjectId(doc.created_by);
        var discussionPromise = discussionModel.getDiscussionByAnswerId(doc._id);
        Promise.join(authorPromise, discussionPromise, function (user, discussion) {
            var result = elMapper.mapAnswerFieldsToBeIndexed(doc, discussion, user);
            return esServices.createDocument(esConfig.answerType, doc._id.toString(), result)
        })
            .then(function (response) {
                logger.debug("insert response for answer doc.", response);
            })
            .then(undefined, function (err) {
                logger.error("error in inserting answer doc", err);
            });
    }

    function onUpdate(updateDoc) {
        if (updateDoc) {
            logger.debug('Answer document ' + updateDoc._id + ' is updated.');

            // Saving all tags as streams
            streamModel.saveAllStreams(extractStreams(updateDoc))
                .then(function (result) {
                    logger.debug("Streams created from tags of answer ", updateDoc._id);
                }).catch(function (err) {
                    logger.error("could not create streams", err);
                });

            // Updating elasticsearch
            var authorPromise = userModel.getUserByObjectId(updateDoc.created_by);
            var discussionPromise = discussionModel.getDiscussionByAnswerId(updateDoc._id);

            Promise.join(authorPromise, discussionPromise, function (user, discussion) {
                var result = elMapper.mapAnswerFieldsToBeIndexed(updateDoc, discussion, user);
                return esServices.updateDocument(esConfig.answerType, updateDoc._id.toString(), result)
            })
                .then(function (response) {
                    logger.debug("update response for answer document", response);
                })
                .then(undefined, function (err) {
                    logger.error("error in updating answer doc", err);
                });
        }
    }

    function onRemove(removedDoc) {
        logger.debug('Answer document ' + removedDoc._id + ' is deleted.');
        var id = removedDoc._id.toString();
        esServices.deleteDocument(esConfig.answerType, id)
            .then(function (response) {
                logger.debug("delete response.", response);
            })
            .then(undefined, function (err) {
                logger.error("error in deleting answer doc", err);
            });
    }

    function extractStreams(blog) {
        var streamList = [];
        for (var i = 0; i < blog.tags.length; i++) {
            var stream = {};
            stream.name = blog.tags[i];
            streamList.push(stream);
        }
        return streamList;
    }

    answerModel.eventEmitter.addListener('ANSWER_CREATED', onSave);
    answerModel.eventEmitter.addListener('ANSWER_UPDATED', onUpdate);
    answerModel.eventEmitter.addListener('ANSWER_DELETED', onRemove);
}