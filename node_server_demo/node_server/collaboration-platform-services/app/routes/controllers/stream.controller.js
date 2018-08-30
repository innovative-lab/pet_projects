var streamService = require("../../services/stream.service");
var searchService = require("../../services/search.service.js");
var logger = require("../../../logger.js");
var Response = require("../response.js");

/**
 * Controller to do CRUD operations on stream.
 */
var streamController = {
  /**
   * to create streams.
   */
  create: createStream,
  /**
   * to get streams.
   */
  getAllStreams: getAllStreams,
  /**
   * to get streams by user.
   */
  getStreamsByUser: getStreamsByUser,
  /**
   * to unsubscribe or subscribe an stream
   */
  subscribeUnsubscribe: subscribeUnsubscribe,
  /**
   * get the content for the subscribed streams for a user.
   */
  getSubscribedStreamContentForUser: getSubscribedStreamContentForUser,
  /**
  * get the most subscribed stream.
  */
  getMostSubscribedStreams: getMostSubscribedStreams,
  /**
  * get the most subscribed stream.
  */
  getMostUsedStreamsCount: getMostUsedStreamsCount
}

function getMostSubscribedStreams(req, res) {
  var response = new Response();
  var pageSize = req.query.psize;
  streamService.getMostSubscribedStreams(pageSize).then(function (data) {
    response.data.streams = data;
    response.status.statusCode = '200';
    response.status.message = 'retrieved most subscribed streams';
    res.status(200).send(response);
  }).then(undefined, function (err) {
    logger.error("unable to fetch most subscribed streams", err);
    response.status.statusCode = '500';
    response.status.message = 'could not retrieve most subscribed streams';
    res.status(500).send(response);
  })
}

/**
 * get all the blogs request url : /collab-services/streams
 */
function getAllStreams(req, res) {
  var pageNr = req.query.pno;
  var pageSize = req.query.psize;
  var response = new Response();
  var user = req.userInfo;
  streamService.getStreams(user, pageNr, pageSize).then(function (streams) {
    response.data.streams = streams;
    response.status.statusCode = '200';
    response.status.message = 'fetched the streams';
    res.status(200).send(response);
  }).catch(function (err) {
    logger.error("unable to fetch the streams", err);
    response.status.statusCode = '500';
    response.status.message = 'unable to fetch streams ' + err;
    res.status(500).send(response);
  });
}

function getStreamsByUser(req, res) {
  var user = req.userInfo;
  var response = new Response();
  streamService.getStreamsByUser(user).then(function (streams) {
    response.data.streams = streams;
    response.status.statusCode = '200';
    response.status.message = 'fetched the streams';
    res.status(200).send(response);
  }).catch(function (err) {
    logger.error("unable to fetch the streams of user", err);
    response.status.statusCode = '500';
    response.status.message = 'unable to fetch streams ' + err;
    res.status(500).send(response);
  });
}

/**
 * req ={
   "stream_name":""
 }
 */
function createStream(req, res) {
  var response = new Response();
  var streamName = req.params.streamName;
  streamService.createStream(streamName)
    .then(function () {
      response.status.statusCode = '201';
      response.status.message = 'created streams successfully';
      res.status(201).send(response);
    }).catch(function (err) {
      logger.error("could not get the streams", err);
      response.status.statusCode = '500';
      response.status.message = 'could not able to create streams';
      res.status(500).send(response);
    });
}


function subscribeUnsubscribe(req, res) {
  var response = new Response();
  var streamName = req.params.streamName;
  var isSubscribed = req.params.isSubscribed;
  var user = req.userInfo;
  logger.debug("Got request to update subscription for stream", streamName);
  streamService.subscribeUnsubscribeStream(user, streamName, isSubscribed).then(function (result) {
    logger.debug("subscription updated successfully");
    response.status.statusCode = '200';
    response.status.message = 'subscription updated successfully';
    res.status(200).send(response);
  }).catch(function (err) {
    logger.error("could not update the subscription", err);
    response.status.statusCode = '500';
    response.status.message = 'could not update the subscription';
    res.status(500).send(response);
  });
}

function getSubscribedStreamContentForUser(req, res) {
  var response = new Response();
  var user = req.userInfo;
  var pageNr = req.query.pno;
  var pageSize = req.query.psize;
  var tags = req.query.tags;
  var followers = req.query.followers;
  streamService.getSubscribedStreamContentForUser(user, tags, followers, pageNr, pageSize).then(function (result) {
    logger.debug("get subscribed content");
    response.data.streamsActivity = result;
    response.status.statusCode = '200';
    response.status.message = 'fetched the content for all subscribed streams';
    res.status(200).send(response);
  }).catch(function (err) {
    logger.error("could not get stream content for user", err);
    response.status.statusCode = '500';
    response.status.message = 'could not fetch subscribed streams';
    res.status(500).send(response);
  })
}

function getMostUsedStreamsCount(req, res) {
  var response = new Response();
  var pageSize = req.query.psize;
  searchService.getMostUsedStreamsCount(pageSize).then(function (result) {
    logger.debug("get most used streams response");
    response.data = result;
    response.status.statusCode = '200';
    response.status.message = 'fetched the count of frequently used streams';
    res.status(200).send(response);
  }).catch(function (err) {
    logger.error("could not get the count of frequently used streams", err);
    response.status.statusCode = '500';
    response.status.message = 'could not get the count of frequently used streams';
    res.status(500).send(response);
  })
}
module.exports = streamController;
