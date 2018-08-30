var dashboardService = require('../../services/dashboard.service.js');
var Response = require("../response.js");
var logger = require("../../../logger");

var dashBoardController = {
	/**
	 * get the total count of all blogs,discussions,answers.
	 */
	getTotalCounts : getTotalCounts,

	/**
	 * Gets count of all published blogs and pulished/draft blogs of author
	 */
	getAllNAuthorBlogCounts : getAllNAuthorBlogCounts,

	/**
	 * Gets count of all published discussions and pulished/draft discussions of author
	 */
	getAllNAuthorDiscCounts : getAllNAuthorDiscCounts
}


function getTotalCounts(req, res) {
	var response = new Response();
	dashboardService.getTotalCounts().then(function (counts) {
		response.data = counts;
		response.status.statusCode = '200';
		response.status.message = 'fetched the counts successfully';
		res.status(200).send(response);
	}).catch(function (err) {
		logger.info("could not the get the total counts ..", err);
		response.status.statusCode = '404';
		response.status.message = 'could not fetch the counts';
		res.status(404).send(response);
	})


}

function getAllNAuthorBlogCounts(req, res) {
	var response = new Response();
	var user = req.userInfo;
	dashboardService.getAllNAuthorBlogCounts(user).then(function (counts) {
		response.data.counts = counts;
		response.status.statusCode = '200';
		response.status.message = 'fetched the counts successfully';
		res.status(200).send(response);
	}).catch(function (err) {
		logger.error("could not fetch the all and author blogs count", err);
		response.status.statusCode = '500';
		response.status.message = 'could not fetch the counts';
		res.status(500).send(response);
	});
}

function getAllNAuthorDiscCounts(req, res) {
	var response = new Response();
	var user = req.userInfo;
	dashboardService.getAllNAuthorDiscCounts(user).then(function (counts) {
		response.data.counts = counts;
		response.status.statusCode = '200';
		response.status.message = 'fetched the counts successfully';
		res.status(200).send(response);
	}).catch(function (err) {
		logger.error("could not fetch all and author discussion counts", err);
		response.status.statusCode = '500';
		response.status.message = 'could not fetch the counts';
		res.status(500).send(response);
	});
}

module.exports = dashBoardController;
