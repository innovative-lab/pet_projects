
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;

var config = require('./lib/config');
var helpers = require('./lib/helpers');
var handlers = require('./lib/handlers');

var httpServer = http.createServer((req, res) => {
    serverHandler(req, res);
});

var serverHandler = (req, res) => {

    var parsedUrl = url.parse(req.url, true);

    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    var queryStringObject = parsedUrl.query;

    var method = req.method.toUpperCase();

    var headers = req.headers;
    console.log("request", parsedUrl);

    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', data => {
        buffer += decoder.write(data);

    })

    req.on('end', () => {
        buffer += decoder.end();

        var data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': helpers.parseJsonToObject(buffer)
        }
        
        var chooseHandler = typeof (router[trimmedPath]) !== "undefined" ? router[trimmedPath] : handlers.notFound;
        console.log("data", data);
        chooseHandler(data, (statusCode, payload) => {
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

            payload = typeof (payload) == 'object' ? payload : {};

            var payloadString = JSON.stringify(payload);


            res.setHeader('Content-Type', 'application/json');
            // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

            // Request methods you wish to allow
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

            // Request headers you wish to allow
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

            // Set to true if you need the website to include cookies in the requests sent
            // to the API (e.g. in case you use sessions)
            res.setHeader('Access-Control-Allow-Credentials', true);
            res.writeHead(statusCode);
            res.end(payloadString);
        })
    })


}

httpServer.listen(config.httpPort, () => {
    console.log("Port running at " + config.httpPort);
})

var router = {
    'login': handlers.login,
    'signup': handlers.signup,
    'main': handlers.main
}

