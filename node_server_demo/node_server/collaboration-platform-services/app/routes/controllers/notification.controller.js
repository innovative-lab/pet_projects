var Response = require('../response.js');
var logger = require("../../../logger");

var notificationService = require("../../services/notification.service.js");

var notificationController = {
  inviteUserForConference: inviteUserForConference
}

function inviteUserForConference(req, res) {
  var response = new Response();
  notificationService.sendMeetingInvitation(req.body).then(function () {
    response.status.statusCode = '200';
    response.status.message = "invitation sent successfully";
    res.status(200).send(response);
  }).catch(function (error) {
    logger.error("Notification sending failed",error);
    response.status.statusCode = '500';
    response.status.message = error;
    res.status(500).send(response);
  })
}

module.exports = notificationController;

