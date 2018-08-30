// var mongoose = require('mongoose');
// var require('sinon-mongoose');
// var sinon = require('sinon');
// var chai = require("chai");
// var chaiAsPromised = require("chai-as-promised");
// chai.use(chaiAsPromised);
// var should = chai.should();
// var expect = chai.expect;
// var sinonBluebird = require('sinon-bluebird');
// var Promise = require('bluebird');
// var blogModel = require("../../app/dao/blog.model.js");

// describe("Blog dao operations", function () {
//     var loggedInUser = {
//         user_name: "john@mindtree.com",
//         profile_pic_file: {
//             ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
//             name: "f344_1394167081599saihareesh.jpg"
//         },
//         full_name: "John Doe",
//         email: null,
//         last_name: "Doe",
//         first_name: "John",
//         employee_id: "M1234567",
//         subscribed_streams: [],
//         followings: [],
//         _id: "5795b9b3d387d768806d80de"
//     };
//     //var mongooseMock = sinon.mock(mongoose);
//     //var blogMongooseModel = sinon.mock(mongoose.model('Blog'));
//     //mongooseMock.expects("model").resolves(blogMongooseModel);

//     describe("Get blogs by IDs", function () {
//         var getBlogsByStatusStubResponse = [
//             {
//                 blog_id: "1234",
//                 content: "content",
//                 tags: ["tag1"],
//                 liked_by: [],
//                 comments: [],
//                 created_by: {
//                     user_name: "M1000000@mindtree.com",
//                     profile_pic_file: {
//                         ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
//                         name: "f344_1394167081599saihareesh.jpg"
//                     },
//                     last_name: "Parker",
//                     first_name: "Peter"
//                 },
//                 viewed_by: [],
//                 created_at: "2016-07-28T10:09:07.067Z",
//                 title: "title",
//                 status: "PUBLISHED",
//             }
//         ];

//         beforeEach(function (done) {
//             blogMongooseModel.expects("find").chain('populate').chain('exec').yields(null, getBlogsByStatusStubResponse);
//             done();
//         });

//         it("should return all published blogs", function (done) {
//             var expected = [
//                 {
//                     blog_id: "1234",
//                     content: "content",
//                     tags: ["tag1"],
//                     likesCount: 0,
//                     commentsCount: 0,
//                     created_by: {
//                         user_name: "M1000000@mindtree.com",
//                         profile_pic_file: {
//                             ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
//                             name: "f344_1394167081599saihareesh.jpg"
//                         },
//                         last_name: "Parker",
//                         first_name: "Peter"
//                     },
//                     views: 0,
//                     created_at: "2016-07-28T10:09:07.067Z",
//                     title: "title",
//                     status: "PUBLISHED",
//                 }
//             ];

//             blogModel.getBlogsByIds([""]).should.eventually.to.eql(getBlogsByStatusStubResponse).notify(done);
//             //blogService.getAllPublishedBlogs(loggedInUser, 1, 5).become(expected);
//             //expect(blogService.getAllPublishedBlogs(loggedInUser, 1, 5)).to.eventually.to.eql(expected);
//             //done();
//         });

//         afterEach(function (done) {
//             done();
//         });
//     });
// });