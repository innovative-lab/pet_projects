var sinon = require('sinon');
var should = require('chai').should;
var expect = require('chai').expect;
var assert = require('chai').assert;
var Promise = require('bluebird');

var activityController = require('../../app/routes/controllers/activity.controller.js');
var activityService = require('../../app/services/activity.service.js');
var http_mocks = require('node-mocks-http');


describe('Activity Controller', function () {

    describe('get all activites', function () {
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
        var mockedActivityService, mockedActivityResponse, request, response;
        beforeEach(function (done) {
            mockedActivityService = sinon.mock(activityService);
            request = http_mocks.createRequest({
                query: {
                    pno: 1,
                    psize: 1
                },
                userInfo: loggedInUser
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });
            mockedActivityResponse = [{
                name: "NEW-PUBLISHED-DISCUSSION",
                content:
                {
                    created_at: '2016-08-04T05:53:33.413Z',
                    tags: ["java"],
                    title: 'abcd',
                    discussion_id: 'discussIPnbAVX7zM',
                    _id: '57a2d85db0a182301f3730e1'
                },
                created_by:
                {
                    user_name: 'Mxxxxxx@mindtree.com',
                    profile_pic_file: [Object],
                    full_name: 'John Doe',
                    email: 'joh.doee@mind.com',
                    last_name: 'Hv',
                    first_name: 'Akshatha',
                    employee_id: 'M1034208',
                    subscribed_streams: ["card", "phone", "mobile", "iot", "java"],
                    followings: ["M1020387@mindtree.com"],
                    _id: '579ee12cd387d768806d8162'
                },
                created_at: 'Thu Aug 04 2016 11:23: 33 GMT+0530(India Standard Time)'
            },
            ]
            done();
        })

        it('check the activities of a user',function (done) {
            mockedActivityService.expects('getAllActivities').once().withArgs(loggedInUser.user_name, 1, 1).returns(Promise.resolve(mockedActivityResponse));
            activityController.activities(request, response);
            response.on('end', function () {
                var res = response._getData();
                expect(res.data.activities).to.deep.equal(mockedActivityResponse);
                done();
            });
        })

        it('check the format of response',function (done) {
            var expectedResponse = {"data":{"activities":mockedActivityResponse},
                                "status":{"statusCode":"200","message":"fetched the activities"}};
            
            mockedActivityService.expects('getAllActivities').once().withArgs(loggedInUser.user_name, 1,1).returns(Promise.resolve(mockedActivityResponse));
            activityController.activities(request, response);
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
        })

        it('check the format of response when username is passed in request',function (done) {
            var req = http_mocks.createRequest({
                query: {
                    pno: 1,
                    psize: 1
                },
                userInfo: loggedInUser,
                params:{
                    username:'Mxxxxx@mindtree.com'
                }
            });
            var expectedResponse = {"data":{"activities":mockedActivityResponse},
                                "status":{"statusCode":"200","message":"fetched the activities"}};
            
            mockedActivityService.expects('getAllActivities').once().withArgs('Mxxxxx@mindtree.com', 1,1).returns(Promise.resolve(mockedActivityResponse));
            activityController.activities(req, response);
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
        })

        it('check the format of response when username and userinfo is undefined',function (done) {
            var req = http_mocks.createRequest({
                query: {
                    pno: 1,
                    psize: 1
                },
                userInfo:{}
            });
            var expectedResponse = {"data":{},
                                "status":{"statusCode":"500","message":"unable to fetch activities"}};
            
            mockedActivityService.expects('getAllActivities').once().withArgs(undefined, 1,1).returns(Promise.reject());
            activityController.activities(req, response);
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
        })

        afterEach(function (done) {
            mockedActivityService.restore();
            done();
        })
    })

})