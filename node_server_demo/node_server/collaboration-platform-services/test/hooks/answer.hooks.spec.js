// var sinon = require('sinon');
// var chai = require("chai");
// var chaiAsPromised = require("chai-as-promised");
// chai.use(chaiAsPromised);
// var should = chai.should();
// var expect = chai.expect;
// var sinonBluebird = require('sinon-bluebird');
// var Promise = require('bluebird');
// var esServices = require('../../app/dao/elasticsearch/es-apis');
// var answerHook = require("../../app/dao/answer.hooks.js");
// var userModel = require("../../app/dao/user.model.js");
// var streamModel = require("../../app/dao/stream.model.js");
// var discussionModel = require("../../app/dao/discussion.model.js");

// describe("Answer Hooks", function () {
//     var answerDoc = {
//         __v: 0,
//         updated_at: "1234",
//         created_at: "1234",
//         answer_id: "1234",
//         created_by:
//         {
//             _id: "5795b9b3d387d768806d80de",
//             user_name: "M1000000@mindtree.com",
//             full_name: 'Peter Parker',
//             email: 'Peter.Parker@mindtreee.com',
//             last_name: "Parker",
//             first_name: "Peter",
//             employee_id: "M1000000",
//             subscribed_streams: [],
//             followings: [],
//             profile_pic_file: {
//                 ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
//                 name: "f344_1394167081599saihareesh.jpg"
//             }
//         },
//         content: "content",
//         _id: "1234",
//         tags: ["aaa","bbb","ccc"],
//         voted_by: [],
//         comments: []
//     };
//     var streamModelMock;
//     var userModelMock;
//     var esServicesMock;
//     describe("On Saving The Answers", function () {
//                     var doc = {
//             __v: 0,
//             updated_at: "1234",
//             created_at: "1234",
//             title: "title",
//             content: "content",
//             blog_id: "1234",
//             created_by:
//             {
//                 _id: "5795b9b3d387d768806d80de",
//                 user_name: "M1000000@mindtree.com",
//                 full_name: 'Peter Parker',
//                 email: 'Peter.Parker@mindtreee.com',
//                 last_name: "Parker",
//                 first_name: "Peter",
//                 employee_id: "M1000000",
//                 subscribed_streams: [],
//                 followings: [],
//                 profile_pic_file: {
//                     ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
//                     name: "f344_1394167081599saihareesh.jpg"
//                 }
//             },
//             _id: "1234",
//             status: "PUBLISHED",
//             viewed_by: [],
//             tags: [],
//             liked_by: [],
//             comments: []
//         };
           
//         beforeEach(function (done) {
//             discussionModelMock = sinon.mock(discussionModel);
//             streamModelMock = sinon.mock(streamModel);
//             userModelMock = sinon.mock(userModel);
//             esServicesMock = sinon.mock(esServices);
//             done();
//         });

//         var saveAllStreamsStubResponse = {
//             _id: "1234",
//             name: "name",
//             updated_at: "1234",
//             __v: 0,
//             created_at: "1234"
//         };
//         var getUserByObjectIdStubResponse = {
//             _id: "5795b9b3d387d768806d80de",
//             user_name: "M1000000@mindtree.com",
//             full_name: 'Peter Parker',
//             email: 'Peter.Parker@mindtreee.com',
//             last_name: "Parker",
//             first_name: "Peter",
//             employee_id: "M1000000",
//             subscribed_streams: [],
//             followings: [],
//             profile_pic_file: {
//                 ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
//                 name: "f344_1394167081599saihareesh.jpg"
//             }
//         };
//         var createDocumentStubResponse = {
//             _index: "index",
//             _type: "type",
//             _id: "1234",
//             _version: 1,
//             _shards: { total: 2, successful: 1, failed: 0 },
//             created: true
//         };

//         it("should log the details while saving blog", function (done) {
//             streamModelMock.expects("saveAllStreams").once().resolves(saveAllStreamsStubResponse);
//             userModelMock.expects("getUserByObjectId").once().resolves(getUserByObjectIdStubResponse);
//             discussionModelMock.expects("getDiscussionByAnswerId").once().resolves(doc);
//             esServicesMock.expects("createDocument").once().resolves(createDocumentStubResponse);
//             answerHook.onSave(answerDoc);
//             done();
//         });
//         it("should throw error when saveAllStreams returns with error", function (done) {
//             streamModelMock.expects("saveAllStreams").once().rejects('error occured');
//             userModelMock.expects("getUserByObjectId").once().resolves(getUserByObjectIdStubResponse);
//             discussionModelMock.expects("getDiscussionByAnswerId").once().resolves(doc);
//             esServicesMock.expects("createDocument").once().resolves(createDocumentStubResponse);
//             answerHook.onSave(answerDoc);
//             done();
//         });
//         it("should throw error when esServices returns with error", function (done) {
//             streamModelMock.expects("saveAllStreams").once().resolves(saveAllStreamsStubResponse);
//             userModelMock.expects("getUserByObjectId").once().resolves(getUserByObjectIdStubResponse);
//             discussionModelMock.expects("getDiscussionByAnswerId").once().resolves(doc);
//             esServicesMock.expects("createDocument").once().rejects('error occured');
//             answerHook.onSave(answerDoc);
//             done();
//         });



