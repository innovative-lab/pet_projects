var sinon = require('sinon');
var should = require('chai').should;
var expect = require('chai').expect;
var assert = require('chai').assert;

var postController = require('../../app/routes/controllers/post.controller.js');
var postService = require('../../app/services/post.service.js');
var Promise = require('bluebird');
var http_mocks = require('node-mocks-http');

describe('post controller', function () {

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

    describe('addPost', function () {
        var mockedPostService, request, response;
        beforeEach(function (done) {

            request = http_mocks.createRequest({
                method: 'GET',
                url: '/all',
                body: { "content": "sample post" },
                userInfo: loggedInUser
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });

            mockedPostService = sinon.mock(postService);
            done();

        })

        it('check the response format for success scenario', function (done) {
            var sampleBody = { "content": "sample post" };
            mockedPostService.expects('createPost').once().withArgs(loggedInUser, sampleBody).returns(Promise.resolve());

            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "200", "message": "created the post" }
            };
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            postController.addPost(request, response);

        })

        it('check the response format if body is undefined', function (done) {
            var req = http_mocks.createRequest({
                userInfo: loggedInUser
            });
            var sampleBody = { "content": "sample post" };
            mockedPostService.expects('createPost').once().withArgs(loggedInUser, {}).returns(Promise.reject("not able to add post"));

            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "500", "message": "couldnot add the post not able to add post" }
            };
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            postController.addPost(req, response);
        })

        afterEach(function (done) {
            mockedPostService.restore();
            done();
        })
    });


    describe('getAllPosts', function () {
        var mockedPostService, request, response;
        beforeEach('', function (done) {

            request = http_mocks.createRequest({
                method: 'GET',
                url: '/all',
                userInfo: loggedInUser,
                query: { pno: 1, psize: 1 }
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });


            mockedPostService = sinon.mock(postService);
            done();
        })

        it('check the response format of the posts', function (done) {
            var mockedPostsResponse = [
                {
                    "post_id": "post_7kxdXxixfU",
                    "content": "fghfgh",
                    "tags": [
                        "fgh"
                    ],
                    "likesCount": 0,
                    "created_by": {
                        "user_name": "M1035984@mindtree.com",
                        "profile_pic_file": {
                            "ref": null,
                            "name": null
                        },
                        "last_name": "Mahato",
                        "first_name": "Pankaj"
                    },
                    "created_at": "2016-08-08T05:28:33.689Z",
                    "isLiked": false,
                    "filename": null,
                    "fileref": null
                }];
            mockedPostService.expects('getAllPosts').once().withArgs(loggedInUser, 1, 1).returns(Promise.resolve(mockedPostsResponse));
            var expectedResponse = {
                "data": { "posts": mockedPostsResponse },
                "status": { "statusCode": "200", "message": "fetched posts" }
            };

            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                expect(res.status.message).to.equal(expectedResponse.status.message);
                done();
            })
            postController.getAllPosts(request, response);
        })

        it('check the error response of the posts', function (done) {
            var mockedPostsResponse = {};
            var req = http_mocks.createRequest({
                method: 'GET',
                url: '/all',
                userInfo: loggedInUser,
                query: { pno: 1, psize: 1 }
            });
            mockedPostService.expects('getAllPosts').once().withArgs(loggedInUser, 1, 1).returns(Promise.reject("error message"));
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "500", "message": "could not get all the posts error message" }
            };

            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })

            postController.getAllPosts(request, response);
        })

        afterEach('', function (done) {
            mockedPostService.restore();
            done();
        })
    });

    describe('likeUnlikePost', function () {
        var mockedPostService, request, response;;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                userInfo: loggedInUser,
                params: { postId: 'post_xyz',likeValue:1 }
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });
            mockedPostService = sinon.mock(postService);
            done()
        })

        it('should give response 200 for like/unlike the post', function (done) {
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "200", "message": "updated likes successfully" }
            };
            mockedPostService.expects('updatePostLikes').once().withArgs(loggedInUser, 'post_xyz',1).returns(Promise.resolve());
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            postController.likeUnlikePost(request, response);
        })

        it('should give error response for like/unlike post', function (done) {
            var req = http_mocks.createRequest({
                params: { postId: 'post_xyz',likeValue:1 }
            });
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "500", "message": "unable to like/unlike posts" }
            };
            mockedPostService.expects('updatePostLikes').once().withArgs(undefined, 'post_xyz',1).returns(Promise.resolve());
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            postController.likeUnlikePost(req, response);
        })

        afterEach(function (done) {
           mockedPostService.restore();
           done();
        })
    });


    describe('deletePost', function () {
        var mockedPostService, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                userInfo: loggedInUser,
                params: { postId: 'post_xyz' }
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });

            mockedPostService = sinon.mock(postService);
            done();
        })

        it('delete the post response', function (done) {
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "200", "message": "deleted the post" }
            };
            mockedPostService.expects('deletePost').once().withArgs(loggedInUser, 'post_xyz').returns(Promise.resolve());

            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            postController.deletePost(request, response);
        })

        it('error response of delete post', function (done) {
            var req = http_mocks.createRequest({
                params: { postId: 'post_xyz' }
            });
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "500", "message": "unable to delete the post" }
            };
            mockedPostService.expects('deletePost').once().withArgs(undefined, 'post_xyz').returns(Promise.reject());

            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            postController.deletePost(req, response);
        })

        afterEach(function (done) {
            mockedPostService.restore();
            done();
        })
    });


});