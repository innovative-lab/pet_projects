var sinon = require('sinon');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var should = chai.should();
var expect = chai.expect;
var sinonBluebird = require('sinon-bluebird');
var Promise = require('bluebird');
var channelService = require("../../app/services/channel.service");
var userModel = require("../../app/dao/user.model.js");
var channelModel = require("../../app/dao/channel.model.js");
var messageModel = require("../../app/dao/message.model.js");

describe("Channel services", function () {
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

    var userModelMock;
    var channelModelMock;
    var messageModelMock;
    var channel;
    var message;

    describe("Create Channel", function () {
        beforeEach(function (done) {
            channelModelMock = sinon.mock(channelModel);
            done();
        });

        var createChannelStubResponse = [
            {
                __v: 0,
                updated_at: "1234",
                created_at: "1234",
                channel_name: "channel",
                channel_id: "1234",
                created_by: {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    updated_at: "1234",
                    full_name: 'Peter Parker',
                    status: "active",
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    __v: 0,
                    created_at: "1234",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                _id: "57a96d430b148f79ad14d7d9",
                members: []
            }
        ];

        it("should create a channel and resolve with promise", function (done) {
            channelModelMock.expects("createChannel").once().resolves(createChannelStubResponse);
            var expected = [
                {
                    __v: 0,
                    updated_at: "1234",
                    created_at: "1234",
                    channel_name: "channel",
                    channel_id: "1234",
                    created_by: {
                        _id: "5795b9b3d387d768806d80de",
                        user_name: "M1000000@mindtree.com",
                        updated_at: "1234",
                        full_name: 'Peter Parker',
                        status: "active",
                        email: 'Peter.Parker@mindtreee.com',
                        last_name: "Parker",
                        first_name: "Peter",
                        employee_id: "M1000000",
                        __v: 0,
                        created_at: "1234",
                        subscribed_streams: [],
                        followings: [],
                        profile_pic_file: {
                            ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                            name: "f344_1394167081599saihareesh.jpg"
                        }
                    },
                    _id: "57a96d430b148f79ad14d7d9",
                    members:
                    [
                    ]
                }
            ];

            channelService.createChannel(loggedInUser, { channelname: "channel" }).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if createChannel dao operation throws error", function (done) {
            channel = {
            };
            channelModelMock.expects("createChannel").once().rejects('error occured in createChannel');
            channelService.createChannel(loggedInUser, { channelname: "channel" }).should.be.rejectedWith("error occured in createChannel").and.notify(done);
        });

        afterEach(function (done) {
            channelModelMock.restore();
            done();
        });
    });

    describe("Channels By UserName", function () {
        beforeEach(function (done) {
            userModelMock = sinon.mock(userModel);
            channelModelMock = sinon.mock(channelModel);
            done();
        });

        var getUserByUsernameStubResponse =
            {
                _id: "5795b9b3d387d768806d80de",
                user_name: "M1000000@mindtree.com",
                updated_at: "1234",
                full_name: 'Peter Parker',
                status: "active",
                email: 'Peter.Parker@mindtreee.com',
                last_name: "Parker",
                first_name: "Peter",
                employee_id: "M1000000",
                __v: 0,
                created_at: "1234",
                subscribed_streams: [],
                followings: [],
                profile_pic_file: {
                    ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                    name: "f344_1394167081599saihareesh.jpg"
                }
            };
        var getChannelsByUserIdStubResponse =
            [
                {
                    channel_id: "1234",
                    channel_name: "channel",
                    members: []
                }
            ];
        it("should return the list of Channels by UserName", function (done) {
            userModelMock.expects("getUserByUsername").once().resolves(getUserByUsernameStubResponse);
            channelModelMock.expects("getChannelsByUserId").once().resolves(getChannelsByUserIdStubResponse);

            var expected =
                [
                    {
                        channel_id: "1234",
                        channel_name: "channel",
                        members: []
                    }
                ];


            channelService.getChannelsByUserName("M1000000@mindtree.com").should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if getUserByUsername dao operation throws error", function (done) {
            userModelMock.expects("getUserByUsername").once().rejects('error occured in getUserByUsername dao');
            channelModelMock.expects("getChannelsByUserId").once().resolves(getChannelsByUserIdStubResponse);
            channelService.getChannelsByUserName("M1000000@mindtree.com").should.be.rejectedWith("error occured in getUserByUsername dao").and.notify(done);
        });

        afterEach(function (done) {
            userModelMock.restore();
            channelModelMock.restore();
            done();
        });
    });
    describe("Channels By User", function () {
        beforeEach(function (done) {
            channelModelMock = sinon.mock(channelModel);
            done();
        });

        var getChannelsByUserIdStubResponse = [
            {
                _id: "57a1822069253a88355c351c",
                updated_at: "1234",
                created_at: "1234",
                channel_name: "channel",
                channel_id: "1234",
                created_by: {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    updated_at: "1234",
                    full_name: 'Peter Parker',
                    status: "active",
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    __v: 0,
                    created_at: "1234",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                __v: 0,
                members: []
            }
        ];

        it("should return channels by user", function (done) {
            channelModelMock.expects("getChannelsByUserId").once().resolves(getChannelsByUserIdStubResponse);

            var expected = [
                {
                    channel_id: "1234",
                    channel_name: "channel",
                    members: []
                }
            ];


            channelService.getChannelsByUser("M1000000@mindtree.com").should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if getChannelsByUserId dao operation throws error", function (done) {
            channelModelMock.expects("getChannelsByUserId").once().rejects('error occured in getChannelsByUserId dao');
            channelService.getChannelsByUser("M1000000@mindtree.com").should.be.rejectedWith("error occured in getChannelsByUserId dao").and.notify(done);
        });

        afterEach(function (done) {
            channelModelMock.restore();
            done();
        });
    });
    describe("Remove user From Channel", function () {
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
            userModelMock = sinon.mock(userModel);
            channelModelMock = sinon.mock(channelModel);
            done();
        });
        it("should remove user from channel and resolve with no data", function (done) {
            userModelMock.expects("getUserByUsername").once().resolves(otherUser);
            channelModelMock.expects("removeUserFromChannel").once().resolves(otherUser);


            channelService.removeUserFromChannel(loggedInUser, "M1000000@mindtree.com", 1).should.be.fulfilled.notify(done);
        });

        it("should reject the promise if getUserByUsername dao operation throws error", function (done) {
            userModelMock.expects("getUserByUsername").once().rejects('error occured in getUserByUsername dao');
            channelModelMock.expects("removeUserFromChannel").once().resolves(otherUser);
            channelService.removeUserFromChannel(loggedInUser, "M1000000@mindtree.com", 1).should.be.rejectedWith("error occured in getUserByUsername dao").and.notify(done);
        });

        afterEach(function (done) {
            userModelMock.restore();
            channelModelMock.restore();
            done();
        });
    });
    describe("Add Message In Channel", function () {
        beforeEach(function (done) {
            messageModelMock = sinon.mock(messageModel);
            done();
        });

        var addMessageInChannelStubResponse = {
            content: "content",
            file: "file",
            channel_id: "1234",
            message_id: "1234",
            created_by: {
                _id: "5795b9b3d387d768806d80de",
                user_name: "M1000000@mindtree.com",
                updated_at: "1234",
                full_name: 'Peter Parker',
                status: "active",
                email: 'Peter.Parker@mindtreee.com',
                last_name: "Parker",
                first_name: "Peter",
                employee_id: "M1000000",
                __v: 0,
                created_at: "1234",
                subscribed_streams: [],
                followings: [],
                profile_pic_file: {
                    ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                    name: "f344_1394167081599saihareesh.jpg"
                }
            },
            created_at: "1234"
        };
        it("should add a message in a channel and resolve with data", function (done) {
            messageModelMock.expects("addMessageInChannel").once().resolves(addMessageInChannelStubResponse);
            message = {
            };
            var expected = {
                content: "content",
                file: "file",
                channel_id: "1234",
                message_id: "1234",
                created_by: {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    updated_at: "1234",
                    full_name: 'Peter Parker',
                    status: "active",
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    __v: 0,
                    created_at: "1234",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                created_at: "1234"
            };

            channelService.addMessageInChannel(loggedInUser, 1, message).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if addMessageInChannel dao operation throws error", function (done) {
            messageModelMock.expects("addMessageInChannel").once().rejects('error occured in addMessageInChannel dao');
            channelService.addMessageInChannel(loggedInUser, 1, message).should.be.rejectedWith("error occured in addMessageInChannel dao").and.notify(done);
        });

        afterEach(function (done) {
            messageModelMock.restore();
            done();
        });
    });
    describe("Messages By Channel", function () {
        beforeEach(function (done) {
            messageModelMock = sinon.mock(messageModel);
            channelModelMock = sinon.mock(channelModel);
            done();
        });

        var getMessagesForChannelStubResponse = [
            {
                _id: "57a970b049dada3d31d8d127",
                updated_at: "12334",
                content: "content",
                channel_id: "1234",
                message_id: "1234",
                created_by: {
                    _id: "5795b9b3d387d768806d80de",
                    user_name: "M1000000@mindtree.com",
                    updated_at: "1234",
                    full_name: 'Peter Parker',
                    status: "active",
                    email: 'Peter.Parker@mindtreee.com',
                    last_name: "Parker",
                    first_name: "Peter",
                    employee_id: "M1000000",
                    __v: 0,
                    created_at: "1234",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                },
                __v: 0,
                read_by: [],
                created_at: "1234"
            }
        ];
        var getChannelByIdStubResponse = {
            _id: "57b589095349842cf2d918c8",
            updated_at: "1234",
            created_at: "1234",
            channel_name: "Channel",
            channel_id: "1234",
            created_by: {
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
            },
            __v: 0,
            members:
            [{
                user: {
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
                },
                created_by: 'M1234567@mindtree.com',
                isAdmin: true,
                _id: "57b589095349842cf2d918c9",
                created_at: "1234"
            },
                {
                    isAdmin: true,
                    created_by: 'M1234567@mindtree.com',
                    user: {
                        _id: "57a9a7dd641974c2b27059b3",
                        user_name: "M1000000@mindtree.com",
                        updated_at: "1234",
                        full_name: "Peter Parker",
                        status: "active",
                        email: "Peter.Parker@mindtree.com",
                        last_name: "Parker",
                        first_name: "Peter",
                        employee_id: "M1000000",
                        __v: 0,
                        created_at: "1234",
                        subscribed_streams: [],
                        followings: [],
                        profile_pic_file:
                        {
                            name: "f593_1463980519450DSC_0043.JPG",
                            ref: "workspace://SpacesStore/f2e755a6-9892-425f-a103-d4e288768e8c"
                        }
                    },
                    _id: "57b5891e5349842cf2d918ca",
                    created_at: "1234"
                }]

        };
        it("should return all messages by channel", function (done) {
            messageModelMock.expects("getMessagesForChannel").once().resolves(getMessagesForChannelStubResponse);
            channelModelMock.expects("getChannelById").once().resolves(getChannelByIdStubResponse);
            message = {
            };
            var expected = [
                {
                    message_id: "1234",
                    channel_id: "1234",
                    content: "content",
                    created_by: {
                        last_name: "Parker",
                        first_name: "Peter",
                        user_name: "M1000000@mindtree.com",
                        profile_pic_file: {
                            ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                            name: "f344_1394167081599saihareesh.jpg"
                        }
                    },
                    file: null,
                    created_at: "1234"
                }
            ];

            channelService.getMessagesByChannel(loggedInUser, 1, 1, 3).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if getChannelById dao error occurs", function (done) {
            channelModelMock.expects("getChannelById").once().rejects('error occured in getChannelById dao');
            messageModelMock.expects("getMessagesForChannel").once().resolves(getMessagesForChannelStubResponse);
            channelService.getMessagesByChannel(loggedInUser, 1, 1, 3).should.be.rejectedWith("error occured in getChannelById dao").and.notify(done);
        });
        it("should throw error if the user is not present in the channel", function (done) {
            var loggedInUserWithid = JSON.parse(JSON.stringify(loggedInUser));
            loggedInUserWithid._id = "5795b9b3d387d768806d80df";
            messageModelMock.expects("getMessagesForChannel").once().resolves(getMessagesForChannelStubResponse);
            channelModelMock.expects("getChannelById").once().resolves(getChannelByIdStubResponse);
            channelService.getMessagesByChannel(loggedInUserWithid, 1, 1, 3).should.be.rejectedWith("User is not part of the channel").and.notify(done);
        });
        afterEach(function (done) {
            messageModelMock.restore();
            channelModelMock.restore();
            done();
        });
    });
    describe("Add user To Channel", function () {
        beforeEach(function (done) {
            userModelMock = sinon.mock(userModel);
            channelModelMock = sinon.mock(channelModel);
            done();
        });
        var getUserByUsernameStubResponse =
            {
                _id: "57a9a7dd641974c2b27059b3",
                user_name: "M1000000@mindtree.com",
                updated_at: "1234",
                full_name: "Peter Parker",
                status: "active",
                email: "Peter.Parker@mindtree.com",
                last_name: "Parker",
                first_name: "Peter",
                employee_id: "M1000000",
                __v: 0,
                created_at: "1234",
                subscribed_streams: [],
                followings: [],
                profile_pic_file:
                {
                    name: "f593_1463980519450DSC_0043.JPG",
                    ref: "workspace://SpacesStore/f2e755a6-9892-425f-a103-d4e288768e8c"
                }
            };
        var channelByIdStubResponse = {
            _id: "57b589095349842cf2d918c8",
            updated_at: "1234",
            created_at: "1234",
            channel_name: "Channel",
            channel_id: "1234",
            created_by: {
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
            },
            __v: 0,
            members:
            [{
                user: {
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
                },
                created_by: 'M1234567@mindtree.com',
                isAdmin: true,
                _id: "57b589095349842cf2d918c9",
                created_at: "1234"
            }]
        };
        var addUserToChannelStubresponse = {
            _id: "57b589095349842cf2d918c8",
            updated_at: "1234",
            created_at: "1234",
            channel_name: "Channel",
            channel_id: "1234",
            created_by: {
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
            },
            __v: 0,
            members:
            [{
                user: {
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
                },
                created_by: 'M1234567@mindtree.com',
                isAdmin: true,
                _id: "57b589095349842cf2d918c9",
                created_at: "1234"
            },
                {
                    isAdmin: true,
                    created_by: 'M1234567@mindtree.com',
                    user: {
                        _id: "57a9a7dd641974c2b27059b3",
                        user_name: "M1000000@mindtree.com",
                        updated_at: "1234",
                        full_name: "Peter Parker",
                        status: "active",
                        email: "Peter.Parker@mindtree.com",
                        last_name: "Parker",
                        first_name: "Peter",
                        employee_id: "M1000000",
                        __v: 0,
                        created_at: "1234",
                        subscribed_streams: [],
                        followings: [],
                        profile_pic_file:
                        {
                            name: "f593_1463980519450DSC_0043.JPG",
                            ref: "workspace://SpacesStore/f2e755a6-9892-425f-a103-d4e288768e8c"
                        }
                    },
                    _id: "57b5891e5349842cf2d918ca",
                    created_at: "1234"
                }]

        };
        it("should add user to the channel", function (done) {
            var expected = {
                 _id: "57b589095349842cf2d918c8",
            updated_at: "1234",
            created_at: "1234",
            channel_name: "Channel",
            channel_id: "1234",
            created_by: {
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
            },
            __v: 0,
            members:
            [{
                user: {
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
                },
                created_by: 'M1234567@mindtree.com',
                isAdmin: true,
                _id: "57b589095349842cf2d918c9",
                created_at: "1234"
            },
                {
                    isAdmin: true,
                    created_by: 'M1234567@mindtree.com',
                    user: {
                        _id: "57a9a7dd641974c2b27059b3",
                        user_name: "M1000000@mindtree.com",
                        updated_at: "1234",
                        full_name: "Peter Parker",
                        status: "active",
                        email: "Peter.Parker@mindtree.com",
                        last_name: "Parker",
                        first_name: "Peter",
                        employee_id: "M1000000",
                        __v: 0,
                        created_at: "1234",
                        subscribed_streams: [],
                        followings: [],
                        profile_pic_file:
                        {
                            name: "f593_1463980519450DSC_0043.JPG",
                            ref: "workspace://SpacesStore/f2e755a6-9892-425f-a103-d4e288768e8c"
                        }
                    },
                    _id: "57b5891e5349842cf2d918ca",
                    created_at: "1234"
                }]
            };
            userModelMock.expects("getUserByUsername").once().resolves(getUserByUsernameStubResponse);
            channelModelMock.expects("getChannelById").once().resolves(channelByIdStubResponse);
            channelModelMock.expects("addUserToChannel").once().resolves(addUserToChannelStubresponse);
            channelService.addUserToChannel(loggedInUser, "M1000001@mindtree.com", "1234").should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if getUserByUsername dao operation throws error", function (done) {
            userModelMock.expects("getUserByUsername").once().rejects('error in getUserByUsername dao');
            channelModelMock.expects("getChannelById").once().resolves(channelByIdStubResponse);
            channelModelMock.expects("addUserToChannel").once().resolves(addUserToChannelStubresponse);
            channelService.addUserToChannel(loggedInUser, "M1000001@mindtree.com", "1234").should.be.rejectedWith("error in getUserByUsername dao").and.notify(done);
        });
        it("should reject the promise if the same user tries to get added", function (done) {
            var getUserByUsernameStubResponseWithid = JSON.parse(JSON.stringify(getUserByUsernameStubResponse));
            getUserByUsernameStubResponseWithid._id = "5795b9b3d387d768806d80de";
            userModelMock.expects("getUserByUsername").once().resolves(getUserByUsernameStubResponseWithid);

            channelModelMock.expects("getChannelById").once().resolves(channelByIdStubResponse);
            channelModelMock.expects("addUserToChannel").once().resolves(addUserToChannelStubresponse);
            channelService.addUserToChannel(loggedInUser, "M1000001@mindtree.com", "1234").should.be.rejectedWith("").and.notify(done);
        });
        it("should reject the promise if the user does not have admin privileges", function (done) {
            var loggedInUserWithid = JSON.parse(JSON.stringify(loggedInUser));
            loggedInUserWithid._id = "5795b9b3d387d768806d80df";
            userModelMock.expects("getUserByUsername").once().resolves(getUserByUsernameStubResponse);
            channelModelMock.expects("getChannelById").once().resolves(channelByIdStubResponse);
            channelModelMock.expects("addUserToChannel").once().resolves(addUserToChannelStubresponse);
            channelService.addUserToChannel(loggedInUserWithid, "M1000001@mindtree.com", "1234").should.be.rejectedWith("").and.notify(done);
        });
        afterEach(function (done) {
            userModelMock.restore();
            channelModelMock.restore();
            done();
        });
    });


    describe("Channel By Id", function () {
        beforeEach(function (done) {
            channelModelMock = sinon.mock(channelModel);
            done();
        });

        var getChannelByIdStubResponse = {
            _id: "57ab21f2e924cfa612f0a5a1",
            updated_at: "1234",
            created_at: "1234",
            channel_name: "channel",
            channel_id: "1234",
            created_by: {
                _id: "57a9a7dd641974c2b27059b3",
                user_name: "M1000001@mindtree.com",
                updated_at: "1234",
                full_name: "Mr Abc",
                status: "active",
                email: "Mr.Abc@mindtree.com",
                last_name: "Abc",
                first_name: "Mr",
                employee_id: "M1000001",
                __v: 0,
                created_at: "1234",
                subscribed_streams: [],
                followings: [],
                profile_pic_file: { name: null, ref: null }
            },
            __v: 0,
            members:
            [
            ]
        };
        it("should return Channel By Id", function (done) {
            channelModelMock.expects("getChannelById").once().resolves(getChannelByIdStubResponse);
            var expected =
                {
                    channel_id: "1234",
                    channel_name: "channel",
                    members: []
                }
                ;
            channelService.getChannelById("1").should.eventually.to.eql(expected).notify(done);
        });

        it("should not return getChannelById", function (done) {
            channelModelMock.expects("getChannelById").once().rejects('error occured');
            channelService.getChannelById("1").should.be.rejectedWith("error occured").and.notify(done);
        });

        afterEach(function (done) {
            channelModelMock.restore();
            done();
        });
    });
});