var logger = require('../../logger');
var esServices = require('./elasticsearch/es-apis');
var elMapper = require('./elasticsearch/el-mapper');
var esConfig = require('../../config/config').props().es;
var userModel = require("./user.model");

module.exports.init = function () {
    function onUpdate(updateDoc) {
        if (updateDoc) {
            logger.debug('User document ' + updateDoc._id + ' is updated.');
            var result = elMapper.mapUserFieldsToBeIndexed(updateDoc);
            esServices.updateDocument(esConfig.userType, updateDoc._id.toString(), result)
                .then(function (response) {
                    logger.debug("update response for user doc.", response);
                }).
                then(undefined, function (err) {
                    logger.error("error in updating user doc in elasticsearch", err);
                });
        }
    }
    userModel.eventEmitter.addListener('USER_UPDATED', onUpdate);
}