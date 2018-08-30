var aad = require('azure-ad-jwt');
var userService = require("../../services/user.service.js");
var logger = require("../../../logger.js");

function init(socketNS) {
    socketNS.use(function (socket, next) {
        var query = socket.handshake.query;
        var jwtToken = query['Authorization'];
        /*var jwtToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik1uQ19WWmNBVGZNNXBPWWlKSE1iYTlnb0VLWSIsImtpZCI6Ik1uQ19WWmNBVGZNNXBPWWlKSE1iYTlnb0VLWSJ9.eyJhdWQiOiJodHRwOi8vY29sbGFib3JhdGlvbi1wbGF0Zm9ybS1zZXJ2aWNlcyIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0Lzg1Yzk5N2I5LWY0OTQtNDZiMy1hMTFkLTc3Mjk4M2NmNmYxMS8iLCJpYXQiOjE0NjkwNzgxMzUsIm5iZiI6MTQ2OTA3ODEzNSwiZXhwIjoxNDY5MDgyMDM1LCJhY3IiOiIxIiwiYW1yIjpbInB3ZCJdLCJhcHBpZCI6ImI3MTRlMmE0LWVkNmQtNDFjNy05ODI1LThlYTEwMDVlYTRhOCIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoiVmFkZ2F2ZSIsImdpdmVuX25hbWUiOiJCaHVzaGFuIiwiaXBhZGRyIjoiMTEyLjEyMS41NS45IiwibmFtZSI6IkJodXNoYW4gQmFsYXNhaGViIFZhZGdhdmUiLCJvaWQiOiIyZDAwYzlkMy00NmY4LTQ0ZGUtOTI1Yi0xNmU4NjRiZjNlN2MiLCJvbnByZW1fc2lkIjoiUy0xLTUtMjEtNDQ4NTM5NzIzLTc0NjEzNzA2Ny0xODAxNjc0NTMxLTE5MzkwMCIsInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInN1YiI6IlZmek8yM3NhRThQMnZyeFhqSTVuWXNGdFFwdlU3bk9tOWlxVG5BVWc3bVEiLCJ0aWQiOiI4NWM5OTdiOS1mNDk0LTQ2YjMtYTExZC03NzI5ODNjZjZmMTEiLCJ1bmlxdWVfbmFtZSI6Ik0xMDIwMzg3QG1pbmR0cmVlLmNvbSIsInVwbiI6Ik0xMDIwMzg3QG1pbmR0cmVlLmNvbSIsInZlciI6IjEuMCJ9.AVnqtZ81ztA9RbC5rVUu0WeiKxoc5Kmj7hqGa4MR_uhMWH8RJpybC5F6YKj-1mE3HnRbWmnfZNyUPJHeL2FUp2mdnMdTDGpGuLMnFBStP7tZEBHILqPklN0z1yaJ6kXdMXuj_T5ic7lj5qPA_ybTFeuAppYC7TchydebNqqbVVzE5kkI3Ml9uJki7gvGQSgkvmYmO0J7df-umsGOjcqc4jDHcBSymUH-Si2YPlVdo6jsMH6NoX2HuAM-n8VuCOWgNwRszfxlV-jZL3A9l_dXc-MsKLYFuG64SeTq6xdPfdaRI0-ow_JNd8HUJ4Zw4wdxvHl55K7BUa0e752RFk2M4g";*/
        if (jwtToken) {
            aad.verify(jwtToken, null, function (err, result) {
                if (result) {
                    var userInfo = userService.buildUserInfo(result);
                    userService.getUserByUsername(userInfo.user_name).then(function (user) {
                        if (user == null) {
                            return userService.createUser(userInfo);
                        } else {
                            socket.userInfo = user;
                        }
                    }).then(function (user) {
                        if (user) {
                            socket.userInfo = user;
                        }
                        next();
                    }).then(undefined, function (err) {
                        logger.error("Error=", err);
                        next(new Error('not authorized'));
                    })
                } else {
                    logger.debug("JWT is invalid: " + err);
                    next(new Error('not authorized'));
                }
            });
        } else {
            logger.error("No token present in the request");
            next(new Error('not authorized'));
        }
    });
}

module.exports = {
    init : init
};