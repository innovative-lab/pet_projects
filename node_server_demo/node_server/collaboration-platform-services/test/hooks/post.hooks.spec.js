// var sinon = require('sinon');
// var chai = require("chai");
// var chaiAsPromised = require("chai-as-promised");
// chai.use(chaiAsPromised);
// var should = chai.should();
// var expect = chai.expect;
// var sinonBluebird = require('sinon-bluebird');
// var Promise = require('bluebird');
// var esServices = require('../../app/dao/elasticsearch/es-apis');
// var postHook = require("../../app/dao/post.hooks.js");
// var userModel = require("../../app/dao/user.model.js");
// var streamModel = require("../../app/dao/stream.model.js");

// describe("Post Hooks", function () {
//             var doc = {
//             __v: 0,
//             updated_at: "1234",
//             created_at: "1234",
//             title: "title",
//             content: "content",
//             post_id: "1234",
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
//             tags: ["aaa","bbb","ccc"],
//             liked_by: [],
//             comments: []
//         };
//     var streamModelMock;
//     var userModelMock;
//     var esServicesMock;
//     describe("On Saving The Posts", function () {
//         beforeEach(function (done) {
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

//         it("should log the details while saving post", function (done) {
//             streamModelMock.expects("saveAllStreams").once().resolves(saveAllStreamsStubResponse);
//             userModelMock.expects("getUserByObjectId").once().resolves(getUserByObjectIdStubResponse);
//             esServicesMock.expects("createDocument").once().resolves(createDocumentStubResponse);
//             postHook.onSave(doc);
//             done();
//         });
//         it("should throw error when saveAllStreams returns with error", function (done) {
//             streamModelMock.expects("saveAllStreams").once().rejects('error occured');
//             userModelMock.expects("getUserByObjectId").once().resolves(getUserByObjectIdStubResponse);
//             esServicesMock.expects("createDocument").once().resolves(createDocumentStubResponse);
//             postHook.onSave(doc);
//             done();
//         });
//         it("should throw error when getUserByObjectId returns with error", function (done) {
//             streamModelMock.expects("saveAllStreams").once().resolves(saveAllStreamsStubResponse);
//             userModelMock.expects("getUserByObjectId").once().rejects('error occured');
//             esServicesMock.expects("createDocument").once().resolves(createDocumentStubResponse);
//             postHook.onSave(doc);
//             done();
//         });


//         afterEach(function (done) {
//             streamModelMock.restore();
//             userModelMock.restore();
//             esServicesMock.restore();
//             done();
//         });
//     });
//             describe("On Removing The Posts", function () {
//         beforeEach(function (done) {
//             streamModelMock = sinon.mock(streamModel);
//             userModelMock = sinon.mock(userModel);
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

//         it("should log the details while deleting blog", function (done) {
//             esServicesMock.expects("deleteDocument").once().resolves(deleteDocumentStubResponse);
//             postHook.onRemove(doc);
//             done();
//         });
//         it("should throw error when deleteDocument from Es Services returns with error", function (done) {
//             esServicesMock.expects("deleteDocument").once().rejects('error occured');
//             postHook.onRemove(doc);
//             done();
//         });


//         afterEach(function (done) {
//             streamModelMock.restore();
//             userModelMock.restore();
//             esServicesMock.restore();
//             done();
//         });
//     });
// });