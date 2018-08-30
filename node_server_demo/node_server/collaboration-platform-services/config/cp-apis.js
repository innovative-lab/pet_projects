var config = require('./config').props();
var swaggerFileName = '../public/swagger-ui/data/swagger.json';
var swaggerJsonFile = require(swaggerFileName);
var express = require("express");
var path = require('path');
var bodyParser = require("body-parser");
var blogController = require("../app/routes/controllers/blog.controller");
var activityController = require("../app/routes/controllers/activity.controller");
var userController = require("../app/routes/controllers/user.controller");
var discussionController = require("../app/routes/controllers/discussion.controller");
var answerController = require("../app/routes/controllers/answer.controller");
var searchController = require("../app/routes/controllers/search.controller");
var categoryController = require("../app/routes/controllers/category.controller");
var alfrescoController = require("../app/routes/controllers/alfresco.controller");
var dashboardController = require("../app/routes/controllers/dashboard.controller");
var notificationController = require("../app/routes/controllers/notification.controller");
var channelController = require("../app/routes/controllers/channel.controller");
var postController = require("../app/routes/controllers/post.controller");
var streamController = require("../app/routes/controllers/stream.controller");
var linkPreviewController = require("../app/routes/controllers/linkPreview.controller");
var routes = require("../app/routes/routes");
var swagger = require("swagger-node-express");
var authFilter = require("../app/routes/filters/auth.filter");
var corsFilter = require("../app/routes/filters/cors.filter");
var logger = require("../logger.js");
var morganLogger = require("morgan");
var fs = require('fs');

var app = express();

app.use(morganLogger('dev'));
//app.use(express.static(path.join(__dirname, 'public')));
app.use('/collab-services/swagger', express.static('./public/swagger-ui'));

var router = express.Router();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  "extended": false
}));

corsFilter(router);

router.get('/collab-services/swaggerjson', function (req, res) {
  res.send(swaggerJsonFile);
});
authFilter(router);

app.use('/', router);
var controllers = {
  blogController: blogController,
  activityController: activityController,
  userController: userController,
  discussionController: discussionController,
  answerController: answerController,
  searchController: searchController,
  categoryController: categoryController,
  dashboardController: dashboardController,
  notificationController: notificationController,
  postController: postController,
  streamController: streamController,
  channelController: channelController,
  alfrescoController: alfrescoController,
  linkPreviewController: linkPreviewController
};

if (!fs.existsSync(config.logs.location)) {
  // Create the directory if it does not exist
  fs.mkdirSync(config.logs.location);
}

routes.setup(router, controllers);

var cpApis = {
  app: app
};

module.exports = cpApis;
