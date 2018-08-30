var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: "localhost:9200",
  log: 'error'
});

var logger = require("../../logger");
var blogsMapping = require("./blogs-mapping.json");
var answersMapping = require("./answers-mapping.json");
var discussionsMapping = require("./discussions-mapping.json");
var postsMapping = require("./posts-mapping.json");
var streamsMapping = require("./streams-mapping.json");
var usersMapping = require("./users-mapping.json");
var indexSettings = require("./index-settings");



client.indices.delete({
  index: 'collaboration-platform'
}, function(err, res) {
  if (err) {
    logger.error("index is not existing" + err.message);
  } else {
    logger.info('Indexes have been deleted!');
  }
  client.indices.create({
      index: "collaboration-platform",
      body: indexSettings
    },
    function(err, resp, respcode) {
      if (err) {
        logger.error("could not create the index" + err);
      } else {
        createMappings();
        logger.info("response =" + JSON.stringify(resp) + "response code =" + respcode)
      }
    });
});

function createMappings() {
  client.indices.putMapping({
      index: "collaboration-platform",
      type: "blogs",
      body:blogsMapping
    },
    function(err, resp, respcode) {
      if (err) {
        logger.error("could not create the type in index" + err);
      } else {
        logger.info("response =" + JSON.stringify(resp) + "response code =" + respcode)
      }
    });

  client.indices.putMapping({
      index: "collaboration-platform",
      type: "discussions",
      body: discussionsMapping
    },
    function(err, resp, respcode) {
      if (err) {
        logger.error("could not create the type in index" + err);
      } else {
        logger.info("response =" + JSON.stringify(resp) + "response code =" + respcode)
      }
    });

  client.indices.putMapping({
      index: "collaboration-platform",
      type: "users",
      body: usersMapping
    },
    function(err, resp, respcode) {
      if (err) {
        logger.error("could not create the type in index" + err);
      } else {
        logger.info("response =" + JSON.stringify(resp) + "response code =" + respcode)
      }
    });

  client.indices.putMapping({
      index: "collaboration-platform",
      type: "answers",
      body: answersMapping
    },
    function(err, resp, respcode) {
      if (err) {
        logger.error("could not create the type in index" + err);
      } else {
        logger.info("response =" + JSON.stringify(resp) + "response code =" + respcode)
      }
    });

  client.indices.putMapping({
      index: "collaboration-platform",
      type: "posts",
      body: postsMapping
    },
    function(err, resp, respcode) {
      if (err) {
        logger.error("could not create the type in index" + err);
      } else {
        logger.info("response =" + JSON.stringify(resp) + "response code =" + respcode)
      }
    });

  client.indices.putMapping({
      index: "collaboration-platform",
      type: "streams",
      body: streamsMapping
    },
    function(err, resp, respcode) {
      if (err) {
        logger.error("could not create the type in index" + err);
      } else {
        logger.info("response =" + JSON.stringify(resp) + "response code =" + respcode)
      }
    });
}
