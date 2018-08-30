var Promise = require("bluebird");
var redisClient = require('../../config/redis');
var logger = require('../../logger.js');
var preview = require("page-previewer");

/**
 * this is responsible for getting the preview of a link.
 */
var linkPreviewService = {
    /**
    * Get the preview of a link.
    */
    getlinkPreview: getlinkPreview

}


/**
 * @param link, link for which the preview is needed.
 */

function getlinkPreview(link) {
    return new Promise(function (resolve, reject) {
        redisClient.get(link, function (err, reply) {
            if (err != null) {
                reject(err);
            } else {
                if (reply != null) {
                    resolve(JSON.parse(reply));
                } else {
                    preview(link, function (err, data) {
                        if (data) {
                            redisClient.set(link, JSON.stringify(data));
                            resolve(data);
                        }
                        else {
                            reject(err);
                        }
                    });
                }
            }
        });
    })
}

module.exports = linkPreviewService;
