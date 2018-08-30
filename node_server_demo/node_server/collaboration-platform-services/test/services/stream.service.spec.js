var sinon = require('sinon');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var should = chai.should();
var expect = chai.expect;
var sinonBluebird = require('sinon-bluebird');
var Promise = require('bluebird');
var streamService = require("../../app/services/stream.service");
var streamModel = require("../../app/dao/stream.model.js");
var userModel = require("../../app/dao/user.model.js");
var blogModel = require("../../app/dao/blog.model.js");
var discussionModel = require("../../app/dao/discussion.model.js");
var answerModel = require("../../app/dao/answer.model.js");
var postModel = require("../../app/dao/post.model.js");
var esService = require("../../app/services/search.service");

describe("Stream services", function () {
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
        subscribed_streams: ['java'],
        followings: ["M1030385@mindtree.com"],
        _id: "5795b9b3d387d768806d80de"
    };

    var streamModelMock;

    describe("Create Stream", function () {
        beforeEach(function (done) {
            streamModelMock = sinon.mock(streamModel);
            done();
        });

        var createStreamStubResponse = {
            _id: "57aaf148641974c2b27059d0",
            name: 'bigdata',
            updated_at: "2016-07-28T10:09:07.067Z",
            __v: 0,
            created_at: "2016-07-28T10:09:07.067Z"
        };

        it("should create a stream and resolve the promise with no data", function (done) {
            streamModelMock.expects("createStream").once().resolves(createStreamStubResponse);
            streamService.createStream("bigdata").should.be.fulfilled.notify(done);
        });

        it("should reject the promise if createStream dao operation throws error", function (done) {
            streamModelMock.expects("createStream").once().rejects('error in createStream');
            streamService.createStream("bigdata").should.be.rejectedWith("error in createStream").and.notify(done);
        });
        it("should throw error if input parameters are invalid", function (done) {
            streamModelMock.expects("createStream").once().resolves(createStreamStubResponse);
            expect(function () { streamService.createStream(undefined); }).to.throw();
            expect(function () { streamService.createStream(null); }).to.throw();
            expect(function () { streamService.createStream("java@!"); }).to.throw();
            done();
        });
        afterEach(function (done) {
            streamModelMock.restore();
            done();
        });
    });

    describe("Subscribe/Unsubscribe Stream", function () {
        var userModelMock;
        beforeEach(function (done) {
            streamModelMock = sinon.mock(streamModel);
            userModelMock = sinon.mock(userModel);
            done();
        });

        var createStreamStubResponse = {
            _id: "57aaf148641974c2b27059d0",
            name: 'bigdata',
            updated_at: "2016-07-28T10:09:07.067Z",
            __v: 0,
            created_at: "2016-07-28T10:09:07.067Z"
        };

        var subscribeStreamStubResponse = {
            _id: "5795b9b3d387d768806d80de",
            user_name: 'M1234567@mindtree.com',
            updated_at: "2016-07-28T10:09:07.067Z",
            full_name: 'John Doe',
            status: 'active',
            email: null,
            last_name: 'Doe',
            first_name: 'John',
            employee_id: 'M1234567',
            __v: 0,
            created_at: "2016-07-28T10:09:07.067Z",
            subscribed_streams: ['java', 'bigdata'],
            followings: [],
            profile_pic_file: { name: null, ref: null }
        };

        var unsubscribeStreamStubResponse = {
            _id: "5795b9b3d387d768806d80de",
            user_name: 'M1234567@mindtree.com',
            updated_at: "2016-07-28T10:09:07.067Z",
            full_name: 'John Doe',
            status: 'active',
            email: null,
            last_name: 'Doe',
            first_name: 'John',
            employee_id: 'M1234567',
            __v: 0,
            created_at: "2016-07-28T10:09:07.067Z",
            subscribed_streams: ['java'],
            followings: [],
            profile_pic_file: { name: null, ref: null }
        };

        it("should add user's subscribtion to a stream and resolve the promise with no data", function (done) {
            streamModelMock.expects("createStream").once().resolves(createStreamStubResponse);
            userModelMock.expects("subscribeStream").once().resolves(subscribeStreamStubResponse);
            streamService.subscribeUnsubscribeStream(loggedInUser, "bigdata", 1).should.be.fulfilled.notify(done);
        });

        it("should remove user's subscribtion to a stream and resolve the promise with no data", function (done) {
            streamModelMock.expects("createStream").once().resolves(createStreamStubResponse);
            userModelMock.expects("unsubscribeStream").once().resolves(unsubscribeStreamStubResponse);
            streamService.subscribeUnsubscribeStream(loggedInUser, "bigdata", 0).should.be.fulfilled.notify(done);
        });

        it("should reject the promise if createStream dao operation throws error", function (done) {
            streamModelMock.expects("createStream").once().rejects('error in createStream');
            userModelMock.expects("subscribeStream").once().resolves(subscribeStreamStubResponse);
            streamService.subscribeUnsubscribeStream(loggedInUser, "bigdata", 1).should.be.rejectedWith("error in createStream").and.notify(done);
        });

        it("should reject the promise if subscribeStream dao operation throws error", function (done) {
            streamModelMock.expects("createStream").once().resolves(createStreamStubResponse);
            userModelMock.expects("subscribeStream").rejects('error in subscribeStream');
            streamService.subscribeUnsubscribeStream(loggedInUser, "bigdata", 1).should.be.rejectedWith("error in subscribeStream").and.notify(done);
        });

        it("should reject the promise if unsubscribeStream dao operation throws error", function (done) {
            streamModelMock.expects("createStream").once().resolves(createStreamStubResponse);
            userModelMock.expects("unsubscribeStream").rejects('error in unsubscribeStream');
            streamService.subscribeUnsubscribeStream(loggedInUser, "bigdata", 0).should.be.rejectedWith("error in unsubscribeStream").and.notify(done);
        });

        afterEach(function (done) {
            streamModelMock.restore();
            userModelMock.restore();
            done();
        });
    });

    describe("Get Streams", function () {
        beforeEach(function (done) {
            streamModelMock = sinon.mock(streamModel);
            done();
        });

        var getStreamsStubResponse = [
            {
                _id: "57aaf582641974c2b27059d1",
                name: 'sdsdf',
                updated_at: "2016-07-28T10:09:07.067Z",
                __v: 0,
                created_at: "2016-07-28T10:09:07.067Z"
            },
            {
                _id: "57aaf148641974c2b27059d0",
                name: 'java',
                updated_at: "2016-07-28T10:09:07.067Z",
                __v: 0,
                created_at: "2016-07-28T10:09:07.067Z"
            },
            {
                _id: "57aac558641974c2b27059ce",
                name: 'fgh',
                updated_at: "2016-07-28T10:09:07.067Z",
                __v: 0,
                created_at: "2016-07-28T10:09:07.067Z"
            },
            {
                _id: "57aab957641974c2b27059cd",
                name: 'demo',
                updated_at: "2016-07-28T10:09:07.067Z",
                __v: 0,
                created_at: "2016-07-28T10:09:07.067Z"
            },
            {
                _id: "57aaafec641974c2b27059cb",
                name: 'mobile',
                updated_at: "2016-07-28T10:09:07.067Z",
                __v: 0,
                created_at: "2016-07-28T10:09:07.067Z"
            }
        ];

        it("should fetch all streams", function (done) {
            var expected = [
                {
                    name: 'sdsdf',
                    isSubscribed: false
                },
                {
                    name: 'java',
                    isSubscribed: true
                },
                {
                    name: 'fgh',
                    isSubscribed: false
                },
                {
                    name: 'demo',
                    isSubscribed: false
                },
                {
                    name: 'mobile',
                    isSubscribed: false
                }
            ];
            streamModelMock.expects("getStreams").once().resolves(getStreamsStubResponse);
            streamService.getStreams(loggedInUser, 1, 10).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if getStreams dao operation throws error", function (done) {
            streamModelMock.expects("getStreams").rejects('error in getStreams');
            streamService.getStreams(loggedInUser, 1, 10).should.be.rejectedWith("error in getStreams").and.notify(done);
        });

        afterEach(function (done) {
            streamModelMock.restore();
            done();
        });
    });

    describe("Get Streams By User", function () {
        beforeEach(function (done) {
            done();
        });

        it("should fetch all stream names subscribed by user", function (done) {
            var expected = ['java'];
            streamService.getStreamsByUser(loggedInUser).should.eventually.to.eql(expected).notify(done);
        });

        afterEach(function (done) {
            done();
        });
    });

    describe("Get Subscribed Stream Content For User", function () {
        var esServiceMock;
        var blogModelMock;
        var discussionModelMock;
        var answerModelMock;
        var postModelMock;

        beforeEach(function (done) {
            esServiceMock = sinon.mock(esService);
            blogModelMock = sinon.mock(blogModel);
            discussionModelMock = sinon.mock(discussionModel);
            answerModelMock = sinon.mock(answerModel);
            postModelMock = sinon.mock(postModel);
            done();
        });

        var getBlogsByIdsStubResponse = [
            {
                _id: "57aacad4d982404630e7a018",
                updated_at: "2016-08-11T08:36:13.226Z",
                created_at: "2016-08-10T06:33:56.920Z",
                title: "blog on java",
                content: "<p>java content</p>",
                blog_id: "blog_gbmPQ9ircX",
                created_by: {
                    _id: "57a9a563641974c2b27059b2",
                    user_name: "M1030385@mindtree.com",
                    updated_at: "2016-08-09T09:55:08.859Z",
                    full_name: "Abhishek Kumar",
                    status: "active",
                    email: "abhishek.kumar5@mindtree.com",
                    last_name: "Kumar",
                    first_name: "Abhishek",
                    employee_id: "M1030385",
                    __v: 0,
                    created_at: "2016-08-09T09:41:55.335Z",
                    subscribed_streams: [
                        "java"
                    ],
                    followings: [],
                    profile_pic_file: {
                        name: null,
                        ref: null
                    }
                },
                __v: 0,
                status: "PUBLISHED",
                viewed_by: [
                    "M1034208@mindtree.com",
                    "M1030395@mindtree.com"
                ],
                tags: [
                    "java"
                ],
                liked_by: [],
                comments: [
                    {
                        created_by: "57a9a7dd641974c2b27059b3",
                        content: "dfsdf",
                        comment_id: "EMPMx",
                        _id: "57ab16cfd982404630e7a031",
                        created_at: "2016-08-10T11:58:07.193Z"
                    }
                ]
            }
        ];

        var getDiscussionsByIdsStubResponse = [
            {
                _id: "57aacb80d982404630e7a01c",
                updated_at: "2016-08-11T09:19:47.178Z",
                created_at: "2016-08-10T06:36:48.378Z",
                content: "<p>java content</p>",
                title: "discussion on java",
                created_by: {
                    _id: "57a9a563641974c2b27059b2",
                    user_name: "M1030385@mindtree.com",
                    updated_at: "2016-08-09T09:55:08.859Z",
                    full_name: "Abhishek Kumar",
                    status: "active",
                    email: "abhishek.kumar5@mindtree.com",
                    last_name: "Kumar",
                    first_name: "Abhishek",
                    employee_id: "M1030385",
                    __v: 0,
                    created_at: "2016-08-09T09:41:55.335Z",
                    subscribed_streams: [
                        "java"
                    ],
                    followings: [],
                    profile_pic_file: {
                        name: null,
                        ref: null
                    }
                },
                discussion_id: "discussrVPstvTFdr",
                __v: 0,
                status: "PUBLISHED",
                answers: [],
                viewed_by: [
                    "M1034342@mindtree.com",
                    "M1020387@mindtree.com"
                ],
                tags: [
                    "java"
                ],
                voted_by: [],
                comments: []
            }
        ];

        var getAnswersByIdsStubResponse = [
            {
                _id: "57ac434bfb9eaff881b24d26",
                updated_at: "2016-08-11T09:20:11.977Z",
                created_at: "2016-08-11T09:20:11.977Z",
                answer_id: "NO7p4",
                created_by: {
                    _id: "57a9a184641974c2b27059ae",
                    user_name: "M1020387@mindtree.com",
                    updated_at: "2016-08-11T08:40:49.393Z",
                    full_name: "Bhushan Balasaheb Vadgave",
                    status: "active",
                    email: "bhushan.vadgave@mindtree.com",
                    last_name: "Vadgave",
                    first_name: "Bhushan",
                    employee_id: "M1020387",
                    __v: 0,
                    created_at: "2016-08-09T09:25:24.962Z",
                    subscribed_streams: [
                        "java",
                        "iot",
                        "bigdata"
                    ],
                    followings: [
                        "M1030385@mindtree.com"
                    ],
                    profile_pic_file: {
                        name: null,
                        ref: null
                    }
                },
                content: "<p>Java answer</p>",
                __v: 0,
                tags: [
                    "java"
                ],
                voted_by: [],
                comments: []
            }
        ];

        var getDiscussionByAnswerIdStubReponse = {
            _id: "57ac0d5e89d7d60566c37869",
            updated_at: "2016-08-09T09:25:24.962Z",
            created_at: "2016-08-09T09:25:24.962Z",
            content: '<p>asdasd</p>',
            title: 'asd',
            created_by: "57aaad43641974c2b27059bd",
            discussion_id: 'discussP9gf0vxlFQ',
            __v: 0,
            status: 'PUBLISHED',
            answers: [Object],
            viewed_by: [Object],
            tags: [Object],
            voted_by: [],
            comments: []
        };

        var getPostsByIdsStubResponse = [
            {
                _id: "57aacaf5d982404630e7a01a",
                updated_at: "2016-08-10T06:34:29.808Z",
                created_at: "2016-08-10T06:34:29.808Z",
                post_id: "post_3EHV9g4NZw",
                created_by: {
                    _id: "57a9a563641974c2b27059b2",
                    user_name: "M1030385@mindtree.com",
                    updated_at: "2016-08-09T09:55:08.859Z",
                    full_name: "Abhishek Kumar",
                    status: "active",
                    email: "abhishek.kumar5@mindtree.com",
                    last_name: "Kumar",
                    first_name: "Abhishek",
                    employee_id: "M1030385",
                    __v: 0,
                    created_at: "2016-08-09T09:41:55.335Z",
                    subscribed_streams: [
                        "java"
                    ],
                    followings: [],
                    profile_pic_file: {
                        name: null,
                        ref: null
                    }
                },
                content: "post on java",
                __v: 0,
                file: {
                    name: null,
                    ref: null
                },
                tags: [
                    "java"
                ],
                liked_by: []
            },
            {
                _id: "57aaf8f7d982404630e7a02c",
                updated_at: "2016-08-10T09:50:47.681Z",
                created_at: "2016-08-10T09:50:47.681Z",
                post_id: "post_egBTWKicMW",
                created_by: {
                    _id: "57a99c38641974c2b27059aa",
                    user_name: "M1035984@mindtree.com",
                    updated_at: "2016-08-11T09:12:58.619Z",
                    full_name: "Pankaj Mahato",
                    status: "active",
                    email: "pankaj.mahato@mindtree.com",
                    last_name: "Mahato",
                    first_name: "Pankaj",
                    employee_id: "M1035984",
                    __v: 0,
                    created_at: "2016-08-09T09:02:48.168Z",
                    subscribed_streams: [
                        "java"
                    ],
                    followings: [
                        "M1020387@mindtree.com"
                    ],
                    profile_pic_file: {
                        name: "f500_1470137188728search.svg",
                        ref: "workspace://SpacesStore/6142a5b4-5550-415a-999e-bf430467e19a"
                    }
                },
                content: "sdfsdf\nhttps://dzone.com/articles/why-idea-better-eclipse",
                __v: 0,
                file: {
                    name: null,
                    ref: null
                },
                tags: [
                    "java"
                ],
                liked_by: []
            }
        ];

        it("should resolve with stream content for user when tags and followers both are undefined in filter", function (done) {
            var searchAllDocumentsByTagsOrAuthorStubReponse = {
                blog_ids: [
                    "57aacad4d982404630e7a018"
                ],
                discussion_ids: [
                    "57aacb80d982404630e7a01c"
                ],
                post_ids: [
                    "57aaf8f7d982404630e7a02c",
                    "57aacaf5d982404630e7a01a"
                ],
                answer_ids: [
                    "57ac434bfb9eaff881b24d26"
                ]
            };
            esServiceMock.expects("searchAllDocumentsByTagsOrAuthor").once().resolves(searchAllDocumentsByTagsOrAuthorStubReponse);
            blogModelMock.expects("getBlogsByIds").once().resolves(getBlogsByIdsStubResponse);
            discussionModelMock.expects("getDiscussionsByIds").once().resolves(getDiscussionsByIdsStubResponse);
            answerModelMock.expects("getAnswersByIds").once().resolves(getAnswersByIdsStubResponse);
            discussionModelMock.expects("getDiscussionByAnswerId").once().resolves(getDiscussionByAnswerIdStubReponse);
            postModelMock.expects("getPostsByIds").once().resolves(getPostsByIdsStubResponse);
            var expected = [
                {
                    type: "answers",
                    streams: [
                        "java"
                    ],
                    followings: [
                        "M1030385@mindtree.com"
                    ],
                    data: {
                        answer_id: "NO7p4",
                        created_at: "2016-08-11T09:20:11.977Z",
                        tags: [
                            "java"
                        ],
                        created_by: {
                            user_name: "M1020387@mindtree.com",
                            profile_pic_file: {
                                ref: null,
                                name: null
                            },
                            last_name: "Vadgave",
                            first_name: "Bhushan"
                        },
                        votesCount: 0,
                        discussion: {
                            discussion_id: "discussP9gf0vxlFQ",
                            title: "asd"
                        }
                    }
                },
                {
                    type: "posts",
                    streams: [
                        "java"
                    ],
                    followings: [
                        "M1030385@mindtree.com"
                    ],
                    data: {
                        post_id: "post_egBTWKicMW",
                        content: "sdfsdf\nhttps://dzone.com/articles/why-idea-better-eclipse",
                        tags: [
                            "java"
                        ],
                        likesCount: 0,
                        created_by: {
                            user_name: "M1035984@mindtree.com",
                            profile_pic_file: {
                                ref: "workspace://SpacesStore/6142a5b4-5550-415a-999e-bf430467e19a",
                                name: "f500_1470137188728search.svg"
                            },
                            last_name: "Mahato",
                            first_name: "Pankaj"
                        },
                        created_at: "2016-08-10T09:50:47.681Z",
                        isLiked: false,
                        file: {
                            name: null,
                            ref: null
                        }
                    }
                },
                {
                    type: "discussions",
                    streams: [
                        "java"
                    ],
                    followings: [
                        "M1030385@mindtree.com"
                    ],
                    data: {
                        discussion_id: "discussrVPstvTFdr",
                        tags: [
                            "java"
                        ],
                        votesCount: 0,
                        answersCount: 0,
                        commentsCount: 0,
                        views: 2,
                        created_at: "2016-08-10T06:36:48.378Z",
                        title: "discussion on java",
                        status: "PUBLISHED",
                        created_by: {
                            user_name: "M1030385@mindtree.com",
                            profile_pic_file: {
                                ref: null,
                                name: null
                            },
                            last_name: "Kumar",
                            first_name: "Abhishek"
                        }
                    }
                },
                {
                    type: "posts",
                    streams: [
                        "java"
                    ],
                    followings: [
                        "M1030385@mindtree.com"
                    ],
                    data: {
                        post_id: "post_3EHV9g4NZw",
                        content: "post on java",
                        tags: [
                            "java"
                        ],
                        likesCount: 0,
                        created_by: {
                            user_name: "M1030385@mindtree.com",
                            profile_pic_file: {
                                ref: null,
                                name: null
                            },
                            last_name: "Kumar",
                            first_name: "Abhishek"
                        },
                        created_at: "2016-08-10T06:34:29.808Z",
                        isLiked: false,
                        file: {
                            name: null,
                            ref: null
                        }
                    }
                },
                {
                    type: "blogs",
                    streams: [
                        "java"
                    ],
                    followings: [
                        "M1030385@mindtree.com"
                    ],
                    data: {
                        blog_id: "blog_gbmPQ9ircX",
                        tags: [
                            "java"
                        ],
                        created_by: {
                            user_name: "M1030385@mindtree.com",
                            profile_pic_file: {
                                ref: null,
                                name: null
                            },
                            last_name: "Kumar",
                            first_name: "Abhishek"
                        },
                        created_at: "2016-08-10T06:33:56.920Z",
                        views: 2,
                        likesCount: 0,
                        title: "blog on java"
                    }
                }
            ];
            streamService.getSubscribedStreamContentForUser(loggedInUser, undefined, undefined, 1, 10).should.eventually.to.eql(expected).notify(done);
        });

        it("should resolve with stream content for user when tags are undefined in filter", function (done) {
            var searchAllDocumentsByUsersStubReponse = {
                blog_ids: [
                    "57aacad4d982404630e7a018"
                ],
                discussion_ids: [
                    "57aacb80d982404630e7a01c"
                ],
                post_ids: [
                    "57aaf8f7d982404630e7a02c",
                    "57aacaf5d982404630e7a01a"
                ],
                answer_ids: [
                    "57ac434bfb9eaff881b24d26"
                ]
            };

            esServiceMock.expects("searchAllDocumentsByUsers").once().resolves(searchAllDocumentsByUsersStubReponse);
            blogModelMock.expects("getBlogsByIds").once().resolves(getBlogsByIdsStubResponse);
            discussionModelMock.expects("getDiscussionsByIds").once().resolves(getDiscussionsByIdsStubResponse);
            answerModelMock.expects("getAnswersByIds").once().resolves(getAnswersByIdsStubResponse);
            discussionModelMock.expects("getDiscussionByAnswerId").once().resolves(getDiscussionByAnswerIdStubReponse);
            postModelMock.expects("getPostsByIds").once().resolves(getPostsByIdsStubResponse);
            var expected = [
                {
                    type: "answers",
                    streams: [],
                    followings: [
                        "M1030385@mindtree.com"
                    ],
                    data: {
                        answer_id: "NO7p4",
                        created_at: "2016-08-11T09:20:11.977Z",
                        tags: [
                            "java"
                        ],
                        created_by: {
                            user_name: "M1020387@mindtree.com",
                            profile_pic_file: {
                                ref: null,
                                name: null
                            },
                            last_name: "Vadgave",
                            first_name: "Bhushan"
                        },
                        votesCount: 0,
                        discussion: {
                            discussion_id: "discussP9gf0vxlFQ",
                            title: "asd"
                        }
                    }
                },
                {
                    type: "posts",
                    streams: [],
                    followings: [
                        "M1030385@mindtree.com"
                    ],
                    data: {
                        post_id: "post_egBTWKicMW",
                        content: "sdfsdf\nhttps://dzone.com/articles/why-idea-better-eclipse",
                        tags: [
                            "java"
                        ],
                        likesCount: 0,
                        created_by: {
                            user_name: "M1035984@mindtree.com",
                            profile_pic_file: {
                                ref: "workspace://SpacesStore/6142a5b4-5550-415a-999e-bf430467e19a",
                                name: "f500_1470137188728search.svg"
                            },
                            last_name: "Mahato",
                            first_name: "Pankaj"
                        },
                        created_at: "2016-08-10T09:50:47.681Z",
                        isLiked: false,
                        file: {
                            name: null,
                            ref: null
                        }
                    }
                },
                {
                    type: "discussions",
                    streams: [],
                    followings: [
                        "M1030385@mindtree.com"
                    ],
                    data: {
                        discussion_id: "discussrVPstvTFdr",
                        tags: [
                            "java"
                        ],
                        votesCount: 0,
                        answersCount: 0,
                        commentsCount: 0,
                        views: 2,
                        created_at: "2016-08-10T06:36:48.378Z",
                        title: "discussion on java",
                        status: "PUBLISHED",
                        created_by: {
                            user_name: "M1030385@mindtree.com",
                            profile_pic_file: {
                                ref: null,
                                name: null
                            },
                            last_name: "Kumar",
                            first_name: "Abhishek"
                        }
                    }
                },
                {
                    type: "posts",
                    streams: [],
                    followings: [
                        "M1030385@mindtree.com"
                    ],
                    data: {
                        post_id: "post_3EHV9g4NZw",
                        content: "post on java",
                        tags: [
                            "java"
                        ],
                        likesCount: 0,
                        created_by: {
                            user_name: "M1030385@mindtree.com",
                            profile_pic_file: {
                                ref: null,
                                name: null
                            },
                            last_name: "Kumar",
                            first_name: "Abhishek"
                        },
                        created_at: "2016-08-10T06:34:29.808Z",
                        isLiked: false,
                        file: {
                            name: null,
                            ref: null
                        }
                    }
                },
                {
                    type: "blogs",
                    streams: [],
                    followings: [
                        "M1030385@mindtree.com"
                    ],
                    data: {
                        blog_id: "blog_gbmPQ9ircX",
                        tags: [
                            "java"
                        ],
                        created_by: {
                            user_name: "M1030385@mindtree.com",
                            profile_pic_file: {
                                ref: null,
                                name: null
                            },
                            last_name: "Kumar",
                            first_name: "Abhishek"
                        },
                        created_at: "2016-08-10T06:33:56.920Z",
                        views: 2,
                        likesCount: 0,
                        title: "blog on java"
                    }
                }
            ];
            streamService.getSubscribedStreamContentForUser(loggedInUser, undefined, ["M1030385@mindtree.com"], 1, 10).should.eventually.to.eql(expected).notify(done);
        });

        it("should resolve with stream content for user when followers are undefined in filter", function (done) {
            var searchAllDocumentsByTagsStubReponse = {
                blog_ids: [
                    "57aacad4d982404630e7a018"
                ],
                discussion_ids: [
                    "57aacb80d982404630e7a01c"
                ],
                post_ids: [
                    "57aaf8f7d982404630e7a02c",
                    "57aacaf5d982404630e7a01a"
                ],
                answer_ids: [
                    "57ac434bfb9eaff881b24d26"
                ]
            };

            esServiceMock.expects("searchAllDocumentsByTags").once().resolves(searchAllDocumentsByTagsStubReponse);
            blogModelMock.expects("getBlogsByIds").once().resolves(getBlogsByIdsStubResponse);
            discussionModelMock.expects("getDiscussionsByIds").once().resolves(getDiscussionsByIdsStubResponse);
            answerModelMock.expects("getAnswersByIds").once().resolves(getAnswersByIdsStubResponse);
            discussionModelMock.expects("getDiscussionByAnswerId").once().resolves(getDiscussionByAnswerIdStubReponse);
            postModelMock.expects("getPostsByIds").once().resolves(getPostsByIdsStubResponse);
            var expected = [
                {
                    type: "answers",
                    streams: [
                        "java"
                    ],
                    followings: [],
                    data: {
                        answer_id: "NO7p4",
                        created_at: "2016-08-11T09:20:11.977Z",
                        tags: [
                            "java"
                        ],
                        created_by: {
                            user_name: "M1020387@mindtree.com",
                            profile_pic_file: {
                                ref: null,
                                name: null
                            },
                            last_name: "Vadgave",
                            first_name: "Bhushan"
                        },
                        votesCount: 0,
                        discussion: {
                            discussion_id: "discussP9gf0vxlFQ",
                            title: "asd"
                        }
                    }
                },
                {
                    type: "posts",
                    streams: [
                        "java"
                    ],
                    followings: [],
                    data: {
                        post_id: "post_egBTWKicMW",
                        content: "sdfsdf\nhttps://dzone.com/articles/why-idea-better-eclipse",
                        tags: [
                            "java"
                        ],
                        likesCount: 0,
                        created_by: {
                            user_name: "M1035984@mindtree.com",
                            profile_pic_file: {
                                ref: "workspace://SpacesStore/6142a5b4-5550-415a-999e-bf430467e19a",
                                name: "f500_1470137188728search.svg"
                            },
                            last_name: "Mahato",
                            first_name: "Pankaj"
                        },
                        created_at: "2016-08-10T09:50:47.681Z",
                        isLiked: false,
                        file: {
                            name: null,
                            ref: null
                        }
                    }
                },
                {
                    type: "discussions",
                    streams: [
                        "java"
                    ],
                    followings: [],
                    data: {
                        discussion_id: "discussrVPstvTFdr",
                        tags: [
                            "java"
                        ],
                        votesCount: 0,
                        answersCount: 0,
                        commentsCount: 0,
                        views: 2,
                        created_at: "2016-08-10T06:36:48.378Z",
                        title: "discussion on java",
                        status: "PUBLISHED",
                        created_by: {
                            user_name: "M1030385@mindtree.com",
                            profile_pic_file: {
                                ref: null,
                                name: null
                            },
                            last_name: "Kumar",
                            first_name: "Abhishek"
                        }
                    }
                },
                {
                    type: "posts",
                    streams: [
                        "java"
                    ],
                    followings: [],
                    data: {
                        post_id: "post_3EHV9g4NZw",
                        content: "post on java",
                        tags: [
                            "java"
                        ],
                        likesCount: 0,
                        created_by: {
                            user_name: "M1030385@mindtree.com",
                            profile_pic_file: {
                                ref: null,
                                name: null
                            },
                            last_name: "Kumar",
                            first_name: "Abhishek"
                        },
                        created_at: "2016-08-10T06:34:29.808Z",
                        isLiked: false,
                        file: {
                            name: null,
                            ref: null
                        }
                    }
                },
                {
                    type: "blogs",
                    streams: [
                        "java"
                    ],
                    followings: [],
                    data: {
                        blog_id: "blog_gbmPQ9ircX",
                        tags: [
                            "java"
                        ],
                        created_by: {
                            user_name: "M1030385@mindtree.com",
                            profile_pic_file: {
                                ref: null,
                                name: null
                            },
                            last_name: "Kumar",
                            first_name: "Abhishek"
                        },
                        created_at: "2016-08-10T06:33:56.920Z",
                        views: 2,
                        likesCount: 0,
                        title: "blog on java"
                    }
                }
            ];
            streamService.getSubscribedStreamContentForUser(loggedInUser, ["java"], undefined, 1, 10).should.eventually.to.eql(expected).notify(done);
        });

        it("should resolve with stream content for user when followers and tags both are defined in filter", function (done) {
            var searchAllDocumentsByTagsAndAuthorStubReponse = {
                blog_ids: [
                    "57aacad4d982404630e7a018"
                ],
                discussion_ids: [
                    "57aacb80d982404630e7a01c"
                ],
                post_ids: [
                    "57aaf8f7d982404630e7a02c",
                    "57aacaf5d982404630e7a01a"
                ],
                answer_ids: [
                    "57ac434bfb9eaff881b24d26"
                ]
            };

            esServiceMock.expects("searchAllDocumentsByTagsAndAuthor").once().resolves(searchAllDocumentsByTagsAndAuthorStubReponse);
            blogModelMock.expects("getBlogsByIds").once().resolves(getBlogsByIdsStubResponse);
            discussionModelMock.expects("getDiscussionsByIds").once().resolves(getDiscussionsByIdsStubResponse);
            answerModelMock.expects("getAnswersByIds").once().resolves(getAnswersByIdsStubResponse);
            discussionModelMock.expects("getDiscussionByAnswerId").once().resolves(getDiscussionByAnswerIdStubReponse);
            postModelMock.expects("getPostsByIds").once().resolves(getPostsByIdsStubResponse);
            var expected = [
                {
                    type: "answers",
                    streams: [
                        "java"
                    ],
                    followings: [
                        "M1030385@mindtree.com"
                    ],
                    data: {
                        answer_id: "NO7p4",
                        created_at: "2016-08-11T09:20:11.977Z",
                        tags: [
                            "java"
                        ],
                        created_by: {
                            user_name: "M1020387@mindtree.com",
                            profile_pic_file: {
                                ref: null,
                                name: null
                            },
                            last_name: "Vadgave",
                            first_name: "Bhushan"
                        },
                        votesCount: 0,
                        discussion: {
                            discussion_id: "discussP9gf0vxlFQ",
                            title: "asd"
                        }
                    }
                },
                {
                    type: "posts",
                    streams: [
                        "java"
                    ],
                    followings: [
                        "M1030385@mindtree.com"
                    ],
                    data: {
                        post_id: "post_egBTWKicMW",
                        content: "sdfsdf\nhttps://dzone.com/articles/why-idea-better-eclipse",
                        tags: [
                            "java"
                        ],
                        likesCount: 0,
                        created_by: {
                            user_name: "M1035984@mindtree.com",
                            profile_pic_file: {
                                ref: "workspace://SpacesStore/6142a5b4-5550-415a-999e-bf430467e19a",
                                name: "f500_1470137188728search.svg"
                            },
                            last_name: "Mahato",
                            first_name: "Pankaj"
                        },
                        created_at: "2016-08-10T09:50:47.681Z",
                        isLiked: false,
                        file: {
                            name: null,
                            ref: null
                        }
                    }
                },
                {
                    type: "discussions",
                    streams: [
                        "java"
                    ],
                    followings: [
                        "M1030385@mindtree.com"
                    ],
                    data: {
                        discussion_id: "discussrVPstvTFdr",
                        tags: [
                            "java"
                        ],
                        votesCount: 0,
                        answersCount: 0,
                        commentsCount: 0,
                        views: 2,
                        created_at: "2016-08-10T06:36:48.378Z",
                        title: "discussion on java",
                        status: "PUBLISHED",
                        created_by: {
                            user_name: "M1030385@mindtree.com",
                            profile_pic_file: {
                                ref: null,
                                name: null
                            },
                            last_name: "Kumar",
                            first_name: "Abhishek"
                        }
                    }
                },
                {
                    type: "posts",
                    streams: [
                        "java"
                    ],
                    followings: [
                        "M1030385@mindtree.com"
                    ],
                    data: {
                        post_id: "post_3EHV9g4NZw",
                        content: "post on java",
                        tags: [
                            "java"
                        ],
                        likesCount: 0,
                        created_by: {
                            user_name: "M1030385@mindtree.com",
                            profile_pic_file: {
                                ref: null,
                                name: null
                            },
                            last_name: "Kumar",
                            first_name: "Abhishek"
                        },
                        created_at: "2016-08-10T06:34:29.808Z",
                        isLiked: false,
                        file: {
                            name: null,
                            ref: null
                        }
                    }
                },
                {
                    type: "blogs",
                    streams: [
                        "java"
                    ],
                    followings: [
                        "M1030385@mindtree.com"
                    ],
                    data: {
                        blog_id: "blog_gbmPQ9ircX",
                        tags: [
                            "java"
                        ],
                        created_by: {
                            user_name: "M1030385@mindtree.com",
                            profile_pic_file: {
                                ref: null,
                                name: null
                            },
                            last_name: "Kumar",
                            first_name: "Abhishek"
                        },
                        created_at: "2016-08-10T06:33:56.920Z",
                        views: 2,
                        likesCount: 0,
                        title: "blog on java"
                    }
                }
            ];
            streamService.getSubscribedStreamContentForUser(loggedInUser, ["java"], ["M1030385@mindtree.com"], 1, 10).should.eventually.to.eql(expected).notify(done);
        });

        afterEach(function (done) {
            esServiceMock.restore();
            blogModelMock.restore();
            discussionModelMock.restore();
            answerModelMock.restore();
            postModelMock.restore();
            done();
        });
    });

    describe("Get Blog Stream For User", function () {
        beforeEach(function (done) {
            done();
        });

        it("should return blog for stream content if it is applicable (through subscribed streams) to loggedin user", function () {
            var blog =
                {
                    __v: 0,
                    updated_at: '2016-08-12T06:29:59.185Z',
                    created_at: '2016-08-12T06:29:59.185Z',
                    title: 'title',
                    content: 'content',
                    blog_id: 'blog_zbVa6EBPWX',
                    created_by:
                    {
                        user_name: 'M1234568@mindtree.com',
                        profile_pic_file: { ref: null, name: null },
                        full_name: 'Peter Parker',
                        email: null,
                        last_name: 'Parker',
                        first_name: 'Peter',
                        employee_id: 'M1234568',
                        subscribed_streams: [],
                        followings: [],
                        _id: "57a9a184641974c2b27059ae"
                    },
                    _id: '57ad6ce7a074ef5420aa3853',
                    status: 'PUBLISHED',
                    viewed_by: [],
                    tags: ['java', 'javascript'],
                    liked_by: [],
                    comments: []
                };

            var expected = {
                type: "blogs",
                streams: ["java", "javascript"],
                followings: null,
                data: {
                    blog_id: "blog_zbVa6EBPWX",
                    tags: ['java', 'javascript'],
                    created_by: {
                        user_name: "M1234568@mindtree.com",
                        profile_pic_file: { ref: null, name: null },
                        last_name: "Parker",
                        first_name: "Peter"
                    },
                    created_at: '2016-08-12T06:29:59.185Z',
                    views: 0,
                    likesCount: 0,
                    title: "title"
                }
            };
            streamService.getBlogStreamForUser(loggedInUser, blog).should.to.eql(expected);
        });

        it("should return blog for stream content if it is applicable (through followings) to loggedin user", function () {
            var blog =
                {
                    __v: 0,
                    updated_at: '2016-08-12T06:29:59.185Z',
                    created_at: '2016-08-12T06:29:59.185Z',
                    title: 'title',
                    content: 'content',
                    blog_id: 'blog_zbVa6EBPWX',
                    created_by:
                    {
                        user_name: 'M1030385@mindtree.com',
                        profile_pic_file: { ref: null, name: null },
                        full_name: 'Peter Parker',
                        email: null,
                        last_name: 'Parker',
                        first_name: 'Peter',
                        employee_id: 'M1030385',
                        subscribed_streams: [],
                        followings: [],
                        _id: "57a9a184641974c2b27059ae"
                    },
                    _id: '57ad6ce7a074ef5420aa3853',
                    status: 'PUBLISHED',
                    viewed_by: [],
                    tags: ['iot'],
                    liked_by: [],
                    comments: []
                };

            var expected = {
                type: "blogs",
                streams: ["iot"],
                followings: "M1030385@mindtree.com",
                data: {
                    blog_id: "blog_zbVa6EBPWX",
                    tags: ['iot'],
                    created_by: {
                        user_name: "M1030385@mindtree.com",
                        profile_pic_file: { ref: null, name: null },
                        last_name: "Parker",
                        first_name: "Peter"
                    },
                    created_at: '2016-08-12T06:29:59.185Z',
                    views: 0,
                    likesCount: 0,
                    title: "title"
                }
            };
            streamService.getBlogStreamForUser(loggedInUser, blog).should.to.eql(expected);
        });

        it("should return null for stream content if it is not applicable to loggedin user", function () {
            var blog =
                {
                    __v: 0,
                    updated_at: '2016-08-12T06:29:59.185Z',
                    created_at: '2016-08-12T06:29:59.185Z',
                    title: 'title',
                    content: 'content',
                    blog_id: 'blog_zbVa6EBPWX',
                    created_by:
                    {
                        user_name: 'M1234568@mindtree.com',
                        profile_pic_file: { ref: null, name: null },
                        full_name: 'Peter Parker',
                        email: null,
                        last_name: 'Parker',
                        first_name: 'Peter',
                        employee_id: 'M1234568',
                        subscribed_streams: [],
                        followings: [],
                        _id: "57a9a184641974c2b27059ae"
                    },
                    _id: '57ad6ce7a074ef5420aa3853',
                    status: 'PUBLISHED',
                    viewed_by: [],
                    tags: ['iot'],
                    liked_by: [],
                    comments: []
                };
            expect(streamService.getBlogStreamForUser(loggedInUser, blog)).to.be.null;
        });

        afterEach(function (done) {
            done();
        });
    });

    describe("Get Discussion Stream For User", function () {
        beforeEach(function (done) {
            done();
        });

        it("should return discussion for stream content if it is applicable (through subscribed streams) to loggedin user", function () {
            var discussion = {
                __v: 0,
                updated_at: '2016-08-12T07:28:43.474Z',
                created_at: '2016-08-12T07:28:43.474Z',
                content: 'content',
                title: 'title',
                created_by:
                {
                    user_name: 'M1234568@mindtree.com',
                    profile_pic_file: { ref: null, name: null },
                    full_name: 'Peter Parker',
                    email: null,
                    last_name: 'Parker',
                    first_name: 'Peter',
                    employee_id: 'M1234568',
                    subscribed_streams: [],
                    followings: [],
                    _id: "57a9a184641974c2b27059ae"
                },
                discussion_id: 'discusshoTSz2Xqdx',
                _id: '57ad7aabf3ac35402d1c5199',
                status: 'PUBLISHED',
                answers: [],
                viewed_by: [],
                tags: ['java'],
                voted_by: [],
                comments: []
            };

            var expected = {
                type: 'discussions',
                streams: ['java'],
                followings: null,
                data:
                {
                    discussion_id: 'discusshoTSz2Xqdx',
                    tags: ['java'],
                    votesCount: 0,
                    answersCount: 0,
                    commentsCount: 0,
                    views: 0,
                    created_at: '2016-08-12T07:28:43.474Z',
                    title: 'title',
                    status: 'PUBLISHED',
                    created_by: {
                        user_name: "M1234568@mindtree.com",
                        profile_pic_file: { ref: null, name: null },
                        last_name: "Parker",
                        first_name: "Peter"
                    },
                }
            };
            streamService.getDiscussionStreamForUser(loggedInUser, discussion).should.to.eql(expected);
        });

        it("should return discussion for stream content if it is applicable (through followings) to loggedin user", function () {
            var discussion = {
                __v: 0,
                updated_at: '2016-08-12T07:28:43.474Z',
                created_at: '2016-08-12T07:28:43.474Z',
                content: 'content',
                title: 'title',
                created_by:
                {
                    user_name: 'M1030385@mindtree.com',
                    profile_pic_file: { ref: null, name: null },
                    full_name: 'Peter Parker',
                    email: null,
                    last_name: 'Parker',
                    first_name: 'Peter',
                    employee_id: 'M1030385',
                    subscribed_streams: [],
                    followings: [],
                    _id: "57a9a184641974c2b27059ae"
                },
                discussion_id: 'discusshoTSz2Xqdx',
                _id: '57ad7aabf3ac35402d1c5199',
                status: 'PUBLISHED',
                answers: [],
                viewed_by: [],
                tags: ['iot'],
                voted_by: [],
                comments: []
            };

            var expected = {
                type: 'discussions',
                streams: ['iot'],
                followings: "M1030385@mindtree.com",
                data:
                {
                    discussion_id: 'discusshoTSz2Xqdx',
                    tags: ['iot'],
                    votesCount: 0,
                    answersCount: 0,
                    commentsCount: 0,
                    views: 0,
                    created_at: '2016-08-12T07:28:43.474Z',
                    title: 'title',
                    status: 'PUBLISHED',
                    created_by: {
                        user_name: "M1030385@mindtree.com",
                        profile_pic_file: { ref: null, name: null },
                        last_name: "Parker",
                        first_name: "Peter"
                    },
                }
            };
            streamService.getDiscussionStreamForUser(loggedInUser, discussion).should.to.eql(expected);
        });

        it("should return null for stream content if it is not applicable to loggedin user", function () {
            var discussion = {
                __v: 0,
                updated_at: '2016-08-12T07:28:43.474Z',
                created_at: '2016-08-12T07:28:43.474Z',
                content: 'content',
                title: 'title',
                created_by:
                {
                    user_name: 'M1234568@mindtree.com',
                    profile_pic_file: { ref: null, name: null },
                    full_name: 'Peter Parker',
                    email: null,
                    last_name: 'Parker',
                    first_name: 'Peter',
                    employee_id: 'M1234568',
                    subscribed_streams: [],
                    followings: [],
                    _id: "57a9a184641974c2b27059ae"
                },
                discussion_id: 'discusshoTSz2Xqdx',
                _id: '57ad7aabf3ac35402d1c5199',
                status: 'PUBLISHED',
                answers: [],
                viewed_by: [],
                tags: ['iot'],
                voted_by: [],
                comments: []
            };
            expect(streamService.getDiscussionStreamForUser(loggedInUser, discussion)).to.be.null;
        });

        afterEach(function (done) {
            done();
        });
    });

    describe("Get Post Stream For User", function () {
        beforeEach(function (done) {
            done();
        });

        it("should return post for stream content if it is applicable (through subscribed streams) to loggedin user", function () {
            var post =
                {
                    __v: 0,
                    updated_at: '2016-08-12T06:29:59.185Z',
                    created_at: '2016-08-12T06:29:59.185Z',
                    content: 'content',
                    post_id: 'post_qRCWr5QHqq',
                    created_by:
                    {
                        user_name: 'M1234568@mindtree.com',
                        profile_pic_file: { ref: null, name: null },
                        full_name: 'Peter Parker',
                        email: null,
                        last_name: 'Parker',
                        first_name: 'Peter',
                        employee_id: 'M1234568',
                        subscribed_streams: [],
                        followings: [],
                        _id: "57a9a184641974c2b27059ae"
                    },
                    _id: '57ad6ce7a074ef5420aa3853',
                    file: { name: null, ref: null },
                    tags: ['java', 'javascript'],
                    liked_by: []
                };

            var expected = {
                type: "posts",
                streams: ["java", "javascript"],
                followings: null,
                data: {
                    post_id: 'post_qRCWr5QHqq',
                    tags: ['java', 'javascript'],
                    created_by: {
                        user_name: "M1234568@mindtree.com",
                        profile_pic_file: { ref: null, name: null },
                        last_name: "Parker",
                        first_name: "Peter"
                    },
                    file: {
                        name: null,
                        ref: null
                    },
                    isLiked: false,
                    created_at: '2016-08-12T06:29:59.185Z',
                    likesCount: 0,
                    content: "content"
                }
            };
            streamService.getPostStreamForUser(loggedInUser, post).should.to.eql(expected);
        });

        it("should return post for stream content if it is applicable (through followings) to loggedin user", function () {
            var post =
                {
                    __v: 0,
                    updated_at: '2016-08-12T06:29:59.185Z',
                    created_at: '2016-08-12T06:29:59.185Z',
                    content: 'content',
                    post_id: 'post_qRCWr5QHqq',
                    created_by:
                    {
                        user_name: 'M1030385@mindtree.com',
                        profile_pic_file: { ref: null, name: null },
                        full_name: 'Peter Parker',
                        email: null,
                        last_name: 'Parker',
                        first_name: 'Peter',
                        employee_id: 'M1030385',
                        subscribed_streams: [],
                        followings: [],
                        _id: "57a9a184641974c2b27059ae"
                    },
                    _id: '57ad6ce7a074ef5420aa3853',
                    file: { name: null, ref: null },
                    tags: ['iot'],
                    liked_by: []
                };

            var expected = {
                type: "posts",
                streams: ["iot"],
                followings: "M1030385@mindtree.com",
                data: {
                    post_id: 'post_qRCWr5QHqq',
                    tags: ['iot'],
                    created_by: {
                        user_name: "M1030385@mindtree.com",
                        profile_pic_file: { ref: null, name: null },
                        last_name: "Parker",
                        first_name: "Peter"
                    },
                    file: {
                        name: null,
                        ref: null
                    },
                    isLiked: false,
                    created_at: '2016-08-12T06:29:59.185Z',
                    likesCount: 0,
                    content: "content"
                }
            };
            streamService.getPostStreamForUser(loggedInUser, post).should.to.eql(expected);
        });

        it("should return null for stream content if it is not applicable to loggedin user", function () {
            var post =
                {
                    __v: 0,
                    updated_at: '2016-08-12T06:29:59.185Z',
                    created_at: '2016-08-12T06:29:59.185Z',
                    content: 'content',
                    post_id: 'post_qRCWr5QHqq',
                    created_by:
                    {
                        user_name: 'M1234568@mindtree.com',
                        profile_pic_file: { ref: null, name: null },
                        full_name: 'Peter Parker',
                        email: null,
                        last_name: 'Parker',
                        first_name: 'Peter',
                        employee_id: 'M1234568',
                        subscribed_streams: [],
                        followings: [],
                        _id: "57a9a184641974c2b27059ae"
                    },
                    _id: '57ad6ce7a074ef5420aa3853',
                    file: { name: null, ref: null },
                    tags: ['iot'],
                    liked_by: []
                };
            expect(streamService.getPostStreamForUser(loggedInUser, post)).to.be.null;
        });

        afterEach(function (done) {
            done();
        });
    });

    describe("Get Answer Stream For User", function () {
        beforeEach(function (done) {
            done();
        });

        it("should return answer for stream content if it is applicable (through subscribed streams) to loggedin user", function () {
            var answer =
                {
                    __v: 0,
                    updated_at: '2016-08-12T10:29:07.773Z',
                    created_at: '2016-08-12T10:29:07.773Z',
                    answer_id: 'ZSV99',
                    created_by:
                    {
                        user_name: 'M1234568@mindtree.com',
                        profile_pic_file: { ref: null, name: null },
                        full_name: 'Peter Parker',
                        email: null,
                        last_name: 'Parker',
                        first_name: 'Peter',
                        employee_id: 'M1234568',
                        subscribed_streams: [],
                        followings: [],
                        _id: "57a9a184641974c2b27059ae"
                    },
                    content: 'content',
                    _id: '57ada4f3227bfc942e57bd08',
                    tags: ['java'],
                    voted_by: [],
                    comments: []
                };

            var discussion = {
                _id: "57ac0d5e89d7d60566c37869",
                updated_at: '2016-08-12T10:29:07.773Z',
                created_at: '2016-08-12T10:29:07.773Z',
                content: '<p>asdasd</p>',
                title: 'title',
                created_by:
                {
                    user_name: 'M1234568@mindtree.com',
                    profile_pic_file: { ref: null, name: null },
                    full_name: 'Peter Parker',
                    email: null,
                    last_name: 'Parker',
                    first_name: 'Peter',
                    employee_id: 'M1234568',
                    subscribed_streams: [],
                    followings: [],
                    _id: "57a9a184641974c2b27059ae"
                },
                discussion_id: 'discussP9gf0vxlFQ',
                __v: 0,
                status: 'PUBLISHED',
                answers: ["57ada4f3227bfc942e57bd08"],
                viewed_by: [],
                tags: ['javascript'],
                voted_by: [],
                comments: []
            };

            var expected = {
                type: 'answers',
                streams: ['java'],
                followings: null,
                data:
                {
                    answer_id: 'ZSV99',
                    created_at: '2016-08-12T10:29:07.773Z',
                    tags: ['java'],
                    created_by: {
                        user_name: "M1234568@mindtree.com",
                        profile_pic_file: { ref: null, name: null },
                        last_name: "Parker",
                        first_name: "Peter"
                    },
                    votesCount: 0,
                    discussion: {
                        discussion_id: 'discussP9gf0vxlFQ',
                        title: 'title'
                    }
                }
            };
            streamService.getAnswerStreamForUser(loggedInUser, answer, discussion).should.to.eql(expected);
        });

        it("should return answer for stream content if it is applicable (through followings) to loggedin user", function () {
            var answer =
                {
                    __v: 0,
                    updated_at: '2016-08-12T10:29:07.773Z',
                    created_at: '2016-08-12T10:29:07.773Z',
                    answer_id: 'ZSV99',
                    created_by:
                    {
                        user_name: 'M1030385@mindtree.com',
                        profile_pic_file: { ref: null, name: null },
                        full_name: 'Peter Parker',
                        email: null,
                        last_name: 'Parker',
                        first_name: 'Peter',
                        employee_id: 'M1030385',
                        subscribed_streams: [],
                        followings: [],
                        _id: "57a9a184641974c2b27059ae"
                    },
                    content: 'content',
                    _id: '57ada4f3227bfc942e57bd08',
                    tags: ['iot'],
                    voted_by: [],
                    comments: []
                };

            var discussion = {
                _id: "57ac0d5e89d7d60566c37869",
                updated_at: '2016-08-12T10:29:07.773Z',
                created_at: '2016-08-12T10:29:07.773Z',
                content: '<p>asdasd</p>',
                title: 'title',
                created_by:
                {
                    user_name: 'M1234568@mindtree.com',
                    profile_pic_file: { ref: null, name: null },
                    full_name: 'Peter Parker',
                    email: null,
                    last_name: 'Parker',
                    first_name: 'Peter',
                    employee_id: 'M1234568',
                    subscribed_streams: [],
                    followings: [],
                    _id: "57a9a184641974c2b27059ae"
                },
                discussion_id: 'discussP9gf0vxlFQ',
                __v: 0,
                status: 'PUBLISHED',
                answers: ["57ada4f3227bfc942e57bd08"],
                viewed_by: [],
                tags: ['javascript'],
                voted_by: [],
                comments: []
            };

            var expected = {
                type: 'answers',
                streams: ['iot'],
                followings: "M1030385@mindtree.com",
                data:
                {
                    answer_id: 'ZSV99',
                    created_at: '2016-08-12T10:29:07.773Z',
                    tags: ['iot'],
                    created_by: {
                        user_name: "M1030385@mindtree.com",
                        profile_pic_file: { ref: null, name: null },
                        last_name: "Parker",
                        first_name: "Peter"
                    },
                    votesCount: 0,
                    discussion: {
                        discussion_id: 'discussP9gf0vxlFQ',
                        title: 'title'
                    }
                }
            };
            streamService.getAnswerStreamForUser(loggedInUser, answer, discussion).should.to.eql(expected);
        });

        it("should return null for stream content if it is not applicable to loggedin user", function () {
            var answer =
                {
                    __v: 0,
                    updated_at: '2016-08-12T10:29:07.773Z',
                    created_at: '2016-08-12T10:29:07.773Z',
                    answer_id: 'ZSV99',
                    created_by:
                    {
                        user_name: 'M1234568@mindtree.com',
                        profile_pic_file: { ref: null, name: null },
                        full_name: 'Peter Parker',
                        email: null,
                        last_name: 'Parker',
                        first_name: 'Peter',
                        employee_id: 'M1234568',
                        subscribed_streams: [],
                        followings: [],
                        _id: "57a9a184641974c2b27059ae"
                    },
                    content: 'content',
                    _id: '57ada4f3227bfc942e57bd08',
                    tags: ['iot'],
                    voted_by: [],
                    comments: []
                };

            var discussion = {
                _id: "57ac0d5e89d7d60566c37869",
                updated_at: '2016-08-12T10:29:07.773Z',
                created_at: '2016-08-12T10:29:07.773Z',
                content: '<p>asdasd</p>',
                title: 'title',
                created_by:
                {
                    user_name: 'M1234568@mindtree.com',
                    profile_pic_file: { ref: null, name: null },
                    full_name: 'Peter Parker',
                    email: null,
                    last_name: 'Parker',
                    first_name: 'Peter',
                    employee_id: 'M1234568',
                    subscribed_streams: [],
                    followings: [],
                    _id: "57a9a184641974c2b27059ae"
                },
                discussion_id: 'discussP9gf0vxlFQ',
                __v: 0,
                status: 'PUBLISHED',
                answers: ["57ada4f3227bfc942e57bd08"],
                viewed_by: [],
                tags: ['javascript'],
                voted_by: [],
                comments: []
            };
            expect(streamService.getAnswerStreamForUser(loggedInUser, answer, discussion)).to.be.null;
        });

        afterEach(function (done) {
            done();
        });
    });

    describe("get Most Subscribed Streams", function () {
        var userModelMock;
        beforeEach(function (done) {
            userModelMock = sinon.mock(userModel);
            done();
        });

        var getMostSubscribedStreamsStubResponse = [
            {
                stream: {
                    name: "bigdata"
                },
                subscribers_count: 3
            },
            {
                stream: {
                    name: "iot"
                },
                subscribers_count: 3
            },
            {
                stream: {
                    name: "java"
                },
                subscribers_count: 2
            }
        ];

        var expected = [
            {
                stream: {
                    name: "bigdata"
                },
                subscribers_count: 3
            },
            {
                stream: {
                    name: "iot"
                },
                subscribers_count: 3
            },
            {
                stream: {
                    name: "java"
                },
                subscribers_count: 2
            }
        ];

        it("should resolve with most subscribed streams with the counts in descending order", function (done) {
            userModelMock.expects("getMostSubscribedStreams").once().resolves(getMostSubscribedStreamsStubResponse);
            streamService.getMostSubscribedStreams(5).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if getMostSubscribedStreams dao operation throws error", function (done) {
            userModelMock.expects("getMostSubscribedStreams").once().rejects('some error in getMostSubscribedStreams');
            streamService.getMostSubscribedStreams(5).should.be.rejectedWith("some error in getMostSubscribedStreams").and.notify(done);
        });

        afterEach(function (done) {
            userModelMock.restore();
            done();
        });
    });
});