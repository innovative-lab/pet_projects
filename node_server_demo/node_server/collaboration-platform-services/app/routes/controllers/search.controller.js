var searchService = require("../../services/search.service.js");
var Response = require("../response.js");
var config = require("../../../config/config").props().search;
var logger = require("../../../logger");

var searchController ={
  searchUsers : searchUsers,
  searchBlogs : searchBlogs,
  searchDiscussions : searchDiscussions,
  searchAll : searchAll,
  searchStreams : searchStreams
}

/**
 * search for users
 */
function searchUsers(req, res) {
  var pageNr = req.query.pno;
  var pageSize = req.query.psize;
  var response = new Response();
  var sText = req.query.stext;
  searchService.searchUserDocuments(sText, pageNr, pageSize).then(function(searchResponse) {
    response.data.searchResults = searchResponse;
    response.data.stext = sText;
    response.status.statusCode = '200';
    response.status.message = 'fetched users matching search text';
    res.status(200).send(response);
  }).catch(function(err) {
    logger.error(err);
    response.status.statusCode = '404';
    response.status.message = 'could not get the users';
    res.status(404).send(response);
  })
}

function searchBlogs(req, res) {
  var pageNr = req.query.pno;
  var pageSize = req.query.psize;
  var response = new Response();
  var sText = req.query.stext;
  searchService.searchBlogDocuments(sText, pageNr, pageSize).then(function(searchResponse) {
    response.data.searchResults = searchResponse;
    response.data.stext = sText;
    response.status.statusCode = '200';
    response.status.message = 'fetched blogs matching search text';
    res.status(200).send(response);
  }).then(undefined, function(err) {
    response.status.statusCode = '404';
    response.status.message = 'could not get the blogs';
    res.status(404).send(response);
  })
}

function searchDiscussions(req, res) {
  var pageNr = req.query.pno;
  var pageSize = req.query.psize;
  var response = new Response();
  var sText = req.query.stext;
  searchService.searchDiscussionDocuments(sText, pageNr, pageSize).then(function(searchResponse) {
    response.data.searchResults = searchResponse;
    response.data.stext = sText;
    response.status.statusCode = '200';
    response.status.message = 'fetched discussions matching search text';
    res.status(200).send(response);
  }).then(undefined, function(err) {
    response.status.statusCode = '404';
    response.status.message = 'could not get the discussions';
    res.status(404).send(response);
  })
}

function searchAll(req, res) {
  var pageNr = req.query.pno;
  var pageSize = req.query.psize;
  var response = new Response();
  var sText = req.query.stext;
  var user = req.userInfo;

  searchService.searchAllDocuments(user, sText, pageNr, pageSize).then(function(searchResponse) {
    response.data.searchResults = searchResponse;
    response.data.stext = sText;
    response.status.statusCode = '200';
    response.status.message = 'fetched documents matching the search text';
    res.status(200).send(response);
  }).then(undefined, function(err) {
    logger.error("could not get the discussions/blogs/users",err);
    response.status.statusCode = '404';
    response.status.message = 'could not get the discussions/blogs/users';
    res.status(404).send(response);
  })
}

function searchStreams(req, res) {
  var response = new Response();
  var sText = req.query.stext;
  searchService.searchStreams(sText).then(function(streams) {
    response.data.searchResults = streams;
    response.status.statusCode = '200';
    response.status.message = 'fetched streams';
    res.status(200).send(response);
  }).then(undefined, function(err) {
    logger.error("could not get streams",err);
    response.status.statusCode = '404';
    response.status.message = 'could not get streams';
    res.status(404).send(response);
  })
}

module.exports = searchController;
