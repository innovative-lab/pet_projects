var sinon = require('sinon');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var should = chai.should();
var expect = chai.expect;
var sinonBluebird = require('sinon-bluebird');
var Promise = require('bluebird');
var dashboardService = require("../../app/services/dashboard.service");
var blogModel = require("../../app/dao/blog.model.js");
var discussionModel = require("../../app/dao/discussion.model.js");
var answerModel = require("../../app/dao/answer.model.js");
var postModel = require("../../app/dao/post.model.js");
describe("DashBoard services", function () {
    var user = {
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
    var blogModelMock;
    var discussionModelMock;
    var answerModelMock;
    var postModelMock;

    describe("Total and Author Blog Counts", function () {
        beforeEach(function (done) {
            blogModelMock = sinon.mock(blogModel);
            done();
        });
        var countAllNAuthorBlogsStubResponse =
            {
                all_published_count: 0,
                my_draft_count: 0,
                my_published_count: 0
            };
        it("should return the total and author blog counts", function (done) {
            blogModelMock.expects("countAllNAuthorBlogs").once().resolves(countAllNAuthorBlogsStubResponse);
            var expected = {
                all_published_count: 0,
                my_draft_count: 0,
                my_published_count: 0
            }
            dashboardService.getAllNAuthorBlogCounts(user).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if countAllNAuthorBlogs dao error occurs", function (done) {
            blogModelMock.expects("countAllNAuthorBlogs").once().rejects('error occured in countAllNAuthorBlogs dao');
            dashboardService.getAllNAuthorBlogCounts(user).should.be.rejectedWith("error occured in countAllNAuthorBlogs dao").and.notify(done);
        });
        afterEach(function (done) {
            blogModelMock.restore();
            done();
        });
    });

    describe("Total and Author Discussion Counts", function () {
        beforeEach(function (done) {
            discussionModelMock = sinon.mock(discussionModel);
            done();
        });
        var countAllNAuthorDiscussionsStubResponse =
            {
                all_published_count: 0,
                my_draft_count: 0,
                my_published_count: 0
            };
        it("should return the total and author discussion counts", function (done) {
            discussionModelMock.expects("countAllNAuthorDiscussions").once().resolves(countAllNAuthorDiscussionsStubResponse);

            var expected = {
                all_published_count: 0,
                my_draft_count: 0,
                my_published_count: 0
            }
            dashboardService.getAllNAuthorDiscCounts(user).should.eventually.to.eql(expected).notify(done);

        });

        it("should reject the promise if countAllNAuthorDiscussions dao error occurs", function (done) {
            discussionModelMock.expects("countAllNAuthorDiscussions").once().rejects('error occured in countAllNAuthorDiscussions dao');
            dashboardService.getAllNAuthorDiscCounts(user).should.be.rejectedWith("error occured in countAllNAuthorDiscussions dao").and.notify(done);
        });
        afterEach(function (done) {
            discussionModelMock.restore();
            done();
        });
    });
    describe("Total Counts", function () {
        beforeEach(function (done) {
            blogModelMock = sinon.mock(blogModel);
            discussionModelMock = sinon.mock(discussionModel);
            answerModelMock = sinon.mock(answerModel);
            postModelMock = sinon.mock(postModel);
            done();
        });
        var blogCountPromiseStubResponse =
            {
                all_published_count: 0,
                my_draft_count: 0,
                my_published_count: 0
            };
        it("should return the total counts", function (done) {
            blogModelMock.expects("getTotalBlogCounts").once().resolves(3);
            discussionModelMock.expects("getTotalDiscussionCounts").once().resolves(0);
            answerModelMock.expects("getTotalAnswerCounts").once().resolves(2);
            postModelMock.expects("getTotalPostCounts").once().resolves(6);

            var expected = {
                answer_counts: 2,
                blog_counts: 3,
                discussion_counts: 0,
                post_counts: 6
            }
            dashboardService.getTotalCounts().should.eventually.to.eql(expected).notify(done);

        });

        it("should reject the promise if any dao error occurs", function (done) {
            blogModelMock.expects("getTotalBlogCounts").once().rejects('error occured');
            discussionModelMock.expects("getTotalDiscussionCounts").once().rejects('error occured');
            answerModelMock.expects("getTotalAnswerCounts").once().rejects('error occured');
            postModelMock.expects("getTotalPostCounts").once().rejects('error occured');
            dashboardService.getTotalCounts().should.be.rejectedWith("errr").and.notify(done);
        });
        afterEach(function (done) {
            blogModelMock.restore();
            discussionModelMock.restore();
            answerModelMock.restore();
            postModelMock.restore();
            done();
        });
    });
});