//         afterEach(function (done) {
//             streamModelMock.restore();
//             userModelMock.restore();
//             discussionModelMock.restore();
//             esServicesMock.restore();
//             done();
//         });
//     });

//     describe("On Updating The Discussions", function () {
//                     var doc = {
//             __v: 0,
//             updated_at: "1234",
//             created_at: "1234",
//             title: "title",
//             content: "content",
//             blog_id: "1234",
//             created_by:
//             {
//                 _id: "5795b9b3d387d768806d80de",
//                 user_name: "M1000000@mindtree.com",
//                 full_name: 'Peter Parker',
//                 email: 'Peter.Parker@mindtreee.com',
//                 last_name: "Parker",
//                 first_name: "Peter",
//                 employee_id: "M1000000",
//                 subscribed_streams: [],
//                 followings: [],
//                 profile_pic_file: {
//                     ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
//                     name: "f344_1394167081599saihareesh.jpg"
//                 }
//             },
//             _id: "1234",
//             status: "PUBLISHED",
//             viewed_by: [],
//             tags: [],
//             liked_by: [],
//             comments: []
//         };
           
//         beforeEach(function (done) {
//             streamModelMock = sinon.mock(streamModel);
//             userModelMock = sinon.mock(userModel);
//             discussionModelMock = sinon.mock(discussionModel);
//             esServicesMock = sinon.mock(esServices);
//             done();
//         });

//         var saveAllStreamsStubResponse = {
//             _id: "1234",
//             name: "name",
//             updated_at: "1234",
//             __v: 0,
//             created_at: "1234"
//         };
//         var getUserByObjectIdStubResponse = {
//             _id: "5795b9b3d387d768806d80de",
//             user_name: "M1000000@mindtree.com",
//             full_name: 'Peter Parker',
//             email: 'Peter.Parker@mindtreee.com',
//             last_name: "Parker",
//             first_name: "Peter",
//             employee_id: "M1000000",
//             subscribed_streams: [],
//             followings: [],
//             profile_pic_file: {
//                 ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
//                 name: "f344_1394167081599saihareesh.jpg"
//             }
//         };
//         var updateDocumentStubResponse = {
//             _index: "index",
//             _type: "type",
//             _id: "1234",
//             _version: 1,
//             _shards: { total: 2, successful: 1, failed: 0 },
//             created: true
//         };

//         it("should log the details while updating answer", function (done) {
//             streamModelMock.expects("saveAllStreams").once().resolves(saveAllStreamsStubResponse);
//             userModelMock.expects("getUserByObjectId").once().resolves(getUserByObjectIdStubResponse);
//             discussionModelMock.expects("getDiscussionByAnswerId").once().resolves(doc);
//             esServicesMock.expects("updateDocument").once().resolves(updateDocumentStubResponse);
//             answerHook.onUpdate(answerDoc);
//             done();
//         });
//         it("should throw error when saveAllStreams returns with error", function (done) {
//             streamModelMock.expects("saveAllStreams").once().rejects('error occured');
//             userModelMock.expects("getUserByObjectId").once().resolves(getUserByObjectIdStubResponse);
//             discussionModelMock.expects("getDiscussionByAnswerId").once().resolves(doc);
//             esServicesMock.expects("updateDocument").once().resolves(updateDocumentStubResponse);
//             answerHook.onUpdate(answerDoc);
//             done();
//         });
//         it("should throw error when esServices returns with error", function (done) {
//             streamModelMock.expects("saveAllStreams").once().resolves(saveAllStreamsStubResponse);
//             userModelMock.expects("getUserByObjectId").once().resolves(getUserByObjectIdStubResponse);
//             discussionModelMock.expects("getDiscussionByAnswerId").once().resolves(doc);
//             esServicesMock.expects("updateDocument").once().rejects('error occured');
//             answerHook.onUpdate(answerDoc);
//             done();
//         });


//         afterEach(function (done) {
//             streamModelMock.restore();
//             userModelMock.restore();
//             discussionModelMock.restore();
//             esServicesMock.restore();
//             done();
//         });
//     });
//             describe("On Removing The Answers", function () {
//         beforeEach(function (done) {
//             esServicesMock = sinon.mock(esServices);
//             done();
//         });
//         var deleteDocumentStubResponse = {
//             _index: "index",
//             _type: "type",
//             _id: "1234",
//             _version: 1,
//             _shards: { total: 2, successful: 1, failed: 0 },
//             created: true
//         };

//         it("should log the details while deleting answer", function (done) {
//             esServicesMock.expects("deleteDocument").once().resolves(deleteDocumentStubResponse);
//             answerHook.onRemove(answerDoc);
//             done();
//         });
//         it("should throw error when deleteDocument from Es Services returns with error", function (done) {
//             esServicesMock.expects("deleteDocument").once().rejects('error occured');
//             answerHook.onRemove(answerDoc);
//             done();
//         });


//         afterEach(function (done) {
//             esServicesMock.restore();
//             done();
//         });
//     });
// });