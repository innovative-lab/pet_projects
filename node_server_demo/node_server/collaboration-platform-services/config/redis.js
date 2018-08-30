var redis = require('redis');
var redisConfig = require('./config').props().redis;
var logger = require("../logger");
var client = redis.createClient(redisConfig.port, redisConfig.host);
/*client.auth(redisConfig.password, function (err) {
    if (err) {
        throw err;
    }
});*/
client.on('connect', function () {
    logger.info("Connected to Redis server and will be accessed through ", redisConfig.host + ":" + redisConfig.port, " by this app.");
});
module.exports = client;
