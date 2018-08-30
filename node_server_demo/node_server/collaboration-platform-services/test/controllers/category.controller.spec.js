var sinon = require('sinon');
var should = require('chai').should;
var expect = require('chai').expect;
var assert = require('chai').assert;

var categoryController = require('../../app/routes/controllers/category.controller.js');
var Promise = require('bluebird');
var http_mocks = require('node-mocks-http');
var gramophone = require('gramophone');

describe('category controller', function () {

    describe('extract tags from content', function () {

        var mockedGramophone, request, response;
        beforeEach(function (done) {
            request = http_mocks.createRequest({
                body: { "content": "this is mindtree and mindtree is same name after mindtree restructure " }
            });

            response = http_mocks.createResponse({
                eventEmitter: require('events').EventEmitter
            });
            mockedGramophone = sinon.mock(gramophone);
            done();
        })

        it('get the extracted tags', function (done) {
            var content = "this is mindtree and mindtree is same name after mindtree restructure ";
            mockedGramophone.expects('extract').once().withArgs(content, { ngrams: [1], min: 4 }).returns(["mindtree"]);
            var expectedResponse = {
                    "data": { "tags": ["mindtree"] },
                    "status": { "statusCode": "200", "message": "extracted tags for content" }
                };
            response.on('end', function () {
                var res = response._getData();
                expect(res).to.deep.equal(expectedResponse);
                done();
            })
            categoryController.extractTagsForContent(request, response);
        })

        afterEach(function (done) {
            mockedGramophone.restore();
            done();
        })
    });

});