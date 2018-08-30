var sinon = require('sinon');
var should = require('chai').should;
var expect = require('chai').expect;
var assert = require('chai').assert;

var streamController = require('../../app/routes/controllers/stream.controller.js');
var streamService = require('../../app/services/stream.service.js');
var searchService = require("../../app/services/search.service.js");
var Promise = require('bluebird');
var http_mocks = require('node-mocks-http');

describe('stream controller', function () {


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
    describe('create stream', function () {
        var mockedStreamService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                params: {
                    streamName: 'sample-stream'
                }
            });
            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });
            mockedStreamService = sinon.mock(streamService);
            done();
        })

        it('should give the response of 200', function (done) {
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "201", "message": "created streams successfully" }
            };
            mockedStreamService.expects('createStream').once().withArgs('sample-stream').returns(Promise.resolve());
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            streamController.create(request, response);
        })

        it('should give the error response', function (done) {
            var req = http_mocks.createRequest({
                params: {
                }
            });
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "500", "message": "could not able to create streams" }
            };
            mockedStreamService.expects('createStream').once().withArgs(undefined).returns(Promise.reject());
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            streamController.create(req, response);
        })

        afterEach(function (done) {
            mockedStreamService.restore();
            done();
        })
    });


    describe('get all streams', function () {
        var mockedStreamService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                userInfo: loggedInUser,
                query: { pno: 1, psize: 1 }
            });
            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });
            mockedStreamService = sinon.mock(streamService);
            done();
        })

        it('should give the response of 200 for getting all streams', function (done) {
            var expectedResponse = {
                "data": { streams: {} },
                "status": { "statusCode": "200", "message": "fetched the streams" }
            };
            mockedStreamService.expects('getStreams').once().withArgs(loggedInUser, 1, 1).returns(Promise.resolve({}));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            streamController.getAllStreams(request, response);
        })

        it('should give error response of 500 for getting all streams', function (done) {
            var req = http_mocks.createRequest({
                query: { pno: 1, psize: 1 }
            });
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "500", "message":'unable to fetch streams '+'could not fetch streams' }
            };
            mockedStreamService.expects('getStreams').once().withArgs(undefined, 1, 1).returns(Promise.reject("could not fetch streams"));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            streamController.getAllStreams(req, response);
        })

        afterEach(function (done) {
            mockedStreamService.restore();
            done();
        })
    });

    describe('get streams by user', function () {
        var mockedStreamService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                userInfo: loggedInUser
            });
            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });
            mockedStreamService = sinon.mock(streamService);
            done();
        })

        it('should give the response of 200 for getting all streams of users', function (done) {
            var expectedResponse = {
                "data": { "streams": []},
                "status": { "statusCode": "200", "message": "fetched the streams" }
            };
            mockedStreamService.expects('getStreamsByUser').once().withArgs(loggedInUser).returns(Promise.resolve([]))
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            streamController.getStreamsByUser(request, response);
        })

        it('should give the response of 500 for getting all streams', function (done) {
            var req = http_mocks.createRequest({
              
            });
            var expectedResponse = {
                "data": {  },
                "status": { 'statusCode': '500', 'message': 'unable to fetch streams '+'error' }
            };
            mockedStreamService.expects('getStreamsByUser').once().withArgs(undefined).returns(Promise.reject("error"))
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            streamController.getStreamsByUser(req, response);
        })

        afterEach(function (done) {
            mockedStreamService.restore();
            done();
        })
    });


    describe('subscribe unsubscribe the stream', function () {
        var mockedStreamService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                userInfo: loggedInUser,
                params: {
                    streamName: 'sample-stream',
                    isSubscribed: 1
                }
            });
            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });
            mockedStreamService = sinon.mock(streamService);
            done();
        })

        it('should give the response of 200 for subscribing streams', function (done) {
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "200", "message": "subscription updated successfully" }
            };
            mockedStreamService.expects('subscribeUnsubscribeStream').once().withArgs(loggedInUser, 'sample-stream', 1).returns(Promise.resolve());
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            streamController.subscribeUnsubscribe(request, response);
        })


        it('should give the error response unsubscribing streams', function (done) {
            var req = http_mocks.createRequest({
                userInfo: loggedInUser,
                params: {
                    isSubscribed: 1
                }
            });
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "500", "message": "could not update the subscription" }
            };
            mockedStreamService.expects('subscribeUnsubscribeStream').once().withArgs(loggedInUser, undefined, 1).returns(Promise.reject());
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            streamController.subscribeUnsubscribe(req, response);
        })

        afterEach(function (done) {
            mockedStreamService.restore();
            done();
        })
    });

    describe('get most subscribed streams', function () {
        var mockedStreamService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                query: {
                    psize: 1
                }
            });
            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });
            mockedStreamService = sinon.mock(streamService);
            done();
        })

        it('should give the response of 200 for most subscribed streams', function (done) {
            var expectedResponse = {
                "data": {"streams":{}},
                "status": { "statusCode": "200", "message": "retrieved most subscribed streams" }
            };
            mockedStreamService.expects('getMostSubscribedStreams').once().withArgs(1).returns(Promise.resolve({}));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            streamController.getMostSubscribedStreams(request, response);
        })

        it('should give the response of 500 for most subscribed streams', function (done) {
            var req = http_mocks.createRequest({
                query: {    
                }
            });
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "500", "message": "could not retrieve most subscribed streams" }
            };
            mockedStreamService.expects('getMostSubscribedStreams').once().withArgs(undefined).returns(Promise.reject({}));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            streamController.getMostSubscribedStreams(req, response);
        })

        afterEach(function (done) {
            mockedStreamService.restore();
            done();
        })
    });

    describe('get subscribed content for user', function () {
        var mockedStreamService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                query: {
                    psize: 1,
                    pno:1,
                    tags:'iot',
                    followers:'Mxxxxx@mindtree.com'
                },
                userInfo:loggedInUser
            });
            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });
            mockedStreamService = sinon.mock(streamService);
            done();
        })

        it('should give the response of 200 for subscribed content', function (done) {
            var expectedResponse = {
                "data": {"streamsActivity":{}},
                "status": { "statusCode": "200", "message": "fetched the content for all subscribed streams" }
            };
            mockedStreamService.expects('getSubscribedStreamContentForUser').once().withArgs(loggedInUser, 'iot','Mxxxxx@mindtree.com', 1, 1).returns(Promise.resolve({}));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            streamController.getSubscribedStreamContentForUser(request, response);
        })

        it('should give the response of 500 for most subscribed streams', function (done) {
            var req = http_mocks.createRequest({
                query: {
                    psize: 1,
                    pno:1,
                    tags:'iot',
                    followers:'Mxxxxx@mindtree.com'
                }
            });
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "500", "message": "could not fetch subscribed streams" }
            };
            mockedStreamService.expects('getSubscribedStreamContentForUser').once().withArgs(undefined, 'iot','Mxxxxx@mindtree.com', 1, 1).returns(Promise.reject({}));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            streamController.getSubscribedStreamContentForUser(req, response);
        })

        afterEach(function (done) {
            mockedStreamService.restore();
            done();
        })
    });
    describe('search most used streams', function () {
        var mockedSearchService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                query: {
                    psize: 5
                }
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });
            mockedSearchService = sinon.mock(searchService);
            done();
        })

        it('response of getMostUsedStreamsCount search', function (done) {
            var expectedResponse = {
                "data": [{}],
                "status": { "statusCode": "200", "message": "fetched the count of frequently used streams" }
            };
            mockedSearchService.expects('getMostUsedStreamsCount').once().withArgs(5).returns(Promise.resolve([{}]));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            streamController.getMostUsedStreamsCount(request, response);
        })

        it('error response for getMostUsedStreamsCount discussions', function (done) {
            var req = http_mocks.createRequest({
                query: {
                }
            })
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "500", "message": "could not get the count of frequently used streams" }
            };
            mockedSearchService.expects('getMostUsedStreamsCount').once().withArgs(undefined).returns(Promise.reject());
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            streamController.getMostUsedStreamsCount(req, response);
        })

        afterEach(function (done) {
            mockedSearchService.restore();
            done();
        })
    });

});