var sinon = require('sinon');
var should = require('chai').should();
var expect = require('chai').expect;
var assert = require('chai').assert;

var dashboardController = require('../../app/routes/controllers/dashboard.controller.js');
var dashboardService = require('../../app/services/dashboard.service.js');
var Promise = require('bluebird');
var http_mocks = require('node-mocks-http');

describe('Dashboard Controller', function () {
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

    describe(
        'Total Counts',
        function () {
            var mockedDashboardService;
            var req, res;
            var mockCount = {};
            beforeEach(function (done) {
                /**
                 * mock object that total counts of the dasboard service
                 */
                mockCount.answer_counts = 10;
                mockCount.blog_counts = 5;
                mockCount.discussion_counts = 3;
                mockCount.post_counts = 3;

                dashboardController.getTotalCounts(req, res);

                req = http_mocks.createRequest({
                    method: 'GET',
                    url: '/getTotalCounts'
                });

                res = http_mocks.createResponse({
                    eventEmitter: require('events').EventEmitter
                });

                mockedDashboardService = sinon.mock(dashboardService);
                done();
            });

            it("number of blog_counts in the response", function (done) {
                mockedDashboardService.expects('getTotalCounts').once().returns(Promise.resolve(mockCount));

                res.on('end', function () {
                    response = res._getData();
                    assert.equal(response.data.blog_counts, 5);
                    done();
                });
                dashboardController.getTotalCounts(req, res);
            })

            it("number of discussion_counts in the response", function (done) {
                mockedDashboardService.expects('getTotalCounts').once().returns(Promise.resolve(mockCount));

                res.on('end', function () {
                    response = res._getData();
                    assert.equal(response.data.discussion_counts, 3);
                    done();
                });
                dashboardController.getTotalCounts(req, res);
            })

            it("number of answer_counts in the response", function (done) {
                mockedDashboardService.expects('getTotalCounts').once().returns(Promise.resolve(mockCount));

                res.on('end', function () {
                    response = res._getData();
                    assert.equal(response.data.answer_counts, 10);
                    done();
                });
                dashboardController.getTotalCounts(req, res);
            })

            it("should give the error response", function (done) {
                var expectedResponse = {
                    'data': {},
                    'status': { 'statusCode': '404', 'message': 'could not fetch the counts' }
                }
                mockedDashboardService.expects('getTotalCounts').once().returns(Promise.reject());

                res.on('end', function () {
                    var response = res._getData();
                    (res._getData()).should.be.eql(expectedResponse);
                    done();
                });
                dashboardController.getTotalCounts(req, res);
            })

            afterEach(function (done) {
                mockedDashboardService.restore();
                done();
            });

        });

    describe(
        'get author and all blog counts',
        function () {
            var mockedDashboardService;
            var request, response;
            var mockCount = {};
            beforeEach(function (done) {
                request = http_mocks.createRequest({
                    userInfo: loggedInUser
                });

                response = http_mocks.createResponse({
                    eventEmitter: require('events').EventEmitter
                });

                mockedDashboardService = sinon.mock(dashboardService);
                done();
            });

            it("number of blog_counts in the response", function (done) {
                var countResponse = {
                    all_published_count: 2,
                    my_draft_count: 12,
                    my_published_count: 8
                }
                mockedDashboardService.expects('getAllNAuthorBlogCounts').once().withArgs(loggedInUser).returns(Promise.resolve(countResponse));

                response.on('end', function () {
                    res = response._getData();
                    expect(countResponse).to.deep.equal(res.data.counts);
                    done();
                });
                dashboardController.getAllNAuthorBlogCounts(request, response);
            })

            it("number of blog counts in the response if user is undefined", function (done) {
                var req = http_mocks.createRequest({
                });
                mockedDashboardService.expects('getAllNAuthorBlogCounts').once().withArgs(undefined).returns(Promise.reject());

                response.on('end', function () {
                    res = response._getData();
                    assert.equal(res.status.statusCode, 500);
                    done();
                });
                dashboardController.getAllNAuthorBlogCounts(req, response);
            })

            afterEach(function (done) {
                mockedDashboardService.restore();
                done();
            });

        });

    describe(
        'get author and all discussion counts',
        function () {
            var mockedDashboardService;
            var request, response;
            var mockCount = {};
            beforeEach(function (done) {
                request = http_mocks.createRequest({
                    userInfo: loggedInUser
                });

                response = http_mocks.createResponse({
                    eventEmitter: require('events').EventEmitter
                });

                mockedDashboardService = sinon.mock(dashboardService);
                done();
            });

            it("number of discission_counts in the response", function (done) {
                var countResponse = {
                    all_published_count: 2,
                    my_draft_count: 12,
                    my_published_count: 8
                }
                mockedDashboardService.expects('getAllNAuthorDiscCounts').once().withArgs(loggedInUser).returns(Promise.resolve(countResponse));

                response.on('end', function () {
                    res = response._getData();
                    expect(countResponse).to.deep.equal(res.data.counts);
                    done();
                });
                dashboardController.getAllNAuthorDiscCounts(request, response);
            })

            it("number of discussion counts in the response", function (done) {
                var req = http_mocks.createRequest({
                });
                mockedDashboardService.expects('getAllNAuthorDiscCounts').once().withArgs(undefined).returns(Promise.reject());

                response.on('end', function () {
                    res = response._getData();
                    assert.equal(res.status.statusCode, 500);
                    done();
                });
                dashboardController.getAllNAuthorDiscCounts(req, response);
            })


            afterEach(function (done) {
                mockedDashboardService.restore();
                done();
            });

        });
})
