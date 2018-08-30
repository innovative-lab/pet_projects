var aad = require('azure-ad-jwt');
var userService = require("../../services/user.service.js");

var logger = require("../../../logger");

var authFilter = function (router) {
    router.use('/collab-services/apis/*', function (req, res, next) {
        var jwtToken = req.get('Authorization');
        if (jwtToken) {
            aad.verify(jwtToken, null, function (err, result) {
                if (result) {
                    var userInfo = userService.buildUserInfo(result);
                    userService.getUserByUsername(userInfo.user_name).then(function (user) {
                        if (user == null) {
                            return userService.createUser(userInfo);
                        } else {
                            req.userInfo = user;
                        }
                    }).then(function (user) {
                        if (user) {
                            req.userInfo = user;
                        }
                        next();
                    }).then(undefined, function (err) {
                        logger.error("Error=", err);
                        res.status(500).send();
                    })
                } else {
                    logger.debug("JWT is invalid: " + err);
                    res.status(401).send();
                }
            });
        } else {
            logger.info("No token present in the request");
            res.status(401).send();
        }
    });
};

module.exports = authFilter;
