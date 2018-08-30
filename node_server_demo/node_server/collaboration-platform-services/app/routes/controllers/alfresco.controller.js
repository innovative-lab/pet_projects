var Client = require('node-rest-client').Client;
var client = new Client();
var Response = require("../response.js");
var config = require("../../../config/config").props().alfresco;
var logger = require("../../../logger.js");

var alfrescoController = {
	alfrescoUploadUrl : alfrescoUploadUrl,
	alfrescoUrlForFileDownload : alfrescoUrlForFileDownload
};

function alfrescoUploadUrl(req, res) {
	var args = {
		headers : {
			"Content-Type" : "application/json"
		},
		data : {
			"username" : "admin",
			"password" : "Welcome123"
		}
	};

	client
			.post(
					config.loginUrl,
					args,
					function(data, response) {
						// parsed response body as js object 
						var response = new Response();
						var uploadUrl = config.uploadUrl
								+ data.data.ticket;
						response.data.url = uploadUrl;
						response.status.statusCode = '200';
						response.status.message = 'fetched the comments';
						res.status(200).json(response);
					}).on('error', function (err) {
						logger.error("Request to alfresco failed.", err);
						var response = new Response();
						response.status.statusCode = '500';
						response.status.message = 'error in request';
						res.status(400).json(response);
					});;
}

function alfrescoUrlForFileDownload(req, res) {
	var noderef = req.params.noderef;
	var args = {
		headers : {
			"Content-Type" : "application/json"
		},
		data : {
			"username" : "admin",
			"password" : "Welcome123"
		}
	};

	client
			.post(
					config.loginUrl,
					args,
					function(data, response) {
						// parsed response body as js object 
						var response = new Response();
						var downloadUrl = config.fileDownloadUrl.replace('noderef',noderef)
								+ data.data.ticket;
						response.data.downloadUrl = downloadUrl;
						response.status.statusCode = '200';
						response.status.message = 'fetched the download url for file';
						res.status(200).json(response);
					}).on('error', function (err) {
					    logger.error("Request to alfresco failed.", err);
						var response = new Response();
						response.status.statusCode = '500';
						response.status.message = 'error in request';
						res.status(400).json(response);
					});;
}

module.exports = alfrescoController;