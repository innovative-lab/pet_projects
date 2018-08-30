var sinon = require('sinon');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var should = chai.should();
var expect = chai.expect;
var sinonBluebird = require('sinon-bluebird');
var Promise = require('bluebird');
var searchService = require("../../app/services/search.service");
var client = require('../../config/elasticsearch');

describe("Search services", function () {
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
        subscribed_streams: [],
        followings: [],
        _id: "5795b9b3d387d768806d80de"
    };

    var esClientMock;

    describe("Search User Documents", function () {
        beforeEach(function (done) {
            esClientMock = sinon.mock(client);
            done();
        });

        var searchStubResponse = {
            took: 14,
            timed_out: false,
            _shards: {
                total: 5,
                successful: 5,
                failed: 0
            },
            hits: {
                total: 1,
                max_score: 1.6989492,
                hits: [
                    {
                        _index: "collaboration-platform",
                        _type: "users",
                        _id: "5795b9b3d387d768806d80de",
                        _score: 1.6989492,
                        _source: {
                            user_name: "M1234567@mindtree.com",
                            first_name: "John",
                            last_name: "Doe",
                            employee_id: "M1234567",
                            full_name: "John Doe",
                            profile_pic_file: {
                                ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                                name: "f344_1394167081599saihareesh.jpg"
                            },
                            email: null
                        }
                    }
                ]
            }
        };

        it("should search users and return promise of list of results for search text", function (done) {
            esClientMock.expects("search").yields(undefined, searchStubResponse);
            var expected = {
                total: 1,
                max_score: 1.6989492,
                hits: [
                    {
                        _index: "collaboration-platform",
                        _type: "users",
                        _id: "5795b9b3d387d768806d80de",
                        _score: 1.6989492,
                        _source: {
                            user_name: "M1234567@mindtree.com",
                            first_name: "John",
                            last_name: "Doe",
                            employee_id: "M1234567",
                            full_name: "John Doe",
                            profile_pic_file: {
                                ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                                name: "f344_1394167081599saihareesh.jpg"
                            },
                            email: null
                        }
                    }
                ]
            };

            searchService.searchUserDocuments("john", 1, 5).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if client.search operation throws error", function (done) {
            esClientMock.expects("search").yields(new Error("some error in search"), undefined);
            searchService.searchUserDocuments("john", 1, 5).should.be.rejectedWith("some error in search").and.notify(done);
        });

        afterEach(function (done) {
            esClientMock.restore();
            done();
        });
    });

    describe("Search Blog Documents", function () {
        beforeEach(function (done) {
            esClientMock = sinon.mock(client);
            done();
        });

        var searchStubResponse = {
            took: 14,
            timed_out: false,
            _shards: {
                total: 5,
                successful: 5,
                failed: 0
            },
            hits: {
                total: 1,
                max_score: 0.4790727,
                hits: [
                    {
                        _index: "collaboration-platform",
                        _type: "blogs",
                        _id: "5795b9b3d387d768806d80de",
                        _score: 0.4790727,
                        _source: {
                            created_by: {
                                user_name: "M1234567@mindtree.com",
                                first_name: "John",
                                last_name: "Doe"
                            },
                            title: "title",
                            blog_id: "1234",
                            tags: ["tag1"],
                            created_at: "2016-08-09T09:37:16.817Z"
                        }
                    }
                ]
            }
        };

        it("should search blogs and return promise of list of results for search text", function (done) {
            esClientMock.expects("search").yields(undefined, searchStubResponse);
            var expected = {
                total: 1,
                max_score: 0.4790727,
                hits: [
                    {
                        _index: "collaboration-platform",
                        _type: "blogs",
                        _id: "5795b9b3d387d768806d80de",
                        _score: 0.4790727,
                        _source: {
                            created_by: {
                                user_name: "M1234567@mindtree.com",
                                first_name: "John",
                                last_name: "Doe"
                            },
                            title: "title",
                            blog_id: "1234",
                            tags: ["tag1"],
                            created_at: "2016-08-09T09:37:16.817Z"
                        }
                    }
                ]
            };

            searchService.searchBlogDocuments("title", 1, 5).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if client.search operation throws error", function (done) {
            esClientMock.expects("search").yields(new Error("some error in search"), undefined);
            searchService.searchBlogDocuments("title", 1, 5).should.be.rejectedWith("some error in search").and.notify(done);
        });

        afterEach(function (done) {
            esClientMock.restore();
            done();
        });
    });

    describe("Search Discussion Documents", function () {
        beforeEach(function (done) {
            esClientMock = sinon.mock(client);
            done();
        });

        var searchStubResponse = {
            took: 14,
            timed_out: false,
            _shards: {
                total: 5,
                successful: 5,
                failed: 0
            },
            hits: {
                total: 1,
                max_score: 0.4790727,
                hits: [
                    {
                        _index: "collaboration-platform",
                        _type: "discussions",
                        _id: "57aaaf61d982404630e79fe3",
                        _score: 0.4232868,
                        _source: {
                            created_by: {
                                user_name: "M1234567@mindtree.com",
                                first_name: "John",
                                last_name: "Doe"
                            },
                            title: "title",
                            discussion_id: "1234",
                            tags: ["tag1"],
                            created_at: "2016-08-10T04:36:49.741Z"
                        }
                    }
                ]
            }
        };

        it("should search discussions and return promise of list of results for search text", function (done) {
            esClientMock.expects("search").yields(undefined, searchStubResponse);
            var expected = {
                total: 1,
                max_score: 0.4790727,
                hits: [
                    {
                        _index: "collaboration-platform",
                        _type: "discussions",
                        _id: "57aaaf61d982404630e79fe3",
                        _score: 0.4232868,
                        _source: {
                            created_by: {
                                user_name: "M1234567@mindtree.com",
                                first_name: "John",
                                last_name: "Doe"
                            },
                            title: "title",
                            discussion_id: "1234",
                            tags: ["tag1"],
                            created_at: "2016-08-10T04:36:49.741Z"
                        }
                    }
                ]
            };

            searchService.searchDiscussionDocuments("tag1", 1, 5).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if client.search operation throws error", function (done) {
            esClientMock.expects("search").yields(new Error("some error in search"), undefined);
            searchService.searchDiscussionDocuments("tag1", 1, 5).should.be.rejectedWith("some error in search").and.notify(done);
        });

        afterEach(function (done) {
            esClientMock.restore();
            done();
        });
    });

    describe("Search All Documents", function () {
        beforeEach(function (done) {
            esClientMock = sinon.mock(client);
            done();
        });

        var searchStubResponse = {
            took: 14,
            timed_out: false,
            _shards: {
                total: 5,
                successful: 5,
                failed: 0
            },
            hits: {
                total: 3,
                max_score: 0.99559003,
                hits: [
                    {
                        _index: "collaboration-platform",
                        _type: "users",
                        _id: "5795b9b3d387d768806d80de",
                        _score: 1.6989492,
                        _source: {
                            user_name: "M1234567@mindtree.com",
                            first_name: "John",
                            last_name: "Doe",
                            employee_id: "M1234567",
                            full_name: "John Doe",
                            profile_pic_file: {
                                ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                                name: "f344_1394167081599saihareesh.jpg"
                            },
                            email: null
                        }
                    },
                    {
                        _index: "collaboration-platform",
                        _type: "blogs",
                        _id: "5795b9b3d387d768806d80de",
                        _score: 0.4790727,
                        _source: {
                            created_by: {
                                user_name: "M1234567@mindtree.com",
                                first_name: "John",
                                last_name: "Doe"
                            },
                            title: "title",
                            blog_id: "1234",
                            tags: ["tag1"],
                            created_at: "2016-08-09T09:37:16.817Z"
                        }
                    },
                    {
                        _index: "collaboration-platform",
                        _type: "discussions",
                        _id: "57aaaf61d982404630e79fe3",
                        _score: 0.4232868,
                        _source: {
                            created_by: {
                                user_name: "M1234567@mindtree.com",
                                first_name: "John",
                                last_name: "Doe"
                            },
                            title: "title",
                            discussion_id: "1234",
                            tags: ["tag1"],
                            created_at: "2016-08-10T04:36:49.741Z"
                        }
                    }
                ]
            }
        };

        it("should search for all and return promise of list of results for search text", function (done) {
            esClientMock.expects("search").yields(undefined, searchStubResponse);
            var expected = {
                total: 3,
                max_score: 0.99559003,
                hits: [
                    {
                        _index: "collaboration-platform",
                        _type: "users",
                        _id: "5795b9b3d387d768806d80de",
                        _score: 1.6989492,
                        _source: {
                            user_name: "M1234567@mindtree.com",
                            first_name: "John",
                            last_name: "Doe",
                            employee_id: "M1234567",
                            full_name: "John Doe",
                            profile_pic_file: {
                                ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                                name: "f344_1394167081599saihareesh.jpg"
                            },
                            email: null
                        }
                    },
                    {
                        _index: "collaboration-platform",
                        _type: "blogs",
                        _id: "5795b9b3d387d768806d80de",
                        _score: 0.4790727,
                        _source: {
                            created_by: {
                                user_name: "M1234567@mindtree.com",
                                first_name: "John",
                                last_name: "Doe"
                            },
                            title: "title",
                            blog_id: "1234",
                            tags: ["tag1"],
                            created_at: "2016-08-09T09:37:16.817Z"
                        }
                    },
                    {
                        _index: "collaboration-platform",
                        _type: "discussions",
                        _id: "57aaaf61d982404630e79fe3",
                        _score: 0.4232868,
                        _source: {
                            created_by: {
                                user_name: "M1234567@mindtree.com",
                                first_name: "John",
                                last_name: "Doe"
                            },
                            title: "title",
                            discussion_id: "1234",
                            tags: ["tag1"],
                            created_at: "2016-08-10T04:36:49.741Z"
                        }
                    }
                ]
            };

            searchService.searchAllDocuments("John", 1, 5).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if client.search operation throws error", function (done) {
            esClientMock.expects("search").yields(new Error("some error in search"), undefined);
            searchService.searchAllDocuments("John", 1, 5).should.be.rejectedWith("some error in search").and.notify(done);
        });

        afterEach(function (done) {
            esClientMock.restore();
            done();
        });
    });

    describe("Search All Documents By Tags Or Author", function () {
        beforeEach(function (done) {
            esClientMock = sinon.mock(client);
            done();
        });

        var searchStubResponse = {
            took: 10,
            timed_out: false,
            _shards: {
                total: 5,
                successful: 5,
                failed: 0
            },
            hits: {
                total: 8,
                max_score: null,
                hits: [
                    {
                        _index: "collaboration-platform",
                        _type: "answers",
                        _id: "57aac7f1026177083efb062c",
                        _score: null,
                        sort: [
                            1470810097963
                        ]
                    },
                    {
                        _index: "collaboration-platform",
                        _type: "discussions",
                        _id: "57aab94cd982404630e79fec",
                        _score: null,
                        sort: [
                            1470806348945
                        ]
                    },
                    {
                        _index: "collaboration-platform",
                        _type: "discussions",
                        _id: "57aab4c4655faee8442a6ce9",
                        _score: null,
                        sort: [
                            1470805188276
                        ]
                    },
                    {
                        _index: "collaboration-platform",
                        _type: "posts",
                        _id: "57aaafecd982404630e79fe7",
                        _score: null,
                        sort: [
                            1470803948036
                        ]
                    },
                    {
                        _index: "collaboration-platform",
                        _type: "posts",
                        _id: "57a9a8a580fc816e1a647e49",
                        _score: null,
                        sort: [
                            1470736549693
                        ]
                    },
                    {
                        _index: "collaboration-platform",
                        _type: "posts",
                        _id: "57a9a88680fc816e1a647e45",
                        _score: null,
                        sort: [
                            1470736518728
                        ]
                    },
                    {
                        _index: "collaboration-platform",
                        _type: "posts",
                        _id: "57a9a87280fc816e1a647e43",
                        _score: null,
                        sort: [
                            1470736498961
                        ]
                    },
                    {
                        _index: "collaboration-platform",
                        _type: "blogs",
                        _id: "57a9a44c80fc816e1a647e3f",
                        _score: null,
                        sort: [
                            1470735436817
                        ]
                    }
                ]
            }
        };

        it("should fetch stream content when followers or tags is selected in filters", function (done) {
            esClientMock.expects("search").yields(undefined, searchStubResponse);
            var expected = {
                blog_ids: [
                    "57a9a44c80fc816e1a647e3f"
                ],
                discussion_ids: [
                    "57aab94cd982404630e79fec",
                    "57aab4c4655faee8442a6ce9"
                ],
                post_ids: [
                    "57aaafecd982404630e79fe7",
                    "57a9a8a580fc816e1a647e49",
                    "57a9a88680fc816e1a647e45",
                    "57a9a87280fc816e1a647e43"
                ],
                answer_ids: [
                    "57aac7f1026177083efb062c"
                ]
            };

            searchService.searchAllDocumentsByTagsOrAuthor([], [], 1, 10).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if client.search operation throws error", function (done) {
            esClientMock.expects("search").yields(new Error("some error in search"), undefined);
            searchService.searchAllDocumentsByTagsOrAuthor([], [], 1, 10).should.be.rejectedWith("some error in search").and.notify(done);
        });

        afterEach(function (done) {
            esClientMock.restore();
            done();
        });
    });

    describe("Search All Documents By Tags And Author", function () {
        beforeEach(function (done) {
            esClientMock = sinon.mock(client);
            done();
        });

        var searchStubResponse = {
            took: 3,
            timed_out: false,
            _shards: {
                total: 5,
                successful: 5,
                failed: 0
            },
            hits: {
                total: 3,
                max_score: null,
                hits: [
                    {
                        _index: "collaboration-platform",
                        _type: "discussions",
                        _id: "57aacb80d982404630e7a01c",
                        _score: null,
                        fields: {
                            tags: [
                                "java"
                            ]
                        },
                        sort: [
                            1470811008378
                        ]
                    },
                    {
                        _index: "collaboration-platform",
                        _type: "posts",
                        _id: "57aacaf5d982404630e7a01a",
                        _score: null,
                        fields: {
                            tags: [
                                "java"
                            ]
                        },
                        sort: [
                            1470810869808
                        ]
                    },
                    {
                        _index: "collaboration-platform",
                        _type: "blogs",
                        _id: "57aacad4d982404630e7a018",
                        _score: null,
                        fields: {
                            tags: [
                                "java"
                            ]
                        },
                        sort: [
                            1470810836920
                        ]
                    }
                ]
            }
        };

        it("should fetch stream content when followers and tags both are selected in filters", function (done) {
            esClientMock.expects("search").yields(undefined, searchStubResponse);
            var expected = {
                blog_ids: [
                    "57aacad4d982404630e7a018"
                ],
                discussion_ids: [
                    "57aacb80d982404630e7a01c"
                ],
                post_ids: [
                    "57aacaf5d982404630e7a01a"
                ],
                answer_ids: []
            };

            searchService.searchAllDocumentsByTagsAndAuthor(["java"], [], 1, 10).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if client.search operation throws error", function (done) {
            esClientMock.expects("search").yields(new Error("some error in search"), undefined);
            searchService.searchAllDocumentsByTagsAndAuthor(["java"], [], 1, 10).should.be.rejectedWith("some error in search").and.notify(done);
        });

        afterEach(function (done) {
            esClientMock.restore();
            done();
        });
    });

    describe("Search All Documents By Tags", function () {
        beforeEach(function (done) {
            esClientMock = sinon.mock(client);
            done();
        });

        var searchStubResponse = {
            took: 5,
            timed_out: false,
            _shards: {
                total: 5,
                successful: 5,
                failed: 0
            },
            hits: {
                total: 11,
                max_score: null,
                hits: [
                    {
                        _index: "collaboration-platform",
                        _type: "discussions",
                        _id: "57aacb80d982404630e7a01c",
                        _score: null,
                        sort: [
                            1470811008378
                        ]
                    },
                    {
                        _index: "collaboration-platform",
                        _type: "posts",
                        _id: "57aacaf5d982404630e7a01a",
                        _score: null,
                        sort: [
                            1470810869808
                        ]
                    },
                    {
                        _index: "collaboration-platform",
                        _type: "blogs",
                        _id: "57aacad4d982404630e7a018",
                        _score: null,
                        sort: [
                            1470810836920
                        ]
                    },
                    {
                        _index: "collaboration-platform",
                        _type: "answers",
                        _id: "57aac7f1026177083efb062c",
                        _score: null,
                        sort: [
                            1470810097963
                        ]
                    },
                    {
                        _index: "collaboration-platform",
                        _type: "discussions",
                        _id: "57aab94cd982404630e79fec",
                        _score: null,
                        sort: [
                            1470806348945
                        ]
                    },
                    {
                        _index: "collaboration-platform",
                        _type: "discussions",
                        _id: "57aab4c4655faee8442a6ce9",
                        _score: null,
                        sort: [
                            1470805188276
                        ]
                    }
                ]
            }
        };

        it("should fetch stream content when only tags are selected in filters", function (done) {
            esClientMock.expects("search").yields(undefined, searchStubResponse);
            var expected = {
                blog_ids: [
                    "57aacad4d982404630e7a018"
                ],
                discussion_ids: [
                    "57aacb80d982404630e7a01c",
                    "57aab94cd982404630e79fec",
                    "57aab4c4655faee8442a6ce9"
                ],
                post_ids: [
                    "57aacaf5d982404630e7a01a"
                ],
                answer_ids: [
                    "57aac7f1026177083efb062c"
                ]
            };

            searchService.searchAllDocumentsByTags(["java"], 1, 10).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if client.search operation throws error", function (done) {
            esClientMock.expects("search").yields(new Error("some error in search"), undefined);
            searchService.searchAllDocumentsByTags(["java"], 1, 10).should.be.rejectedWith("some error in search").and.notify(done);
        });

        afterEach(function (done) {
            esClientMock.restore();
            done();
        });
    });

    describe("Search All Documents By Users", function () {
        beforeEach(function (done) {
            esClientMock = sinon.mock(client);
            done();
        });

        var searchStubResponse = {
            took: 1,
            timed_out: false,
            _shards: {
                total: 5,
                successful: 5,
                failed: 0
            },
            hits: {
                total: 3,
                max_score: null,
                hits: [
                    {
                        _index: "collaboration-platform",
                        _type: "discussions",
                        _id: "57aacb80d982404630e7a01c",
                        _score: null,
                        sort: [
                            1470811008378
                        ]
                    },
                    {
                        _index: "collaboration-platform",
                        _type: "posts",
                        _id: "57aacaf5d982404630e7a01a",
                        _score: null,
                        sort: [
                            1470810869808
                        ]
                    },
                    {
                        _index: "collaboration-platform",
                        _type: "blogs",
                        _id: "57aacad4d982404630e7a018",
                        _score: null,
                        sort: [
                            1470810836920
                        ]
                    }
                ]
            }
        };

        it("should fetch stream content when only followers are selected in filters", function (done) {
            esClientMock.expects("search").yields(undefined, searchStubResponse);
            var expected = {
                blog_ids: [
                    "57aacad4d982404630e7a018"
                ],
                discussion_ids: [
                    "57aacb80d982404630e7a01c"
                ],
                post_ids: [
                    "57aacaf5d982404630e7a01a"
                ],
                answer_ids: []
            };

            searchService.searchAllDocumentsByUsers(["M1234567@mindtree.com"], 1, 10).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if client.search operation throws error", function (done) {
            esClientMock.expects("search").yields(new Error("some error in search"), undefined);
            searchService.searchAllDocumentsByUsers(["M1234567@mindtree.com"], 1, 10).should.be.rejectedWith("some error in search").and.notify(done);
        });

        afterEach(function (done) {
            esClientMock.restore();
            done();
        });
    });

    describe("Search Stream names", function () {
        beforeEach(function (done) {
            esClientMock = sinon.mock(client);
            done();
        });

        var searchStubResponse = {
            took: 2,
            timed_out: false,
            _shards: {
                total: 5,
                successful: 5,
                failed: 0
            },
            hits: {
                total: 1,
                max_score: 2.5040774,
                hits: [
                    {
                        _index: "collaboration-platform",
                        _type: "streams",
                        _id: "57a9a44c641974c2b27059b0",
                        _score: 2.5040774,
                        _source: {
                            name: "java"
                        }
                    }
                ]
            }
        };

        it("should fetch stream content when only followers are selected in filters", function (done) {
            esClientMock.expects("search").yields(undefined, searchStubResponse);
            var expected = ["java"];
            searchService.searchStreams("jav").should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if client.search operation throws error", function (done) {
            esClientMock.expects("search").yields(new Error("some error in search"), undefined);
            searchService.searchStreams("jav").should.be.rejectedWith("some error in search").and.notify(done);
        });
        it("should throw error if input parameters length is invalid", function (done) {
            esClientMock.expects("search").yields(undefined, searchStubResponse);
            expect(function () { searchService.searchStreams("ja"); }).to.throw();
            done();
        });
        afterEach(function (done) {
            esClientMock.restore();
            done();
        });
    });

    describe("Aggregate Most used streams", function () {
        beforeEach(function (done) {
            esClientMock = sinon.mock(client);
            done();
        });

        var searchStubResponse = {
            aggregations: {
                range: {
                    buckets: [
                    ]
                }
            }
        };

        it("should get all the most frequently used streams name and counts", function (done) {
            esClientMock.expects("search").yields(undefined, searchStubResponse);
            var expected = [
            ];

            searchService.getMostUsedStreamsCount(1).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if client.search operation throws error", function (done) {
            esClientMock.expects("search").yields(new Error("some error in search"), undefined);
            searchService.getMostUsedStreamsCount(1).should.be.rejectedWith("some error in search").and.notify(done);
        });

        afterEach(function (done) {
            esClientMock.restore();
            done();
        });
    });

});