var elasticsearch = require('elasticsearch');
var esConfig = require('./config').props().es;
var logger = require('../logger');
var client = new elasticsearch.Client({
    host: esConfig.host + ':' + esConfig.port,
    log: 'error'
});

client.ping({
    requestTimeout: 30000,
    hello: "elasticsearch"
}, function (error) {
    if (error) {
        logger.error('Elasticsearch is down!');
    } else {
        logger.info("Elasticsearch is up and will be accessed through ",esConfig.host + ":" + esConfig.port," by this app.");
    }
});

module.exports = client;