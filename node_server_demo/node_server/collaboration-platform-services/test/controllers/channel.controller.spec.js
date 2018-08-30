var sinon = require('sinon');
var should = require('chai').should;
var expect = require('chai').expect;
var assert = require('chai').assert;

var channelController = require('../../app/routes/controllers/channel.controller.js');
var channelService = require("../../app/services/channel.service.js");
var Promise = require('bluebird');
var http_mocks = require('node-mocks-http');

describe('channel controller', function () {
    describe('get channels by user', function () {
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

        describe('get all channels by user', function () {
            var mockedChannelService, request, response;
            beforeEach(function (done) {
                request = http_mocks.createRequest({
                    userInfo: loggedInUser,
                    params: {
                        username: 'Mxxxxx@mindtree.com'
                    }
                });

                response = http_mocks.createResponse({
                    eventEmitter: require('events').EventEmitter
                });
                mockedChannelService = sinon.mock(channelService);
                done();
            })

            it('check the resposne of the get all channels by user', function (done) {
                var expectedResponse = {
                    "data": { "channels": {} },
                    "status": { "statusCode": "200", "message": "fetched the channels users belongs to" }
                };
                mockedChannelService.expects('getChannelsByUserName').once().withArgs('Mxxxxx@mindtree.com').returns(
                    Promise.resolve({}));
                response.on('end', function () {
                    var res = response._getData();
                    expect(res).to.deep.equal(expectedResponse);
                    done();
                });
                channelController.getChannelsByUser(request, response);
            })

            it('error resposne of the get all channels by user', function (done) {
                var req = http_mocks.createRequest({

                });
                var expectedResponse = {
                    "data": {},
                    "status": { "statusCode": "500", "message": "could not fetch the channels of a user" }
                };
                mockedChannelService.expects('getChannelsByUserName').once().withArgs(undefined).returns(
                    Promise.reject());
                response.on('end', function () {
                    var res = response._getData();
                    expect(res).to.deep.equal(expectedResponse);
                    done();
                });
                channelController.getChannelsByUser(req, response);
            })

            afterEach(function (done) {
                mockedChannelService.restore();
                done();
            })
        });


        describe('get all channels by loggedInUser', function () {
            var mockedChannelService, request, response;
            beforeEach(function (done) {
                request = http_mocks.createRequest({
                    userInfo: loggedInUser
                });

                response = http_mocks.createResponse({
                    eventEmitter: require('events').EventEmitter
                });
                mockedChannelService = sinon.mock(channelService);
                done();
            })

            it('check the resposne of the get all channels by logged in user', function (done) {
                var expectedResponse = {
                    "data": { "channels": {} },
                    "status": { "statusCode": "200", "message": "fetched the channels users belongs to" }
                };
                mockedChannelService.expects('getChannelsByUser').once().withArgs(loggedInUser).returns(
                    Promise.resolve({}));
                response.on('end', function () {
                    var res = response._getData();
                    expect(res).to.deep.equal(expectedResponse);
                    done();
                });
                channelController.getChannelsByLoggedInUser(request, response);
            })

            it('error resposne of the get all channels by user', function (done) {
                var req = http_mocks.createRequest({

                });
                var expectedResponse = {
                    "data": {},
                    "status": { "statusCode": "500", "message": "could not fetch the channels of a user" }
                };
                mockedChannelService.expects('getChannelsByUser').once().withArgs(undefined).returns(
                    Promise.reject());
                response.on('end', function () {
                    var res = response._getData();
                    expect(res).to.deep.equal(expectedResponse);
                    done();
                });
                channelController.getChannelsByLoggedInUser(req, response);
            })

            afterEach(function (done) {
                mockedChannelService.restore();
                done();
            })
        });

        describe('create channel', function () {
            var mockedChannelService, request, response;
            beforeEach(function (done) {
                request = http_mocks.createRequest({
                    userInfo: loggedInUser,
                    body: { "channel": "xyz" }
                });

                response = http_mocks.createResponse({
                    eventEmitter: require('events').EventEmitter
                });
                mockedChannelService = sinon.mock(channelService);
                done();
            })

            it('check the resposne of the create channel', function (done) {
                var expectedResponse = {
                    "data": {},
                    "status": { "statusCode": "200", "message": "created the channel successfully" }
                };
                mockedChannelService.expects('createChannel').once().withArgs(loggedInUser, { "channel": "xyz" }).returns(
                    Promise.resolve({}));
                response.on('end', function () {
                    var res = response._getData();
                    expect(res).to.deep.equal(expectedResponse);
                    done();
                });
                channelController.createChannel(request, response);
            })

            it('error response of the create channel', function (done) {
                var req = http_mocks.createRequest({
                    userInfo: loggedInUser
                })
                var expectedResponse = {
                    "data": {},
                    "status": { "statusCode": "500", "message": "could not create the channel" }
                };
                mockedChannelService.expects('createChannel').once().withArgs(loggedInUser, {}).returns(
                    Promise.reject());
                response.on('end', function () {
                    var res = response._getData();
                    expect(res).to.deep.equal(expectedResponse);
                    done();
                });
                channelController.createChannel(req, response);
            })

            afterEach(function (done) {
                mockedChannelService.restore();
                done();
            })
        });


        describe('add user to Channel', function () {
            var mockedChannelService, request, response;
            beforeEach(function (done) {
                request = http_mocks.createRequest({
                    userInfo: loggedInUser,
                    params: {
                        username: 'Mxxxx@mindtree.com',
                        channelId: 'sample'
                    }
                });

                response = http_mocks.createResponse({
                    eventEmitter: require('events').EventEmitter
                });
                mockedChannelService = sinon.mock(channelService);
                done();
            })

            it('check the resposne of adding user to channel', function (done) {
                var expectedResponse = {
                    "data": {},
                    "status": { "statusCode": "200", "message": "added the user to the channel" }
                };
                mockedChannelService.expects('addUserToChannel').once().withArgs(loggedInUser, 'Mxxxx@mindtree.com', 'sample').returns(
                    Promise.resolve());
                response.on('end', function () {
                    var res = response._getData();
                    expect(res).to.deep.equal(expectedResponse);
                    done();
                });
                channelController.addUserToChannel(request, response);
            })

            it('error response of the adding user to channel', function (done) {
                var req = http_mocks.createRequest({
                    userInfo: loggedInUser,
                    params: {
                        username: 'Mxxxx@mindtree.com'
                    }
                })
                var expectedResponse = {
                    "data": {},
                    "status": { "statusCode": "500", "message": "could not add user to channel" }
                };
                mockedChannelService.expects('addUserToChannel').once().withArgs(loggedInUser, 'Mxxxx@mindtree.com', undefined).returns(
                    Promise.reject("could not add user to channel"));
                response.on('end', function () {
                    var res = response._getData();
                    expect(res).to.deep.equal(expectedResponse);
                    done();
                });
                channelController.addUserToChannel(req, response);
            })

            afterEach(function (done) {
                mockedChannelService.restore();
                done();
            })
        });

        describe('channel details by channel id', function () {
            var mockedChannelService, request, response;
            beforeEach(function (done) {
                request = http_mocks.createRequest({
                    params: {
                        channelId: 'sample'
                    }
                });

                response = http_mocks.createResponse({
                    eventEmitter: require('events').EventEmitter
                });
                mockedChannelService = sinon.mock(channelService);
                done();
            })

            it('should return channel details', function (done) {
                var expectedResponse = {
                    "data": { "channel": {} },
                    "status": { "statusCode": "200", "message": "fetched channel details" }
                };
                mockedChannelService.expects('getChannelById').once().withArgs('sample').returns(
                    Promise.resolve({}));
                response.on('end', function () {
                    var res = response._getData();
                    expect(res).to.deep.equal(expectedResponse);
                    done();
                });
                channelController.getChannelById(request, response);
            })

            it('should return error response for channel details', function (done) {
                var req = http_mocks.createRequest({
                    params: {

                    }
                })
                var expectedResponse = {
                    "data": {},
                    "status": { "statusCode": "500", "message": "could not fetch channel details" }
                };
                mockedChannelService.expects('getChannelById').once().withArgs(undefined).returns(
                    Promise.reject());
                response.on('end', function () {
                    var res = response._getData();
                    expect(res).to.deep.equal(expectedResponse);
                    done();
                });
                channelController.getChannelById(req, response);
            })

            afterEach(function (done) {
                mockedChannelService.restore();
                done();
            })
        });

        describe('get messages in a channel', function () {
            var mockedChannelService, request, response;
            beforeEach(function (done) {
                request = http_mocks.createRequest({
                    userInfo: loggedInUser,
                    params: {
                        channelId: 'sample'
                    },
                    query: {
                        pno: 1,
                        psize: 1
                    }
                });

                response = http_mocks.createResponse({
                    eventEmitter: require('events').EventEmitter
                });
                mockedChannelService = sinon.mock(channelService);
                done();
            })

            it('should return channel details', function (done) {
                var expectedResponse = {
                    "data": { "messages": {} },
                    "status": { "statusCode": "200", "message": "fetched messages in channel" }
                };
                mockedChannelService.expects('getMessagesByChannel').once().withArgs(loggedInUser, 'sample', 1, 1).returns(
                    Promise.resolve({}));
                response.on('end', function () {
                    var res = response._getData();
                    expect(res).to.deep.equal(expectedResponse);
                    done();
                });
                channelController.getMessagesByChannel(request, response);
            })

            it('should return error response for channel details', function (done) {
                var req = http_mocks.createRequest({
                     query: {
                        pno: 1,
                        psize: 1
                    }
                })
                var expectedResponse = {
                    "data": {},
                    "status": { "statusCode": "500", "message": "could not fetch the messages in channel" }
                };
                mockedChannelService.expects('getMessagesByChannel').once().withArgs(undefined).returns(
                    Promise.reject());
                response.on('end', function () {
                    var res = response._getData();
                    expect(res).to.deep.equal(expectedResponse);
                    done();
                });
                channelController.getMessagesByChannel(req, response);
            })

            afterEach(function (done) {
                mockedChannelService.restore();
                done();
            })
        });
        
        describe('remove user from Channel', function () {
            var mockedChannelService, request, response;
            beforeEach(function (done) {
                request = http_mocks.createRequest({
                    userInfo: loggedInUser,
                    params: {
                        username: 'Mxxxx@mindtree.com',
                        channelId: 'sample'
                    }
                });

                response = http_mocks.createResponse({
                    eventEmitter: require('events').EventEmitter
                });
                mockedChannelService = sinon.mock(channelService);
                done();
            })

            it('check the resposne of adding user to channel', function (done) {
                var expectedResponse = {
                    "data": {},
                    "status": { "statusCode": "200", "message": "removed the user from channel" }
                };
                mockedChannelService.expects('removeUserFromChannel').once().withArgs(loggedInUser, 'Mxxxx@mindtree.com', 'sample').returns(
                    Promise.resolve());
                response.on('end', function () {
                    var res = response._getData();
                    expect(res).to.deep.equal(expectedResponse);
                    done();
                });
                channelController.removeUserFromChannel(request, response);
            })

            it('error response of the adding user to channel', function (done) {
                var req = http_mocks.createRequest({
                    userInfo: loggedInUser,
                    params: {
                        username: 'Mxxxx@mindtree.com'
                    }
                })
                var expectedResponse = {
                    "data": {},
                    "status": { "statusCode": "500", "message": "could not remove the user from channel" }
                };
                mockedChannelService.expects('removeUserFromChannel').once().withArgs(loggedInUser, 'Mxxxx@mindtree.com', undefined).returns(
                    Promise.reject());
                response.on('end', function () {
                    var res = response._getData();
                    expect(res).to.deep.equal(expectedResponse);
                    done();
                });
                channelController.removeUserFromChannel(req, response);
            })

            afterEach(function (done) {
                mockedChannelService.restore();
                done();
            })
        });
        
        describe('add message in channel', function () {
            var mockedChannelService, request, response;
            beforeEach(function (done) {
                request = http_mocks.createRequest({
                    userInfo: loggedInUser,
                    params: {
                        channelId: 'sample'
                    },
                    body:{"message":"hi"}
                });

                response = http_mocks.createResponse({
                    eventEmitter: require('events').EventEmitter
                });
                mockedChannelService = sinon.mock(channelService);
                done();
            })

            it('check the response of adding message in channel', function (done) {
                var expectedResponse = {
                    "data": {"message":{"message":"hi"}},   
                    "status": { "statusCode": "200", "message": "posted a message in channel" }
                };
                mockedChannelService.expects('addMessageInChannel').once().withArgs(loggedInUser, 'sample', {"message":"hi"}).returns(
                    Promise.resolve());
                response.on('end', function () {
                    var res = response._getData();
                    expect(res).to.deep.equal(expectedResponse);
                    done();
                });
                channelController.addMessageInChannel(request, response);
            })

            it('error response of the adding user to channel', function (done) {
                 var req = http_mocks.createRequest({
                    userInfo: loggedInUser,
                    params: {
                    },
                    body:{"message":"hi"}
                });
                var expectedResponse = {
                    "data": {},
                    "status": { "statusCode": "500", "message": "could not post message" }
                };
                mockedChannelService.expects('addMessageInChannel').once().withArgs(loggedInUser, undefined, {"message":"hi"}).returns(
                    Promise.reject());
                response.on('end', function () {
                    var res = response._getData();
                    expect(res).to.deep.equal(expectedResponse);
                    done();
                });
                channelController.addMessageInChannel(req, response);
            })

            afterEach(function (done) {
                mockedChannelService.restore();
                done();
            })
        });


    });
})