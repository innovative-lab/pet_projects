var channelService = require("../../services/channel.service.js");
var Response = require("../response.js");
var logger = require("../../../logger");

var channelController = {
    /**
     * create a channel.
     */
    createChannel : createChannel,
    /**
     * get channels by user.
     */
    getChannelsByUser : getChannelsByUser,
    /**
     * get channels of loggedin user.
     */
    getChannelsByLoggedInUser : getChannelsByLoggedInUser,
    /**
     * add user to the channel.
     */
    addUserToChannel : addUserToChannel,
    /**
     * remove user from channel.
     */
    removeUserFromChannel : removeUserFromChannel,
    /**
     * add message in channel
     */
    addMessageInChannel : addMessageInChannel,
    /**
     * get messages in channel
     */
    getMessagesByChannel : getMessagesByChannel,
    /**
     * get channel details for channel by id.
     */
    getChannelById : getChannelById

}

/**
 * create a new channel.
 */
function createChannel(req, res) {
    var response = new Response();
    var channel = req.body;
    var user = req.userInfo;
    channelService.createChannel(user, channel).then(function (data) {
        response.status.statusCode = '200';
        response.status.message = 'created the channel successfully';
        res.status(200).send(response);
    }).catch(function (err) {
        response.status.statusCode = '500';
        response.status.message = 'could not create the channel';
        res.status(500).send(response);
    })
}

/**
 * get the channels for a user
 */
function getChannelsByUser(req, res) {
    var response = new Response();
    var username = req.params.username;
    channelService.getChannelsByUserName(username).then(function (channels) {
        response.data.channels = channels;
        response.status.statusCode = '200';
        response.status.message = 'fetched the channels users belongs to';
        res.status(200).send(response);
    }).catch(function (err) {
        logger.error("could not fetch the channels of user", err);
        response.status.statusCode = '500';
        response.status.message = 'could not fetch the channels of a user';
        res.status(500).send(response);
    })
}

/**
 * get the channels that loggedin user belongs to
 */
function getChannelsByLoggedInUser(req, res) {
    var response = new Response();
    var user = req.userInfo;
    channelService.getChannelsByUser(user).then(function (channels) {
        response.data.channels = channels;
        response.status.statusCode = '200';
        response.status.message = 'fetched the channels users belongs to';
        res.status(200).send(response);
    }).catch(function (err) {
        logger.error("could not fetch the channels of user", err);
        response.status.statusCode = '500';
        response.status.message = 'could not fetch the channels of a user';
        res.status(500).send(response);
    })
}

/**
 * this method is responsible for adding new member to channel
 */
function addUserToChannel(req, res) {
    var response = new Response();
    var usernameTobeAdded = req.params.username;
    var user = req.userInfo;
    var channelId = req.params.channelId;
    logger.info("channel id" + channelId);
    channelService.addUserToChannel(user, usernameTobeAdded, channelId).then(function (result) {
        response.status.statusCode = '200';
        response.status.message = 'added the user to the channel';
        res.status(200).send(response);
    }).catch(function (err) {
        logger.error("could not add the user to channel", err);
        response.status.statusCode = '500';
        response.status.message = err;
        res.status(500).send(response);
    })
}

/**
 * this method is responsible for adding new member to channel
 */
function removeUserFromChannel(req, res) {
    var response = new Response();
    var usernameTobeRemoved = req.params.username;
    var user = req.userInfo;
    var channelId = req.params.channelId;
    logger.info("channel id" + channelId);
    channelService.removeUserFromChannel(user, usernameTobeRemoved, channelId).then(function (result) {
        response.status.statusCode = '200';
        response.status.message = 'removed the user from channel';
        res.status(200).send(response);
    }).catch(function (err) {
        logger.error("could not remove the user", err);
        response.status.statusCode = '500';
        response.status.message = 'could not remove the user from channel';
        res.status(500).send(response);
    })
}

function addMessageInChannel(req, res) {
    var response = new Response();
    var user = req.userInfo;
    var channelId = req.params.channelId;
    var message = req.body;
    channelService.addMessageInChannel(user, channelId, message).then(function (result) {
        response.data.message = message;
        response.status.statusCode = '200';
        response.status.message = 'posted a message in channel';
        res.status(200).send(response);
    }).catch(function (err) {
        logger.error("could not post message", err);
        response.status.statusCode = '500';
        response.status.message = 'could not post message';
        res.status(500).send(response);
    })
}

function getMessagesByChannel(req, res) {
    var response = new Response();
    var user = req.userInfo;
    var channelId = req.params.channelId;
    var pageNr = req.query.pno;
    var pageSize = req.query.psize;
    channelService.getMessagesByChannel(user, channelId, pageNr, pageSize).then(function (messages) {
        response.data.messages = messages
        response.status.statusCode = '200';
        response.status.message = 'fetched messages in channel';
        res.status(200).send(response);

    }).catch(function (err) {
        logger.error("err in channel", err);
        response.status.statusCode = '500';
        response.status.message = 'could not fetch the messages in channel';
        res.status(500).send(response);
    })
}

function getChannelById(req, res) {
    var response = new Response();
    var channelId = req.params.channelId;
    channelService.getChannelById(channelId).then(function (channel) {
        response.data.channel = channel
        response.status.statusCode = '200';
        response.status.message = 'fetched channel details';
        res.status(200).send(response);

    }).catch(function (err) {
        logger.error("err in channel", err);
        response.status.statusCode = '500';
        response.status.message = 'could not fetch channel details';
        res.status(500).send(response);
    })
}

module.exports = channelController;