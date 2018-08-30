var sinon = require('sinon');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var should = chai.should();
var expect = chai.expect;
var sinonBluebird = require('sinon-bluebird');
var Promise = require('bluebird');
var discussionService = require("../../app/services/discussion.service");
var userModel = require("../../app/dao/user.model.js");
var answerModel = require("../../app/dao/answer.model.js");
var discussionModel = require("../../app/dao/discussion.model.js");

describe("Discussion services", function () {
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
    var mockeditdiscussion;
    var answerModelMock;
    var discussionModelMock;
    var userModelMock;

    describe("All Published Discussions", function () {
        var getDiscussionsByStatusStubResponse =
            [
                {
                    _id: "57a09a1e0140eca43424c676",
                    updated_at: "1234",
                    created_at: "1234",
                    content: "content",
                    title: "title",
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
                    discussion_id: "1234",
                    __v: 0,
                    status: "PUBLISHED",
                    answers: [],
                    viewed_by: [],
                    tags: [],
                    voted_by: [],
                    comments: []
                }
            ];

        beforeEach(function (done) {
            discussionModelMock = sinon.mock(discussionModel);


            done();
        });

        it("should return all published discussions", function (done) {
            discussionModelMock.expects("getDiscussionsByStatus").once().resolves(getDiscussionsByStatusStubResponse);
            var expected =
                [
                    {
                        discussion_id: "1234",
                        content: "content",
                        tags: [],
                        votesCount: 0,
                        answersCount: 0,
                        commentsCount: 0,
                        views: 0,
                        created_at: "1234",
                        title: "title",
                        status: "PUBLISHED",
                        created_by: {
                            user_name: "M1000000@mindtree.com",
                            profile_pic_file: {
                                ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                                name: "f344_1394167081599saihareesh.jpg"
                            },
                            last_name: "Parker",
                            first_name: "Peter"
                        },
                    }
                ];

            discussionService.getPublishedDiscussions(loggedInUser, 1, 5).should.eventually.to.eql(expected).notify(done);
        });
        it("should reject the promise if getDiscussionsByStatus dao error occurs", function (done) {
            discussionModelMock.expects("getDiscussionsByStatus").once().rejects('error occured in getDiscussionsByStatus dao');
            discussionService.getPublishedDiscussions(loggedInUser, 1, 5).should.be.rejectedWith("error occured in getDiscussionsByStatus dao").and.notify(done);
        });

        afterEach(function (done) {
            discussionModelMock.restore();
            done();
        });
    });


    describe("Create Discussion", function () {
        var discussionToBeCreated = {
            content: "content",
            title: "title",
            tags: [],
            status: "PUBLISHED",
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
            discussion_id: "1234"
        };
        var invalidDiscussion = {
            content: null,
            tags: ["abcd", "thistagisfordemo", "java%@"],
            title: null,
            status: "PUBLISHED"
        };
        var createDiscussionStubResponse =
            {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                content: "content",
                title: "title",
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
                discussion_id: "1234",
                _id: "57a2dd1653fb58cd1301475e",
                status: "PUBLISHED",
                answers: [],
                viewed_by: [],
                tags: [],
                voted_by: [],
                comments: []
            };
        beforeEach(function (done) {
            discussionModelMock = sinon.mock(discussionModel);
            done();
        });

        it("should create a discussion and resolve with data", function (done) {
            discussionModelMock.expects("createDiscussion").once().resolves(createDiscussionStubResponse);
            var expected = {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                content: "content",
                title: "title",
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
                discussion_id: "1234",
                _id: "57a2dd1653fb58cd1301475e",
                status: "PUBLISHED",
                answers: [],
                viewed_by: [],
                tags: [],
                voted_by: [],
                comments: []
            };
            discussionService.createDiscussion(loggedInUser, discussionToBeCreated).should.eventually.to.eql(expected).notify(done);
        });
        it("should reject the promise if createDiscussion dao operation throws error", function (done) {
            discussionModelMock.expects("createDiscussion").once().rejects('error occured in createDiscussion dao');
            discussionService.createDiscussion(loggedInUser, discussionToBeCreated).should.be.rejectedWith("error occured in createDiscussion dao").and.notify(done);
        });
        it("should throw error if input parameters are invalid", function (done) {
            discussionModelMock.expects("createDiscussion").once().resolves(createDiscussionStubResponse);
            expect(function () { discussionService.createDiscussion(undefined, discussionToBeCreated); }).to.throw();
            expect(function () { discussionService.createDiscussion(loggedInUser, undefined); }).to.throw();
            expect(function () { discussionService.createDiscussion(loggedInUser, invalidDiscussion); }).to.throw();
            done();
        });
        afterEach(function (done) {
            discussionModelMock.restore();
            done();
        });
    });

    describe("Add Discussion Comment", function () {
        var addCommentStubResponse =
            {
                _id: "57a2de62f13f5125094f78c6",
                updated_at: "1234",
                created_at: "1234",
                content: "1234",
                title: "1234",
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
                discussion_id: "1234",
                __v: 0,
                status: "PUBLISHED",
                answers: [],
                viewed_by: [],
                tags: [],
                voted_by: [],
                comments: []
            };
        beforeEach(function (done) {
            discussionModelMock = sinon.mock(discussionModel);


            done();
        });

        it("should add a comment to a discussion and resolve with no data", function (done) {
            discussionModelMock.expects("addComment").once().resolves(addCommentStubResponse);
            discussionService.postCommentToDiscussion(loggedInUser, "1", "1234").should.eventually.to.eql().notify(done);
        });
        it("should reject the promise if addDiscussionComment dao operation throws error", function (done) {
            discussionModelMock.expects("addComment").once().rejects('error occured in addDiscussionComment');
            discussionService.postCommentToDiscussion(loggedInUser, "1", "1234").should.be.rejectedWith("error occured in addDiscussionComment").and.notify(done);
        });
        afterEach(function (done) {
            discussionModelMock.restore();
            done();
        });
    });
    describe("Discussion Vote update", function () {
        var voteDiscussionStubResponse =
            {
                _id: "57a2de62f13f5125094f78c6",
                updated_at: "1234",
                created_at: "1234",
                content: "content",
                title: "title",
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
                discussion_id: "1234",
                __v: 0,
                status: "PUBLISHED",
                answers: [],
                viewed_by: [],
                tags: [],
                voted_by: [],
                comments: []
            };
        var unVoteDiscussionStubResponse = voteDiscussionStubResponse;
        beforeEach(function (done) {
            discussionModelMock = sinon.mock(discussionModel);
            done();
        });
        it("should like the discussion and resolve with no data", function (done) {
            discussionModelMock.expects("addVote").once().resolves(voteDiscussionStubResponse);
            discussionService.voteUnvoteDiscussion(loggedInUser, "1", "1").should.be.fulfilled.notify(done);
        });
        it("should unlike the discussion and resolve with no data", function (done) {
            discussionModelMock.expects("removeVote").once().resolves(unVoteDiscussionStubResponse);
            discussionService.voteUnvoteDiscussion(loggedInUser, "1", "0").should.be.fulfilled.notify(done);
        });
        it("should reject the promise if addVote dao operation throws error", function (done) {
            discussionModelMock.expects("addVote").once().rejects('error occured in addVote dao');
            discussionService.voteUnvoteDiscussion(loggedInUser, "1", "1").should.be.rejectedWith("error occured in addVote dao").and.notify(done);
        });
        it("should reject the promise if removeVote dao operation throws error", function (done) {
            discussionModelMock.expects("removeVote").once().rejects('error occured in removeVote dao');
            discussionService.voteUnvoteDiscussion(loggedInUser, "1", "0").should.be.rejectedWith("error occured in removeVote dao").and.notify(done);
        });
        afterEach(function (done) {
            discussionModelMock.restore();
            done();
        });
    });
    describe("Delete discussion Comment", function () {
        var deleteCommentStubResponse =
            {
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
                comment_id: "1234",
                _id: "57a309f26dfe0a751f6b63d9",
                created_at: "1234"
            };
        var getCommentByIdStubResponse =
            {
                content: "content",
                comment_id: "1234",
                _id: "57a309f26dfe0a751f6b63d9",
                created_at: "1234",
                created_by: "5795b9b3d387d768806d80de"
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
            discussionModelMock = sinon.mock(discussionModel);
            done();
        });

        it("should delete a discussion comment and resolve with no data", function (done) {
            discussionModelMock.expects("getCommentById").once().resolves(getCommentByIdStubResponse);
            discussionModelMock.expects("deleteComment").once().resolves(deleteCommentStubResponse);
            discussionService.removeCommentInDiscussion(loggedInUser, "1", "1").should.be.fulfilled.notify(done);
        });
        it("should reject the promise if getCommentById dao operation throws error", function (done) {
            discussionModelMock.expects("getCommentById").once().rejects('error occured in getCommentById dao');
            discussionModelMock.expects("deleteComment").once().resolves(deleteCommentStubResponse);
            discussionService.removeCommentInDiscussion(loggedInUser, "1", "1").should.be.rejectedWith("error occured in getCommentById dao").and.notify(done);
        });
        it("should reject the promise if deleteComment dao operation throws error", function (done) {
            discussionModelMock.expects("getCommentById").once().resolves(getCommentByIdStubResponse);
            discussionModelMock.expects("deleteComment").once().rejects('error occured in deleteComment dao');
            discussionService.removeCommentInDiscussion(loggedInUser, "1", "1").should.be.rejectedWith("error occured in deleteComment dao").and.notify(done);
        });
        it("should reject the promise if other user tries to delete the comment", function (done) {
            discussionModelMock.expects("getCommentById").once().resolves(getCommentByIdStubResponse);
            discussionModelMock.expects("deleteComment").once().resolves(deleteCommentStubResponse);
            discussionService.removeCommentInDiscussion(otherUser, "1", "1").should.be.rejectedWith("you dont have permission to delete others comments").and.notify(done);
        });
        afterEach(function (done) {
            discussionModelMock.restore();
            done();
        });
    });

    describe("User's Published Discussion", function () {
        var getUserByUsernameStubResponse =
            {
                _id: "579ee622d387d768806d816b",
                user_name: "M1000000@mindtree.com",
                updated_at: "1234",
                full_name: "Peter Parker",
                status: "active",
                email: "Peter.Parker@mindtree.com",
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
            };
        var getDiscussionsByUserStubResponse =
            [
                {
                    _id: "57a2de62f13f5125094f78c6",
                    updated_at: "1234",
                    created_at: "1234",
                    content: "content",
                    title: "title",
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
                    discussion_id: "1234",
                    __v: 0,
                    status: "PUBLISHED",
                    answers: [],
                    viewed_by: [],
                    tags: [],
                    voted_by: [],
                    comments: []
                }
            ];
        beforeEach(function (done) {
            discussionModelMock = sinon.mock(discussionModel);
            userModelMock = sinon.mock(userModel);
            done();
        });

        it("should return published discussions of an user", function (done) {
            userModelMock.expects("getUserByUsername").once().resolves(getUserByUsernameStubResponse);
            discussionModelMock.expects("getDiscussionsByUser").once().resolves(getDiscussionsByUserStubResponse);
            var expected =
                [
                    {
                        discussion_id: "1234",
                        content: "content",
                        tags: [],
                        votesCount: 0,
                        answersCount: 0,
                        commentsCount: 0,
                        views: 0,
                        created_at: "1234",
                        title: "title",
                        status: "PUBLISHED",
                        created_by:
                        {
                            user_name: "M1000000@mindtree.com",
                            last_name: "Parker",
                            first_name: "Peter",
                            profile_pic_file: {
                                ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                                name: "f344_1394167081599saihareesh.jpg"
                            }
                        }
                    }
                ];

            discussionService.getPublishedDiscussionsOfUser(loggedInUser, "M1000000@mindtree.com", 1, 5).should.eventually.to.eql(expected).notify(done);
        });
        it("should reject the promise if getUserByUsername dao error occurs", function (done) {
            userModelMock.expects("getUserByUsername").once().rejects('error occured in getUserByUsername dao');
            discussionModelMock.expects("getDiscussionsByUser").once().resolves(getDiscussionsByUserStubResponse);
            discussionService.getPublishedDiscussionsOfUser(loggedInUser, "M1000000@mindtree.com", 1, 5).should.be.rejectedWith("error occured in getUserByUsername dao").and.notify(done);
        });
        it("should reject the promise if getDiscussionsByUser dao error occurs", function (done) {
            userModelMock.expects("getUserByUsername").once().resolves(getUserByUsernameStubResponse);
            discussionModelMock.expects("getDiscussionsByUser").once().rejects('error occured in getDiscussionsByUser dao');
            discussionService.getPublishedDiscussionsOfUser(loggedInUser, "M1000000@mindtree.com", 1, 5).should.be.rejectedWith("error occured in getDiscussionsByUser dao").and.notify(done);
        });
        afterEach(function (done) {
            discussionModelMock.restore();
            userModelMock.restore();
            done();
        });
    });
    describe("All Disussions Of User", function () {
        var getDiscussionsByUserStubResponse =
            [{
                _id: "57a2de62f13f5125094f78c6",
                updated_at: "1234",
                created_at: "1234",
                content: "content",
                title: "title",
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
                discussion_id: "1234",
                __v: 0,
                status: "PUBLISHED",
                answers: [],
                viewed_by: [],
                tags: [],
                voted_by: [],
                comments: []
            }
            ];
        beforeEach(function (done) {
            discussionModelMock = sinon.mock(discussionModel);


            done();
        });

        it("should return all discussions of an user", function (done) {
            discussionModelMock.expects("getDiscussionsByUser").once().resolves(getDiscussionsByUserStubResponse);
            var expected =

                [
                    {
                        discussion_id: "1234",
                        content: "content",
                        tags: [],
                        votesCount: 0,
                        answersCount: 0,
                        commentsCount: 0,
                        views: 0,
                        created_at: "1234",
                        title: "title",
                        status: "PUBLISHED",
                        created_by:
                        {
                            user_name: "M1000000@mindtree.com",
                            last_name: "Parker",
                            first_name: "Peter",
                            profile_pic_file: {
                                ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                                name: "f344_1394167081599saihareesh.jpg"
                            }
                        }
                    }
                ];

            discussionService.getAllDiscussionsOfUser(loggedInUser, 1, 5).should.eventually.to.eql(expected).notify(done);
        });
        it("should reject the promise if getDiscussionsByUser dao error occurs", function (done) {
            discussionModelMock.expects("getDiscussionsByUser").once().rejects('error occured in getDiscussionsByUser dao');
            discussionService.getAllDiscussionsOfUser(loggedInUser, 1, 5).should.be.rejectedWith("error occured in getDiscussionsByUser dao").and.notify(done);
        });

        afterEach(function (done) {
            discussionModelMock.restore();
            done();
        });
    });


    describe("Delete Discussion", function () {
        var getDiscussionByIdStubResponse =
            {
                _id: "57a2de62f13f5125094f78c6",
                updated_at: "1234",
                created_at: "1234",
                content: "content",
                title: "title",
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
                discussion_id: "1234",
                __v: 0,
                status: "PUBLISHED",
                answers: [],
                viewed_by: [],
                tags: [],
                voted_by: [],
                comments: []
            };
        var deleteDiscussionByIdStubResponse =
            {
                _id: "57a2de62f13f5125094f78c6",
                updated_at: "1234",
                created_at: "1234",
                content: "content",
                title: "title",
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
                discussion_id: "1234",
                __v: 0,
                status: "PUBLISHED",
                answers: [],
                viewed_by: [],
                tags: [],
                voted_by: [],
                comments: []
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
            answerModelMock = sinon.mock(answerModel);
            discussionModelMock = sinon.mock(discussionModel);
            done();
        });

        it("should delete the discussion and return with no data", function (done) {
            discussionModelMock.expects("getDiscussionById").once().resolves(getDiscussionByIdStubResponse);
            discussionModelMock.expects("deleteDiscussionById").once().resolves(deleteDiscussionByIdStubResponse);
            answerModelMock.expects("deleteAnswerByIds").once().resolves(2);
            discussionService.deleteDiscussion(loggedInUser, "1").should.be.fulfilled.notify(done);
        });
        it("should reject the promise if deleteDiscussionById dao operation throws error", function (done) {
            discussionModelMock.expects("getDiscussionById").once().resolves(getDiscussionByIdStubResponse);
            answerModelMock.expects("deleteAnswerByIds").once().resolves(2);
            discussionModelMock.expects("deleteDiscussionById").once().rejects('error occured in deleteDiscussionById dao');
            discussionService.deleteDiscussion(loggedInUser, "1").should.be.rejectedWith("error occured in deleteDiscussionById dao").and.notify(done);
        });
        it("should reject the promise if getDiscussionById dao operation throws error", function (done) {
            discussionModelMock.expects("getDiscussionById").once().rejects('error occured in getDiscussionById dao');
            answerModelMock.expects("deleteAnswerByIds").once().resolves(2);
            discussionModelMock.expects("deleteDiscussionById").once().resolves(deleteDiscussionByIdStubResponse);
            discussionService.deleteDiscussion(loggedInUser, "1").should.be.rejectedWith("error occured in getDiscussionById dao").and.notify(done);
        });
        it("should reject the promise if other user tries to delete discussion", function (done) {
            discussionModelMock.expects("getDiscussionById").once().resolves(getDiscussionByIdStubResponse);
            discussionModelMock.expects("deleteDiscussionById").once().resolves(deleteDiscussionByIdStubResponse);
            discussionService.deleteDiscussion(otherUser, "1").should.be.rejectedWith("Error").and.notify(done);
        });

        afterEach(function (done) {

            answerModelMock.restore();
            discussionModelMock.restore();
            done();
        });
    });
    describe("Edit Discussion", function () {
        var editedDiscussion = {
            title: "title",
            content: "content",
            tags: [],
            status: "PUBLISHED"
        };
        var invalidDiscussion = {
            content: null,
            tags: ["abcd", "thistagisfordemo", "java%@"],
            title: null,
            status: "PUBLISHED"
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
        var getDiscussionByIdStubResponse =
            {
                _id: "57a2dd1653fb58cd1301475e",
                updated_at: "1234",
                created_at: "1234",
                content: "content",
                title: "title",
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
                discussion_id: "1234",
                __v: 0,
                status: "PUBLISHED",
                answers: [],
                viewed_by: [],
                tags: [],
                voted_by: [],
                comments: []
            };

        var editDiscussionStubResponse =
            {
                _id: "57a2dd1653fb58cd1301475e",
                updated_at: "1234",
                created_at: "1234",
                content: "content",
                title: "title",
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
                discussion_id: "1234",
                __v: 0,
                status: "PUBLISHED",
                answers: [],
                viewed_by: [],
                tags: [],
                voted_by: [],
                comments: []
            };
        beforeEach(function (done) {
            discussionModelMock = sinon.mock(discussionModel);
            done();
        });

        it("should edit the discussion and resolve with no data", function (done) {
            discussionModelMock.expects("getDiscussionById").once().resolves(getDiscussionByIdStubResponse);
            discussionModelMock.expects("editDiscussion").once().resolves(editDiscussionStubResponse);
            discussionService.editDiscussion(loggedInUser, "1", editedDiscussion).should.be.fulfilled.notify(done);
        });
        it("should reject the promise if editDiscussion dao operation throws error", function (done) {
            discussionModelMock.expects("getDiscussionById").once().resolves(getDiscussionByIdStubResponse);
            discussionModelMock.expects("editDiscussion").once().rejects('error in editDiscussion dao');
            discussionService.editDiscussion(loggedInUser, "1", editedDiscussion).should.be.rejectedWith("error in editDiscussion dao").and.notify(done);
        });
        it("should reject the promise if current status of discussion is PUBLISHED and user tries to change status to DRAFT", function (done) {
            discussionModelMock.expects("getDiscussionById").once().resolves(getDiscussionByIdStubResponse);
            discussionModelMock.expects("editDiscussion").once().resolves(editDiscussionStubResponse);
            var editedDiscussionWithDraftStatus = JSON.parse(JSON.stringify(editedDiscussion));
            editedDiscussionWithDraftStatus.status = "DRAFT";
            discussionService.editDiscussion(loggedInUser, "1", editedDiscussionWithDraftStatus).should.be.rejectedWith("Error").and.notify(done);
        });
        it("should reject the promise if other user tries to edit the discussion", function (done) {
            discussionModelMock.expects("getDiscussionById").once().resolves(getDiscussionByIdStubResponse);
            discussionModelMock.expects("editDiscussion").once().resolves(editDiscussionStubResponse);
            discussionService.editDiscussion(otherUser, "1", editedDiscussion).should.be.rejectedWith("Error").and.notify(done);
        });
        it("should throw error if input parameters are invalid", function (done) {
            discussionModelMock.expects("getDiscussionById").once().resolves(getDiscussionByIdStubResponse);
            discussionModelMock.expects("editDiscussion").once().resolves(editDiscussionStubResponse);
            expect(function () { discussionService.editDiscussion(undefined,"1",editedDiscussion); }).to.throw();
            expect(function () { discussionService.editDiscussion(loggedInUser,"123",undefined); }).to.throw();
            expect(function () { discussionService.editDiscussion(loggedInUser, undefined, editedDiscussion); }).to.throw();
            expect(function () { discussionService.editDiscussion(loggedInUser, "123", invalidDiscussion); }).to.throw();
            done();
        });
        afterEach(function (done) {
            discussionModelMock.restore();
            done();
        });
    });
    describe("View Discussion", function () {
        var getDiscussionByIdStubResponse =
            {
                _id: "57a01c9d81f03fd0203fbc17",
                updated_at: "1234",
                created_at: "1234",
                content: "content",
                title: "title",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    updated_at: "1234",
                    full_name: "Peter Parker",
                    status: "active",
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: 'parker',
                    first_name: 'Peter',
                    employee_id: "M1000000",
                    __v: 0,
                    created_at: "1234",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    },
                },
                discussion_id: "1234",
                __v: 0,
                status: "PUBLISHED",
                answers: [],
                viewed_by: [],
                tags: [],
                voted_by: [],
                comments: []
            };
        var updateDiscussionViewStubResponse = {
            _id: "57a33392025237c03a6e2ff5",
            updated_at: "1234",
            created_at: "1234",
            content: "content",
            title: "title",
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
            discussion_id: "1234",
            __v: 0,
            status: "PUBLISHED",
            answers: [],
            viewed_by: [],
            tags: [],
            voted_by: [],
            comments: []
        };
        beforeEach(function (done) {
            discussionModelMock = sinon.mock(discussionModel);
            done();
        });

        it("should view the discussion and to return with the data", function (done) {
            discussionModelMock.expects("getDiscussionById").once().resolves(getDiscussionByIdStubResponse);
            discussionModelMock.expects("updateDiscussionView").once().resolves(updateDiscussionViewStubResponse);
            var expected =
                {
                    discussion_id: "1234",
                    content: "content",
                    tags: [],
                    votesCount: 0,
                    commentsCount: 0,
                    comments: [],
                    views: 0,
                    created_at: "1234",
                    title: "title",
                    status: "PUBLISHED",
                    isVoted: false,
                    created_by:
                    {
                        user_name: "M1000000@mindtree.com",
                        profile_pic_file: {
                            ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                            name: "f344_1394167081599saihareesh.jpg"
                        },
                        last_name: "parker",
                        first_name: "Peter"
                    }
                };
            discussionService.viewDiscussion(loggedInUser, 1, 5).should.eventually.to.eql(expected).notify(done);
        });
        it("should not view the discussion and to return with the data", function (done) {
            discussionModelMock.expects("getDiscussionById").once().resolves(getDiscussionByIdStubResponse);
            discussionModelMock.expects("updateDiscussionView").once().resolves(updateDiscussionViewStubResponse);
            var expected =
                {
                    discussion_id: "1234",
                    content: "content",
                    tags: [],
                    votesCount: 0,
                    commentsCount: 0,
                    comments: [],
                    views: 0,
                    created_at: "1234",
                    title: "title",
                    status: "PUBLISHED",
                    isVoted: false,
                    created_by:
                    {
                        user_name: "M1000000@mindtree.com",
                        profile_pic_file: {
                            ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                            name: "f344_1394167081599saihareesh.jpg"
                        },
                        last_name: "parker",
                        first_name: "Peter"
                    }
                };
            discussionService.viewDiscussion(loggedInUser, 1, 0).should.eventually.to.eql(expected).notify(done);
        });
        it("should reject the promise if updateDiscussionView dao operation throws error", function (done) {
            discussionModelMock.expects("updateDiscussionView").once().rejects('error occured in updateDiscussionView dao');
            discussionModelMock.expects("getDiscussionById").once().resolves(getDiscussionByIdStubResponse);
            discussionService.viewDiscussion(loggedInUser, 1, 5).should.be.rejectedWith("error occured in updateDiscussionView dao").and.notify(done);
        });
        it("should reject the promise if getDiscussionById dao operation throws error", function (done) {
            discussionModelMock.expects("updateDiscussionView").once().resolves(updateDiscussionViewStubResponse);
            discussionModelMock.expects("getDiscussionById").once().rejects('error occurred in getDiscussionById dao');
            discussionService.viewDiscussion(loggedInUser, 1, 5).should.be.rejectedWith("error occurred in getDiscussionById dao").and.notify(done);
        });

        afterEach(function (done) {
            discussionModelMock.restore();
            done();
        });
    });
});
