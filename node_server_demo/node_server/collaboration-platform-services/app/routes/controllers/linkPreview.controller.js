var linkPreviewService = require('../../services/linkPreview.service');
var Response = require("../response.js");
var logger = require("../../../logger.js");

var linkPreviewController = {
    linkPreview: linkPreview
}

/**
 *To Get The Preview Of A Link.
 */
function linkPreview(req, res) {
    var link = req.query.link;
    var response = new Response();
    linkPreviewService.getlinkPreview(link).then(function (preview) {
        response.data.link = preview;
        response.status.statusCode = '200';
        response.status.message = 'Feteched Link preview ';
        res.status(200).send(response);
    }).catch(function (err) {
        logger.error("could not get preview of the link", err);
        response.status.statusCode = '500';
        response.status.message = 'could not preview the link';
        res.status(500).send(response);
    })
}

module.exports = linkPreviewController;
