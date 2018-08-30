var winston = require('winston');
var fs = require('fs');
var path = require('path');
var logDirLocation = process.env.CP_LOG_DIR || "logs";
var logFileName = "collaboration-services.log";

var createLogsDir = function () {
    if (!fs.existsSync(logDirLocation)) {
        fs.mkdirSync(logDirLocation);
    }
}

createLogsDir();

winston.emitErrs = false;

function formatter(args) {
  var dataTimeComponent = new Date();
  var dateTimeComponents = new Date().toLocaleTimeString('en-us').split(',');
  var logMessage = dataTimeComponent + ' - ' + args.level + ': ' + args.message;
  return logMessage;
}

var logger = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'debug',
            filename: logDirLocation+'/'+logFileName,
            handleExceptions: true,
            json: false,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: true,
            formatter: formatter
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true,
            timestamp:true,
            label:'collab-services',
            humanReadableUnhandledException :true
        })
    ],
    exitOnError: false
});

module.exports = logger;

module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};