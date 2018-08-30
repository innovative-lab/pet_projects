var nodemailer = require('nodemailer');
var events = require('events');
var eventEmitter = new events.EventEmitter();
var userModel = require("../dao/user.model.js");
var logger = require("../../logger");
var Promise = require("bluebird");

var notificationService = {
    /**
     * send meeting invitation.
     */
    sendMeetingInvitation: sendMeetingInvitation,
    eventEmitter: eventEmitter
}


/**
 * send meeting invitation.
 */
function sendMeetingInvitation(meetingInviteRequest) {
    var content = meetingInviteRequest.content;
    var email = meetingInviteRequest.email;
    var userName = meetingInviteRequest.user_name;
    return new Promise(function (resolve, reject) {
        if (userName != undefined) {
            var eventData = {"content": content, "user_name": userName };
            eventEmitter.emit('MEETING-INVITE', eventData);
            userModel.getUserByUsername(userName).then(function (user) {
                email = user.email;
                return sendMail(email, content);
            }).then(function (data) {
                resolve(data);
            }).catch(function (err) {
                logger.error("unable to send mail",err);
                reject(err);
            })
        } else {
            sendMail(email, content).then(function (data) {
                resolve(data);
            }).catch(function (err) {
                reject(err);
            })
        }

    })

}

function sendMail(email, content) {
    return new Promise(function (resolve, reject) {
        logger.info("email one");
        var transporter = nodemailer.createTransport('smtps://opencoe@gmail.com:opencoe2016@smtp.gmail.com');
        var mailOptions = {
            from: 'opencoe@gmail.com',
            to: email,
            subject: 'Meeting Invite',
            text: content
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (!error) {
                resolve(info);
            } else {
                logger.error("unable to send mail", error);
                reject(error);
            };
        });
    })
}
module.exports = notificationService;