var esConfig = require('../../../config/config').props().es;
var logger = require('../../../logger.js');
var client = require('../../../config/elasticsearch');
var Promise = require("bluebird");

var createDocument = function (type, id, document) {
    return new Promise(function (resolve, reject) {
        client.create({
            index: esConfig.index,
            type: type,
            id: id,
            body: document
        }, function (error, response) {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
};

var updateDocument = function (type, id, document) {
    return new Promise(function (resolve, reject) {
        client.update({
            index: esConfig.index,
            type: type,
            id: id,
            body: {
                doc: document,
                doc_as_upsert: true
            }
        }, function (error, response) {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
};

var deleteDocument = function (type, id) {
    return new Promise(function (resolve, reject) {
        client.delete({
            index: esConfig.index,
            type: type,
            id: id
        }, function (error, response) {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
};

module.exports = {
    createDocument: createDocument,
    updateDocument: updateDocument,
    deleteDocument: deleteDocument
};
