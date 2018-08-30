var sinon = require('sinon');
var should = require('chai').should;
var expect = require('chai').expect;
var assert = require('chai').assert;

var answerController = require('../../app/routes/controllers/answer.controller.js');
var answerService = require('../../app/services/answer.service.js');
var Promise = require('bluebird');
var http_mocks = require('node-mocks-http');

describe('answer controller', function () {
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
    describe('get all answers for discussion', function () {
        var mockedAnswerService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                userInfo: loggedInUser,
                params: {
                    discussionId: 'disc_xyz'
                }
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });

            mockedAnswerService = sinon.mock(answerService);
            done();

        })

        it('should return response of 200 for getting answers for discussion', function (done) {
            var expectedResponse = {
                "data": { "answers": [] },
                "status": { "statusCode": "200", "message": "fetched answers for discussion id" }
            }
            mockedAnswerService.expects('getAnswersByDiscussionId').once().withArgs(loggedInUser, 'disc_xyz').returns(
                Promise.resolve([]));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
            answerController.getAnswersForDiscussion(request, response);
        })

        it('should return response of 404 for getting answers', function (done) {
            var req = http_mocks.createRequest({
                userInfo: loggedInUser,
                params: {
                }
            });
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "404", "message": "could not get the answers" }
            }
            mockedAnswerService.expects('getAnswersByDiscussionId').once().withArgs(loggedInUser, undefined).returns(
                Promise.reject());
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
            answerController.getAnswersForDiscussion(req, response);
        })

        afterEach(function (done) {
            mockedAnswerService.restore();
            done();
        })
    });


    describe('post answer for discussion', function () {
        var mockedAnswerService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                userInfo: loggedInUser,
                params: {
                    discussionId: 'disc_xyz'
                },
                body: { answer: "sample-answer" }
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });

            mockedAnswerService = sinon.mock(answerService);
            done();

        })

        it('should return response of 200 for posting answer in discussion', function (done) {
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "200", "message": "posted answer for discussion id" }
            }
            mockedAnswerService.expects('postAnswer').once().withArgs(loggedInUser, 'disc_xyz', { answer: "sample-answer" }).returns(
                Promise.resolve());
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
            answerController.postAnswer(request, response);
        })

        it('should return response of 500 for posting answer', function (done) {
            var req = http_mocks.createRequest({
                params: {
                    discussionId: 'disc_xyz'
                },
                body: { answer: "sample-answer" }
            });
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "500", "message": "could not post answer for discussion" }
            }
            mockedAnswerService.expects('postAnswer').once().withArgs(undefined, 'disc_xyz', { answer: "sample-answer" }).returns(
                Promise.reject({ "err": { "message": "", "stack": "" } }));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
            answerController.postAnswer(req, response);
        })

        afterEach(function (done) {
            mockedAnswerService.restore();
            done();
        })
    });

    describe('edit answer', function () {
        var mockedAnswerService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                userInfo: loggedInUser,
                params: {
                    answerId: 'ans_xyz'
                },
                body: { answer: "sample-answer" }
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });

            mockedAnswerService = sinon.mock(answerService);
            done();

        })

        it('should return response of 200 for editing answer', function (done) {
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "200", "message": "updated answer for answer id" }
            }
            mockedAnswerService.expects('editAnswer').once().withArgs(loggedInUser, 'ans_xyz', { "answer": "sample-answer" }).returns(
                Promise.resolve());
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
            answerController.editAnswer(request, response);
        })

        it('should return response of 500 for posting answer', function (done) {
            var req = http_mocks.createRequest({
                params: {
                    answerId: 'ans_xyz'
                },
                body: { answer: "sample-answer" }
            });
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "500", "message": "could not edit answer" }
            }
            mockedAnswerService.expects('editAnswer').once().withArgs(undefined, 'ans_xyz', { answer: "sample-answer" }).returns(
                Promise.reject({ "err": { "message": "", "stack": "" } }));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
            answerController.editAnswer(req, response);
        })

        afterEach(function (done) {
            mockedAnswerService.restore();
            done();
        })
    });


    describe('comment on answer', function () {
        var mockedAnswerService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                userInfo: loggedInUser,
                params: {
                    answerId: 'ans_xyz'
                },
                body: { comment: "sample-content" }
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });

            mockedAnswerService = sinon.mock(answerService);
            done();

        })

        it('should return response of 200 for commenting on answer', function (done) {
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "200", "message": "created comment for the answer" }
            }
            mockedAnswerService.expects('addComment').once().withArgs(loggedInUser, 'ans_xyz', 'sample-content').returns(
                Promise.resolve());
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
            answerController.commentOnAnswer(request, response);
        })

        it('should return response of 500 for commenting on answer', function (done) {
            var req = http_mocks.createRequest({
                params: {
                    answerId: 'ans_xyz'
                },
                body: { comment: 'sample-content' }
            });
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "500", "message": "could not comment on answer" }
            }
            mockedAnswerService.expects('addComment').once().withArgs(undefined, 'ans_xyz', 'sample-content').returns(
                Promise.reject({ "err": { "message": "", "stack": "" } }));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
            answerController.commentOnAnswer(req, response);
        })

        afterEach(function (done) {
            mockedAnswerService.restore();
            done();
        })
    });

    describe('vote unvote answer', function () {
        var mockedAnswerService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                params:{answerId:'ans_xyz',voteValue:1},
                userInfo:loggedInUser
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });

            mockedAnswerService = sinon.mock(answerService);
            done();

        })

        it('should return response of 200 vote/unvote answer', function (done) {
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "201", "message": "updated the votes of the answer" }
            }
            mockedAnswerService.expects('voteUnvoteAnswer').once().withArgs(loggedInUser, 'ans_xyz', 1).returns(
                Promise.resolve([]));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
            answerController.voteUnvoteAnswer(request, response);
        })

        it('should return error response of vote/unvote answer', function (done) {
            var req = http_mocks.createRequest({
                params:{answerId:'ans_xyz',voteValue:1}
            });

            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "500", "message": "could not the vote the answer" }
            }
            mockedAnswerService.expects('voteUnvoteAnswer').once().withArgs(undefined, 'ans_xyz', 1).returns(
                Promise.reject({ "err": { "message": "", "stack": "" } }));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
            answerController.voteUnvoteAnswer(req, response);
        })

        afterEach(function (done) {
            mockedAnswerService.restore();
            done();
        })
    });

     describe('delete comment on answer', function () {
        var mockedAnswerService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                params:{answerId:'ans_xyz',commentId:'comm_xyz'},
                userInfo:loggedInUser
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });

            mockedAnswerService = sinon.mock(answerService);
            done();

        })

        it('should return response of 200 delete comment for answer', function (done) {
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "200", "message": "deleted comments for answers" }
            }
            mockedAnswerService.expects('deleteComment').once().withArgs(loggedInUser, 'ans_xyz', 'comm_xyz').returns(
                Promise.resolve([]));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
            answerController.deleteCommentForAnswer(request, response);
        })

        it('should return error response for delete comment for answer', function (done) {
            var req = http_mocks.createRequest({
                params:{answerId:'ans_xyz',commentId:'comm_xyz'}
            });

            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "500", "message": "could not delete comments for answers" }
            }
            mockedAnswerService.expects('deleteComment').once().withArgs(undefined, 'ans_xyz', 'comm_xyz').returns(
                Promise.reject({ "err": { "message": "", "stack": "" } }));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
            answerController.deleteCommentForAnswer(req, response);
        })

        afterEach(function (done) {
            mockedAnswerService.restore();
            done();
        })
    });

    
    describe('delete discussion by id', function () {
        var mockedAnswerService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                userInfo: loggedInUser,
                params: { "answerId":'ans_xyz' }
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });

            mockedAnswerService = sinon.mock(answerService);
            done();

        })

        it('should return response of 204 for deleting the answer', function (done) {
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "204", "message": "answer deleted successfully" }
            }
            mockedAnswerService.expects('deleteAnswer').once().withArgs(loggedInUser,'ans_xyz').returns(
                Promise.resolve([]));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
            answerController.deleteAnswerById(request, response);
        })

        it('should return error response for deleting answer', function (done) {
            var req = http_mocks.createRequest({
                params: { "answerId":'ans_xyz' }
            });

            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "500", "message": "could not delete the answer" }
            }
            mockedAnswerService.expects('deleteAnswer').once().withArgs(undefined,'ans_xyz').returns(
                Promise.reject({ "err": { "message": "", "stack": "" } }));
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            });
            answerController.deleteAnswerById(req, response);
        })

        afterEach(function (done) {
            mockedAnswerService.restore();
            done();
        })
    });

});