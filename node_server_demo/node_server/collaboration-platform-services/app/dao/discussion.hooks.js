var logger = require('../../logger');
var userModel = require("./user.model");
var discussionModel = require("./discussion.model");
var esServices = require('./elasticsearch/es-apis');
var elMapper = require('./elasticsearch/el-mapper');
var esConfig = require('../../config/config').props().es;
var constants = require('../services/constants.js');
var streamModel = require("./stream.model.js");

module.exports.init = function () {
    function onSave(doc) {
        logger.debug('Discussion document ' + doc._id + ' is created.');

        // Adding the discussion doc in elasticsearch only if discussion is published
        if (doc.status == constants.PUBLISHED) {
            // Saving all tags as streams
            streamModel.saveAllStreams(extractStreams(doc))
                .then(function (result) {
                    logger.debug("Streams created from tags of discussion ", doc._id);
                }).catch(function (err) {
                    logger.error("could not create streams", err);
                });

            // Saving discussion into elasticsearch
            userModel.getUserByObjectId(doc.created_by).then(function (user) {
                var result = elMapper.mapDiscussionFieldsToBeIndexed(doc, user);
                return esServices.createDocument(esConfig.discussionType, doc._id.toString(), result)
            })
                .then(function (response) {
                    logger.debug("insert response for discussion doc", response);
                })
                .then(undefined, function (err) {
                    logger.error("error in inserting discussion doc in elasticsearch", err);
                });
        }
    }

    function onUpdate(updateDoc) {
        if (updateDoc) {
            // Updating the discussion doc in elasticsearch only if discussion is published
            if (updateDoc.status == constants.PUBLISHED) {
                logger.debug('Discussion document ' + updateDoc._id + ' is updated.');

                // Saving all tags as streams
                streamModel.saveAllStreams(extractStreams(updateDoc))
                    .then(function (result) {
                        logger.debug("Streams created from tags of discussion ", updateDoc._id);
                    }).catch(function (err) {
                        logger.error("could not create streams", err);
                    });

                // Updating discussion into elasticsearch
                userModel.getUserByObjectId(updateDoc.created_by).then(function (user) {
                    var result = elMapper.mapDiscussionFieldsToBeIndexed(updateDoc, user);
                    return esServices.updateDocument(esConfig.discussionType, updateDoc._id.toString(), result);
                })
                    .then(function (response) {
                        logger.debug("update response for discussion document", response);
                    })
                    .then(undefined, function (err) {
                        logger.error("error in updating discusscion doc in elasticsearch", err);
                    });
            }
        }
    }

    function onRemove(removedDoc) {
        logger.debug('Discussion document ' + removedDoc._id + ' is deleted.');
        var id = removedDoc._id.toString();
        esServices.deleteDocument(esConfig.discussionType, id)
            .then(function (response) {
                logger.debug("delete discussion doc response.", response);
            })
            .then(undefined, function (err) {
                logger.error("error in deleting discusscion doc in elasticsearch", err);
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

    discussionModel.eventEmitter.addListener('DISCUSSION_CREATED', onSave);
    discussionModel.eventEmitter.addListener('DISCUSSION_UPDATED', onUpdate);
    discussionModel.eventEmitter.addListener('DISCUSSION_DELETED', onRemove);
}