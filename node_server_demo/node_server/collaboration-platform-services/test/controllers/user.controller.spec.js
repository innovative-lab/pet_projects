var sinon = require('sinon');
var should = require('chai').should;
var expect = require('chai').expect;
var assert = require('chai').assert;

var userController = require('../../app/routes/controllers/user.controller.js');
var userService = require('../../app/services/user.service.js');
var Promise = require('bluebird');
var http_mocks = require('node-mocks-http');

describe('user controller', function () {
    var loggedInUser = {
        user_name: "john@mindtree.com",
        profile_pic_file: {
            ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
            name: "f344_1394167081599saihareesh.jpg"
        },
        full_name: "John Doe",
        email: null,
        last_name: "Doe",
        first_name: "John",
        employee_id: "M1234567",
        subscribed_streams: [],
        followings: [],
        _id: "5795b9b3d387d768806d80de"
    };

    describe('addUser', function () {
        var mockedUserService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                body: loggedInUser
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });
            mockedUserService = sinon.mock(userService);
            done();
        })

        it('create user response', function (done) {
            mockedUserService.expects('createUser').once().withArgs(loggedInUser).returns(Promise.resolve(loggedInUser));

            var expectedResponse = {
                "data": { "user": loggedInUser },
                "status": { "statusCode": "200", "message": "created the user" }
            };
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            userController.addUserInfo(request, response);
        })

        it('create user response if body is undefined', function (done) {
            var req = http_mocks.createRequest({});
            mockedUserService.expects('createUser').once().withArgs({}).returns(Promise.reject());

            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "500", "message": "could not create user" }
            };
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            userController.addUserInfo(req, response);
        })

        afterEach(function (done) {
            mockedUserService.restore();
            done();
        })
    });

    describe('get user information', function () {
        var mockedUserService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                userInfo: loggedInUser
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });
            mockedUserService = sinon.mock(userService);
            done();
        })

        it('get user info if request consists of user info', function (done) {
            mockedUserService.expects('getUserByUsername').once().withArgs(loggedInUser.user_name).returns(Promise.resolve(loggedInUser));
            userController.getUserInfo(request, response);
            var expectedResponse = {
                "data": { "user": loggedInUser },
                "status": { "statusCode": "200", "message": "getting the user info" }
            };
            response.on('end', function () {
                var res = response._getData();
                expect(res.data.user).to.deep.equal(expectedResponse.data.user);
                done();
            })
        })

        it('get user info if request consists of username', function (done) {
            var req = http_mocks.createRequest({
                query: { 'username': 'john@mindtree.com' }
            });
            mockedUserService.expects('getUserByUsername').once().withArgs('john@mindtree.com').returns(Promise.resolve(loggedInUser));

            var expectedResponse = {
                "data": { "user": loggedInUser },
                "status": { "statusCode": "200", "message": "getting the user info" }
            };
            response.on('end', function () {
                var res = response._getData();
                expect(res.data.user).to.deep.equal(expectedResponse.data.user);
                done();
            })
            userController.getUserInfo(req, response);
        })

        afterEach(function (done) {
            mockedUserService.restore();
            done();
        })
    });

    describe('update email address', function () {
        var mockedUserService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                userInfo: loggedInUser,
                body: { email: 'john2@mindtree.com' }
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });
            mockedUserService = sinon.mock(userService);
            done();
        })


        it('update email of user', function (done) {
            mockedUserService.expects('updateEmail').once().withArgs(loggedInUser, 'john2@mindtree.com').returns(Promise.resolve());

            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "201", "message": "updated user successfully" }
            };
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            userController.updateEmail(request, response);
        })

        it('update email of user if body doesnot contain email', function (done) {
            var req = http_mocks.createRequest({
                userInfo: loggedInUser
            });
            mockedUserService.expects('updateEmail').once().withArgs(loggedInUser, undefined).returns(Promise.reject());

            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "500", "message": "could not update the user" }
            };
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            userController.updateEmail(req, response);
        })

        afterEach(function (done) {
            mockedUserService.restore();
            done();
        })
    });


    describe('update profile pic', function () {
        var mockedUserService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                userInfo: loggedInUser,
                body: {
                    profile_pic_filename: 'john.png',
                    profile_pic_noderef: '9808jasdfovasdfion9113'
                }
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });
            mockedUserService = sinon.mock(userService);
            done();
        })


        it('update profile pic', function (done) {
            mockedUserService.expects('updateProfilePic').once().withArgs(loggedInUser, 'john.png', '9808jasdfovasdfion9113').returns(Promise.resolve());

            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "201", "message": "updated user picture successfully" }
            };
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            userController.updateProfilePic(request, response);

        });

        it('error response of update profile pic', function (done) {
            var req = http_mocks.createRequest({
                userInfo: loggedInUser,
                body:{}
            });

            var expectedResponse = {
                "data": {},
                "status": {'statusCode': '400', 'message': 'profile pic filename and noderef are undefined'}
            };

            response.on('end', function () {
                console.log("end in the controller");
                res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            userController.updateProfilePic(req, response);
        });

        it('should return error response of update profile pic if userinfo is undefined', function (done) {
            var req = http_mocks.createRequest({
                body:{
                    profile_pic_filename: 'john.png',
                    profile_pic_noderef: '9808jasdfovasdfion9113'
                }
            });

            var expectedResponse = {
                "data": {},
                "status": {'statusCode': '500', 'message': 'could not update the profile pic'}
            };

            mockedUserService.expects('updateProfilePic').once().withArgs(undefined, 'john.png', '9808jasdfovasdfion9113').returns(Promise.resolve());

            response.on('end', function () {
                console.log("end in the controller");
                res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            userController.updateProfilePic(req, response);
        });

        afterEach(function (done) {
            mockedUserService.restore();
            done();
        })
    });

    describe('follow user', function () {
        var mockedUserService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                userInfo: loggedInUser,
                params: {
                    username: 'Mxxxxx@mindtree.com',
                    followValue: 1
                }
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });
            mockedUserService = sinon.mock(userService);
            done();
        })

        it('follow user', function (done) {
            mockedUserService.expects('followUser').once().withArgs(loggedInUser, 'Mxxxxx@mindtree.com', 1).returns(Promise.resolve());

            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "200", "message": "added users to followings list" }
            };
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            userController.followUser(request, response);
        })

        it('error response follow user ', function (done) {
            var req = http_mocks.createRequest({
                userInfo: loggedInUser,
                params: {
                    followValue: 1
                }
            });
            mockedUserService.expects('followUser').once().withArgs(loggedInUser, undefined, 1).returns(Promise.reject());

            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "500", "message": "could not follow user" }
            };
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            userController.followUser(req, response);
        })

        afterEach(function (done) {
            mockedUserService.restore();
            done();
        })
    });


    describe('get total counts by author', function () {
        var mockedUserService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                userInfo: loggedInUser,
                query: {
                    username: 'Mxxxxx@mindtree.com'
                }
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });
            mockedUserService = sinon.mock(userService);
            done();
        })

        it('get total counts response', function (done) {
            var expectedResponse = {
                "data": {
                    "answer_counts": 0,
                    "blog_counts": 0,
                    "discussion_counts": 0,
                    "post_counts": 0,
                    "followers_count": 2
                },
                "status": {
                    "statusCode": "200",
                    "message": "fetched the TotalCount"
                }
            };
            var serviceResponse = {
                "answer_counts": 0,
                "blog_counts": 0,
                "discussion_counts": 0,
                "post_counts": 0,
                "followers_count": 2
            }
            mockedUserService.expects('getTotalCountsByUser').once().withArgs('Mxxxxx@mindtree.com').returns(Promise.resolve(serviceResponse));

            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            userController.getTotalCountsByAuthor(request, response);
        })

        it('get total counts response', function (done) {
            var req = http_mocks.createRequest({
                userInfo: {}
            });
            var expectedResponse = {
                "data": {},
                "status": {
                    "statusCode": "404",
                    "message": "could not get the TotalCounts"
                }
            };
            mockedUserService.expects('getTotalCountsByUser').once().withArgs(undefined).returns(Promise.reject());

            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            userController.getTotalCountsByAuthor(req, response);
        })

        afterEach('', function (done) {
            mockedUserService.restore();
            done();
        })
    });

     describe('get my following users', function () {
        var mockedUserService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                userInfo: loggedInUser
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });
            mockedUserService = sinon.mock(userService);
            done();
        })

        it('follow user', function (done) {
            mockedUserService.expects('getMyFollowingUsers').once().withArgs(loggedInUser).returns(Promise.resolve([]));

            var expectedResponse = {
                "data": {"followedUsers":[]},
                "status": { "statusCode": "200", "message": "fetch the followings list" }
            };
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            userController.getMyFollowingUsers(request, response);
        })

        it('error response follow user ', function (done) {
            var req = http_mocks.createRequest({
                
            });
            mockedUserService.expects('getMyFollowingUsers').once().withArgs(undefined).returns(Promise.reject());

            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "404", "message": "could not get the followings list" }
            };
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            userController.getMyFollowingUsers(req, response);
        })

        afterEach(function (done) {
            mockedUserService.restore();
            done();
        })
    });

    describe('get most followed users', function () {
        var mockedUserService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                query:{psize:1}
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });
            mockedUserService = sinon.mock(userService);
            done();
        })

        it('follow user', function (done) {
            mockedUserService.expects('getMostFollowedUsers').once().withArgs(1).returns(Promise.resolve([]));

            var expectedResponse = {
                "data": {"users":[]},
                "status": { "statusCode": "200", "message": "retrieved most followed users" }
            };
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            userController.getMostFollowedUsers(request, response);
        })

        it('error response follow user ', function (done) {
            var req = http_mocks.createRequest({
                
            });
            mockedUserService.expects('getMostFollowedUsers').once().withArgs(undefined).returns(Promise.reject());

            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "500", "message": "could not retrieve most followed users" }
            };
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            userController.getMostFollowedUsers(req, response);
        })

        afterEach(function (done) {
            mockedUserService.restore();
            done();
        })
    });

    describe('get all users', function () {
        var mockedUserService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });
            mockedUserService = sinon.mock(userService);
            done();
        })

        it('should give resposne for all users', function (done) {
            mockedUserService.expects('getAllUsers').once().returns(Promise.resolve([]));

            var expectedResponse = {
                "data": {"users":[]},
                "status": { "statusCode": "200", "message": "fetching all users" }
            };
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            userController.getAllUsers(request, response);
        })

        it('error response follow user ', function (done) {
            var req = http_mocks.createRequest({
                
            });
            mockedUserService.expects('getAllUsers').once().returns(Promise.reject());

            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "404", "message": "unable to fetch users" }
            };
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            userController.getAllUsers(req, response);
        })

        afterEach(function (done) {
            mockedUserService.restore();
            done();
        })
    });


});