var sinon = require('sinon');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var should = chai.should();
var expect = chai.expect;
var sinonBluebird = require('sinon-bluebird');
var Promise = require('bluebird');
var activityService = require("../../app/services/activity.service");
var userModel = require("../../app/dao/user.model.js");
var activityModel = require("../../app/dao/activity.model.js");


describe("Activity services", function () {
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

    var userModelMock;
    var activityModelMock;
    var discussion;
    var postActivity;
    var activity = {
        __v: 0,
        updated_at: "1234",
        created_at: "1234",
        title: "title",
        content: "content",
        blog_id: "1234",
        created_by:
        {
            _id: "5795b9b3d387d768806d80de",
            user_name: "M1000000@mindtree.com",
            full_name: 'Peter Parker',
            email: 'Peter.Parker@mindtreee.com',
            last_name: "Parker",
            first_name: "Peter",
            employee_id: "M1000000",
            subscribed_streams: [],
            followings: [],
            profile_pic_file: {
                ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                name: "f344_1394167081599saihareesh.jpg"
            }
        },
        _id: "57a9a4a1a1aa1975e7c538ea",
        status: "PUBLISHED",
        viewed_by: [],
        tags: [],
        liked_by: [],
        comments: []
    };
    var created_by = {
        _id: "5795b9b3d387d768806d80de",
        user_name: "M1000000@mindtree.com",
        full_name: 'Peter Parker',
        email: 'Peter.Parker@mindtreee.com',
        last_name: "Parker",
        first_name: "Peter",
        employee_id: "M1000000",
        subscribed_streams: [],
        followings: [],
        profile_pic_file: {
            ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
            name: "f344_1394167081599saihareesh.jpg"
        }
    };

    describe("All Activities", function () {
        beforeEach(function (done) {
            userModelMock = sinon.mock(userModel);
            activityModelMock = sinon.mock(activityModel);
            done();
        });

        var getUserByUsernameStubResponse = {
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
        };
        var getAllActivitiesStubResponse = [
            {
                _id: "57a85c30961dfa11329c98d4",
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                __v: 0,
                data:
                {
                    _id: "57a85c30961dfa11329c98d3",
                    discussion_id: "1234",
                    title: "title",
                    tags: [],
                    created_at: "1234"
                },
                isActive: true
            }
        ];

        it("should return all activities", function (done) {
            userModelMock.expects("getUserByUsername").once().resolves(getUserByUsernameStubResponse);
            activityModelMock.expects("getAllActivities").once().resolves(getAllActivitiesStubResponse);

            var expected = [
                {
                    name: "name",
                    content:
                    {
                        created_at: "1234",
                        tags: [],
                        title: "title",
                        discussion_id: "1234",
                        _id: "57a85c30961dfa11329c98d3"
                    },
                    created_by:
                    {
                        _id: "5795b9b3d387d768806d80de",
                        user_name: "M1000000@mindtree.com",
                        full_name: 'Peter Parker',
                        email: 'Peter.Parker@mindtreee.com',
                        last_name: "Parker",
                        first_name: "Peter",
                        employee_id: "M1000000",
                        subscribed_streams: [],
                        followings: [],
                        profile_pic_file: {
                            ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                            name: "f344_1394167081599saihareesh.jpg"
                        }
                    },
                    created_at: "1234"
                }
            ];

            activityService.getAllActivities("M1000000@mindtree.com", 1, 5).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if getUserByUsername dao error occurs", function (done) {
            userModelMock.expects("getUserByUsername").once().rejects('error occured in getUserByUsername dao');
            activityModelMock.expects("getAllActivities").once().resolves(getAllActivitiesStubResponse);
            activityService.getAllActivities("M1000000@mindtree.com", 1, 5).should.be.rejectedWith("error occured in getUserByUsername dao").and.notify(done);
        });

        afterEach(function (done) {
            userModelMock.restore();
            activityModelMock.restore();
            done();
        });
    });

    describe("New Blog Listener", function () {
        beforeEach(function (done) {
            activityModelMock = sinon.mock(activityModel);
            done();
        });

        var createActivityStubResponse =
            {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9a4a1a1aa1975e7c538eb",
                data:
                {
                    created_at: "1234",
                    tags: [],
                    title: "title",
                    blog_id: "1234",
                    _id: "57a9a4a1a1aa1975e7c538ea"
                },
                isActive: true
            };
        activity = {
            __v: 0,
            updated_at: "1234",
            created_at: "1234",
            title: "title",
            content: "content",
            blog_id: "1234",
            created_by:
            {
                _id: "5795b9b3d387d768806d80de",
                user_name: "M1000000@mindtree.com",
                full_name: 'Peter Parker',
                email: 'Peter.Parker@mindtreee.com',
                last_name: "Parker",
                first_name: "Peter",
                employee_id: "M1000000",
                subscribed_streams: [],
                followings: [],
                profile_pic_file: {
                    ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                    name: "f344_1394167081599saihareesh.jpg"
                }
            },
            _id: "57a9a4a1a1aa1975e7c538ea",
            status: "PUBLISHED",
            viewed_by: [],
            tags: [],
            liked_by: [],
            comments: []
        };
        it("should listen the blog once created return with blog data", function (done) {
            activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
            var expected = {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9a4a1a1aa1975e7c538eb",
                data:
                {
                    created_at: "1234",
                    tags: [],
                    title: "title",
                    blog_id: "1234",
                    _id: "57a9a4a1a1aa1975e7c538ea"
                },
                isActive: true
            };

            activityService.newBlogListener(activity).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if newBlogActivity dao operation throws error", function (done) {
            activityModelMock.expects("createActivity").once().rejects('error occured in newBlogActivity dao');
            activityService.newBlogListener(activity).should.be.rejectedWith("error occured in newBlogActivity dao").and.notify(done);
        });

        afterEach(function (done) {
            activityModelMock.restore();
            done();
        });
    });
    describe("Blog Comment Listener", function () {
        beforeEach(function (done) {
            activityModelMock = sinon.mock(activityModel);
            done();
        });

        var createActivityStubResponse =
            {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9a6706d2f2d840c5a084a",
                data:
                {
                    comments:
                    {
                        content: "content",
                        created_by:
                        {
                            _id: "5795b9b3d387d768806d80de",
                            user_name: "M1000000@mindtree.com",
                            full_name: 'Peter Parker',
                            email: 'Peter.Parker@mindtreee.com',
                            last_name: "Parker",
                            first_name: "Peter",
                            employee_id: "M1000000",
                            subscribed_streams: [],
                            followings: [],
                            profile_pic_file: {
                                ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                                name: "f344_1394167081599saihareesh.jpg"
                            }
                        },
                        created_at: "1234",
                        comment_id: "1234"
                    },
                    title: "title",
                    _id: "57a9a4a1a1aa1975e7c538ea",
                    blog_id: "1234"
                },
                isActive: true
            };
        it("should listen the comment in a blog when created and return with commentBlog data", function (done) {
            activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
            var expected = {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9a6706d2f2d840c5a084a",
                data:
                {
                    comments:
                    {
                        content: "content",
                        created_by:
                        {
                            _id: "5795b9b3d387d768806d80de",
                            user_name: "M1000000@mindtree.com",
                            full_name: 'Peter Parker',
                            email: 'Peter.Parker@mindtreee.com',
                            last_name: "Parker",
                            first_name: "Peter",
                            employee_id: "M1000000",
                            subscribed_streams: [],
                            followings: [],
                            profile_pic_file: {
                                ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                                name: "f344_1394167081599saihareesh.jpg"
                            }
                        },
                        created_at: "1234",
                        comment_id: "1234"
                    },
                    title: "title",
                    _id: "57a9a4a1a1aa1975e7c538ea",
                    blog_id: "1234"
                },
                isActive: true
            };

            activityService.newBlogCommentListener(activity, loggedInUser).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if blogCommentActivity dao operation throws error", function (done) {
            activityModelMock.expects("createActivity").once().rejects('error occured in blogCommentActivity dao');
            activityService.newBlogCommentListener(activity, loggedInUser).should.be.rejectedWith("error occured in blogCommentActivity dao").and.notify(done);
        });

        afterEach(function (done) {
            activityModelMock.restore();
            done();
        });
    });
    describe("Like Blog Listener", function () {
        beforeEach(function (done) {
            activityModelMock = sinon.mock(activityModel);
            done();
        });

        var createActivityStubResponse =
            {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9c5ea0437ff4982c9f5fa",
                data: {
                    _id: "57a9a4a1a1aa1975e7c538ea", blog_id: "blog_qk7N3TrHx3"
                },
                isActive: true
            };

        it("should listen when the blog gets liked and return with updated blog data", function (done) {
            activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
            var expected = {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9c5ea0437ff4982c9f5fa",
                data: {
                    _id: "57a9a4a1a1aa1975e7c538ea", blog_id: "blog_qk7N3TrHx3"
                },
                isActive: true
            };

            activityService.likeBlogListener(activity, loggedInUser).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if likeBlogActivity dao operation throws error", function (done) {
            activityModelMock.expects("createActivity").once().rejects('error occured in likeBlogActivity dao');
            activityService.likeBlogListener(activity, loggedInUser).should.be.rejectedWith("error occured in likeBlogActivity dao").and.notify(done);
        });

        afterEach(function (done) {
            activityModelMock.restore();
            done();
        });
    });
    describe("Delete Blog Comment Listener", function () {
        beforeEach(function (done) {
            activityModelMock = sinon.mock(activityModel);
            done();
        });

        var createActivityStubResponse =
            {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9a85fe0656459d4e393e0",
                data:
                {
                    comments:
                    {
                        content: "content",
                        created_by:
                        {
                            _id: "5795b9b3d387d768806d80de",
                            user_name: "M1000000@mindtree.com",
                            full_name: 'Peter Parker',
                            email: 'Peter.Parker@mindtreee.com',
                            last_name: "Parker",
                            first_name: "Peter",
                            employee_id: "M1000000",
                            subscribed_streams: [],
                            followings: [],
                            profile_pic_file: {
                                ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                                name: "f344_1394167081599saihareesh.jpg"
                            }
                        },
                        created_at: "1234",
                        comment_id: "1234"
                    },
                    blog_id: "1234"
                },
                isActive: true
            };


        it("should listen the blog when it gets deleted and return with no data", function (done) {
            activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
            activityModelMock.expects("deleteBlogCommentEvent").once().resolves({});
            var expected = {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9a85fe0656459d4e393e0",
                data:
                {
                    comments:
                    {
                        content: "content",
                        created_by:
                        {
                            _id: "5795b9b3d387d768806d80de",
                            user_name: "M1000000@mindtree.com",
                            full_name: 'Peter Parker',
                            email: 'Peter.Parker@mindtreee.com',
                            last_name: "Parker",
                            first_name: "Peter",
                            employee_id: "M1000000",
                            subscribed_streams: [],
                            followings: [],
                            profile_pic_file: {
                                ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                                name: "f344_1394167081599saihareesh.jpg"
                            }
                        },
                        created_at: "1234",
                        comment_id: "1234"
                    },
                    blog_id: "1234"
                },
                isActive: true
            };

            activityService.deleteBlogCommentListener(activity, loggedInUser).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if deleteBlogCommentActivity dao operation throws error", function (done) {
            activityModelMock.expects("createActivity").once().rejects('error occured in deleteBlogCommentActivity dao');
            activityModelMock.expects("deleteBlogCommentEvent").once().resolves({});
            activityService.deleteBlogCommentListener(activity, loggedInUser).should.be.rejectedWith("error occured").and.notify(done);
        });
        it("should reject the promise if deleteBlogCommentEvent dao operation throws error", function (done) {
            activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
            activityModelMock.expects("deleteBlogCommentEvent").once().rejects('error occured in deleteBlogCommentEvent dao');
            activityService.deleteBlogCommentListener(activity, loggedInUser).should.be.rejectedWith("error occured in deleteBlogCommentEvent dao").and.notify(done);
        });

        afterEach(function (done) {
            activityModelMock.restore();
            done();
        });
    });
    describe("Edit Blog Listener", function () {
        beforeEach(function (done) {
            activityModelMock = sinon.mock(activityModel);
            done();
        });

        var createActivityStubResponse = {
            __v: 0,
            updated_at: "1234",
            created_at: "1234",
            name: "name",
            created_by:
            {
                _id: "5795b9b3d387d768806d80de",
                user_name: "M1000000@mindtree.com",
                full_name: 'Peter Parker',
                email: 'Peter.Parker@mindtreee.com',
                last_name: "Parker",
                first_name: "Peter",
                employee_id: "M1000000",
                subscribed_streams: [],
                followings: [],
                profile_pic_file: {
                    ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                    name: "f344_1394167081599saihareesh.jpg"
                }
            },
            _id: "57a9c5f50437ff4982c9f5fc",
            data:
            {
                status: "PUBLISHED",
                tags: [],
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                content: "content",
                title: "title",
                _id: "57a9a4a1a1aa1975e7c538ea",
                blog_id: "1234"
            },
        };
        it("should listen when the blog is edited and return with updated blog data", function (done) {
            activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
            var expected = {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9c5f50437ff4982c9f5fc",
                data:
                {
                    status: "PUBLISHED",
                    tags: [],
                    created_by:
                    {
                        _id: "5795b9b3d387d768806d80de",
                        user_name: "M1000000@mindtree.com",
                        full_name: 'Peter Parker',
                        email: 'Peter.Parker@mindtreee.com',
                        last_name: "Parker",
                        first_name: "Peter",
                        employee_id: "M1000000",
                        subscribed_streams: [],
                        followings: [],
                        profile_pic_file: {
                            ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                            name: "f344_1394167081599saihareesh.jpg"
                        }
                    },
                    content: "content",
                    title: "title",
                    _id: "57a9a4a1a1aa1975e7c538ea",
                    blog_id: "1234"
                },
            };
            activityService.editBlogListener(activity, loggedInUser).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if editBlogActivity dao operation throws error", function (done) {
            activityModelMock.expects("createActivity").once().rejects('error occured in editBlogActivity dao');
            activityService.editBlogListener(activity, loggedInUser).should.be.rejectedWith("error occured in editBlogActivity dao").and.notify(done);
        });

        afterEach(function (done) {
            activityModelMock.restore();
            done();
        });
    });
    describe("UnLike Blog Listener", function () {
        beforeEach(function (done) {
            activityModelMock = sinon.mock(activityModel);
            done();
        });

        var createActivityStubResponse =
            {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9c5ea0437ff4982c9f5fa",
                data: {
                    _id: "57a9a4a1a1aa1975e7c538ea", blog_id: "blog_qk7N3TrHx3"
                },
                isActive: true
            };

        it("should listen when the blog is unliked and returns with updated data", function (done) {
            activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
            var expected = {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9c5ea0437ff4982c9f5fa",
                data: {
                    _id: "57a9a4a1a1aa1975e7c538ea", blog_id: "blog_qk7N3TrHx3"
                },
                isActive: true
            };

            activityService.unlikeBlogListener(activity, loggedInUser).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if unLikeBlogActivity dao error occurs", function (done) {
            activityModelMock.expects("createActivity").once().rejects('error occured in unLikeBlogActivity dao');
            activityService.unlikeBlogListener(activity, loggedInUser).should.be.rejectedWith("error occured in unLikeBlogActivity dao").and.notify(done);
        });

        afterEach(function (done) {
            activityModelMock.restore();
            done();
        });
    });
    describe("Delete Blog Listener", function () {
        beforeEach(function (done) {
            activityModelMock = sinon.mock(activityModel);
            done();
        });

        var createActivityStubResponse =
            {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9c8c111826029e01d95e2",
                data:
                {
                    comments: [],
                    liked_by: [],
                    tags: [],
                    viewed_by: [],
                    status: "PUBLISHED",
                    __v: 0,
                    created_by:
                    {
                        _id: "5795b9b3d387d768806d80de",
                        user_name: "M1000000@mindtree.com",
                        full_name: 'Peter Parker',
                        email: 'Peter.Parker@mindtreee.com',
                        last_name: "Parker",
                        first_name: "Peter",
                        employee_id: "M1000000",
                        subscribed_streams: [],
                        followings: [],
                        profile_pic_file: {
                            ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                            name: "f344_1394167081599saihareesh.jpg"
                        }
                    },
                    blog_id: "1234",
                    content: "content",
                    title: "title",
                    created_at: "1234",
                    updated_at: "1234",
                    _id: '57a9a4a1a1aa1975e7c538ea'
                },
                isActive: true
            };
        it("should listen when the blog is deleted and to delete the associated comments with it and return with data", function (done) {
            activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
            activityModelMock.expects("deleteBlogEvent").once().resolves({});
            activityModelMock.expects("deleteBlogCommentOnDeleteBlogEvent").once().resolves({});
            var expected = {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9c8c111826029e01d95e2",
                data:
                {
                    comments: [],
                    liked_by: [],
                    tags: [],
                    viewed_by: [],
                    status: "PUBLISHED",
                    __v: 0,
                    created_by:
                    {
                        _id: "5795b9b3d387d768806d80de",
                        user_name: "M1000000@mindtree.com",
                        full_name: 'Peter Parker',
                        email: 'Peter.Parker@mindtreee.com',
                        last_name: "Parker",
                        first_name: "Peter",
                        employee_id: "M1000000",
                        subscribed_streams: [],
                        followings: [],
                        profile_pic_file: {
                            ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                            name: "f344_1394167081599saihareesh.jpg"
                        }
                    },
                    blog_id: "1234",
                    content: "content",
                    title: "title",
                    created_at: "1234",
                    updated_at: "1234",
                    _id: '57a9a4a1a1aa1975e7c538ea'
                },
                isActive: true
            };

            activityService.deleteBlogListener(activity, loggedInUser).should.eventually.to.eql(expected).notify(done);
        });
        it("should reject the promise if deleteBlogActivity dao error occurs", function (done) {
            activityModelMock.expects("createActivity").once().rejects('error occured in deleteBlogActivity dao');
            activityModelMock.expects("deleteBlogEvent").once().resolves({});
            activityModelMock.expects("deleteBlogCommentOnDeleteBlogEvent").once().resolves({});
            activityService.deleteBlogListener(activity, loggedInUser).should.be.rejectedWith("error occured in deleteBlogActivity dao").and.notify(done);
        });
        // it("should reject the promise if deleteBlogEvent dao error occurs", function (done) {
        //     activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
        //     activityModelMock.expects("deleteBlogCommentOnDeleteBlogEvent").once().resolves({});
        //     activityModelMock.expects("deleteBlogEvent").once().rejects('error occured in error occured in deleteBlogEvent dao');
        //     activityService.deleteBlogListener(activity, loggedInUser).should.be.rejectedWith("error occured in error occured in deleteBlogEvent dao").and.notify(done);
        // });
        // it("should reject the promise if deleteBlogCommentOnDeleteBlogEvent dao error occurs", function (done) {
        //     activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
        //     activityModelMock.expects("deleteBlogEvent").once().resolves({});
        //     activityModelMock.expects("deleteBlogCommentOnDeleteBlogEvent").once().rejects('error occured in deleteBlogCommentOnDeleteBlogEvent dao');
        //     activityService.deleteBlogListener(activity, loggedInUser).should.be.rejectedWith("error occured in deleteBlogCommentOnDeleteBlogEvent dao").and.notify(done);
        // });


        afterEach(function (done) {
            activityModelMock.restore();
            done();
        });
    });

    describe("New Discussion Listener", function () {
        beforeEach(function (done) {
            activityModelMock = sinon.mock(activityModel);
            done();
        });

        var createActivityStubResponse =
            {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9cb123044c6a1e9e923e5",
                data:
                {
                    created_at: "1234",
                    tags: [],
                    title: "title",
                    discussion_id: "1234",
                    _id: "57a9cb123044c6a1e9e923e4"
                },
                isActive: true
            };

        it("should listen when new discussion is created and return with data", function (done) {
            activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
            var expected = {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9cb123044c6a1e9e923e5",
                data:
                {
                    created_at: "1234",
                    tags: [],
                    title: "title",
                    discussion_id: "1234",
                    _id: "57a9cb123044c6a1e9e923e4"
                },
                isActive: true
            };

            activityService.newDiscussionListener(activity).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if craeteDisussionAcivity dao operation throws error", function (done) {
            activityModelMock.expects("createActivity").once().rejects('error occured in craeteDisussionAcivity dao');
            activityService.newDiscussionListener(activity).should.be.rejectedWith("error occured in craeteDisussionAcivity dao").and.notify(done);
        });

        afterEach(function (done) {
            activityModelMock.restore();
            done();
        });
    });
    describe("Comment Discussion Listener", function () {
        beforeEach(function (done) {
            activityModelMock = sinon.mock(activityModel);
            done();
        });

        var createActivityStubResponse =
            {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9cba83044c6a1e9e923ea",
                data:
                {
                    comments:
                    {
                        content: "content",
                        created_by:
                        {
                            _id: "5795b9b3d387d768806d80de",
                            user_name: "M1000000@mindtree.com",
                            full_name: 'Peter Parker',
                            email: 'Peter.Parker@mindtreee.com',
                            last_name: "Parker",
                            first_name: "Peter",
                            employee_id: "M1000000",
                            subscribed_streams: [],
                            followings: [],
                            profile_pic_file: {
                                ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                                name: "f344_1394167081599saihareesh.jpg"
                            }
                        },
                        created_at: "1234",
                        comment_id: "1234"
                    },
                    _id: "57a9cb123044c6a1e9e923e4",
                    title: "title",
                    discussion_id: "1234"
                },
                isActive: true
            };

        it("should listen the comment in the discussion when created and return with data", function (done) {
            activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
            var expected = {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9cba83044c6a1e9e923ea",
                data:
                {
                    comments:
                    {
                        content: "content",
                        created_by:
                        {
                            _id: "5795b9b3d387d768806d80de",
                            user_name: "M1000000@mindtree.com",
                            full_name: 'Peter Parker',
                            email: 'Peter.Parker@mindtreee.com',
                            last_name: "Parker",
                            first_name: "Peter",
                            employee_id: "M1000000",
                            subscribed_streams: [],
                            followings: [],
                            profile_pic_file: {
                                ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                                name: "f344_1394167081599saihareesh.jpg"
                            }
                        },
                        created_at: "1234",
                        comment_id: "1234"
                    },
                    _id: "57a9cb123044c6a1e9e923e4",
                    title: "title",
                    discussion_id: "1234"
                },
                isActive: true
            };

            activityService.commentDiscussionListener(activity, loggedInUser).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if createCommentDiscussionActivity dao operation throws error", function (done) {
            activityModelMock.expects("createActivity").once().rejects('error occured in createCommentDiscussionActivity dao');
            activityService.commentDiscussionListener(activity, loggedInUser).should.be.rejectedWith("error occured in createCommentDiscussionActivity dao").and.notify(done);
        });

        afterEach(function (done) {
            activityModelMock.restore();
            done();
        });
    });
    describe("Vote Discussion Listener", function () {
        beforeEach(function (done) {
            activityModelMock = sinon.mock(activityModel);
            done();
        });

        var createActivityStubResponse =
            {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9cb193044c6a1e9e923e6",
                data:
                {
                    _id: "57a9cb123044c6a1e9e923e4",
                    discussion_id: "1234"
                },
                isActive: true
            };

        it("should listen when user voted in the discussion and return data", function (done) {
            activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
            var expected = {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9cb193044c6a1e9e923e6",
                data:
                {
                    _id: "57a9cb123044c6a1e9e923e4",
                    discussion_id: "1234"
                },
                isActive: true
            };

            activityService.voteDiscussionListener(activity, loggedInUser).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if voteDiscussionActivity dao operation throws error", function (done) {
            activityModelMock.expects("createActivity").once().rejects('error occured in voteDiscussionActivity dao');
            activityService.voteDiscussionListener(activity, loggedInUser).should.be.rejectedWith("error occured in voteDiscussionActivity dao").and.notify(done);
        });

        afterEach(function (done) {
            activityModelMock.restore();
            done();
        });
    });
    describe("Delete Discussion Comment Listener", function () {
        beforeEach(function (done) {
            activityModelMock = sinon.mock(activityModel);
            done();
        });

        var createActivityStubResponse =
            {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9cea5d2637315dbcf737c",
                data:
                {
                    answers: ["1234"],
                    comments:
                    {
                        content: "content",
                        created_by:
                        {
                            _id: "5795b9b3d387d768806d80de",
                            user_name: "M1000000@mindtree.com",
                            full_name: 'Peter Parker',
                            email: 'Peter.Parker@mindtreee.com',
                            last_name: "Parker",
                            first_name: "Peter",
                            employee_id: "M1000000",
                            subscribed_streams: [],
                            followings: [],
                            profile_pic_file: {
                                ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                                name: "f344_1394167081599saihareesh.jpg"
                            }
                        },
                        created_at: "1234",
                        comment_id: "1234"
                    },
                    discussion_id: "1234"
                },
                isActive: true
            };
        it("should listen whena a discussion is deleted and return", function (done) {
            activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
            activityModelMock.expects("deleteDiscussionCommentEvent").once().resolves({});
            var expected = {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9cea5d2637315dbcf737c",
                data:
                {
                    answers: ["1234"],
                    comments:
                    {
                        content: "content",
                        created_by:
                        {
                            _id: "5795b9b3d387d768806d80de",
                            user_name: "M1000000@mindtree.com",
                            full_name: 'Peter Parker',
                            email: 'Peter.Parker@mindtreee.com',
                            last_name: "Parker",
                            first_name: "Peter",
                            employee_id: "M1000000",
                            subscribed_streams: [],
                            followings: [],
                            profile_pic_file: {
                                ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                                name: "f344_1394167081599saihareesh.jpg"
                            }
                        },
                        created_at: "1234",
                        comment_id: "1234"
                    },
                    discussion_id: "1234"
                },
                isActive: true
            };

            activityService.deleteDiscussionCommentListener(activity, loggedInUser).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if deleteDiscussionActivity dao operation throws error", function (done) {
            activityModelMock.expects("createActivity").once().rejects('error occured in deleteDiscussionActivity dao');
            activityModelMock.expects("deleteDiscussionCommentEvent").once().resolves({});
            activityService.deleteDiscussionCommentListener(activity, loggedInUser).should.be.rejectedWith("error occured in deleteDiscussionActivity dao").and.notify(done);
        });
  it("should reject the promise if deleteDiscussionCommentEvent dao operation throws error", function (done) {
            activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
            activityModelMock.expects("deleteDiscussionCommentEvent").once().rejects('error occured in deleteDiscussionCommentEvent dao');
            activityService.deleteDiscussionCommentListener(activity, loggedInUser).should.be.rejectedWith("error occured in deleteDiscussionCommentEvent dao").and.notify(done);
        });
        afterEach(function (done) {
            activityModelMock.restore();
            done();
        });
    });
    describe("Edit Discussion Listener", function () {
        beforeEach(function (done) {
            activityModelMock = sinon.mock(activityModel);
            done();
        });

        var createActivityStubResponse =
            {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9cb1e3044c6a1e9e923e8",
                data:
                {
                    status: "PUBLISHED",
                    tags: [],
                    created_by:
                    {
                        _id: "5795b9b3d387d768806d80de",
                        user_name: "M1000000@mindtree.com",
                        full_name: 'Peter Parker',
                        email: 'Peter.Parker@mindtreee.com',
                        last_name: "Parker",
                        first_name: "Peter",
                        employee_id: "M1000000",
                        subscribed_streams: [],
                        followings: [],
                        profile_pic_file: {
                            ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                            name: "f344_1394167081599saihareesh.jpg"
                        }
                    },
                    content: "content",
                    title: "title",
                    _id: "57a9cb123044c6a1e9e923e4",
                    discussion_id: "1234"
                },
                isActive: true
            };

        it("should listen when a discussion is edited and return with the updated Discussion", function (done) {
            activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
            var expected = {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9cb1e3044c6a1e9e923e8",
                data:
                {
                    status: "PUBLISHED",
                    tags: [],
                    created_by:
                    {
                        _id: "5795b9b3d387d768806d80de",
                        user_name: "M1000000@mindtree.com",
                        full_name: 'Peter Parker',
                        email: 'Peter.Parker@mindtreee.com',
                        last_name: "Parker",
                        first_name: "Peter",
                        employee_id: "M1000000",
                        subscribed_streams: [],
                        followings: [],
                        profile_pic_file: {
                            ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                            name: "f344_1394167081599saihareesh.jpg"
                        }
                    },
                    content: "content",
                    title: "title",
                    _id: "57a9cb123044c6a1e9e923e4",
                    discussion_id: "1234"
                },
                isActive: true
            };

            activityService.editDiscussionListener(activity, loggedInUser).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if editDiscussionActivity dao operation throws error", function (done) {
            activityModelMock.expects("createActivity").once().rejects('error occured in editDiscussionActivity dao');
            activityService.editDiscussionListener(activity, loggedInUser).should.be.rejectedWith("error occured in editDiscussionActivity dao").and.notify(done);
        });

        afterEach(function (done) {
            activityModelMock.restore();
            done();
        });
    });
    describe("Unvote Discussion Listener", function () {
        beforeEach(function (done) {
            activityModelMock = sinon.mock(activityModel);
            done();
        });

        var createActivityStubResponse =
            {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9cb1a3044c6a1e9e923e7",
                data:
                {
                    _id: "57a9cb123044c6a1e9e923e4",
                    discussion_id: "1234"
                },
                isActive: true
            };

        it("should listen when the user unvotes the discussion and return with data", function (done) {
            activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
            var expected = {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9cb1a3044c6a1e9e923e7",
                data:
                {
                    _id: "57a9cb123044c6a1e9e923e4",
                    discussion_id: "1234"
                },
                isActive: true
            };


            activityService.unvoteDiscussionListener(activity, loggedInUser).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if unvoteDiscussionActivity dao operation throws error", function (done) {
            activityModelMock.expects("createActivity").once().rejects('error occured in unvoteDiscussionActivity dao');
            activityService.unvoteDiscussionListener(activity, loggedInUser).should.be.rejectedWith("error occured in unvoteDiscussionActivity dao").and.notify(done);
        });

        afterEach(function (done) {
            activityModelMock.restore();
            done();
        });
    });
    describe("Delete Discussion Listener", function () {
        beforeEach(function (done) {
            activityModelMock = sinon.mock(activityModel);
            done();
        });

        var createActivityStubResponse =
            {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9cb123044c6a1e9e923e5",
                data:
                {
                    created_at: "1234",
                    tags: [],
                    title: "title",
                    discussion_id: "1234",
                    answers: [],
                    _id: "57a9cb123044c6a1e9e923e4"
                },
                isActive: true
            };
        it("should listen when a discussion is deleted and return with data", function (done) {
            activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
            activityModelMock.expects("deleteDiscussionEvent").once().resolves({});
            activityModelMock.expects("deleteDiscussionCommentonDeleteDiscussionEvent").once().resolves({});
            activityModelMock.expects("deleteAnswerOnDiscussionEvent").once().resolves({});
            activityModelMock.expects("deleteAnswerCommentsOnDeleteDiscussionEvent").once().resolves({});
            var expected = {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9cb123044c6a1e9e923e5",
                data:
                {
                    created_at: "1234",
                    tags: [],
                    title: "title",
                    discussion_id: "1234",
                    answers: [],
                    _id: "57a9cb123044c6a1e9e923e4"
                },
                isActive: true
            };

            activityService.deleteDiscussionListener(activity, loggedInUser).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if deleteDiscussionActivity dao operation throws error", function (done) {
            activityModelMock.expects("createActivity").once().rejects('error occured in deleteDiscussionActivity dao');
            activityModelMock.expects("deleteDiscussionEvent").once().resolves({});
            activityModelMock.expects("deleteDiscussionCommentonDeleteDiscussionEvent").once().resolves({});
            activityModelMock.expects("deleteAnswerOnDiscussionEvent").once().resolves({});
            activityModelMock.expects("deleteAnswerCommentsOnDeleteDiscussionEvent").once().resolves({});
            activityService.deleteDiscussionListener(activity, loggedInUser).should.be.rejectedWith("error occured in deleteDiscussionActivity dao").and.notify(done);
        });
        //      it("should reject the promise if deleteDiscussionEvent dao operation throws error", function (done) {
        //     activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
        //     activityModelMock.expects("deleteDiscussionEvent").once().rejects('error occured in deleteDiscussionEvent dao');
        //     activityModelMock.expects("deleteDiscussionCommentonDeleteDiscussionEvent").once().resolves({});
        //     activityModelMock.expects("deleteAnswerOnDiscussionEvent").once().resolves({});
        //     activityModelMock.expects("deleteAnswerCommentsOnDeleteDiscussionEvent").once().resolves({});
        //     activityService.deleteDiscussionListener(activity, loggedInUser).should.be.rejectedWith("error occured in deleteDiscussionActivity dao").and.notify(done);
        // });
        //      it("should reject the promise if deleteDiscussionCommentonDeleteDiscussionEvent dao operation throws error", function (done) {
        //     activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
        //     activityModelMock.expects("deleteDiscussionEvent").once().resolves({});
        //     activityModelMock.expects("deleteDiscussionCommentonDeleteDiscussionEvent").once().rejects('error occured in deleteDiscussionCommentonDeleteDiscussionEvent dao');
        //     activityModelMock.expects("deleteAnswerOnDiscussionEvent").once().resolves({});
        //     activityModelMock.expects("deleteAnswerCommentsOnDeleteDiscussionEvent").once().resolves({});
        //     activityService.deleteDiscussionListener(activity, loggedInUser).should.be.rejectedWith("error occured in deleteDiscussionActivity dao").and.notify(done);
        // });
        //              it("should reject the promise if deleteAnswerOnDiscussionEvent dao operation throws error", function (done) {
        //     activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
        //     activityModelMock.expects("deleteDiscussionEvent").once().resolves({});
        //     activityModelMock.expects("deleteDiscussionCommentonDeleteDiscussionEvent").once().resolves({});
        //     activityModelMock.expects("deleteAnswerOnDiscussionEvent").once().rejects('error occured in deleteAnswerOnDiscussionEvent dao');
        //     activityModelMock.expects("deleteAnswerCommentsOnDeleteDiscussionEvent").once().resolves({});
        //     activityService.deleteDiscussionListener(activity, loggedInUser).should.be.rejectedWith("error occured in deleteDiscussionActivity dao").and.notify(done);
        // });
        // it("should reject the promise if deleteAnswerCommentsOnDeleteDiscussionEvent dao operation throws error", function (done) {
        //     activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
        //     activityModelMock.expects("deleteDiscussionEvent").once().resolves({});
        //     activityModelMock.expects("deleteDiscussionCommentonDeleteDiscussionEvent").once().resolves({});
        //     activityModelMock.expects("deleteAnswerOnDiscussionEvent").once().resolves({});
        //     activityModelMock.expects("deleteAnswerCommentsOnDeleteDiscussionEvent").once().rejects('error occured in deleteAnswerCommentsOnDeleteDiscussionEvent dao');
        //     activityService.deleteDiscussionListener(activity, loggedInUser).should.be.rejectedWith("error occured in deleteAnswerCommentsOnDeleteDiscussionEvent dao").and.notify(done);
        // });

        afterEach(function (done) {
            activityModelMock.restore();
            done();
        });
    });
    describe("New Answer Listener", function () {
        beforeEach(function (done) {
            activityModelMock = sinon.mock(activityModel);
            done();
        });
        discussion = {
            _id: "57a9d34235a2f4ede287dafe",
            updated_at: "1234",
            created_at: "1234",
            content: '<p>asd</p>',
            title: 'asd',
            created_by:
            {
                _id: "5795b9b3d387d768806d80de",
                user_name: "M1000000@mindtree.com",
                full_name: 'Peter Parker',
                email: 'Peter.Parker@mindtreee.com',
                last_name: "Parker",
                first_name: "Peter",
                employee_id: "M1000000",
                subscribed_streams: [],
                followings: [],
                profile_pic_file: {
                    ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                    name: "f344_1394167081599saihareesh.jpg"
                }
            },
            discussion_id: "discussL1SvGhGxCf",
            __v: 0,
            status: "PUBLISHED",
            answers: [],
            viewed_by: [],
            tags: [],
            voted_by: [],
            comments: []
        };
        var createActivityStubResponse =
            {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9d34c35a2f4ede287db01",
                data:
                {
                    title: "title",
                    discussion_id: "1234",
                    answers:
                    {
                        created_at: "1234",
                        tags: [],
                        _id: "57a9d34c35a2f4ede287db00",
                        answer_id: "1234"
                    }
                },
                isActive: true
            };

        it("should listen when answer is created and returns the data", function (done) {
            activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
            var expected = {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9d34c35a2f4ede287db01",
                data:
                {
                    title: "title",
                    discussion_id: "1234",
                    answers:
                    {
                        created_at: "1234",
                        tags: [],
                        _id: "57a9d34c35a2f4ede287db00",
                        answer_id: "1234"
                    }
                },
                isActive: true
            };

            activityService.newAnswerListener(discussion, activity).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if newAnswerActivity dao operation throws error", function (done) {
            activityModelMock.expects("createActivity").once().rejects('error occured in newAnswerActivity dao');
            activityService.newAnswerListener(discussion, activity).should.be.rejectedWith("error occured").and.notify(done);
        });

        afterEach(function (done) {
            activityModelMock.restore();
            done();
        });
    });
    describe("Comment Answer Listener", function () {
        beforeEach(function (done) {
            activityModelMock = sinon.mock(activityModel);
            done();
        });

        var createActivityStubResponse =
            {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9d4bd35a2f4ede287db03",
                data:
                {
                    comments:
                    {
                        content: "content",
                        created_by: [],
                        created_at: "1234",
                        comment_id: "1234"
                    },
                    _id: "57a9d34c35a2f4ede287db00",
                    answer_id: "1234"
                },
                isActive: true
            };

        it("should listen when comment is added in the answer and returns with data", function (done) {
            activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
            var expected = {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9d4bd35a2f4ede287db03",
                data:
                {
                    comments:
                    {
                        content: "content",
                        created_by: [],
                        created_at: "1234",
                        comment_id: "1234"
                    },
                    _id: "57a9d34c35a2f4ede287db00",
                    answer_id: "1234"
                },
                isActive: true
            };

            activityService.commentAnswerListener(activity, loggedInUser).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if commentAnswerActivity dao operation throws error", function (done) {
            activityModelMock.expects("createActivity").once().rejects('error occured in commentAnswerActivity dao');
            activityService.commentAnswerListener(activity, loggedInUser).should.be.rejectedWith("error occured in commentAnswerActivity dao").and.notify(done);
        });

        afterEach(function (done) {
            activityModelMock.restore();
            done();
        });
    });
    describe("Vote Answer Listener", function () {
        beforeEach(function (done) {
            activityModelMock = sinon.mock(activityModel);
            done();
        });

        var createActivityStubResponse =
            {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9d52b35a2f4ede287db04",
                data: { _id: "57a9d34c35a2f4ede287db00", answer_id: "1234" },
                isActive: true
            };

        it("should listen when user votes for answer and returns with data", function (done) {
            activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
            var expected = {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9d52b35a2f4ede287db04",
                data: { _id: "57a9d34c35a2f4ede287db00", answer_id: "1234" },
                isActive: true
            };

            activityService.voteAnswerListener(activity, loggedInUser).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if voteAnswerActivity dao operation throws error", function (done) {
            activityModelMock.expects("createActivity").once().rejects('error occured in voteAnswerActivity dao');
            activityService.voteAnswerListener(activity, loggedInUser).should.be.rejectedWith("error occured in voteAnswerActivity dao").and.notify(done);
        });

        afterEach(function (done) {
            activityModelMock.restore();
            done();
        });
    });
    describe("Delete Answer Comment Listener", function () {
        beforeEach(function (done) {
            activityModelMock = sinon.mock(activityModel);
            done();
        });

        var createActivityStubResponse =
            {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9d59f35a2f4ede287db05",
                data:
                {
                    answer_id: "1234",
                    created_at: "1234",
                    _id: "57a9d4bd35a2f4ede287db02",
                    comment_id: "1234",
                    content: "1234",
                    created_by: "1234"
                },
                isActive: true
            };


        it("should list when comment in the answer gets deleted and returns with data", function (done) {
            activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
            activityModelMock.expects("deleteAnswerCommentEvent").once().resolves({});
            var expected = {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9d59f35a2f4ede287db05",
                data:
                {
                    answer_id: "1234",
                    created_at: "1234",
                    _id: "57a9d4bd35a2f4ede287db02",
                    comment_id: "1234",
                    content: "1234",
                    created_by: "1234"
                },
                isActive: true
            };

            activityService.deleteAnswerCommentListener(activity, loggedInUser).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if deleteAnswerCommentActivity dao operation throws error", function (done) {
            activityModelMock.expects("createActivity").once().rejects('error occured in deleteAnswerCommentActivity dao');
            activityModelMock.expects("deleteAnswerCommentEvent").once().resolves({});
            activityService.deleteAnswerCommentListener(activity, loggedInUser).should.be.rejectedWith("error occured in deleteAnswerCommentActivity dao").and.notify(done);
        });
           it("should reject the promise if deleteAnswerCommentEvent dao operation throws error", function (done) {
            activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
            activityModelMock.expects("deleteAnswerCommentEvent").once().rejects('error occured in deleteAnswerCommentEvent dao');
            activityService.deleteAnswerCommentListener(activity, loggedInUser).should.be.rejectedWith("error occured in deleteAnswerCommentEvent dao").and.notify(done);
        });

        afterEach(function (done) {
            activityModelMock.restore();
            done();
        });
    });
    describe("Edit Answer Listener", function () {
        beforeEach(function (done) {
            activityModelMock = sinon.mock(activityModel);
            done();
        });

        var createActivityStubResponse =
            {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9d61535a2f4ede287db06",
                data:
                {
                    tags: [],
                    created_by:
                    {
                        _id: "5795b9b3d387d768806d80de",
                        user_name: "M1000000@mindtree.com",
                        full_name: 'Peter Parker',
                        email: 'Peter.Parker@mindtreee.com',
                        last_name: "Parker",
                        first_name: "Peter",
                        employee_id: "M1000000",
                        subscribed_streams: [],
                        followings: [],
                        profile_pic_file: {
                            ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                            name: "f344_1394167081599saihareesh.jpg"
                        }
                    },
                    content: "content",
                    _id: "57a9d34c35a2f4ede287db00",
                    answer_id: "1234"
                },
                isActive: true
            };

        it("should listen when the answer is edited and return with the updated answer data", function (done) {
            activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
            var expected = {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9d61535a2f4ede287db06",
                data:
                {
                    tags: [],
                    created_by:
                    {
                        _id: "5795b9b3d387d768806d80de",
                        user_name: "M1000000@mindtree.com",
                        full_name: 'Peter Parker',
                        email: 'Peter.Parker@mindtreee.com',
                        last_name: "Parker",
                        first_name: "Peter",
                        employee_id: "M1000000",
                        subscribed_streams: [],
                        followings: [],
                        profile_pic_file: {
                            ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                            name: "f344_1394167081599saihareesh.jpg"
                        }
                    },
                    content: "content",
                    _id: "57a9d34c35a2f4ede287db00",
                    answer_id: "1234"
                },
                isActive: true
            };

            activityService.editAnswerListener(activity, loggedInUser).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if editAnswerActivity dao operation throws error", function (done) {
            activityModelMock.expects("createActivity").once().rejects('error occured in editAnswerActivity dao');
            activityService.editAnswerListener(activity, loggedInUser).should.be.rejectedWith("error occured in editAnswerActivity dao").and.notify(done);
        });

        afterEach(function (done) {
            activityModelMock.restore();
            done();
        });
    });
    describe("UnVote Answer Listener", function () {
        beforeEach(function (done) {
            activityModelMock = sinon.mock(activityModel);
            done();
        });

        var createActivityStubResponse =
            {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9d68d35a2f4ede287db07",
                data: { _id: "57a9d34c35a2f4ede287db00", answer_id: "1234" },
                isActive: true
            };

        it("should listen when user unvotes the answer and return with the data", function (done) {
            activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
            var expected = {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9d68d35a2f4ede287db07",
                data: { _id: "57a9d34c35a2f4ede287db00", answer_id: "1234" },
                isActive: true
            };

            activityService.unvoteAnswerListener(activity, loggedInUser).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if unVoteAnswerActivity dao operation throws error", function (done) {
            activityModelMock.expects("createActivity").once().rejects('error occured in unVoteAnswerActivity dao');
            activityService.unvoteAnswerListener(activity, loggedInUser).should.be.rejectedWith("error occured in unVoteAnswerActivity dao").and.notify(done);
        });

        afterEach(function (done) {
            activityModelMock.restore();
            done();
        });
    });
    describe("Delete Answer Listener", function () {
        beforeEach(function (done) {
            activityModelMock = sinon.mock(activityModel);
            done();
        });

        var createActivityStubResponse =
            {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9d6e935a2f4ede287db08",
                data:
                {
                    comments: [],
                    voted_by: [],
                    tags: [],
                    __v: 0,
                    content: "content",
                    created_by:
                    {
                        _id: "5795b9b3d387d768806d80de",
                        user_name: "M1000000@mindtree.com",
                        full_name: 'Peter Parker',
                        email: 'Peter.Parker@mindtreee.com',
                        last_name: "Parker",
                        first_name: "Peter",
                        employee_id: "M1000000",
                        subscribed_streams: [],
                        followings: [],
                        profile_pic_file: {
                            ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                            name: "f344_1394167081599saihareesh.jpg"
                        }
                    },
                    answer_id: "1234",
                    created_at: "1234",
                    updated_at: "1234",
                    _id: "57a9d34c35a2f4ede287db00"
                },
                isActive: true
            };
        it("should listen when the answer is deleted", function (done) {
            activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
            activityModelMock.expects("deleteAnswerEvent").once().resolves({});
            activityModelMock.expects("deleteAnswerCommentOnDeleteAnswerEvent").once().resolves({});
            var expected = {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9d6e935a2f4ede287db08",
                data:
                {
                    comments: [],
                    voted_by: [],
                    tags: [],
                    __v: 0,
                    content: "content",
                    created_by:
                    {
                        _id: "5795b9b3d387d768806d80de",
                        user_name: "M1000000@mindtree.com",
                        full_name: 'Peter Parker',
                        email: 'Peter.Parker@mindtreee.com',
                        last_name: "Parker",
                        first_name: "Peter",
                        employee_id: "M1000000",
                        subscribed_streams: [],
                        followings: [],
                        profile_pic_file: {
                            ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                            name: "f344_1394167081599saihareesh.jpg"
                        }
                    },
                    answer_id: "1234",
                    created_at: "1234",
                    updated_at: "1234",
                    _id: "57a9d34c35a2f4ede287db00"
                },
                isActive: true
            };

            activityService.deleteAnswerListener(activity, loggedInUser).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if deleteAnswerActivity dao operation throws error", function (done) {
            activityModelMock.expects("createActivity").once().rejects('error occured in deleteAnswerActivity dao');
            activityModelMock.expects("deleteAnswerEvent").once().resolves({});
            activityModelMock.expects("deleteAnswerCommentOnDeleteAnswerEvent").once().resolves({});
            activityService.deleteAnswerListener(activity, loggedInUser).should.be.rejectedWith("error occured in deleteAnswerActivity dao").and.notify(done);
        });
        // it("should reject the promise if deleteAnswerEvent dao operation throws error", function (done) {
        //     activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
        //     activityModelMock.expects("deleteAnswerEvent").once().rejects('error occured in deleteAnswerEvent dao');
        //     activityModelMock.expects("deleteAnswerCommentOnDeleteAnswerEvent").once().resolves({});
        //     activityService.deleteAnswerListener(activity, loggedInUser).should.be.rejectedWith("error occured in deleteAnswerEvent dao").and.notify(done);
        // });
        //        it("should reject the promise if deleteAnswerCommentOnDeleteAnswerEvent dao operation throws error", function (done) {
        //     activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
        //     activityModelMock.expects("deleteAnswerEvent").once().resolves({});
        //     activityModelMock.expects("deleteAnswerCommentOnDeleteAnswerEvent").once().rejects('error occured in deleteAnswerCommentOnDeleteAnswerEventdao');
        //     activityService.deleteAnswerListener(activity, loggedInUser).should.be.rejectedWith("error occured in deleteAnswerCommentOnDeleteAnswerEventdao").and.notify(done);
        // });



        afterEach(function (done) {
            activityModelMock.restore();
            done();
        });
    });
    describe("New Post Listener", function () {
        beforeEach(function (done) {
            activityModelMock = sinon.mock(activityModel);
            done();
        });

        var createActivityStubResponse =
            {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: "Peter Parker",
                    email: "Peter.Parker@mindtreee.com",
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9d89ee1519781e05adb3f",
                data:
                {
                    fileref: null,
                    filename: null,
                    isLiked: false,
                    created_at: "1234",
                    likesCount: 0,
                    _id: "57a9d89de1519781e05adb3e",
                    tags: [],
                    content: "content",
                    post_id: "1234"
                },
                isActive: true
            };
        postActivity = {
            __v: 0,
            updated_at: "1234",
            created_at: "1234",
            post_id: "1234",
            created_by:
            {
                _id: "5795b9b3d387d768806d80de",
                user_name: "M1000000@mindtree.com",
                full_name: "Peter Parker",
                email: "Peter.Parker@mindtreee.com",
                last_name: "Parker",
                first_name: "Peter",
                employee_id: "M1000000",
                subscribed_streams: [],
                followings: [],
                profile_pic_file: {
                    ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                    name: "f344_1394167081599saihareesh.jpg"
                }
            },
            content: "1234",
            _id: "57aab2f32ae382d5ea745698",
            file: { name: null, ref: null },
            tags: [],
            liked_by: []
        }
        it("should listen when a new post is posted and return with data", function (done) {
            activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
            var expected = {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: "Peter Parker",
                    email: "Peter.Parker@mindtreee.com",
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9d89ee1519781e05adb3f",
                data:
                {
                    fileref: null,
                    filename: null,
                    isLiked: false,
                    created_at: "1234",
                    likesCount: 0,
                    _id: "57a9d89de1519781e05adb3e",
                    tags: [],
                    content: "content",
                    post_id: "1234"
                },
                isActive: true
            };

            activityService.newPostListener(postActivity).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if newPostActivity dao operation throws error", function (done) {
            activityModelMock.expects("createActivity").once().rejects('error occured in newPostActivity dao');
            activityService.newPostListener(postActivity).should.be.rejectedWith("error occured in newPostActivity dao").and.notify(done);
        });

        afterEach(function (done) {
            activityModelMock.restore();
            done();
        });
    });
    describe("Like Post Listener", function () {
        beforeEach(function (done) {
            activityModelMock = sinon.mock(activityModel);
            done();
        });

        var createActivityStubResponse =
            {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9d93de1519781e05adb40",
                data: { _id: "57a9d89de1519781e05adb3e", post_id: "1234" },
                isActive: true
            };

        it("should listen when the post is like and return with data", function (done) {
            activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
            var expected = {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9d93de1519781e05adb40",
                data: { _id: "57a9d89de1519781e05adb3e", post_id: "1234" },
                isActive: true
            };

            activityService.likePostListener(activity, loggedInUser).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if likePostActivity dao operation throws error", function (done) {
            activityModelMock.expects("createActivity").once().rejects('error occured in likePostActivity dao');
            activityService.likePostListener(activity, loggedInUser).should.be.rejectedWith("error occured in likePostActivity dao").and.notify(done);
        });

        afterEach(function (done) {
            activityModelMock.restore();
            done();
        });
    });
    describe("UnLike Post Listener", function () {
        beforeEach(function (done) {
            activityModelMock = sinon.mock(activityModel);
            done();
        });

        var createActivityStubResponse =
            {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9d93de1519781e05adb40",
                data: { _id: "57a9d89de1519781e05adb3e", post_id: "1234" },
                isActive: true
            };
        it("should listen when the post is unliked and return with data", function (done) {
            activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
            var expected = {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9d93de1519781e05adb40",
                data: { _id: "57a9d89de1519781e05adb3e", post_id: "1234" },
                isActive: true
            };

            activityService.unlikePostListener(activity, loggedInUser).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if unLikePostActivity dao operation throws error", function (done) {
            activityModelMock.expects("createActivity").once().rejects('error occured in unLikePostActivity dao');
            activityService.unlikePostListener(activity, loggedInUser).should.be.rejectedWith("error occured in unLikePostActivity dao").and.notify(done);
        });

        afterEach(function (done) {
            activityModelMock.restore();
            done();
        });
    });
    describe("Delete Post Listener", function () {
        beforeEach(function (done) {
            activityModelMock = sinon.mock(activityModel);
            done();
        });

        var createActivityStubResponse =
            {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9d9cbe1519781e05adb42",
                data:
                {
                    liked_by: [],
                    tags: [],
                    file:
                    {
                        ref: "workspace://SpacesStore/a1f368da-6696-47ee-a7ca-ac3d5c4e3c64",
                        name: "f479_Temp....txt"
                    },
                    __v: 0,
                    content: "content",
                    created_by:
                    {
                        _id: "5795b9b3d387d768806d80de",
                        user_name: "M1000000@mindtree.com",
                        full_name: 'Peter Parker',
                        email: 'Peter.Parker@mindtreee.com',
                        last_name: "Parker",
                        first_name: "Peter",
                        employee_id: "M1000000",
                        subscribed_streams: [],
                        followings: [],
                        profile_pic_file: {
                            ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                            name: "f344_1394167081599saihareesh.jpg"
                        }
                    },
                    post_id: "1234",
                    created_at: "1234",
                    updated_at: "1234",
                    _id: "57a9d89de1519781e05adb3e"
                },
                isActive: true
            };
        it("should listen when a post is deleted and return with data", function (done) {
            activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
            activityModelMock.expects("deletePostEvent").once().resolves({});
            var expected = {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                name: "name",
                created_by:
                {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    full_name: 'Peter Parker',
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a9d9cbe1519781e05adb42",
                data:
                {
                    liked_by: [],
                    tags: [],
                    file:
                    {
                        ref: "workspace://SpacesStore/a1f368da-6696-47ee-a7ca-ac3d5c4e3c64",
                        name: "f479_Temp....txt"
                    },
                    __v: 0,
                    content: "content",
                    created_by:
                    {
                        _id: "5795b9b3d387d768806d80de",
                        user_name: "M1000000@mindtree.com",
                        full_name: 'Peter Parker',
                        email: 'Peter.Parker@mindtreee.com',
                        last_name: "Parker",
                        first_name: "Peter",
                        employee_id: "M1000000",
                        subscribed_streams: [],
                        followings: [],
                        profile_pic_file: {
                            ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                            name: "f344_1394167081599saihareesh.jpg"
                        }
                    },
                    post_id: "1234",
                    created_at: "1234",
                    updated_at: "1234",
                    _id: "57a9d89de1519781e05adb3e"
                },
                isActive: true
            };
            activityService.deletePostListener(activity, loggedInUser).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if deletePostActivity dao operation throws error", function (done) {
            activityModelMock.expects("createActivity").once().rejects('error occured in deletePostActivity dao');
            activityModelMock.expects("deletePostEvent").once().resolves({});
            activityService.deletePostListener(activity, loggedInUser).should.be.rejectedWith("error occured in deletePostActivity dao").and.notify(done);
        });
                it("should reject the promise if deletePostEvent dao operation throws error", function (done) {
            activityModelMock.expects("createActivity").once().resolves(createActivityStubResponse);
            activityModelMock.expects("deletePostEvent").once().rejects('error occured in deletePostEvent dao');
            activityService.deletePostListener(activity, loggedInUser).should.be.rejectedWith("error occured in deletePostEvent dao").and.notify(done);
        });

        afterEach(function (done) {
            activityModelMock.restore();
            done();
        });
    });
});