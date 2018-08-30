var sinon = require('sinon');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var should = chai.should();
var expect = chai.expect;
var sinonBluebird = require('sinon-bluebird');
var Promise = require('bluebird');
var linkPreviewService = require("../../app/services/linkPreview.service");
var redisClient = require('../../config/redis');

describe("Link Preview services", function () {
    var postInfo;
    var redisClientMock;
    describe("Link Preview", function () {
        var getRedisClientStubResponse = 
        '{"url":"www.google.com","loadFailed":true,"mediaType":"website"}';
        beforeEach(function (done) {
            redisClientMock = sinon.mock(redisClient);
            done();
        });

        it("should return the link preview from the redis cache", function (done) {
            redisClientMock.expects("get").yields(null, getRedisClientStubResponse);
            var expected =
            { url: 'www.google.com', loadFailed: true, mediaType: 'website'};

            linkPreviewService.getlinkPreview("www.google.com").should.eventually.to.eql(expected).notify(done);
        });
               it("should return the link preview after setting it in the redis cache", function (done) {
            redisClientMock.expects("get").yields(null, null);
            var expected =
                {
                    audios: undefined,
                    contentType: undefined,
                    description: undefined,
                    images: undefined,
                    loadFailed: true,
                    mediaType: "website",
                    title: undefined,
                    url: "www.google.com",
                    videos: undefined
                };

            linkPreviewService.getlinkPreview("www.google.com").should.eventually.to.eql(expected).notify(done);
        });
    it("should reject the promise if redisClient get throws error", function (done) {
            redisClientMock.expects("get").yields("error occured", getRedisClientStubResponse);
            linkPreviewService.getlinkPreview("www.google.com").should.be.rejectedWith("error occured").and.notify(done);
        });
        afterEach(function (done) {
            redisClientMock.restore();
            done();
        });
    });
});