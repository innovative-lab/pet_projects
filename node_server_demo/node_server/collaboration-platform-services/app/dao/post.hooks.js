var logger = require('../../logger');
var userModel = require("./user.model");
var esServices = require('./elasticsearch/es-apis');
var elMapper = require('./elasticsearch/el-mapper');
var esConfig = require('../../config/config').props().es;
var streamModel = require("./stream.model.js");
var postModel = require("./post.model");

module.exports.init = function () {
    function onSave(doc) {
        logger.debug('Post document ' + doc._id + ' is created.');

        // Saving all tags as streams
        streamModel.saveAllStreams(extractStreams(doc))
            .then(function (result) {
                logger.debug("Streams created from tags of blog ", doc._id);
            }).catch(function (err) {
                logger.error("could not create streams", err);
            });

        // Saving blog into elasticsearch
        userModel.getUserByObjectId(doc.created_by).then(function (user) {
            var result = elMapper.mapPostFieldsToBeIndexed(doc, user);
            return esServices.createDocument(esConfig.postType, doc._id.toString(), result);
        })
            .then(function (response) {
                logger.debug("insert response for post doc.", response);
            }).
            then(undefined, function (err) {
                logger.error("error in inserting post document in elasticsearch", err);
            });
    }

    function onRemove(removedDoc) {
        logger.debug('Post document ' + removedDoc._id + ' is deleted.');
        var id = removedDoc._id.toString();
        esServices.deleteDocument(esConfig.postType, id)
            .then(function (response) {
                logger.debug("delete response for post document", response);
            })
            .then(undefined, function (err) {
                logger.error("error in delete post document in elasticsearch", err);
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

    postModel.eventEmitter.addListener('POST_CREATED', onSave);
    postModel.eventEmitter.addListener('POST_DELETED', onRemove);
}