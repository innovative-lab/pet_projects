var Promise = require("bluebird");
var esConfig = require('../../config/config').props().es;
var userType = esConfig.userType;
var blogType = esConfig.blogType;
var discussionType = esConfig.discussionType;
var answerType = esConfig.answerType;
var streamType = esConfig.streamType;
var logger = require('../../logger.js');
var client = require('../../config/elasticsearch');
var constants = require('./constants.js');
var searchMapper = require('./mappers/search.mapper.js');
var underscore = require('underscore');

var searchUserDocuments = function (searchText, pageNr, pageSize) {
  pageNr = validatePageNr(pageNr);
  pageSize = validatePageSize(pageSize);
  var nrOfResultsToBeSkipped = (pageNr - 1) * pageSize;
  var nrOfResults = pageSize;
  return new Promise(function (resolve, reject) {
    var query = {
      index: esConfig.index,
      type: userType,
      body: {
        "query": {
          "multi_match": {
            "fields": ["user_name", "first_name", "last_name"],
            "query": searchText
          }
        }
      },
      from: nrOfResultsToBeSkipped,
      size: nrOfResults
    };
    client.search(query, function (error, response) {
      if (!error) {
        resolve(response.hits);
      } else {
        reject(error);
      }
    });
  });
};

var searchBlogDocuments = function (searchText, pageNr, pageSize) {
  pageNr = validatePageNr(pageNr);
  pageSize = validatePageSize(pageSize);
  var nrOfResultsToBeSkipped = (pageNr - 1) * pageSize;
  var nrOfResults = pageSize;
  return new Promise(function (resolve, reject) {
    var query = {
      index: esConfig.index,
      type: blogType,
      body: {
        query: {
          match: {
            _all: searchText
          }
        }
      },
      from: nrOfResultsToBeSkipped,
      size: nrOfResults
    };
    client.search(query, function (error, response) {
      if (!error) {
        resolve(response.hits);
      } else {
        reject(error);
      }
    });
  });
};

var searchDiscussionDocuments = function (searchText, pageNr, pageSize) {
  pageNr = validatePageNr(pageNr);
  pageSize = validatePageSize(pageSize);
  var nrOfResultsToBeSkipped = (pageNr - 1) * pageSize;
  var nrOfResults = pageSize;
  return new Promise(function (resolve, reject) {
    var query = {
      index: esConfig.index,
      type: discussionType,
      body: {
        query: {
          match: {
            _all: searchText
          }
        }
      },
      from: nrOfResultsToBeSkipped,
      size: nrOfResults
    };
    client.search(query, function (error, response) {
      if (!error) {
        resolve(response.hits);
      } else {
        reject(error);
      }
    });
  });
};

var searchAllDocuments = function (user, searchText, pageNr, pageSize) {
  pageNr = validatePageNr(pageNr);
  pageSize = validatePageSize(pageSize);
  var nrOfResultsToBeSkipped = (pageNr - 1) * pageSize;
  var nrOfResults = pageSize;

  return new Promise(function (resolve, reject) {
    var query = {
      index: esConfig.index,
      type: userType + ',' + streamType + ',' + blogType + ',' + discussionType + ',' + answerType,
      body: {
        query: {
          match: {
            _all: searchText
          }
        }
      },
      from: nrOfResultsToBeSkipped,
      size: nrOfResults
    };
    client.search(query, function (error, response) {
      if (!error) {
        resolve(response.hits);
      } else {
        reject(error);
      }
    });
  });
};

var searchAllDocumentsByTagsOrAuthor = function (tags, followers, pageNr, pageSize) {
  var followingsMids = extractMids(followers);
  var searchText = tags.join(" ") + " " + followingsMids.join(" ");
  pageNr = validatePageNr(pageNr);
  pageSize = validatePageSize(pageSize);
  var nrOfResultsToBeSkipped = (pageNr - 1) * pageSize;
  var nrOfResults = pageSize;
  return new Promise(function (resolve, reject) {
    var query = {
      index: esConfig.index,
      body: {
        fields: [
          "_id"
        ],
        query: {
          multi_match: {
            query: searchText,
            fields: ["created_by.user_name", "tags"]
          }
        },
        sort: [{
          "created_at": {
            "order": "desc"
          }
        }]
      },
      from: nrOfResultsToBeSkipped,
      size: nrOfResults
    };
    client.search(query, function (error, response) {
      if (!error) {
        var ids = searchMapper.extractIds(response.hits.hits);
        resolve(ids);
      } else {
        reject(error);
      }
    });
  });

}

