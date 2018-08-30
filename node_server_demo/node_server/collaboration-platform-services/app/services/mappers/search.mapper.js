var esConfig = require('../../../config/config').props().es;

var searchMapper = {
  searchAllResultMapper: searchAllResultMapper,
  mapSearchStreams: mapSearchStreams,
  extractIds: extractIds,
  mapMostUsedStreams: mapMostUsedStreams
}

function searchAllResultMapper(user, userStreams, searchResult) {
  var response = searchResult;
  var streamNames = userStreams.map(function (streamObject) {
    return streamObject.stream_name;
  });

  for (var i = 0; i < response.hits.hits.length; i++) {
    if (response.hits.hits[i]._type == esConfig.streamType) {
      response.hits.hits[i]._source.isSubscribed = streamNames.indexOf(response.hits.hits[i]._source.name) != -1;
    }
    if (response.hits.hits[i]._type == esConfig.userType) {
      response.hits.hits[i]._source.isFollowing = user.followers.indexOf(response.hits.hits[i]._source.user_name) != -1;
    }
  }
  return response;
}

function mapSearchStreams(searchResult) {
  var streams = searchResult.hits.hits;
  var searchResult = [];
  streams.forEach(function (stream) {
    searchResult.push(stream._source.name);
  })
  return searchResult;
}

function extractIds(results) {
  var ids = { "blog_ids": [], "discussion_ids": [], "post_ids": [], "answer_ids": [] };
  for (var i = 0; i < results.length; i++) {
    var type = results[i]._type;
    switch (type) {
      case "blogs":
        ids.blog_ids.push(results[i]._id)
        break;
      case "discussions":
        ids.discussion_ids.push(results[i]._id)
        break;
      case "posts":
        ids.post_ids.push(results[i]._id)
        break;
      case "answers":
        ids.answer_ids.push(results[i]._id)
        break;
    }
  }
  return ids;
}

function mapMostUsedStreams(aggregations) {
  var streams = aggregations.range;
  var response = [];
  for (var i = 0; i < streams.buckets.length; i++) {
    for (var j = 0; j < streams.buckets[i].top_tags.buckets.length; j++) {
      var itr, count_per_type = [];
      itr = {
        stream_name: streams.buckets[i].top_tags.buckets[j].key,
        streams_count: streams.buckets[i].top_tags.buckets[j].doc_count,
        counts_per_type: streams.buckets[i].top_tags.buckets[j].types_under_tags.buckets
      }
      response.push(itr);
    }
  }

  return response;
}

module.exports = searchMapper;
