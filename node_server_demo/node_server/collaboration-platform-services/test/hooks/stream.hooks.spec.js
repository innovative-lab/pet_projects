// var sinon = require('sinon');
// var chai = require("chai");
// var chaiAsPromised = require("chai-as-promised");
// chai.use(chaiAsPromised);
// var should = chai.should();
// var expect = chai.expect;
// var sinonBluebird = require('sinon-bluebird');
// var Promise = require('bluebird');
// var esServices = require('../../app/dao/elasticsearch/es-apis');
// var streamHook = require("../../app/dao/stream.hooks.js");

// describe("Stream Hooks", function () {
//             var doc = 
//             {
//                    __v: 0,
//         updated_at: "1234",
//         created_at: "1234",
//         title: "title",
//         content: "content",
//         stream_name: "1234",
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
//         _id: "1234",
//         status: "PUBLISHED",
//         answers: [],
//         viewed_by: [],
//         tags: [],
//         liked_by: [],
//         comments: []
//         };
//     var esServicesMock;
//     describe("On Saving The Streams", function () {
//         beforeEach(function (done) {
//             esServicesMock = sinon.mock(esServices);
//             done();
//         });
//         var createDocumentStubResponse = {
//             _index: "index",
//             _type: "type",
//             _id: "1234",
//             _version: 1,
//             _shards: { total: 2, successful: 1, failed: 0 },
//             created: true
//         };

//         it("should log the details while saving stream", function (done) {
//             esServicesMock.expects("createDocument").once().resolves(createDocumentStubResponse);
//             streamHook.onSave(doc);
//             done();
//         });
//         it("should throw error when createDocument returns with error", function (done) {
//             esServicesMock.expects("createDocument").once().rejects('error occured');
//             streamHook.onSave(doc);
//             done();
//         });


//         afterEach(function (done) {
//             esServicesMock.restore();
//             done();
//         });
//     });
//             describe("On Updating The Streams", function () {
//         beforeEach(function (done) {
//             esServicesMock = sinon.mock(esServices);
//             done();
//         });
//         var updateDocumentStubResponse = {
//             _index: "index",
//             _type: "type",
//             _id: "1234",
//             _version: 1,
//             _shards: { total: 2, successful: 1, failed: 0 },
//             created: true
//         };

//         it("should log the details while updating stream", function (done) {
//             esServicesMock.expects("updateDocument").once().resolves(updateDocumentStubResponse);
//             streamHook.onUpdate(doc);
//             done();
//         });
//         it("should throw error when updateDocument from Es Services returns with error", function (done) {
//             esServicesMock.expects("updateDocument").once().rejects('error occured');
//             streamHook.onUpdate(doc);
//             done();
//         });


//         afterEach(function (done) {
//             esServicesMock.restore();
//             done();
//         });
//     });
// });