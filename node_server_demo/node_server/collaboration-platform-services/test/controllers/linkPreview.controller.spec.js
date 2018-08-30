var sinon = require('sinon');
var should = require('chai').should;
var expect = require('chai').expect;
var assert = require('chai').assert;

var linkPreviewController = require('../../app/routes/controllers/linkPreview.controller.js');
var linkPreviewService = require('../../app/services/linkPreview.service.js');
var Promise = require('bluebird');
var http_mocks = require('node-mocks-http');

describe('linkPreview controller', function () {

    describe('getting the link preview', function () {
        var mockedlinkPreviewService, request, response;
        beforeEach('', function (done) {

            request = http_mocks.createRequest({
                method: 'GET',
                url: 'link/preview',
                link: "www.mock.com"
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });


            mockedlinkPreviewService = sinon.mock(linkPreviewService);
            done();
        })

        it('returns with the response of the link preview', function (done) {
            var mockedlinkPreviewResponse = { url: 'www.google.com', loadFailed: true, mediaType: 'website' };
            mockedlinkPreviewService.expects("getlinkPreview").once().resolves(mockedlinkPreviewResponse);
            // mockedlinkPreviewService.expects('getlinkPreview').once().withArgs("www.google.com").returns(Promise.resolve(mockedlinkPreviewResponse));
            var expectedResponse = {
                "data": { "link": mockedlinkPreviewResponse },
                "status": { "statusCode": "200", "message": "Feteched Link preview " }
            };

            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                expect(res.status.message).to.equal(expectedResponse.status.message);
                done();
            })
            linkPreviewController.linkPreview(request, response);
        })

        it('check the error response of the link preview', function (done) {
            var mockedPostsResponse = {};
            var req = http_mocks.createRequest({
                    method: 'GET',
                url: 'link/preview',
                link: "www.mock.com"
            });
            mockedlinkPreviewService.expects("getlinkPreview").once().rejects('error while fetching the link preview');
            // mockedlinkPreviewService.expects('getlinkPreview').once().withArgs("www.google.com").returns(Promise.reject("error message"));
            var expectedResponse = {
                "data": {},
                "status": { "statusCode": "500", "message": "could not preview the link" }
            };

            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })

            linkPreviewController.linkPreview(request, response);
        })

        afterEach('', function (done) {
            mockedlinkPreviewService.restore();
            done();
        })
    });


});