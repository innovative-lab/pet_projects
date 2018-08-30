var sinon = require('sinon');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var should = chai.should();
var expect = chai.expect;
var sinonBluebird = require('sinon-bluebird');
var Promise = require('bluebird');
var answerService = require("../../app/services/answer.service");
var answerModel = require("../../app/dao/answer.model.js");
var discussionModel = require("../../app/dao/discussion.model.js");

describe("Answer services", function () {
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
    var answerModelMock;
    var discussionModelMock;
    var answer;
    var commentContent;

    describe("AnswersByDiscussionId", function () {
        var getAnswersByDiscussionIdStubResponse = [
            {
                answer_id: "1234",
                content: "content",
                created_by: {
                    user_name: "M1000000@mindtree.com",
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    },
                    last_name: "Parker",
                    first_name: "Peter"
                },
                created_at: "1234",
                comments: [],
                voted_by: [],
                tags: []
            }
        ];
        beforeEach(function (done) {
            answerModelMock = sinon.mock(answerModel);

            answer = {
                content: "content",
                tags: [],
                answer_id: "1234",
                created_by: {
                    user_name: "M1000000@mindtree.com",
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    },
                    last_name: "Parker",
                    first_name: "Peter"
                }
            };
            done();
        });

        it("should return answers by discussionId", function (done) {

            answerModelMock.expects("getAnswersByDiscussionId").once().resolves(getAnswersByDiscussionIdStubResponse);

            var expected = [
                {
                    answer_id: "1234",
                    content: "content",
                    created_at: "1234",
                    created_by: {
                        user_name: "M1000000@mindtree.com",
                        profile_pic_file: {
                            ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                            name: "f344_1394167081599saihareesh.jpg"
                        },
                        last_name: "Parker",
                        first_name: "Peter"
                    },
                    isVoted: false,
                    comments: [],
                    tags: [],
                    votesCount: 0
                }
            ];

            answerService.getAnswersByDiscussionId(loggedInUser, "1", answer).should.eventually.to.eql(expected).notify(done);
        });
        it("should reject the promise if getAnswersByDiscussionId dao operation throws error", function (done) {
            answerModelMock.expects("getAnswersByDiscussionId").once().rejects('error occured in getAnswersByDiscussionId');
            answerService.getAnswersByDiscussionId(loggedInUser, "1", answer).should.be.rejectedWith("error occured in getAnswersByDiscussionId").and.notify(done);
        });

        afterEach(function (done) {
            answerModelMock.restore();
            done();
        });
    });
    describe("Post Answer", function () {

        var answerToBePosted = {
            content: "content",
            tags: [],
            answer_id: "1234",
            created_by: {
                user_name: "M1000000@mindtree.com",
                profile_pic_file: {
                    ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                    name: "f344_1394167081599saihareesh.jpg"
                },
                last_name: "Parker",
                first_name: "Peter"
            }
        };
        var invalidAnswer = {
            content: null,
            tags: ["abcd", "thistagisfordemo", "java$@!"]
        };
        var saveAnswerStubResponse =
            {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                answer_id: "1234",
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
                content: "1234",
                _id: "57aaf582f0a9ae05fb5a2ee9",
                tags: [],
                voted_by: [],
                comments: []
            };
        var getDiscussionByIdStubResponse =
            {
                _id: "57aaaf61d982404630e79fe3",
                updated_at: "1234",
                created_at: "1234",
                content: "1234",
                title: "1234",
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
                discussion_id: "1234",
                __v: 0,
                status: "PUBLISHED",
                answers: [],
                viewed_by: [],
                tags: [],
                voted_by: [],
                comments: []
            };
        beforeEach(function (done) {
            answerModelMock = sinon.mock(answerModel);
            discussionModelMock = sinon.mock(discussionModel);
            done();
        });
        it("should post a answer and resolve with no data", function (done) {
            discussionModelMock.expects("getDiscussionById").once().resolves(getDiscussionByIdStubResponse);
            answerModelMock.expects("saveAnswer").once().resolves(saveAnswerStubResponse);
            answerService.postAnswer(loggedInUser, "1", answerToBePosted).should.be.fulfilled.notify(done);
        });
        // it("should reject the promise if getDiscussionById dao operation throws error", function (done) {
        //     discussionModelMock.expects("getDiscussionById").once().rejects('error occured in getDiscussionById dao');
        //     answerModelMock.expects("saveAnswer").once().resolves(saveAnswerStubResponse);
        //     answerService.postAnswer(loggedInUser, "1", answerToBePosted).should.be.rejectedWith("").and.notify(done);
        // });
        it("should reject the promise if saveAnswer dao operation throws error", function (done) {
            answerModelMock.expects("saveAnswer").once().rejects('error in saveAnswer dao');
            discussionModelMock.expects("getDiscussionById").once().resolves(getDiscussionByIdStubResponse);
            answerService.postAnswer(loggedInUser, "1", answerToBePosted).should.be.rejectedWith("error in saveAnswer dao").and.notify(done);
        });
        it("should throw error if input parameters are invalid", function (done) {
            discussionModelMock.expects("getDiscussionById").once().resolves(getDiscussionByIdStubResponse);
            answerModelMock.expects("saveAnswer").once().resolves(saveAnswerStubResponse);
            expect(function () { answerService.postAnswer(undefined, "1", answerToBePosted); }).to.throw();
            expect(function () { answerService.postAnswer(loggedInUser, "1", undefined); }).to.throw();
            expect(function () { answerService.postAnswer(loggedInUser, undefined, answerToBePosted); }).to.throw();
            expect(function () { answerService.postAnswer(loggedInUser, "1", invalidAnswer); }).to.throw();
            done();
        });
        afterEach(function (done) {
            discussionModelMock.restore();
            answerModelMock.restore();
            done();
        });
    });


    describe("Add answer comment", function () {
        var addCommentStubResponse =
            {
                _id: "1234",
                updated_at: "1234",
                created_at: "1234",
                answer_id: "1234",
                created_by: {
                    user_name: "M1000000@mindtree.com",
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    },
                    last_name: "Parker",
                    first_name: "Peter",
                    _id: "5795b9b3d387d768806d80de"
                },
                content: "1234",
                __v: 0,
                tags: [],
                voted_by: [],
                comments: []
            }
            ;
        beforeEach(function (done) {
            answerModelMock = sinon.mock(answerModel);
            commentContent =
                {
                    comment_id: "1234",
                    content: "content",
                    created_by: {
                        user_name: "M1000000@mindtree.com",
                        profile_pic_file: {
                            ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                            name: "f344_1394167081599saihareesh.jpg"
                        },
                        last_name: "Parker",
                        first_name: "Peter",
                        _id: "5795b9b3d387d768806d80de"
                    }
                };

            done();
        });

        it("should add a comment to a answer and resolve with no data", function (done) {
            answerModelMock.expects("addComment").once().resolves(addCommentStubResponse);
            answerService.addComment(loggedInUser, "1", commentContent).should.be.fulfilled.notify(done);
        });
        it("should reject the promise if addAnswerComment dao operation throws error", function (done) {
            answerModelMock.expects("addComment").once().rejects('error occured in addAnswerCommentdao');
            answerService.addComment(loggedInUser, "1", commentContent).should.be.rejectedWith("error occured in addAnswerCommentdao").and.notify(done);
        });
        afterEach(function (done) {
            answerModelMock.restore();
            done();
        });
    });
    describe("Edit Answer", function () {
        var getAnswersByIdStubResponse =
            {
                _id: "57a1cb364c628fed15a4ad46",
                updated_at: "1234",
                created_at: "1234",
                answer_id: "1234",
                created_by: {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    },
                    last_name: "Parker",
                    first_name: "Peter",
                },
                content: "content",
                __v: 0,
                tags: [],
                voted_by: [],
                comments: []
            };
        var answerToBeUpdated = {
            content: "content",
            tags: [],
            answer_id: "1234",
            created_by: {
                user_name: "M1000000@mindtree.com",
                profile_pic_file: {
                    ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                    name: "f344_1394167081599saihareesh.jpg"
                },
                last_name: "Parker",
                first_name: "Peter"
            }
        };
        var invalidAnswer = {
            content: null,
            tags: ["abcd", "thistagisfordemo", "java$@!"]
        };
        var editAnswerStubResponse =
            {
                _id: "57a1cb364c628fed15a4ad46",
                updated_at: "1234",
                created_at: "1234",
                answer_id: "1234",
                created_by: {
                    user_name: "M1000000@mindtree.com",
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    },
                    last_name: "Parker",
                    first_name: "Peter",
                    _id: "5795b9b3d387d768806d80de"
                },
                content: "content",
                __v: 0,
                tags: [],
                voted_by: [],
                comments: []
            }
            ;
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
        beforeEach(function (done) {
            answerModelMock = sinon.mock(answerModel);

            done();
        });

        it("should edit the answer and resolve with no data", function (done) {
            answerModelMock.expects("getAnswerById").once().resolves(getAnswersByIdStubResponse);
            answerModelMock.expects("editAnswer").once().resolves(editAnswerStubResponse);
            answerService.editAnswer(loggedInUser, "1",answerToBeUpdated).should.be.fulfilled.notify(done);
        });
        it("should reject the promise if other user tries to edit the answer", function (done) {
            answerModelMock.expects("getAnswerById").once().resolves(getAnswersByIdStubResponse);
            answerModelMock.expects("editAnswer").once().resolves(editAnswerStubResponse);
            answerService.editAnswer(otherUser, "1",answerToBeUpdated).should.be.rejectedWith("Error").and.notify(done);
        });
        it("should reject the promise if getAnswerById dao operation throws error", function (done) {
            answerModelMock.expects("getAnswerById").once().once().rejects('error occured in getAnswerById dao');
            answerModelMock.expects("editAnswer").once().once().resolves(editAnswerStubResponse);
            answerService.editAnswer(loggedInUser, "1",answerToBeUpdated).should.be.rejectedWith("error occured in getAnswerById dao").and.notify(done);
        });
        it("should reject the promise if editAnswer dao operation throws error", function (done) {
            answerModelMock.expects("getAnswerById").once().once().resolves(getAnswersByIdStubResponse);
            answerModelMock.expects("editAnswer").once().once().rejects('error occured in editAnswer dao');
            answerService.editAnswer(loggedInUser, "1",answerToBeUpdated).should.be.rejectedWith("error occured in editAnswer dao").and.notify(done);
        });
        it("should throw error if input parameters are invalid", function (done) {
            answerModelMock.expects("getAnswerById").once().resolves(getAnswersByIdStubResponse);
            answerModelMock.expects("editAnswer").once().resolves(editAnswerStubResponse);
            expect(function () { answerService.editAnswer(undefined, "1", answerToBeUpdated); }).to.throw();
            expect(function () { answerService.editAnswer(loggedInUser, "1", undefined); }).to.throw();
            expect(function () { answerService.editAnswer(loggedInUser, undefined, answerToBeUpdated); }).to.throw();
            expect(function () { answerService.editAnswer(loggedInUser, "1", invalidAnswer); }).to.throw();
            done();
        });
        afterEach(function (done) {
            answerModelMock.restore();
            done();
        });
    });
    describe("Delete answer comment", function () {
        var deleteCommentStubResponse =
            {
                created_by: {
                    user_name: "M1000000@mindtree.com",
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    },
                    last_name: "Parker",
                    first_name: "Peter"
                },
                content: "content",
                comment_id: "1234",
                _id: "57a1ce300ddd96651057615a",
                created_at: "1234"
            }
            ;
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

        var answer = {
            content: "content",
            tags: [],
            answer_id: "1234",
            created_by: {
                user_name: "M1000000@mindtree.com",
                profile_pic_file: {
                    ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                    name: "f344_1394167081599saihareesh.jpg"
                },
                last_name: "Parker",
                first_name: "Peter"
            }
        };
        beforeEach(function (done) {
            answerModelMock = sinon.mock(answerModel);
            done();
        });

        it("should delete a answer comment and resolve with no data", function (done) {
            answerModelMock.expects("deleteComment").once().resolves(deleteCommentStubResponse);
            answerService.deleteComment(loggedInUser, "1", answer).should.be.fulfilled.notify(done);
        });
        it("should reject the promise if deleteAnswerComment dao operation throws error", function (done) {
            answerModelMock.expects("deleteComment").once().rejects('error occured in deleteAnswerComment dao');
            answerService.deleteComment(loggedInUser, "1", answer).should.be.rejectedWith("error occured in deleteAnswerComment dao").and.notify(done);
        });
        afterEach(function (done) {
            answerModelMock.restore();
            done();
        });
    });
    describe("Delete Answer", function () {
        var getAnswerByIdStubResponse =
            {
                created_by: {
                    user_name: "M1000000@mindtree.com",
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    },
                    last_name: "Parker",
                    first_name: "Peter",
                    _id: "5795b9b3d387d768806d80de"
                }
            }
            ;
        var deleteAnswerByIdStubResponse =
            {
                created_by: {
                    user_name: "M1000000@mindtree.com",
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    },
                    last_name: "Parker",
                    first_name: "Peter",
                    _id: "5795b9b3d387d768806d80de"
                }
            }
            ;
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
        var removeAnswerIdStubResponse = {
          _id: '57c40a3c0533798002380417',
          content: '<p>Answer</p>',
          title: 'Some answer',
          created_by: '57a9a069641974c2b27059ad',
          discussion_id: 'discusscQc0B27hlc',
          status: 'PUBLISHED',
          answers: [],
          viewed_by: ['M1035984@mindtree.com'],
          tags: ['sdf'],
          voted_by: [],
          comments: []
        };
        beforeEach(function (done) {
            answerModelMock = sinon.mock(answerModel);
            discussionModelMock = sinon.mock(discussionModel);
            done();
        });

        it("should delete the answer and return with no data", function (done) {
            answerModelMock.expects("deleteAnswerById").once().resolves(deleteAnswerByIdStubResponse);
            answerModelMock.expects("getAnswerById").once().resolves(getAnswerByIdStubResponse);
            discussionModelMock.expects("removeAnswerId").once().resolves(removeAnswerIdStubResponse);
            answerService.deleteAnswer(loggedInUser, "1").should.eventually.to.eql().notify(done);
        });
        it("should reject the promise if deleteAnswerById dao operation throws error", function (done) {
            answerModelMock.expects("deleteAnswerById").once().rejects('error occured in deleteAnswerById dao');
            discussionModelMock.expects("removeAnswerId").once().resolves(removeAnswerIdStubResponse);
            answerModelMock.expects("getAnswerById").once().resolves(getAnswerByIdStubResponse);
            answerService.deleteAnswer(loggedInUser, "1").should.be.rejectedWith("error occured in deleteAnswerById dao").and.notify(done);
        });
        it("should reject the promise if removeAnswerId dao operation throws error", function (done) {
            answerModelMock.expects("deleteAnswerById").once().resolves(deleteAnswerByIdStubResponse);
            discussionModelMock.expects("removeAnswerId").once().rejects('error occured in removeAnswerId dao');
            answerModelMock.expects("getAnswerById").once().resolves(getAnswerByIdStubResponse);
            answerService.deleteAnswer(loggedInUser, "1").should.be.rejectedWith("error occured in removeAnswerId dao").and.notify(done);
        });
        it("should reject the promise if getAnswerById dao operation throws error", function (done) {
            answerModelMock.expects("deleteAnswerById").once().resolves(deleteAnswerByIdStubResponse);
            discussionModelMock.expects("removeAnswerId").once().resolves(removeAnswerIdStubResponse);
            answerModelMock.expects("getAnswerById").once().rejects('error occured in getAnswerById dao');
            answerService.deleteAnswer(loggedInUser, "1").should.be.rejectedWith("error occured in getAnswerById dao").and.notify(done);
        });
        it("should reject the promise if other user tries to delete the answer", function (done) {
            answerModelMock.expects("deleteAnswerById").once().resolves(deleteAnswerByIdStubResponse);
            answerModelMock.expects("getAnswerById").once().resolves(getAnswerByIdStubResponse);
            answerService.deleteAnswer(otherUser, "1").should.be.rejectedWith("Error").and.notify(done);
        });
        afterEach(function (done) {
            answerModelMock.restore();
            discussionModelMock.restore();
            done();
        });
    });
    describe("Answer Vote update", function () {
        var voteAnswerStubResponse =
            {
                _id: "57a09d359a519478b4f8372d",
                updated_at: "1234",
                created_at: "1234",
                answer_id: "1234",
                created_by: {
                    user_name: "M1000000@mindtree.com",
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    },
                    last_name: "Parker",
                    first_name: "Peter",
                    _id: "5795b9b3d387d768806d80de"
                },
                content: "content",
                __v: 0,
                tags: [],
                voted_by: [],
                comments: []
            };
        var unVoteAnswerstubResponse = voteAnswerStubResponse;
        beforeEach(function (done) {
            answerModelMock = sinon.mock(answerModel);
            done();
        });
        it("should vote the answer and resolve with no data", function (done) {
            answerModelMock.expects("addVote").once().resolves(voteAnswerStubResponse);
            answerService.voteUnvoteAnswer(loggedInUser, "1", "1").should.be.fulfilled.notify(done);
        });
        it("should unVote the answer and resolve with no data", function (done) {
            answerModelMock.expects("removeVote").once().resolves(unVoteAnswerstubResponse);
            answerService.voteUnvoteAnswer(loggedInUser, "1", "0").should.be.fulfilled.notify(done);
        });
        it("should reject the promise if addVote dao operation throws error", function (done) {
            answerModelMock.expects("addVote").once().rejects('error occured in addVote dao');
            answerService.voteUnvoteAnswer(loggedInUser, "1", "1").should.be.rejectedWith("error occured in addVote dao").and.notify(done);
        });
        it("should reject the promise if removeVote dao operation throws error", function (done) {
            answerModelMock.expects("removeVote").once().rejects('error occured in removeVote dao');
            answerService.voteUnvoteAnswer(loggedInUser, "1", "0").should.be.rejectedWith("error occured in removeVote dao").and.notify(done);
        });
        afterEach(function (done) {
            answerModelMock.restore();
            done();
        });
    });
});
