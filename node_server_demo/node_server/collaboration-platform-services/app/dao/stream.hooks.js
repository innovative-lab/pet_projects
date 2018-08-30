var streamModel = require("./stream.model");
var logger = require('../../logger');
var esServices = require('./elasticsearch/es-apis');
var elMapper = require('./elasticsearch/el-mapper');
var esConfig = require('../../config/config').props().es;

module.exports.init = function () {
    function onUpdate(updateDoc) {
        if (updateDoc) {
            logger.debug('Stream document ' + updateDoc._id + ' is updated.');
            var result = elMapper.mapStreamFieldsToBeIndexed(updateDoc);
            esServices.updateDocument(esConfig.streamType, updateDoc._id.toString(), result)
                .then(function (response) {
                    logger.debug("update response for stream doc.", response);
                }).
                then(undefined, function (err) {
                    logger.error("error in updating stream document in elasticsearch", err);
                });
        }
    }
    streamModel.eventEmitter.addListener('STREAM_UPDATED', onUpdate);
}