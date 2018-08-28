var fs = require('fs');
var helpers = require('./helpers');
var path = require('path');

var lib = {};

lib.baseURL = path.join(__dirname , "/../.data/");

lib.create = (dir, file, data, callback) => {

    fs.open(lib.baseURL + dir + '/' + file + ".json", "wx", (err, fileDescriptor) => {
        
        if (!err && fileDescriptor) {
            var stringData = JSON.stringify(data);
            fs.writeFile(fileDescriptor, stringData, err => {
                if (!err) {
                    fs.close(fileDescriptor, (err) => {
                        if (!err) {
                            callback(false);
                        } else {
                            callback('Error closing new file');
                        }
                    })
                } else {
                    callback('Error writing to new file');
                }
            })
        } else {
            callback("Could not create new file, it may already exist");
        }
    })
}

lib.read = function (dir, file, callback) {
    fs.readFile(lib.baseURL + dir + '/' + file + '.json', 'utf8', function (err, data) {
        if (!err && data) {
            var parsedData = helpers.parseJsonToObject(data);
            callback(false, parsedData);
        } else {
            callback(err, data);
        }
    });
};

module.exports = lib;