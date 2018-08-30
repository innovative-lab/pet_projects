var sinon = require('sinon');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var should = chai.should();
var expect = chai.expect;
var sinonBluebird = require('sinon-bluebird');
var Promise = require('bluebird');
var postService = require("../../app/services/post.service");
var postModel = require("../../app/dao/post.model.js");

describe("Post services", function () {
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
    var postInfo;
    var postModelMock;
    describe("Create Post", function () {
        var createPostStubResponse =
            {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                post_id: "1234",
                created_by:
                {
                    _id: "579ee12cd387d768806d8162",
                    user_name: "M1000000@mindtree.com",
                    updated_at: "1234",
                    full_name: 'Peter Parker',
                    status: "active",
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    __v: 0,
                    created_at: "1234",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                content: "content",
                _id: "57a4354095d0f5ed51a24858",
                file:
                {
                    name: 'f464_temp1.txt',
                    ref: 'workspace://SpacesStore/0f9857b2-fb65-40e7-bd4f-50f4db42e7e7'
                },
                tags: [],
                liked_by: []
            };
        var postInfo = {
            content: "content",
            tags: [],
            fileNoderef: 'workspace://SpacesStore/0f9857b2-fb65-40e7-bd4f-50f4db42e7e7',
            fileName: 'f464_temp1.txt'
        };
        var invalidPost = {
            content: null,
            tags: ["abcd", "thistagisfordemopurpose","ja+%!var"],
            fileNoderef: 'workspace://SpacesStore/0f9857b2-fb65-40e7-bd4f-50f4db42e7e7',
            fileName: 'f464_temp1.txt'
        };
        beforeEach(function (done) {
            postModelMock = sinon.mock(postModel);
            done();
        });

        it("should create a post and resolve with promise", function (done) {
            postModelMock.expects("createPost").once().resolves(createPostStubResponse);
            var expected = {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                post_id: "1234",
                created_by:
                {
                    _id: "579ee12cd387d768806d8162",
                    user_name: "M1000000@mindtree.com",
                    updated_at: "1234",
                    full_name: 'Peter Parker',
                    status: "active",
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    __v: 0,
                    created_at: "1234",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                content: "content",
                _id: "57a4354095d0f5ed51a24858",
                file:
                {
                    name: 'f464_temp1.txt',
                    ref: 'workspace://SpacesStore/0f9857b2-fb65-40e7-bd4f-50f4db42e7e7'
                },
                tags: [],
                liked_by: []
            };
            postService.createPost(loggedInUser, postInfo).should.eventually.to.eql(expected).notify(done);
        });
        it("should reject the promise if createPost dao operation throws error", function (done) {
            postModelMock.expects("createPost").once().rejects('error occured in createPost dao');
            postService.createPost(loggedInUser, postInfo).should.be.rejectedWith("error occured in createPost dao").and.notify(done);
        });
        it("should throw error if input parameters are invalid", function (done) {
            postModelMock.expects("createPost").once().resolves(createPostStubResponse);
            expect(function () { postService.createPost(undefined, postInfo); }).to.throw();
            expect(function () { postService.createPost(loggedInUser, undefined); }).to.throw();
            expect(function () { postService.createPost(loggedInUser, invalidPost); }).to.throw();
            done();
        });

        afterEach(function (done) {
            postModelMock.restore();
            done();
        });
    });
    describe("Delete Post", function () {
        var getPostByIdStubResponse =
            {
                _id: "57a4354095d0f5ed51a24858",
                updated_at: "1234",
                created_at: "1234",
                post_id: "1234",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    updated_at: "1234",
                    full_name: 'Peter Parker',
                    status: "active",
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    __v: 0,
                    created_at: "1234",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                content: "content",
                __v: 0,
                file:
                {
                    name: 'f464_temp1.txt',
                    ref: 'workspace://SpacesStore/0f9857b2-fb65-40e7-bd4f-50f4db42e7e7'
                },
                tags: [],
                liked_by: []
            };
        var deletePostStubResponse =
            {
                _id: "57a4354095d0f5ed51a24858",
                updated_at: "1234",
                created_at: "1234",
                post_id: "1234",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    updated_at: "1234",
                    full_name: 'Peter Parker',
                    status: "active",
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    __v: 0,
                    created_at: "1234",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                content: "content",
                __v: 0,
                file:
                {
                    name: 'f464_temp1.txt',
                    ref: 'workspace://SpacesStore/0f9857b2-fb65-40e7-bd4f-50f4db42e7e7'
                },
                tags: [],
                liked_by: []
            };
        var otherUser = {
            user_name: "peter@mindtree.com",
            profile_pic_file: {
                ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678f",
                name: "f344_139416708159.jpg"
            },
            full_name: "Peter Parker",
            email: null,
            last_name: "Parker",
            first_name: "Peter",
            employee_id: "M1234568",
            subscribed_streams: [],
            followings: [],
            _id: "5795b9b3d387d768806d80dg"
        };
        beforeEach(function (done) {
            postModelMock = sinon.mock(postModel);
            done();
        });

        it("should delete the post and return with no data", function (done) {
            postModelMock.expects("getPostById").once().resolves(getPostByIdStubResponse);
            postModelMock.expects("deletePost").once().resolves(deletePostStubResponse);
            postService.deletePost(loggedInUser, "1234").should.be.fulfilled.notify(done);
        });
        it("should reject the promise if deletePost dao operation throws error", function (done) {
            postModelMock.expects("getPostById").once().resolves(getPostByIdStubResponse);
            postModelMock.expects("deletePost").once().rejects('error occured in deletePost dao');
            postService.deletePost(loggedInUser, "1234").should.be.rejectedWith("error occured in deletePost dao").and.notify(done);
        });
        it("should reject the promise if getPostById dao operation throws error", function (done) {
            postModelMock.expects("getPostById").once().rejects('error occured in getPostById dao');
            postModelMock.expects("deletePost").once().resolves(deletePostStubResponse);
            postService.deletePost(loggedInUser, "1234").should.be.rejectedWith("error occured in getPostById dao").and.notify(done);
        });
        //     it("should throw error if input parameters are invalid", function (done) {
        //     postModelMock.expects("getPostById").once().resolves(getPostByIdStubResponse);
        //     postModelMock.expects("deletePost").once().rejects('error occured  in delete post');
        //     expect(function () { postService.deletePost(otherUser, "1234"); }).to.throw(new Error);            done();
        // });
        afterEach(function (done) {
            postModelMock.restore();
            done();
        });
    });
    describe("Post Like update", function () {
        var likePostStubResponse =
            {
                _id: "57a42d1c95d0f5ed51a24856",
                updated_at: "1234",
                created_at: "1234",
                post_id: "1234",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    updated_at: "1234",
                    full_name: 'Peter Parker',
                    status: "active",
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    __v: 0,
                    created_at: "1234",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                content: "content",
                __v: 0,
                file:
                {
                    name: 'f464_temp1.txt',
                    ref: 'workspace://SpacesStore/0f9857b2-fb65-40e7-bd4f-50f4db42e7e7'
                },
                tags: [],
                liked_by: []
            };
        var unLikePostStubResponse = likePostStubResponse;
        beforeEach(function (done) {
            postModelMock = sinon.mock(postModel);
            done();
        });

        it("should like the post and resolve with no data", function (done) {
            postModelMock.expects("likePost").once().resolves(likePostStubResponse);
            postService.updatePostLikes(loggedInUser, "1", "1").should.be.fulfilled.notify(done);
        });
        it("should unlike the post and resolve with no data", function (done) {
            postModelMock.expects("unLikePost").once().resolves(unLikePostStubResponse);
            postService.updatePostLikes(loggedInUser, "1", "0").should.be.fulfilled.notify(done);
        });
        it("should reject the promise if likePost dao operation throws error", function (done) {
            postModelMock.expects("likePost").once().rejects('error occured in likePost dao');
            postService.updatePostLikes(loggedInUser, "1", "1").should.be.rejectedWith("error occured in likePost dao").and.notify(done);
        });
        it("should reject the promise if unLikePost dao operation throws error", function (done) {
            postModelMock.expects("unLikePost").once().rejects('error occured in unLikePost dao');
            postService.updatePostLikes(loggedInUser, "1", "0").should.be.rejectedWith("error occured in unLikePost dao").and.notify(done);
        });
        afterEach(function (done) {
            postModelMock.restore();
            done();
        });
    });
    describe("All Posts", function () {
        var getAllPostsStubResponse =
            [
                {
                    _id: "57a42d1c95d0f5ed51a24856",
                    updated_at: "1234",
                    created_at: "1234",
                    post_id: "1234",
                    created_by:
                    {
                        _id: "5795b9b3d387d768806d80de",
                        user_name: "M1000000@mindtree.com",
                        updated_at: "1234",
                        full_name: 'Peter Parker',
                        status: "active",
                        email: 'Peter.Parker@mindtreee.com',
                        last_name: "Parker",
                        first_name: "Peter",
                        employee_id: "M1000000",
                        __v: 0,
                        created_at: "1234",
                        subscribed_streams: [],
                        followings: [],
                        profile_pic_file: {
                            ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                            name: "f344_1394167081599saihareesh.jpg"
                        }
                    },
                    content: "content",
                    __v: 0,
                    file:
                    {
                        name: 'f464_temp1.txt',
                        ref: 'workspace://SpacesStore/0f9857b2-fb65-40e7-bd4f-50f4db42e7e7'
                    },
                    tags: [],
                    liked_by: []
                }
            ];
        beforeEach(function (done) {
            postModelMock = sinon.mock(postModel);
            done();
        });

        it("should return all posts", function (done) {
            postModelMock.expects("getAllPosts").once().resolves(getAllPostsStubResponse);
            var expected =
                [
                    {
                        content: "content",
                        created_at: "1234",
                        created_by: {
                            first_name: "Peter",
                            last_name: "Parker",
                            profile_pic_file: {
                                name: "f344_1394167081599saihareesh.jpg",
                                ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e"
                            },
                            user_name: "M1000000@mindtree.com"
                        },
                        file: {
                            name: "f464_temp1.txt",
                            ref: "0f9857b2-fb65-40e7-bd4f-50f4db42e7e7"
                        },
                        isLiked: false,
                        likesCount: 0,
                        post_id: "1234",
                        tags: []
                    }
                ];

            postService.getAllPosts(loggedInUser, 1, 5).should.eventually.to.eql(expected).notify(done);
        });
        it("should reject the promise if getAllPosts dao error occurs", function (done) {
            postModelMock.expects("getAllPosts").once().rejects('error occured in getAllPosts dao');
            postService.getAllPosts(loggedInUser, 1, 5).should.be.rejectedWith("error occured in getAllPosts dao").and.notify(done);
        });

        afterEach(function (done) {
            postModelMock.restore();
            done();
        });
    });
});