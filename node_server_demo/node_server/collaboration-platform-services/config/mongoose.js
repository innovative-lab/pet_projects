var config = require("./config").props();
var mongoose = require("mongoose");
var logger = require("../logger");

function connect() {

  var options = {
            user: config.db.userName,
            pass: config.db.password,
            auth: {
                authdb: config.db.authenticationDB
            }
        };
  mongoose.connect('mongodb://' + config.db.host + ':' + config.db.port + '/' + config.db.dbName,options);
  mongoose.connection.on('connected',  function ()  {
        logger.info("Connection to Mongo established and will be accessed through ",config.db.host + ":" + config.db.port," by this app.");
  });

  mongoose.connection.on('error',  function (err)  {
        logger.error('Connection to mongo failed '  +  err);
  });
}

var Mongoose = function () {
  this.connect = connect;
}

module.exports = Mongoose;