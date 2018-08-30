var sinon = require('sinon');
var should = require('chai').should;
var expect = require('chai').expect;
var assert = require('chai').assert;

var searchController = require('../../app/routes/controllers/search.controller.js');
var searchService = require("../../app/services/search.service.js");
var Promise = require('bluebird');
var http_mocks = require('node-mocks-http');

describe('search controller', function () {

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

    describe('search users', function () {
        var mockedSearchService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                query: {
                    pno: 1,
                    psize: 1,
                    stext: 'sai'
                }
            });
            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });
            mockedSearchService = sinon.mock(searchService);
            done();
        })

        it('check response of search users', function (done) {
            var expectedResponse = {
                "data": { "searchResults": { hits: [] }, "stext": 'sai' },
                "status": { "statusCode": "200", "message": "fetched users matching search text" }
            };
            mockedSearchService.expects('searchUserDocuments').once().withArgs('sai', 1, 1).returns(Promise.resolve({ hits: [] }));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            searchController.searchUsers(request, response);
        })

        it('error response for search users', function (done) {
            var req = http_mocks.createRequest({
                query: {
                    pno: 1,
                    psize: 1
                }
            })
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "404", "message": "could not get the users" }
            };
            mockedSearchService.expects('searchUserDocuments').once().withArgs(undefined, 1, 1).returns(Promise.reject());
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            searchController.searchUsers(req, response);
        })

        afterEach(function (done) {
            mockedSearchService.restore();
            done();
        })
    });

    describe('search blogs', function () {
        var mockedSearchService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                userInfo: loggedInUser,
                query: {
                    pno: 1,
                    psize: 1,
                    stext: 'iot'
                }
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });
            mockedSearchService = sinon.mock(searchService);
            done();
        })

        it('check response of blogs search ', function (done) {
            var expectedResponse = {
                "data": { "searchResults": { hits: [] }, "stext": 'iot' },
                "status": { "statusCode": "200", "message": "fetched blogs matching search text" }
            };
            mockedSearchService.expects('searchBlogDocuments').once().withArgs('iot', 1, 1).returns(Promise.resolve({ hits: [] }));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            searchController.searchBlogs(request, response);
        })

        it('error response for search blogs', function (done) {
            var req = http_mocks.createRequest({
                query: {
                    pno: 1,
                    psize: 1
                }
            })
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "404", "message": "could not get the blogs" }
            };
            mockedSearchService.expects('searchBlogDocuments').once().withArgs(undefined, 1, 1).returns(Promise.reject());
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            searchController.searchBlogs(req, response);
        })

        afterEach(function (done) {
            mockedSearchService.restore();
            done();
        })
    });

    describe('search discussions', function () {
        var mockedSearchService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                query: {
                    pno: 1,
                    psize: 1,
                    stext: 'iot'
                }
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });
            mockedSearchService = sinon.mock(searchService);
            done();
        })

        it('response of discussions search', function (done) {
            var expectedResponse = {
                "data": { "searchResults": { hits: [] }, "stext": 'iot' },
                "status": { "statusCode": "200", "message": "fetched discussions matching search text" }
            };
            mockedSearchService.expects('searchDiscussionDocuments').once().withArgs('iot', 1, 1).returns(Promise.resolve({ hits: [] }));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            searchController.searchDiscussions(request, response);
        })

        it('error response for search discussions', function (done) {
            var req = http_mocks.createRequest({
                query: {
                    pno: 1,
                    psize: 1
                }
            })
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "404", "message": "could not get the discussions" }
            };
            mockedSearchService.expects('searchDiscussionDocuments').once().withArgs(undefined, 1, 1).returns(Promise.reject());
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            searchController.searchDiscussions(req, response);
        })

        afterEach(function (done) {
            mockedSearchService.restore();
            done();
        })
    });

    describe('search all types', function () {
        var mockedSearchService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                userInfo: loggedInUser,
                query: {
                    pno: 1,
                    psize: 1,
                    stext: 'sai'
                }
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });
            mockedSearchService = sinon.mock(searchService);
            done();
        })

        it('search in all types', function (done) {
            var expectedResponse = {
                "data": { "searchResults": { hits: [] }, "stext": 'sai' },
                "status": { "statusCode": "200", "message": "fetched documents matching the search text" }
            };
            mockedSearchService.expects('searchAllDocuments').once().withArgs(loggedInUser, 'sai', 1, 1).returns(Promise.resolve({ hits: [] }));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            searchController.searchAll(request, response);
        })

        it('error response for search all types', function (done) {
            var req = http_mocks.createRequest({
                userInfo: loggedInUser,
                query: {
                    pno: 1,
                    psize: 1
                }
            })
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "404", "message": "could not get the discussions/blogs/users" }
            };
            mockedSearchService.expects('searchAllDocuments').once().withArgs(loggedInUser, undefined, 1, 1).returns(Promise.reject());
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
            searchController.searchAll(req, response);
        })

        afterEach(function (done) {
            mockedSearchService.restore();
            done();
        })
    });


    describe('search streams', function () {
        var mockedSearchService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                query: {
                    pno: 1,
                    psize: 1,
                    stext: 'java'
                }
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });
            mockedSearchService = sinon.mock(searchService);
            done();
        })

        it('search response of streams', function (done) {
            var expectedResponse = {
                "data": { "searchResults": [] },
                "status": { "statusCode": "200", "message": "fetched streams" }
            };
            mockedSearchService.expects('searchStreams').once().withArgs('java').returns(Promise.resolve([]));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            searchController.searchStreams(request, response);
        })

        it('error response for search streams', function (done) {
            var req = http_mocks.createRequest({
                query: {
                    pno: 1,
                    psize: 1
                }
            });
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "404", "message": "could not get streams" }
            };
            mockedSearchService.expects('searchStreams').once().withArgs(undefined).returns(Promise.reject());
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            searchController.searchStreams(req, response);

        })

        afterEach(function (done) {
            mockedSearchService.restore();
            done();
        })
    });

});