var _data = require('./data');
var helpers = require('./helpers');


var handlers = {};
handlers._login = {};
handlers._signup = {};
handlers._main = {};

handlers.signup = (data, callback) => {
    var acceptableMethods = ['POST', 'OPTIONS'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._signup[data.method](data, callback);
    } else {
        callback(405);
    }
}
handlers.login = (data, callback) => {
    var acceptableMethods = ['GET', 'OPTIONS'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._login[data.method](data, callback);
    } else {
        callback(405);
    }
}

handlers.notFound = (data, callback) => {
    callback(404);
}

handlers.main = (data, callback) => {
    var acceptableMethods = ['POST', 'GET'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._main[data.method](data, callback);
    } else {
        callback(405);
    }
}

handlers._main.GET = (data, callback) => {
    var phone = typeof (data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if (phone) {
        // Lookup the user
        _data.read('users', phone, function (err, data) {
            if (!err && data) {
                // Remove the hashed password from the user user object before returning it to the requester
                delete data.hashedPassword;
                callback(200, data);
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field' })
    }
}
handlers._login.GET = (data, callback) => {
    var phone = typeof (data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if (phone) {
        // Lookup the user
        _data.read('users', phone, function (err, data) {
            if (!err && data) {
                // Remove the hashed password from the user user object before returning it to the requester
                delete data.hashedPassword;
                callback(200, data);
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, { 'Error': 'Missing required field' })
    }
}
handlers._signup.OPTIONS = (data, callback) => {
    return callback(200);
}
handlers._login.OPTIONS = (data, callback) => {
    return callback(200);
}
handlers._signup.POST = (data, callback) => {
    var name = typeof (data.payload.name) == 'string' && data.payload.name.trim().length > 0 ? data.payload.name.trim() : false;
    var phone = typeof (data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    var email = typeof (data.payload.email) == 'string' ? data.payload.email.trim() : false;
    var password = typeof (data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    var tosAgreement = typeof (data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;
    if (name && phone && password && tosAgreement) {


        _data.read("users", phone, (err) => {
            if (err) {
                var hashedPassword = helpers.hash(password);

                if (hashedPassword) {
                    var userObject = {
                        'name': name,
                        'phone': phone,
                        'email': email,
                        'hashedPassword': hashedPassword,
                        'tosAgreement': true
                    };

                    // Store the user
                    _data.create('users', phone, userObject, function (err) {
                        if (!err) {
                            delete userObject.hashedPassword;
                            callback(200, userObject);
                        } else {
                            callback(500, { 'Error': 'Could not create the new user' });
                        }
                    });
                } else {
                    callback(500, { 'Error': 'Could not hash the user\'s password.' });
                }
            } else {
                callback(400, { 'Error': 'A user with that phone number already exists' });
            }
        })
    } else {
        callback(400, { 'Error': 'Missing required fields' });
    }
}

module.exports = handlers;