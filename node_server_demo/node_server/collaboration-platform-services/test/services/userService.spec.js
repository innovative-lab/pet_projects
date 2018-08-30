var sinon = require('sinon');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
var should = chai.should();
var expect = chai.expect;
var sinonBluebird = require('sinon-bluebird');
var Promise = require('bluebird');
var userService = require("../../app/services/user.service");
var blogModel = require("../../app/dao/blog.model.js");
var discussionModel = require("../../app/dao/discussion.model.js");
var answerModel = require("../../app/dao/answer.model.js");
var postModel = require("../../app/dao/post.model.js");
var userModel = require("../../app/dao/user.model.js");

describe("User services", function () {
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
    var blogModelMock;
    var discussionModelMock;
    var answerModelMock;
    var postModelMock;
    var userModelMock;
    var user;
    var decodedUser;
    describe("Most Followed Users", function () {
        beforeEach(function (done) {
            userModelMock = sinon.mock(userModel);
            done();
        });

        var getMostFollowedUsersStubResponse = [
            {
                followers_count: 3,
                user:
                {
                    _id: "57a045acd387d768806d8186",
                    user_name: "john@mindtree.com",
                    updated_at: "1234",
                    full_name: "John Doe",
                    status: "active",
                    email: null,
                    last_name: "Doe",
                    first_name: "John",
                    employee_id: "M1234567",
                    __v: 0,
                    created_at: "1234",
                    subscribed_streams: [],
                    followings: [],
                    profile_pic_file: {
                        ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                        name: "f344_1394167081599saihareesh.jpg"
                    }
                }
            }
        ];

        it("should return most followed users", function (done) {
            userModelMock.expects("getMostFollowedUsers").once().resolves(getMostFollowedUsersStubResponse);
            var expected = [
                {
                    followers_count: 3,
                    user:
                    {
                        user_name: "john@mindtree.com",
                        profile_pic_file: {
                            ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
                            name: "f344_1394167081599saihareesh.jpg"
                        },
                        last_name: "Doe",
                        first_name: "John"
                    }
                },
            ];

            userService.getMostFollowedUsers(1).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if getMostFollowedUsers dao operation throws error", function (done) {
            userModelMock.expects("getMostFollowedUsers").once().rejects('some dao error in getMostFollowedUsers dao');
            userService.getMostFollowedUsers(1).should.be.rejectedWith("some dao error in getMostFollowedUsers dao").and.notify(done);
        });

        afterEach(function (done) {
            userModelMock.restore();
            done();
        });
    });

    describe("Update Profile Picture", function () {
        beforeEach(function (done) {
            userModelMock = sinon.mock(userModel);
            done();
        });

        var updateProfilePicStubResponse =
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

        it("should update the profile picture", function (done) {
            userModelMock.expects("updateProfilePic").once().resolves(updateProfilePicStubResponse);

            var expected = {

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

            userService.updateProfilePic(loggedInUser, "1234", "1234").should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if updateProfilePic dao operation throws error", function (done) {
            userModelMock.expects("updateProfilePic").once().rejects('error occured in updateProfilePic dao');
            userService.updateProfilePic(loggedInUser, "1234", "1234").should.be.rejectedWith("error occured in updateProfilePic dao").and.notify(done);
        });
        afterEach(function (done) {
            userModelMock.restore();
            done();
        });
    });

    describe("User By UserName", function () {
        beforeEach(function (done) {
            userModelMock = sinon.mock(userModel);
            done();
        });

        var getUserByUsernameResponse =
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

        it("should return the user by user name", function (done) {
            userModelMock.expects("getUserByUsername").once().resolves(getUserByUsernameResponse);

            var expected = {
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
            };

            userService.getUserByUsername("M100000@,imdtree.com").should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if getUserByUsername dao operation throws error", function (done) {
            userModelMock.expects("getUserByUsername").once().rejects('error occured in getUserByUsername dao');
            userService.getUserByUsername("M100000@mindtree.com").should.be.rejectedWith("error occured in getUserByUsername dao").and.notify(done);
        });
        afterEach(function (done) {
            userModelMock.restore();
            done();
        });
    });
    describe("Create User", function () {
        beforeEach(function (done) {
            userModelMock = sinon.mock(userModel);
            done();
        });

        var createUserStubResponse =
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

        it("should create a user", function (done) {
            userModelMock.expects("createUser").once().resolves(createUserStubResponse);
            user = {
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
            var expected = {
                _id: "5795b9b3d387d768806d80de",
                __v: 0,
                created_at: "1234",
                user_name: "M1000000@mindtree.com",
                updated_at: "1234",
                full_name: 'Peter Parker',
                status: "active",
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
            };

            userService.createUser(user).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if createUser dao operation throws error", function (done) {
            userModelMock.expects("createUser").once().rejects('error occured in createUser dao');
            userService.createUser(user).should.be.rejectedWith("error occured in createUser dao").and.notify(done);
        });

        afterEach(function (done) {
            userModelMock.restore();
            done();
        });
    });
    describe("All Users", function () {
        beforeEach(function (done) {
            userModelMock = sinon.mock(userModel);
            done();
        });

        var getAllUsersStubResponse = [
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
            }
        ];

        it("should return all users", function (done) {
            userModelMock.expects("getAllUsers").once().resolves(getAllUsersStubResponse);
            var expected = [
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
                }
            ];

            userService.getAllUsers().should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if getAllUsers dao error occurs", function (done) {
            userModelMock.expects("getAllUsers").once().rejects('error occured in getAllUsers dao');
            userService.getAllUsers().should.be.rejectedWith("error occured in getAllUsers dao").and.notify(done);
        });

        afterEach(function (done) {
            userModelMock.restore();
            done();
        });
    });
    describe("Update Email", function () {
        beforeEach(function (done) {
            userModelMock = sinon.mock(userModel);
            done();
        });

        var updateEmailStubResponse =
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


        it("should update the email and resolve with user data", function (done) {
            userModelMock.expects("updateEmail").once().resolves(updateEmailStubResponse);
            var expected =
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


            userService.updateEmail(loggedInUser, "1234@1234.com").should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if updateEmail dao operation throws error", function (done) {
            userModelMock.expects("updateEmail").once().rejects('error occured in updateEmail dao');
            userService.updateEmail(loggedInUser, "1234@1234.com").should.be.rejectedWith("error occured in updateEmail dao").and.notify(done);
        });

        afterEach(function (done) {
            userModelMock.restore();
            done();
        });
    });
    describe("Follow User", function () {
        beforeEach(function (done) {
            userModelMock = sinon.mock(userModel);
            done();
        });

        var followUserStubResponse =
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

        it("should follow the user and return with the user data", function (done) {
            userModelMock.expects("followUser").once().resolves(followUserStubResponse);
            var expected = {
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


            userService.followUser(loggedInUser, "1234@mindtree.com", 1).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if followUser dao operation throws error", function (done) {
            userModelMock.expects("followUser").once().rejects('error occured in followUser dao');
            userService.followUser(loggedInUser, "1234@mindtree.com", 1).should.be.rejectedWith("error occured in followUser dao").and.notify(done);
        });
        it("should throw error if the one follows himself", function (done) {
            userModelMock.expects("followUser").once().rejects(followUserStubResponse)
            userService.followUser(loggedInUser, "john@mindtree.com", 1).should.be.rejectedWith("one cannot follow oneself").and.notify(done);
        });

        afterEach(function (done) {
            userModelMock.restore();
            done();
        });
    });
    describe("LoggedIn User's Following Users", function () {
        beforeEach(function (done) {
            userModelMock = sinon.mock(userModel);
            done();
        });

        var getUsersByUserNamesStubResponse = [
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
            }
        ];

        it("should return Following users of the LoggedIn User", function (done) {
            userModelMock.expects("getUsersByUserNames").once().resolves(getUsersByUserNamesStubResponse);
            var expected = [
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
                }
            ];

            userService.getMyFollowingUsers(loggedInUser).should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if getUsersByUserNames dao operation throws error", function (done) {
            userModelMock.expects("getUsersByUserNames").once().rejects('error occured in getUsersByUserNames dao');
            userService.getMyFollowingUsers(loggedInUser).should.be.rejectedWith("error occured in getUsersByUserNames dao").and.notify(done);
        });
        afterEach(function (done) {
            userModelMock.restore();
            done();
        });
    });
    describe("Total Counts By User", function () {
        beforeEach(function (done) {
            blogModelMock = sinon.mock(blogModel);
            discussionModelMock = sinon.mock(discussionModel);
            answerModelMock = sinon.mock(answerModel);
            postModelMock = sinon.mock(postModel);
            userModelMock = sinon.mock(userModel);
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
        it("should return the total counts of an user", function (done) {
            blogModelMock.expects("getTotalBlogCountsByAuthor").once().resolves(3);
            discussionModelMock.expects("getTotalDiscussionCountsByAuthor").once().resolves(0);
            answerModelMock.expects("getTotalAnswerCountsByAuthor").once().resolves(2);
            postModelMock.expects("getTotalPostCountByAuthor").once().resolves(6);
            userModelMock.expects("getUserFollowersCount").once().resolves(6);
            userModelMock.expects("getUserByUsername").once().resolves(getUserByUsernameStubResponse);

            var expected = {
                answer_counts: 2,
                blog_counts: 3,
                discussion_counts: 0,
                post_counts: 6,
                followers_count: 6
            }
            userService.getTotalCountsByUser("M1000000@mindtree.com").should.eventually.to.eql(expected).notify(done);

        });

        it("should reject the promise if getUserByUsername dao operation throws error", function (done) {
            blogModelMock.expects("getTotalBlogCountsByAuthor").once().resolves(3);
            discussionModelMock.expects("getTotalDiscussionCountsByAuthor").once().resolves(0);
            answerModelMock.expects("getTotalAnswerCountsByAuthor").once().resolves(2);
            postModelMock.expects("getTotalPostCountByAuthor").once().resolves(6);
            userModelMock.expects("getUserFollowersCount").once().resolves(6);
            userModelMock.expects("getUserByUsername").once().rejects('error occured in getUserByUsername dao');

            userService.getTotalCountsByUser("M1000000@mindtree.com").should.be.rejectedWith("error occured in getUserByUsername dao").and.notify(done);
        });
        //   it("should reject the promise if input parameters are invalid", function (done) {
        //     blogModelMock.expects("getTotalBlogCountsByAuthor").once().resolves(3);
        //     discussionModelMock.expects("getTotalDiscussionCountsByAuthor").once().resolves(0);
        //     answerModelMock.expects("getTotalAnswerCountsByAuthor").once().resolves(2);
        //     postModelMock.expects("getTotalPostCountByAuthor").once().resolves(6);
        //     userModelMock.expects("getUserFollowersCount").once().resolves(6);
        //     userModelMock.expects("getUserByUsername").once().resolves(getUserByUsernameStubResponse);
        //     userService.getTotalCountsByUser(undefined).should.be.rejectedWith("Error").and.notify(done);
        // });
        afterEach(function (done) {
            blogModelMock.restore();
            discussionModelMock.restore();
            answerModelMock.restore();
            postModelMock.restore();
            userModelMock.restore();
            done();
        });
    });
    // describe("buildUserInfo", function () {
    //     beforeEach(function (done) {
    //         done();
    //     });
    //     it("should return buildUserInfo", function (done) {
    //          user = {
    //              unique_name:"M1000000",
    //         _id: "5795b9b3d387d768806d80de",
    //         user_name: "M1000000@mindtree.com",
    //         updated_at: "1234",
    //         full_name: 'Peter Parker',
    //         status: "active",
    //         email: 'Peter.Parker@mindtreee.com',
    //         last_name: "Parker",
    //         first_name: "Peter",
    //         employee_id: "M1000000",
    //         __v: 0,
    //         created_at: "1234",
    //         subscribed_streams: [],
    //         followings: [],
    //         profile_pic_file: {
    //             ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
    //             name: "f344_1394167081599saihareesh.jpg"
    //         }
    //     };
    //       var expected = {
    //         _id: "5795b9b3d387d768806d80de",
    //         user_name: "M1000000@mindtree.com",
    //         updated_at: "1234",
    //         full_name: 'Peter Parker',
    //         status: "active",
    //         email: 'Peter.Parker@mindtreee.com',
    //         last_name: "Parker",
    //         first_name: "Peter",
    //         employee_id: "M1000000",
    //         __v: 0,
    //         created_at: "1234",
    //         subscribed_streams: [],
    //         followings: [],
    //         profile_pic_file: {
    //             ref: "workspace://SpacesStore/75f711f9-ef38-4fe1-b7c2-60e6c0b3678e",
    //             name: "f344_1394167081599saihareesh.jpg"
    //         }
    //     };
    //     userService.expects('buildUserInfo').once().withArgs(user).returns(expected);
    //     });
    //     afterEach(function (done) {
    //          userModelMock.restore();
    //         done();
    //     });
    // });

    describe("All Users", function () {
        beforeEach(function (done) {
            userModelMock = sinon.mock(userModel);
            done();
        });

        var getAllUsersWithStreamsAndFollowingsStubResponse = [
            {
                _id: "57ac355c641974c2b27059d4",
                user_name: "M1030395@mindtree.com",
                subscribed_streams: [
                    "java"
                ],
                followings: [
                    "M1030385@mindtree.com",
                    "M1020387@mindtree.com"
                ]
            },
            {
                _id: "57a9a563641974c2b27059b2",
                user_name: "M1030385@mindtree.com",
                subscribed_streams: [
                    "java",
                    "iot",
                    "bigdata"
                ],
                followings: [
                    "M1035984@mindtree.com"
                ]
            },
            {
                _id: "57ad6fba641974c2b27059d9",
                user_name: "M1030390@mindtree.com",
                subscribed_streams: [],
                followings: [
                    "M1030385@mindtree.com"
                ]
            }
        ];

        it("should return All Users With Subscribed Streams And Followings", function (done) {
            userModelMock.expects("getAllUsersWithStreamsAndFollowings").once().resolves(getAllUsersWithStreamsAndFollowingsStubResponse);
            var expected = [
                {
                    _id: "57ac355c641974c2b27059d4",
                    user_name: "M1030395@mindtree.com",
                    subscribed_streams: [
                        "java"
                    ],
                    followings: [
                        "M1030385@mindtree.com",
                        "M1020387@mindtree.com"
                    ]
                },
                {
                    _id: "57a9a563641974c2b27059b2",
                    user_name: "M1030385@mindtree.com",
                    subscribed_streams: [
                        "java",
                        "iot",
                        "bigdata"
                    ],
                    followings: [
                        "M1035984@mindtree.com"
                    ]
                },
                {
                    _id: "57ad6fba641974c2b27059d9",
                    user_name: "M1030390@mindtree.com",
                    subscribed_streams: [],
                    followings: [
                        "M1030385@mindtree.com"
                    ]
                }
            ];

            userService.getAllUsersWithStreamsAndFollowings().should.eventually.to.eql(expected).notify(done);
        });

        it("should reject the promise if getAllUsersWithStreamsAndFollowings dao error occurs", function (done) {
            userModelMock.expects("getAllUsersWithStreamsAndFollowings").once().rejects('error occured in getAllUsersWithStreamsAndFollowings dao');
            userService.getAllUsersWithStreamsAndFollowings().should.be.rejectedWith("error occured in getAllUsersWithStreamsAndFollowings dao").and.notify(done);
        });

        afterEach(function (done) {
            userModelMock.restore();
            done();
        });
    });
});