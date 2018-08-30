var sinon = require('sinon');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var should = chai.should();
var expect = chai.expect;
var sinonBluebird = require('sinon-bluebird');
var Promise = require('bluebird');
var blogService = require("../../app/services/blog.service");
var blogModel = require("../../app/dao/blog.model.js");

describe("Blog services", function () {
    var loggedInUser = {
        user_name: "M1234567@mindtree.com",
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

    var blogModelMock;

    describe("All published blogs", function () {
        beforeEach(function (done) {
            blogModelMock = sinon.mock(blogModel);
            done();
        });

        var getBlogsByStatusStubResponse = [
            {
                _id: "5795b9b3d387d768806d80de",
                blog_id: "1234",
                content: "content",
                tags: ["tag1"],
                liked_by: [],
                comments: [],
                created_by: {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    },
                    email: null,
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    full_name: "Peter Parker",
                    last_name: "Parker",
                    first_name: "Peter"
                },
                viewed_by: [],
                created_at: "2016-07-28T10:09:07.067Z",
                title: "title",
                status: "PUBLISHED",
            }
        ];

        it("should return all published blogs", function (done) {
            blogModelMock.expects("getBlogsByStatus").once().resolves(getBlogsByStatusStubResponse);
            var expected = [
                {
                    blog_id: "1234",
                    content: "content",
                    tags: ["tag1"],
                    likesCount: 0,
                    commentsCount: 0,
                    created_by: {
                        user_name: "M1000000@mindtree.com",
                        profile_pic_file: {
                            ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                            name: "f344_1394167081599saihareesh.jpg"
                        },
                        last_name: "Parker",
                        first_name: "Peter"
                    },
                    views: 0,
                    created_at: "2016-07-28T10:09:07.067Z",
                    title: "title",
                    status: "PUBLISHED",
                }
            ];

            blogService.getAllPublishedBlogs(loggedInUser, 1, 5).should.eventually.to.eql(expected).notify(done);
            //blogService.getAllPublishedBlogs(loggedInUser, 1, 5).become(expected);
            //expect(blogService.getAllPublishedBlogs(loggedInUser, 1, 5)).to.eventually.to.eql(expected);
            //done();
        });

        it("should reject the promise if any dao error occurs", function (done) {
            blogModelMock.expects("getBlogsByStatus").once().rejects('some dao error');
            blogService.getAllPublishedBlogs(loggedInUser, 1, 5).should.be.rejectedWith("some dao error").and.notify(done);
        });

        it("should throw error if input parameters are invalid", function (done) {
            blogModelMock.expects("getBlogsByStatus").once().resolves(getBlogsByStatusStubResponse);
            expect(function () { blogService.getAllPublishedBlogs(undefined, 1, 5); }).to.throw();
            expect(function () { blogService.getAllPublishedBlogs(loggedInUser, "", 5); }).to.throw();
            expect(function () { blogService.getAllPublishedBlogs(loggedInUser, 1, ""); }).to.throw();
            done();
        });

        afterEach(function (done) {
            blogModelMock.restore();
            done();
        });
    });

    describe("Blog by id", function () {
        beforeEach(function (done) {
            blogModelMock = sinon.mock(blogModel);
            done();
        });

        var getBlogByIdStubResponse =
            {
                _id: "5795b9b3d387d768806d80de",
                blog_id: "1234",
                content: "content",
                tags: ["tag1"],
                liked_by: [],
                comments: [
                    {
                        comment_id: "1234",
                        content: "comment",
                        created_by: {
                            _id: "5795b9b3d387d768806d80de",
                            user_name: "M1000000@mindtree.com",
                            profile_pic_file: {
                                ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                                name: "f344_1394167081599saihareesh.jpg"
                            },
                            email: null,
                            employee_id: "M1000000",
                            subscribed_streams: [],
                            followings: [],
                            full_name: "Peter Parker",
                            last_name: "Parker",
                            first_name: "Peter"
                        },
                        created_at: "2016-07-28T10:09:07.067Z"
                    }
                ],
                created_by: {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    },
                    email: null,
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    full_name: "Peter Parker",
                    last_name: "Parker",
                    first_name: "Peter"
                },
                viewed_by: [],
                created_at: "2016-07-28T10:09:07.067Z",
                title: "title",
                status: "PUBLISHED",
            };

        it("should return blog by id", function (done) {
            blogModelMock.expects("updateBlogViews").once().resolves({});
            blogModelMock.expects("getBlogById").once().resolves(getBlogByIdStubResponse);

            var expected = {
                blog_id: "1234",
                content: "content",
                tags: ["tag1"],
                likesCount: 0,
                commentsCount: 1,
                comments: [
                    {
                        comment_id: "1234",
                        content: "comment",
                        created_by: {
                            user_name: "M1000000@mindtree.com",
                            profile_pic_file: {
                                ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                                name: "f344_1394167081599saihareesh.jpg"
                            },
                            last_name: "Parker",
                            first_name: "Peter"
                        },
                        created_at: "2016-07-28T10:09:07.067Z"
                    }
                ],
                created_by: {
                    user_name: "M1000000@mindtree.com",
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    },
                    last_name: "Parker",
                    first_name: "Peter"
                },
                views: 0,
                created_at: "2016-07-28T10:09:07.067Z",
                title: "title",
                status: "PUBLISHED",
                isLiked: false
            };

            blogService.getBlogById(loggedInUser, "1234", 1).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if getBlogById dao operation throws error", function (done) {
            blogModelMock.expects("getBlogById").once().rejects('some error in getBlogById');
            blogService.getBlogById(loggedInUser, "1234", 1).should.be.rejectedWith("some error in getBlogById").and.notify(done);
        });

        it("should throw error if input parameters are invalid", function (done) {
            blogModelMock.expects("updateBlogViews").once().resolves({});
            blogModelMock.expects("getBlogById").once().resolves(getBlogByIdStubResponse);
            expect(function () { blogService.getBlogById(undefined, "1234", 1); }).to.throw();
            expect(function () { blogService.getBlogById(loggedInUser, undefined, 1); }).to.throw();
            done();
        });

        afterEach(function (done) {
            blogModelMock.restore();
            done();
        });
    });

    describe("Blog like update", function () {
        beforeEach(function (done) {
            blogModelMock = sinon.mock(blogModel);
            done();
        });

        var likeBlogStubResponse =
            {
                _id: "1234",
                blog_id: "1234",
                content: "content",
                tags: ["tag1"],
                liked_by: [],
                comments: [
                    {
                        comment_id: "1234",
                        content: "comment",
                        created_by: "5795b9b3d387d768806d80de",
                        created_at: "2016-07-28T10:09:07.067Z"
                    }
                ],
                created_by: "5795b9b3d387d768806d80de",
                viewed_by: [],
                created_at: "2016-07-28T10:09:07.067Z",
                title: "title",
                status: "PUBLISHED",
            };
        var unlikeBlogStubResponse = likeBlogStubResponse;

        it("should like the blog and resolve with no data", function (done) {
            blogModelMock.expects("likeBlog").once().resolves(likeBlogStubResponse);
            blogService.updateBlogLikes(loggedInUser, "1234", 1).should.be.fulfilled.notify(done);
        });

        it("should unlike the blog and resolve with no data", function (done) {
            blogModelMock.expects("unlikeBlog").once().resolves(unlikeBlogStubResponse);
            blogService.updateBlogLikes(loggedInUser, "1234", 0).should.be.fulfilled.notify(done);
        });

        it("should reject the promise if likeBlog dao operation throws error", function (done) {
            blogModelMock.expects("likeBlog").once().rejects('some error in likeBlog');
            blogService.updateBlogLikes(loggedInUser, "1234", 1).should.be.rejectedWith("some error in likeBlog").and.notify(done);
        });

        it("should reject the promise if unlikeBlog dao operation throws error", function (done) {
            blogModelMock.expects("unlikeBlog").once().rejects('some error in unlikeBlog');
            blogService.updateBlogLikes(loggedInUser, "1234", 0).should.be.rejectedWith("some error in unlikeBlog").and.notify(done);
        });

        it("should throw error if input parameters are invalid", function (done) {
            blogModelMock.expects("likeBlog").once().resolves(likeBlogStubResponse);
            blogModelMock.expects("unlikeBlog").once().resolves(unlikeBlogStubResponse);
            expect(function () { blogService.updateBlogLikes(undefined, "1234", 1); }).to.throw();
            expect(function () { blogService.updateBlogLikes(loggedInUser, undefined, 1); }).to.throw();
            done();
        });

        afterEach(function (done) {
            blogModelMock.restore();
            done();
        });
    });

    describe("Create blog", function () {
        beforeEach(function (done) {
            blogModelMock = sinon.mock(blogModel);
            done();
        });

        var blogToBeCreated = {
            content: "content",
            tags: ["tag1"],
            title: "title",
            status: "PUBLISHED"
        };
        var invalidBlog = {
            content: null,
            tags: ["abcd", "thistagisfordemo", "jav*%@"],
            title: null,
            status: "PUBLISHED"
        };
        var createBlogStubResponse =
            {
                _id: "5795b9b3d387d768806d80de",
                blog_id: "1234",
                content: "content",
                tags: ["tag1"],
                liked_by: [],
                comments: [
                    {
                        comment_id: "1234",
                        content: "comment",
                        created_by: "5795b9b3d387d768806d80de",
                        created_at: "2016-07-28T10:09:07.067Z"
                    }
                ],
                created_by: "5795b9b3d387d768806d80de",
                viewed_by: [],
                created_at: "2016-07-28T10:09:07.067Z",
                title: "title",
                status: "PUBLISHED",
            };

        it("should create a blog and resolve with no data", function (done) {
            blogModelMock.expects("createBlog").once().resolves(createBlogStubResponse);
            blogService.createBlog(loggedInUser, blogToBeCreated).should.be.fulfilled.notify(done);
        });

        it("should reject the promise if createBlog dao operation throws error", function (done) {
            blogModelMock.expects("createBlog").once().rejects('some error in createBlog');
            blogService.createBlog(loggedInUser, blogToBeCreated).should.be.rejectedWith("some error in createBlog").and.notify(done);
        });

        it("should throw error if input parameters are invalid", function (done) {
            blogModelMock.expects("createBlog").once().resolves(createBlogStubResponse);
            expect(function () { blogService.createBlog(undefined, blogToBeCreated); }).to.throw();
            expect(function () { blogService.createBlog(loggedInUser, undefined); }).to.throw();
            expect(function () { blogService.createBlog(loggedInUser, invalidBlog); }).to.throw();
            done();
        });

        afterEach(function (done) {
            blogModelMock.restore();
            done();
        });
    });

    describe("Add blog comment", function () {
        beforeEach(function (done) {
            blogModelMock = sinon.mock(blogModel);
            done();
        });

        var addBlogCommentStubResponse =
            {
                _id: "5795b9b3d387d768806d80de",
                blog_id: "1234",
                content: "content",
                tags: ["tag1"],
                liked_by: [],
                comments: [
                    {
                        comment_id: "1234",
                        content: "comment",
                        created_by: "1234",
                        created_at: "2016-07-28T10:09:07.067Z"
                    }
                ],
                created_by: "5795b9b3d387d768806d80de",
                viewed_by: [],
                created_at: "2016-07-28T10:09:07.067Z",
                title: "title",
                status: "PUBLISHED",
            };

        it("should add a comment to a blog and resolve with no data", function (done) {
            blogModelMock.expects("addBlogComment").once().resolves(addBlogCommentStubResponse);
            blogService.addBlogComment(loggedInUser, '1234', 'comment').should.be.fulfilled.notify(done);
        });

        it("should reject the promise if addBlogComment dao operation throws error", function (done) {
            blogModelMock.expects("addBlogComment").once().rejects('some error in addBlogComment');
            blogService.addBlogComment(loggedInUser, '1234', 'comment').should.be.rejectedWith("some error in addBlogComment").and.notify(done);
        });

        it("should throw error if input parameters are invalid", function (done) {
            blogModelMock.expects("addBlogComment").once().resolves(addBlogCommentStubResponse);
            expect(function () { blogService.addBlogComment(undefined, '1234', 'comment'); }).to.throw();
            expect(function () { blogService.addBlogComment(loggedInUser, undefined, 'comment'); }).to.throw();
            expect(function () { blogService.addBlogComment(loggedInUser, '1234', undefined); }).to.throw();
            done();
        });

        afterEach(function (done) {
            blogModelMock.restore();
            done();
        });
    });

    describe("Delete blog comment", function () {
        beforeEach(function (done) {
            blogModelMock = sinon.mock(blogModel);
            done();
        });

        var getCommentByIdStubResponse =
            {
                comment_id: "1234",
                content: "comment",
                created_by: "5795b9b3d387d768806d80de",
                created_at: "2016-07-28T10:09:07.067Z"
            };

        var deleteBlogCommentStubResponse = {
            _id: "1234",
            blog_id: "1234",
            content: "content",
            tags: ["tag1"],
            liked_by: [],
            comments: [],
            created_by: "5795b9b3d387d768806d80de",
            viewed_by: [],
            created_at: "2016-07-28T10:09:07.067Z",
            title: "title",
            status: "PUBLISHED",
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

        it("should delete a blog comment and resolve with no data", function (done) {
            blogModelMock.expects("getCommentById").once().resolves(getCommentByIdStubResponse);
            blogModelMock.expects("deleteBlogComment").once().resolves(deleteBlogCommentStubResponse);
            blogService.deleteCommentForBlog(loggedInUser, '1234', '1234').should.be.fulfilled.notify(done);
        });

        it("should reject the promise if getCommentById dao operation throws error", function (done) {
            blogModelMock.expects("getCommentById").once().rejects('some error in getCommentById');
            blogModelMock.expects("deleteBlogComment").once().resolves(deleteBlogCommentStubResponse);
            blogService.deleteCommentForBlog(loggedInUser, '1234', '1234').should.be.rejectedWith("some error in getCommentById").and.notify(done);
        });

        it("should reject the promise if deleteBlogComment dao operation throws error", function (done) {
            blogModelMock.expects("getCommentById").once().resolves(getCommentByIdStubResponse);
            blogModelMock.expects("deleteBlogComment").once().rejects('some error in deleteBlogComment');
            blogService.deleteCommentForBlog(loggedInUser, '1234', '1234').should.be.rejectedWith("some error in deleteBlogComment").and.notify(done);
        });

        it("should reject the promise if other user tries to delete the comment", function (done) {
            blogModelMock.expects("getCommentById").once().resolves(getCommentByIdStubResponse);
            blogModelMock.expects("deleteBlogComment").once().resolves(deleteBlogCommentStubResponse);
            blogService.deleteCommentForBlog(otherUser, '1234', '1234').should.be.rejectedWith("you dont have permission to delete others comments").and.notify(done);
        });

        it("should throw error if input parameters are invalid", function (done) {
            blogModelMock.expects("getCommentById").once().resolves(getCommentByIdStubResponse);
            blogModelMock.expects("deleteBlogComment").once().resolves(deleteBlogCommentStubResponse);
            expect(function () { blogService.deleteCommentForBlog(undefined, '1234', '1234'); }).to.throw();
            expect(function () { blogService.deleteCommentForBlog(otherUser, undefined, '1234'); }).to.throw();
            expect(function () { blogService.deleteCommentForBlog(otherUser, '1234', undefined); }).to.throw();
            done();
        });

        afterEach(function (done) {
            blogModelMock.restore();
            done();
        });
    });

    describe("Edit blog", function () {
        beforeEach(function (done) {
            blogModelMock = sinon.mock(blogModel);
            done();
        });

        var getBlogByIdStubResponse =
            {
                _id: "5795b9b3d387d768806d80de",
                blog_id: "1234",
                content: "content",
                tags: ["tag1"],
                liked_by: [],
                comments: [
                    {
                        comment_id: "1234",
                        content: "comment",
                        created_by: {
                            _id: "5795b9b3d387d768806d80de",
                            user_name: "M1000000@mindtree.com",
                            profile_pic_file: {
                                ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                                name: "f344_1394167081599saihareesh.jpg"
                            },
                            email: null,
                            employee_id: "M1000000",
                            subscribed_streams: [],
                            followings: [],
                            full_name: "Peter Parker",
                            last_name: "Parker",
                            first_name: "Peter"
                        },
                        created_at: "2016-07-28T10:09:07.067Z"
                    }
                ],
                created_by: {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    },
                    email: null,
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    full_name: "Peter Parker",
                    last_name: "Parker",
                    first_name: "Peter"
                },
                viewed_by: [],
                created_at: "2016-07-28T10:09:07.067Z",
                title: "title",
                status: "PUBLISHED",
            };

        var updatedBlog = {
            title: "updated title",
            content: "updated content",
            tags: ["tag1", "tag2"],
            status: "PUBLISHED"
        };
        var invalidEditBlog = {
            content: null,
            tags: ["abcd", "thistagisfordemo", "jav*%@"],
            title: null,
            status: "PUBLISHED"
        };
        var updateBlogInfoStubResponse = {
            _id: "5795b9b3d387d768806d80de",
            blog_id: "1234",
            content: "updated content",
            tags: ["tag1", "tag2"],
            liked_by: [],
            comments: [
                {
                    comment_id: "1234",
                    content: "comment",
                    created_by: "5795b9b3d387d768806d80de",
                    created_at: "2016-07-28T10:09:07.067Z"
                }
            ],
            created_by: "5795b9b3d387d768806d80de",
            viewed_by: [],
            created_at: "2016-07-28T10:09:07.067Z",
            title: "updated title",
            status: "PUBLISHED",
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

        it("should edit the blog and resolve with no data", function (done) {
            blogModelMock.expects("getBlogById").once().resolves(getBlogByIdStubResponse);
            blogModelMock.expects("updateBlogInfo").once().resolves(updateBlogInfoStubResponse);
            blogService.editBlog(loggedInUser, updatedBlog, '1234').should.be.fulfilled.notify(done);
        });

        it("should reject the promise if other user tries to edit the blog", function (done) {
            blogModelMock.expects("getBlogById").once().resolves(getBlogByIdStubResponse);
            blogModelMock.expects("updateBlogInfo").once().resolves(updateBlogInfoStubResponse);
            blogService.editBlog(otherUser, updatedBlog, '1234').should.be.rejectedWith("author is not same as editor").and.notify(done);
        });

        it("should reject the promise if current status of blog is PUBLISHED and user tries to change status to DRAFT", function (done) {
            blogModelMock.expects("getBlogById").once().resolves(getBlogByIdStubResponse);
            blogModelMock.expects("updateBlogInfo").once().resolves(updateBlogInfoStubResponse);
            var updatedBlogWithDraftStatus = JSON.parse(JSON.stringify(updatedBlog));
            updatedBlogWithDraftStatus.status = "DRAFT";
            blogService.editBlog(loggedInUser, updatedBlogWithDraftStatus, '1234').should.be.rejectedWith("cannot draft the blog which is already published").and.notify(done);
        });


        it("should reject the promise if getBlogById dao operation throws error", function (done) {
            blogModelMock.expects("getBlogById").once().rejects('some error in getBlogById');
            blogModelMock.expects("updateBlogInfo").once().resolves(updateBlogInfoStubResponse);
            blogService.editBlog(loggedInUser, updatedBlog, '1234').should.be.rejectedWith("some error in getBlogById").and.notify(done);
        });

        it("should reject the promise if updateBlogInfo dao operation throws error", function (done) {
            blogModelMock.expects("getBlogById").once().resolves(getBlogByIdStubResponse);
            blogModelMock.expects("updateBlogInfo").once().rejects('some error in updateBlogInfo');
            blogService.editBlog(loggedInUser, updatedBlog, '1234').should.be.rejectedWith("some error in updateBlogInfo").and.notify(done);
        });

        it("should throw error if input parameters are invalid", function (done) {
            blogModelMock.expects("getBlogById").once().resolves(getBlogByIdStubResponse);
            blogModelMock.expects("updateBlogInfo").once().resolves(updateBlogInfoStubResponse);
            expect(function () { blogService.editBlog(undefined, updatedBlog, '1234'); }).to.throw();
            expect(function () { blogService.editBlog(loggedInUser, undefined, '1234'); }).to.throw();
            expect(function () { blogService.editBlog(loggedInUser, updatedBlog, undefined); }).to.throw();
            expect(function () { blogService.editBlog(loggedInUser, invalidEditBlog, '1234'); }).to.throw();
            done();
        });

        afterEach(function (done) {
            blogModelMock.restore();
            done();
        });
    });

    describe("Get Blogs For LoggedIn User", function () {
        beforeEach(function (done) {
            blogModelMock = sinon.mock(blogModel);
            done();
        });

        var getPublicNDraftBlogsByUserStubResponse = [
            {
                _id: "5795b9b3d387d768806d80de",
                blog_id: "1234",
                content: "content",
                tags: ["tag1"],
                liked_by: [],
                comments: [
                    {
                        comment_id: "1234",
                        content: "comment",
                        created_by: "5795b9b3d387d768806d80de",
                        created_at: "2016-07-28T10:09:07.067Z"
                    }
                ],
                created_by: {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    },
                    email: null,
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    full_name: "Peter Parker",
                    last_name: "Parker",
                    first_name: "Peter"
                },
                viewed_by: [],
                created_at: "2016-07-28T10:09:07.067Z",
                title: "title",
                status: "PUBLISHED",
            }];


        it("should return the list of blogs written by loggedin user", function (done) {
            var expected = [
                {
                    blog_id: "1234",
                    content: "content",
                    tags: ["tag1"],
                    likesCount: 0,
                    commentsCount: 1,
                    created_by: {
                        user_name: "M1000000@mindtree.com",
                        profile_pic_file: {
                            ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                            name: "f344_1394167081599saihareesh.jpg"
                        },
                        last_name: "Parker",
                        first_name: "Peter"
                    },
                    views: 0,
                    created_at: "2016-07-28T10:09:07.067Z",
                    title: "title",
                    status: "PUBLISHED",
                }
            ];
            blogModelMock.expects("getPublicNDraftBlogsByUser").once().resolves(getPublicNDraftBlogsByUserStubResponse);
            blogService.getBlogsForLoggedInUser(loggedInUser, 1, 5).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if getPublicNDraftBlogsByUser dao operation throws error", function (done) {
            blogModelMock.expects("getPublicNDraftBlogsByUser").once().rejects('some error in getPublicNDraftBlogsByUser');
            blogService.getBlogsForLoggedInUser(loggedInUser, 1, 5).should.be.rejectedWith("some error in getPublicNDraftBlogsByUser").and.notify(done);
        });

        it("should throw error if input parameters are invalid", function (done) {
            blogModelMock.expects("getPublicNDraftBlogsByUser").once().resolves(getPublicNDraftBlogsByUserStubResponse);
            expect(function () { blogService.getBlogsForLoggedInUser(undefined, 1, 5); }).to.throw();
            expect(function () { blogService.getBlogsForLoggedInUser(loggedInUser, "", 5); }).to.throw();
            expect(function () { blogService.getBlogsForLoggedInUser(loggedInUser, 1, ""); }).to.throw();
            done();
        });

        afterEach(function (done) {
            blogModelMock.restore();
            done();
        });
    });

    describe("Delete blog", function () {
        beforeEach(function (done) {
            blogModelMock = sinon.mock(blogModel);
            done();
        });

        var getBlogByIdStubResponse =
            {
                _id: "5795b9b3d387d768806d80de",
                blog_id: "1234",
                content: "content",
                tags: ["tag1"],
                liked_by: [],
                comments: [
                    {
                        comment_id: "1234",
                        content: "comment",
                        created_by: {
                            _id: "5795b9b3d387d768806d80de",
                            user_name: "M1000000@mindtree.com",
                            profile_pic_file: {
                                ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                                name: "f344_1394167081599saihareesh.jpg"
                            },
                            email: null,
                            employee_id: "M1000000",
                            subscribed_streams: [],
                            followings: [],
                            full_name: "Peter Parker",
                            last_name: "Parker",
                            first_name: "Peter"
                        },
                        created_at: "2016-07-28T10:09:07.067Z"
                    }
                ],
                created_by: {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    },
                    email: null,
                    employee_id: "M1000000",
                    subscribed_streams: [],
                    followings: [],
                    full_name: "Peter Parker",
                    last_name: "Parker",
                    first_name: "Peter"
                },
                viewed_by: [],
                created_at: "2016-07-28T10:09:07.067Z",
                title: "title",
                status: "PUBLISHED",
            };

        var deleteBlogStubResponse =
            {
                _id: "5795b9b3d387d768806d80de",
                blog_id: "1234",
                content: "content",
                tags: ["tag1"],
                liked_by: [],
                comments: [
                    {
                        comment_id: "1234",
                        content: "comment",
                        created_by: "5795b9b3d387d768806d80de",
                        created_at: "2016-07-28T10:09:07.067Z"
                    }
                ],
                created_by: "5795b9b3d387d768806d80de",
                viewed_by: [],
                created_at: "2016-07-28T10:09:07.067Z",
                title: "title",
                status: "PUBLISHED",
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

        it("should return the list of blogs written by loggedin user", function (done) {
            blogModelMock.expects("getBlogById").once().resolves(getBlogByIdStubResponse);
            blogModelMock.expects("deleteBlog").once().resolves(deleteBlogStubResponse);
            blogService.deleteBlog(loggedInUser, "1234").should.be.fulfilled.notify(done);
        });

        it("should reject the promise if other user tries to delete blog", function (done) {
            blogModelMock.expects("getBlogById").once().resolves(getBlogByIdStubResponse);
            blogModelMock.expects("deleteBlog").once().resolves(deleteBlogStubResponse);
            blogService.deleteBlog(otherUser, "1234").should.be.rejectedWith("No other user except the author can delete blog").and.notify(done);
        });

        it("should reject the promise if getPublicNDraftBlogsByUser dao operation throws error", function (done) {
            blogModelMock.expects("getBlogById").once().rejects('some error in getBlogById');
            blogModelMock.expects("deleteBlog").once().resolves(deleteBlogStubResponse);
            blogService.deleteBlog(otherUser, "1234").should.be.rejectedWith("some error in getBlogById").and.notify(done);
        });

        it("should reject the promise if getPublicNDraftBlogsByUser dao operation throws error", function (done) {
            blogModelMock.expects("getBlogById").once().resolves(getBlogByIdStubResponse);
            blogModelMock.expects("deleteBlog").once().rejects('some error in deleteBlog');
            blogService.deleteBlog(loggedInUser, "1234").should.be.rejectedWith("some error in deleteBlog").and.notify(done);
        });

        it("should throw error if input parameters are invalid", function (done) {
            blogModelMock.expects("getBlogById").once().resolves(getBlogByIdStubResponse);
            blogModelMock.expects("deleteBlog").once().rejects('some error in deleteBlog');
            expect(function () { blogService.deleteBlog(undefined, "1234"); }).to.throw();
            expect(function () { blogService.deleteBlog(loggedInUser, undefined); }).to.throw();
            done();
        });

        afterEach(function (done) {
            blogModelMock.restore();
            done();
        });
    });
});