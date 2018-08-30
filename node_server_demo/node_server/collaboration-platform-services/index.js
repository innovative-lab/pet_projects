var configObj = require("./config/config");
configObj.setEnv(process.argv[2]);
var config = configObj.props();
var logger = require("./logger");
var Mongoose = require("./config/mongoose");
var mong = new Mongoose();
var http = require('http');
var sockets = require("./config/sockets");
var apis = require("./config/cp-apis");

function start() {
  logger.info("starting the server using startup function");
  logger.info("argument passed to start process on port ",process.argv[3]);
  var port;
  if(process.argv[3]!=undefined){
     port = process.argv[3];
  }else{
     port = config.app.port;
  }
  var server = http.createServer(apis.app);
  sockets.init(server);
  server.listen(port);
  logger.info("Express server listening on port %d ", port);
  mong.connect();
}

start();
