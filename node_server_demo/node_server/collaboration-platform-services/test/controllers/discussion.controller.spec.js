var sinon = require('sinon');
var should = require('chai').should;
var expect = require('chai').expect;
var assert = require('chai').assert;

var discussionController = require('../../app/routes/controllers/discussion.controller.js');
var discussionService = require('../../app/services/discussion.service.js');
var Promise = require('bluebird');
var http_mocks = require('node-mocks-http');

describe('discussion controller', function () {
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
    describe('get all discussions', function () {
        var mockedDiscussionService, request, response;
        beforeEach(function (done) {
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

            mockedDiscussionService = sinon.mock(discussionService);
            done();

        })

        it('should return response of 200 for getting all discussions', function (done) {
            var expectedResponse = {
                "data": { "discussions": [] },
                "status": { "statusCode": "200", "message": "fetched all discussions" }
            }
            mockedDiscussionService.expects('getPublishedDiscussions').once().withArgs(loggedInUser, 1, 1).returns(
                Promise.resolve([]));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
            discussionController.discussions(request, response);
        })

         it('should return response of 200 for getting all discussions', function (done) {
            var req = http_mocks.createRequest({
                query: {
                    pno: 1,
                    psize: 1
                }
            });
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "500", "message": "could not find discussions" }
            }
            mockedDiscussionService.expects('getPublishedDiscussions').once().withArgs(undefined, 1, 1).returns(
                Promise.reject({ "err": { "message": "", "stack": "" } }));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
            discussionController.discussions(req, response);
        })

        afterEach(function (done) {
            mockedDiscussionService.restore();
            done();
        })
    });

    describe('view the discussion', function () {
        var mockedDiscussionService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                query: {
                    viewValue: 1
                },
                userInfo: loggedInUser,
                params: {
                    discussionId: 'disc_xyz'
                }
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });

            mockedDiscussionService = sinon.mock(discussionService);
            done();

        })

        it('should return response of 200 for getting all discussions', function (done) {
            var expectedResponse = {
                "data": { "discussion": {} },
                "status": { "statusCode": "200", "message": "fetch discussion for a particular id" }
            }
            mockedDiscussionService.expects('viewDiscussion').once().withArgs(loggedInUser, 'disc_xyz', 1).returns(
                Promise.resolve({}));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
            discussionController.viewDiscussion(request, response);
        })

        it('should return error response of 404 for getting all discussions', function (done) {
            request = http_mocks.createRequest({
                query: {
                    viewValue: 1
                },
                params: {
                    discussionId: 'disc_xyz'
                }
            });
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "404", "message": "could not get the discussion by id" }
            }
            mockedDiscussionService.expects('viewDiscussion').once().withArgs(undefined, 'disc_xyz', 1).returns(
                Promise.reject());
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
            discussionController.viewDiscussion(request, response);
        })

        afterEach(function (done) {
            mockedDiscussionService.restore();
            done();
        })
    });

    describe('create discussion', function () {
        var mockedDiscussionService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                userInfo: loggedInUser,
                body: { "discussion": "xyz" }
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });

            mockedDiscussionService = sinon.mock(discussionService);
            done();

        })

        it('should return response of 200 for creating discussion', function (done) {
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "201", "message": "created discussion successfully" }
            }
            mockedDiscussionService.expects('createDiscussion').once().withArgs(loggedInUser, { "discussion": "xyz" }).returns(
                Promise.resolve());
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
            discussionController.createDiscussion(request, response);
        })

        it('should return error response creating discussion', function (done) {
            var req = http_mocks.createRequest({
                userInfo: loggedInUser,
                body: { "discussion": "xyz" }
            });
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "500", "message": "could not add discussion" }
            }
            mockedDiscussionService.expects('createDiscussion').once().withArgs(loggedInUser, { "discussion": "xyz" }).returns(
                Promise.reject({ "err": { "message": "", "stack": "" } }));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
            discussionController.createDiscussion(req, response);
        })

        afterEach(function (done) {
            mockedDiscussionService.restore();
            done();
        })
    });

    describe('post comment in discussion', function () {
        var mockedDiscussionService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                userInfo: loggedInUser,
                params: { "discussionId": "disc_xyz" },
                body: { "comment": "sample-comment" }
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });

            mockedDiscussionService = sinon.mock(discussionService);
            done();

        })

        it('should return response of 200 for posting comment in discussion', function (done) {
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "201", "message": "fetched comments for the discussions" }
            }
            mockedDiscussionService.expects('postCommentToDiscussion').once().withArgs(loggedInUser, 'disc_xyz', 'sample-comment').returns(
                Promise.resolve());
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
            discussionController.postComment(request, response);
        })

        it('should return error response creating discussion', function (done) {
            var req = http_mocks.createRequest({
                userInfo: loggedInUser,
                params: {},
                body: { "comment": "sample-comment" }
            });

            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "500", "message": "could not post comment" }
            }
            mockedDiscussionService.expects('postCommentToDiscussion').once().withArgs(loggedInUser, undefined, 'sample-comment').returns(
                Promise.reject({ "err": { "message": "", "stack": "" } }));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
            discussionController.postComment(req, response);
        })

        afterEach(function (done) {
            mockedDiscussionService.restore();
            done();
        })
    });


    describe('get all discussions of logged in user', function () {
        var mockedDiscussionService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                userInfo: loggedInUser,
                query: { pno: 1, psize: 1 }
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });

            mockedDiscussionService = sinon.mock(discussionService);
            done();

        })

        it('should return response of 200 to discussions of logged in user', function (done) {
            var expectedResponse = {
                "data": {"discussions":[]},
                "status": { "statusCode": "200", "message": "fetched discussions written by user" }
            }
            mockedDiscussionService.expects('getAllDiscussionsOfUser').once().withArgs(loggedInUser, 1, 1).returns(
                Promise.resolve([]));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
            discussionController.getAllDiscussionsForLoggedInUser(request, response);
        })

        it('should return error response creating discussion', function (done) {
            var req = http_mocks.createRequest({
                query: { pno: 1, psize: 1 }
            });

            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "404", "message": "unable to get the discussions writtern by user" }
            }
            mockedDiscussionService.expects('getAllDiscussionsOfUser').once().withArgs(undefined, 1,1).returns(
                Promise.reject({ "err": { "message": "", "stack": "" } }));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
            discussionController.getAllDiscussionsForLoggedInUser(req, response);
        })

        afterEach(function (done) {
            mockedDiscussionService.restore();
            done();
        })
    });

    describe('delete discussion by id', function () {
        var mockedDiscussionService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                userInfo: loggedInUser,
                params: { "discussionId":'disc_xyz' }
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });

            mockedDiscussionService = sinon.mock(discussionService);
            done();

        })

        it('should return response of 204 for deleting the discussion', function (done) {
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "204", "message": "discussion deleted successfully" }
            }
            mockedDiscussionService.expects('deleteDiscussion').once().withArgs(loggedInUser,'disc_xyz').returns(
                Promise.resolve([]));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
            discussionController.deleteDiscussionById(request, response);
        })

        it('should return error response for deleting discussion', function (done) {
            var req = http_mocks.createRequest({
                params: { "discussionId":'disc_xyz' }
            });

            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "500", "message": "could not delete the discussion post" }
            }
            mockedDiscussionService.expects('deleteDiscussion').once().withArgs(undefined,'disc_xyz').returns(
                Promise.reject({ "err": { "message": "", "stack": "" } }));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
            discussionController.deleteDiscussionById(req, response);
        })

        afterEach(function (done) {
            mockedDiscussionService.restore();
            done();
        })
    });

    describe('get all published discussions of user', function () {
        var mockedDiscussionService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                userInfo: loggedInUser,
                query: { pno: 1, psize: 1 },
                params:{userName:'Mxxxxx@mindtree.com'}
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });

            mockedDiscussionService = sinon.mock(discussionService);
            done();

        })

        it('should return response of 200 to discussions of logged in user', function (done) {
            var expectedResponse = {
                "data": {"discussions":[]},
                "status": { "statusCode": "200", "message": "fetched discussions written by user" }
            }
            mockedDiscussionService.expects('getPublishedDiscussionsOfUser').once().withArgs(loggedInUser,'Mxxxxx@mindtree.com',1, 1).returns(
                Promise.resolve([]));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
            discussionController.getPublishedDiscussionsOfUser(request, response);
        })

        it('should return error response of fetching discussions of a user', function (done) {
            var req = http_mocks.createRequest({
                query: { pno: 1, psize: 1 },
                userInfo: loggedInUser
            });

            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "404", "message": "unable to get the discussions writtern by user" }
            }
            mockedDiscussionService.expects('getPublishedDiscussionsOfUser').once().withArgs(loggedInUser,undefined,1, 1).returns(
                Promise.reject({ "err": { "message": "", "stack": "" } }));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
            discussionController.getPublishedDiscussionsOfUser(req, response);
        })

        afterEach(function (done) {
            mockedDiscussionService.restore();
            done();
        })
    });

    describe('delete comment in discussion', function () {
        var mockedDiscussionService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                userInfo: loggedInUser,
                params:{discussionId:'disc_xyz',commentId:'comm_xyz'}
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });

            mockedDiscussionService = sinon.mock(discussionService);
            done();

        })

        it('should return response of 200 for deleting comment in discussion', function (done) {
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "200", "message": "comment deleted successfully" }
            }
            mockedDiscussionService.expects('removeCommentInDiscussion').once().withArgs(loggedInUser, 'disc_xyz', 'comm_xyz').returns(
                Promise.resolve([]));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
            discussionController.deleteComment(request, response);
        })

        it('should return error response of deleting comment in discussion', function (done) {
            var req = http_mocks.createRequest({
                params:{discussionId:'disc_xyz',commentId:'comm_xyz'}
            });

            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "500", "message": "could not delete the comment" }
            }
            mockedDiscussionService.expects('removeCommentInDiscussion').once().withArgs(undefined, 'disc_xyz', 'comm_xyz').returns(
                Promise.reject({ "err": { "message": "", "stack": "" } }));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
            discussionController.deleteComment(req, response);
        })

        afterEach(function (done) {
            mockedDiscussionService.restore();
            done();
        })
    });


    describe('vote unvote discussion', function () {
        var mockedDiscussionService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                params:{discussionId:'disc_xyz',voteValue:1},
                userInfo:loggedInUser
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });

            mockedDiscussionService = sinon.mock(discussionService);
            done();

        })

        it('should return response of 200 vote/unvote discussion', function (done) {
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "200", "message": "updated the votes of the discussion" }
            }
            mockedDiscussionService.expects('voteUnvoteDiscussion').once().withArgs(loggedInUser, 'disc_xyz', 1).returns(
                Promise.resolve([]));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
            discussionController.voteUnvoteDiscussion(request, response);
        })

        it('should return error response of vote/unvote discussion', function (done) {
            var req = http_mocks.createRequest({
                params:{discussionId:'disc_xyz',voteValue:1}
            });

            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "500", "message": "could not vote the discussion" }
            }
            mockedDiscussionService.expects('voteUnvoteDiscussion').once().withArgs(undefined, 'disc_xyz', 1).returns(
                Promise.reject({ "err": { "message": "", "stack": "" } }));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
            discussionController.voteUnvoteDiscussion(req, response);
        })

        afterEach(function (done) {
            mockedDiscussionService.restore();
            done();
        })
    });

    describe('edit discussion', function () {
			var mockedDiscussionService, request, response;
			beforeEach(function (done) {
				request = http_mocks.createRequest({
					userInfo: loggedInUser,
					query: { "discussionId": 'disc_xyz' },
					body:{content:"discussion content"}
				});

				response = http_mocks.createResponse({
					eventEmitter: require('events').EventEmitter
				});

				mockedDiscussionService = sinon.mock(discussionService);
				done();

			})

			it('should return response of 200 for editing discussion', function (done) {
				var expectedResponse = {
					"data": {},
					"status": { "statusCode": "200", "message": "edited discussion successfully" }
				}
				mockedDiscussionService.expects('editDiscussion').once().withArgs(loggedInUser,'disc_xyz',{content:"discussion content"}).returns(
					Promise.resolve());
				response.on('end', function () {
					var res = response._getData();
					expect(res).to.deep.equal(expectedResponse);
					done();
				});
				discussionController.editDiscussion(request, response);
			})

			it('should return error response for editing discussion', function (done) {
				var req = http_mocks.createRequest({
					query: { "discussionId": 'disc_xyz' },
					body:{content:"discussion content"}
				});

				var expectedResponse = {
					"data": {},
					"status": { "statusCode": "500", "message": "could not edit the discussion"}
				}
				mockedDiscussionService.expects('editDiscussion').once().withArgs(undefined,'disc_xyz',{content:"discussion content"}).returns(
					Promise.reject({ "err": { "message": "", "stack": "" } }));
				response.on('end', function () {
					var res = response._getData();
					expect(res).to.deep.equal(expectedResponse);
					done();
				});
				discussionController.editDiscussion(req, response);
			})

			afterEach(function (done) {
				mockedDiscussionService.restore();
				done();
			})
		});



});