var searchAllDocumentsByTagsAndAuthor = function (tags, followers, pageNr, pageSize) {
  var followingsMids = extractMids(followers);
  var searchText = followingsMids.join(" ");
  pageNr = validatePageNr(pageNr);
  pageSize = validatePageSize(pageSize);
  var nrOfResultsToBeSkipped = (pageNr - 1) * pageSize;
  var nrOfResults = pageSize;
  return new Promise(function (resolve, reject) {
    var query = {
      index: esConfig.index,
      body: {
        fields: [
          "_id",
          "tags"
        ],
        query: {
          multi_match: {
            query: searchText,
            fields: ["created_by.user_name"]
          }
        },
        sort: [{
          "created_at": {
            "order": "desc"
          }
        }]
      },
      from: nrOfResultsToBeSkipped,
      size: nrOfResults
    };
    client.search(query, function (error, response) {
      if (!error) {
        //logic to extract only content user has subscribed to tags
        var results = response.hits.hits;
        var resultList = [];
        for (var i = 0; i < results.length; i++) {
          if (underscore.intersection(results[i].fields.tags, tags).length > 0) {
            resultList.push(results[i]);
          }
        }
        var ids = searchMapper.extractIds(resultList);
        resolve(ids);
      } else {
        reject(error);
      }
    });
  });



}

var searchAllDocumentsByTags = function (filteredTags, pageNr, pageSize) {
  pageNr = validatePageNr(pageNr);
  pageSize = validatePageSize(pageSize);
  var nrOfResultsToBeSkipped = (pageNr - 1) * pageSize;
  var nrOfResults = pageSize;
  return new Promise(function (resolve, reject) {
    var query = {
      index: esConfig.index,
      body: {
        fields: [
          "_id"
        ],
        query: {
          terms: {
            tags: filteredTags
          }
        },
        sort: [{
          "created_at": {
            "order": "desc"
          }
        }]
      },
      from: nrOfResultsToBeSkipped,
      size: nrOfResults
    };
    client.search(query, function (error, response) {
      if (!error) {
        var ids = searchMapper.extractIds(response.hits.hits);
        resolve(ids);
      } else {
        reject(error);
      }
    });
  });

}

var searchAllDocumentsByUsers = function (followers, pageNr, pageSize) {
  var followingsMids = extractMids(followers);
  var searchText = followingsMids.join(" ");
  pageNr = validatePageNr(pageNr);
  pageSize = validatePageSize(pageSize);
  var nrOfResultsToBeSkipped = (pageNr - 1) * pageSize;
  var nrOfResults = pageSize;
  return new Promise(function (resolve, reject) {
    var query = {
      index: esConfig.index,
      body: {
        fields: [
          "_id"
        ],
        query: {
          multi_match: {
            query: searchText,
            fields: ["created_by.user_name"]
          }
        },
        sort: [{
          "created_at": {
            "order": "desc"
          }
        }]
      },
      from: nrOfResultsToBeSkipped,
      size: nrOfResults
    };
    client.search(query, function (error, response) {
      if (!error) {
        var ids = searchMapper.extractIds(response.hits.hits);
        resolve(ids);
      } else {
        reject(error);
      }
    });
  });

}

var searchStreams = function (sText) {
  if (sText.length >= constants.TAG_LENGTH_FOR_AUTOPOPULATING) {
    return new Promise(function (resolve, reject) {
      var query = {
        index: esConfig.index,
        type: streamType,
        body: {
          query: {
            match: {
              name: sText
            }
          }
        }
      };
      client.search(query, function (error, response) {
        if (!error) {
          var streams = searchMapper.mapSearchStreams(response);
          resolve(streams);
        } else {
          reject(error);
        }
      });
    });
  } else {
    throw new Error("invalid blog input");
  }
}

var getMostUsedStreamsCount = function (pageSize) {
  pageSize = validatePageSize(pageSize);
  var nrOfResults = pageSize;
  return new Promise(function (resolve, reject) {
    var query = {
      index: esConfig.index,
      body: {
        aggs: {
          range: {
            date_range: {
              field: "created_at",
              ranges: [{ from: 'now-1M' }]
            },
            aggs: {
              "top_tags": {
                terms: { field: "tags", size: nrOfResults },
                aggs: { "types_under_tags": { terms: { field: "_type" } } }
              }
            }
          }
        }
      }
    };
    client.search(query, function (error, response) {
      if (!error) {
        var streams = searchMapper.mapMostUsedStreams(response.aggregations);
        resolve(streams);
      } else {
        reject(error);
      }
    });
  });
}

function validatePageNr(pageNr) {
  if (pageNr == undefined) {
    return 1;
  }
  return pageNr;
}

function validatePageSize(pageSize) {
  if (pageSize == undefined) {
    return constants.DEFAULT_NO_OF_RESULTS;
  }
  return pageSize;
}

function extractMids(followings) {
  followingMids = [];
  followings.forEach(function (following) {
    var followingMid = following.replace("@mindtree.com", "");
    followingMids.push(followingMid);
  });
  return followingMids;
}



var searchService = {
  searchUserDocuments: searchUserDocuments,
  searchBlogDocuments: searchBlogDocuments,
  searchDiscussionDocuments: searchDiscussionDocuments,
  searchAllDocuments: searchAllDocuments,

  searchAllDocumentsByTags: searchAllDocumentsByTags,
  searchAllDocumentsByTagsOrAuthor: searchAllDocumentsByTagsOrAuthor,
  searchAllDocumentsByUsers: searchAllDocumentsByUsers,
  searchAllDocumentsByTagsAndAuthor: searchAllDocumentsByTagsAndAuthor,

  searchStreams: searchStreams,
  getMostUsedStreamsCount: getMostUsedStreamsCount
};

module.exports = searchService;
