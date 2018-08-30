var Response = require("../response.js");
var activityService = require("../../services/activity.service");
var logger = require("../../../logger.js");
/**
 * Controller to do operations on activities.
 */
var activityController =  {
	/**
	 * get activities.
	 */
	activities : getAllActivities

}
/**
 * get all the activities request url : /collab-services/activities/user
 */
function getAllActivities(req, res) {
	var pageNr = req.query.pno;
	var pageSize = req.query.psize;
	var response = new Response();
	var user = req.userInfo;
	var username;
	if (req.params.username == null) {
		username = user.user_name;
	} else {
		username = req.params.username;
	}
    activityService.getAllActivities(username, pageNr, pageSize).then(function (activities) {
		response.data.activities = activities;
		response.status.statusCode = '200';
		response.status.message = 'fetched the activities';
		res.status(200).send(response);
	}).catch(function (err) {
		logger.error("unable to fetch the activities", err);
		response.status.statusCode = '500';
		response.status.message = 'unable to fetch activities';
		res.status(500).send(response);
	})
}
module.exports = activityController;