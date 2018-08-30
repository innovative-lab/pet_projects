var logger = require('../../logger');
var userModel = require("./user.model");
var blogModel = require("./blog.model");
var esServices = require('./elasticsearch/es-apis');
var elMapper = require('./elasticsearch/el-mapper');
var esConfig = require('../../config/config').props().es;
var constants = require('../services/constants.js');
var streamModel = require("./stream.model.js");

module.exports.init = function () {
    function onSave(doc) {
        logger.debug('Blog document ' + doc._id + ' is created.');

        // Adding the blog doc in elasticsearch only if blog is published
        if (doc.status == constants.PUBLISHED) {

            // Saving all tags as streams
            streamModel.saveAllStreams(extractStreams(doc))
                .then(function (result) {
                    logger.debug("Streams created from tags of blog ", doc._id);
                }).catch(function (err) {
                    logger.error("could not create streams", err);
                });

            // Saving blog into elasticsearch
            userModel.getUserByObjectId(doc.created_by).then(function (user) {
                var result = elMapper.mapBlogFieldsToBeIndexed(doc, user);
                return esServices.createDocument(esConfig.blogType, doc._id.toString(), result);
            })
                .then(function (response) {
                    logger.debug("insert response for blog document", response);
                }).
                then(undefined, function (err) {
                    logger.error("error in inserting blog document in elasticsearch", err);
                });
        }
    }

    function onUpdate(updateDoc) {
        if (updateDoc) {
            // Updating the blog doc in elasticsearch only if blog is published
            if (updateDoc.status == constants.PUBLISHED) {
                logger.debug('Blog document ' + updateDoc._id + ' is updated.');

                // Saving all tags as streams
                streamModel.saveAllStreams(extractStreams(updateDoc))
                    .then(function (result) {
                        logger.debug("Streams created from tags of blog ", updateDoc._id);
                    }).catch(function (err) {
                        logger.error("could not create streams", err);
                    });

                // Updating elasticsearch
                userModel.getUserByObjectId(updateDoc.created_by).then(function (user) {
                    var result = elMapper.mapBlogFieldsToBeIndexed(updateDoc, user)
                    return esServices.updateDocument(esConfig.blogType, updateDoc._id.toString(), result);
                })
                    .then(function (response) {
                        logger.debug("update response for blog document", response);
                    })
                    .then(undefined, function (err) {
                        logger.error("error in update blog document in elasticsearch", err);
                    });
            }
        }
    }

    function onRemove(removedDoc) {
        logger.debug('Blog document ' + removedDoc._id + ' is deleted.');
        var id = removedDoc._id.toString();
        esServices.deleteDocument(esConfig.blogType, id)
            .then(function (response) {
                logger.debug("delete response for blog document", response);
            })
            .then(undefined, function (err) {
                logger.error("error in delete blog document in elasticsearch", err);
            });
    }

    function extractStreams(blog) {
        var streamList = [];
        for (var i = 0; i < blog.tags.length; i++) {
            var stream = {};
            stream.name = blog.tags[i].toLowerCase();
            streamList.push(stream);
        }
        return streamList;
    }
    blogModel.eventEmitter.addListener('BLOG_CREATED', onSave);
    blogModel.eventEmitter.addListener('BLOG_UPDATED', onUpdate);
    blogModel.eventEmitter.addListener('BLOG_DELETED', onRemove);
}