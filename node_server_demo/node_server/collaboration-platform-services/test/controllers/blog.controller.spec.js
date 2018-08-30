var sinon = require('sinon');
var should = require('chai').should;
var expect = require('chai').expect;
var assert = require('chai').assert;

var blogController = require('../../app/routes/controllers/blog.controller.js');
var blogService = require('../../app/services/blog.service.js');
var Promise = require('bluebird');
var http_mocks = require('node-mocks-http');

describe('Blog controller',

	function () {
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


		describe(
			'all blogs',
			function () {
				var mockedBlogService;
				var request;
				var response;
				var blogsMockResponse
				beforeEach(function (done) {
					request = http_mocks.createRequest({
						method: 'GET',
						url: '/all',
						query: {
							pno: 1,
							psize: 1
						},
						userInfo: loggedInUser
					});

					response = http_mocks.createResponse({
						eventEmitter: require('events').EventEmitter
					});

					blogsMockResponse = [{
						"blog_id": 'blogxyz123',
						"content": 'sample',
						"tags": ["java", "dotNet"],
						"liked_by": ['Mxxxxxx@mindtree.com'],
						"comments": [{}, {}],
						"created_by": {},
						"viewed_by": ["Mxxxxx@mindtree.com", "Myyyyy@mindtree.com"],
						"created_at": '',
						"title": 'SA',
						"status": 'PUBLISHED'
					},
						{
							"blog_id": 'blogabc456',
							"content": 'sampletwo',
							"tags": ["java", "js"],
							"liked_by": ['Mxxxxxx@mindtree.com'],
							"comments": [{}, {}],
							"created_by": {},
							"viewed_by": ["Mxxxxx@mindtree.com", "Myyyyy@mindtree.com"],
							"created_at": '',
							"title": 'SS',
							"status": 'PUBLISHED'
						}];

					mockedBlogService = sinon.mock(blogService);
					done();
				});

				it('test the length of blogs', function (done) {
					mockedBlogService.expects('getAllPublishedBlogs').once().withArgs(loggedInUser, 1, 1).returns(
						Promise.resolve(blogsMockResponse));
					response.on('end', function () {
						var res = response._getData();
						expect(res.data.blogs.length).to.equal(2);
						done();
					});
					blogController.blogs(request, response);
				});

				it('test the fields of returned', function (done) {
					mockedBlogService.expects('getAllPublishedBlogs').once().withArgs(loggedInUser, 1, 1).returns(
						Promise.resolve(blogsMockResponse));

					response.on('end', function () {
						var res = response._getData();
						expect(res.data.blogs).to.deep.equal(blogsMockResponse);
						done();
					});
					blogController.blogs(request, response);
				});

				it('check the response if user is null', function (done) {
					var user = null;
					var request = http_mocks.createRequest({
						method: 'GET',
						url: '/all',
						query: {
							pno: 1,
							psize: 1
						},
						userInfo: user
					});
					mockedBlogService.expects('getAllPublishedBlogs').once().withArgs(user, 1, 1).returns(
						Promise.reject("user is null"));

					response.on('end', function () {
						var res = response._getData();
						expect(res.status.statusCode).to.equal('500');
						done();
					});
					blogController.blogs(request, response);
				})

				afterEach(function (done) {
					mockedBlogService.restore();
					done();
				});

			});


		describe(
			'blogs by id',
			function () {
				var mockedblogService;
				var blogMockResponse = {
					"blog_id": 'blogxyz123',
					"content": 'sample',
					"tags": ["java", "dotNet"],
					"comments": [{}, {}],
					"created_by": {},
					"viewed_by": ["Mxxxxx@mindtree.com", "Myyyyy@mindtree.com"],
					"liked_by": ["Mxxxxx@mindtree.com"],
					"created_at": '',
					"title": 'SA'
				}
                var request, response;
				beforeEach(function (done) {
					mockedblogService = sinon.mock(blogService);
					request = http_mocks.createRequest({
						method: 'GET',
						url: '/all',
						userInfo: loggedInUser,
						params: {
							id: 'blogxyz123'
						},
						query: {
							viewValue: 1
						}
					});
					response = http_mocks.createResponse({
						eventEmitter: require('events').EventEmitter
					});
					done();
				});

				it("number of fields in the response", function (done) {
					mockedblogService.expects('getBlogById').once().withArgs(loggedInUser, 'blogxyz123', 1).returns(
						Promise.resolve(blogMockResponse))

					response.on('end', function () {
						var res = response._getData();
						assert.equal(Object.keys(res.data.blog).length, 9);
						done();
					});
					blogController.blogsById(request, response);
				})

				it(
					"match all fields in the response",
					function (done) {
						mockedblogService.expects('getBlogById').once().withArgs(loggedInUser, 'blogxyz123', 1).returns(
							Promise.resolve(blogMockResponse))

						response.on('end', function () {
							var res = response._getData();
							expect(res.data.blog).to.deep.equal(blogMockResponse)
							done();
						});
						blogController.blogsById(request, response);
					})

				it(
					"match all fields in the response",
					function (done) {
						mockedblogService.expects('getBlogById').once().withArgs(loggedInUser, 'blogxyz123', 1).returns(
							Promise.resolve(blogMockResponse))

						response.on('end', function () {
							var res = response._getData();
							expect(res.data.blog).to.deep.equal(blogMockResponse)
							done();
						});
						blogController.blogsById(request, response);
					})

				it(
					"check response if user is null",
					function (done) {
						var req = http_mocks.createRequest({
							method: 'GET',
							url: '/all',
							userInfo: null,
							params: {
								id: 'blogxyz123'
							},
							query: {
								viewValue: 1
							}
						});
						mockedblogService.expects('getBlogById').once().withArgs(null, 'blogxyz123', 1).returns(
							Promise.reject("could not fetch blogs"))

						response.on('end', function () {
							var res = response._getData();
							expect(res.status.statusCode).to.equal('500');
							done();
						});
						blogController.blogsById(req, response);
					})

				afterEach(function (done) {
					mockedblogService.restore();
					done();
				});

			});

		describe(
			'like the blog',
			function () {
				var mockedBlogService;
                var req, res;
				beforeEach(function (done) {
					mockedBlogService = sinon.mock(blogService);
					req = http_mocks.createRequest({
						params: {
							blogId: 'blogxyz123',
							likeValue: 1
						},
						userInfo: loggedInUser
					});
					res = http_mocks.createResponse({
						eventEmitter: require('events').EventEmitter
					});
					done();
				});

				it("status of the successfull update of like", function (done) {
					var blogId = 'blogxyz123';
					mockedBlogService.expects('updateBlogLikes').once().withArgs(loggedInUser, blogId, 1).returns(
						Promise.resolve());

					res.on('end', function () {
						response = res._getData();
						assert.equal(response.status.statusCode, 200);
						done();
					});
					blogController.likeUnlikeBlog(req, res);
				})

				it("status of the like if user is null", function (done) {
					var req = http_mocks.createRequest({
						params: {
							blogId: 'blogxyz123',
							likeValue: 1
						}
					});
					var blogId = 'blogxyz123';
					mockedBlogService.expects('updateBlogLikes').once().withArgs(undefined, blogId, 1).returns(
						Promise.reject());

					res.on('end', function () {
						response = res._getData();
						assert.equal(response.status.statusCode, 500);
						done();
					});
					blogController.likeUnlikeBlog(req, res);
				})

				afterEach(function (done) {
					mockedBlogService.restore();
					done();
				});

			});

		describe(
			'create Blog Post',
			function () {
				var mockedBlogService;
				var request, response;
				beforeEach(function (done) {
					mockedBlogService = sinon.mock(blogService);
					/**
					 * request to create blog.
					 */
					request = http_mocks.createRequest({
						body: {
							title: 'first blog',
							content: 'first content of the blog',
							status: 'PUBLISHED',
							tags: ['java']
						},
						userInfo: loggedInUser
					});
					response = http_mocks.createResponse({
						eventEmitter: require('events').EventEmitter
					});
                    done();
				});

				it("status of the create blog", function (done) {
					var blogRequest = {
						title: 'first blog',
						content: 'first content of the blog',
						status: 'PUBLISHED',
						tags: ['java']
					}
                    mockedBlogService.expects('createBlog').once().withArgs(loggedInUser, blogRequest).returns(
						Promise.resolve());

					response.on('end', function () {
						res = response._getData();
						assert.equal(res.status.statusCode, 201);
						done();
					});
					blogController.createBlogPost(request, response);
				})

				it("check validation of blog", function (done) {

					var blogRequest = {
						title: 'first blog',
						content: 'first content of the blog',
						tags: ['java']
					}

					var req = http_mocks.createRequest({
						body: blogRequest,
						userInfo: loggedInUser
					});
                    mockedBlogService.expects('createBlog').once().withArgs(loggedInUser, blogRequest).returns(
						Promise.reject());

					response.on('end', function () {
						res = response._getData();
						assert.equal(res.status.statusCode, 500);
						done();
					});
					blogController.createBlogPost(req, response);
				})

				afterEach(function (done) {
					mockedBlogService.restore();
					done();
				});
			});


		describe('post comment for blog', function () {
			var mockedBlogService;
			var request, response;
			beforeEach(function (done) {
				mockedBlogService = sinon.mock(blogService);

				/**
				 * request to create blog.
				 */
				request = http_mocks.createRequest({
					params: {
						blogId: 'blog_xyz'
					},
					body: {
						comment: 'sample comment'
					},
					userInfo: loggedInUser
				});
				response = http_mocks.createResponse({
					eventEmitter: require('events').EventEmitter
				});
				done()

			});

			it('test the commenting on post', function (done) {
				var commentContent = {
					comment: 'sample comment'
				};
				mockedBlogService.expects('addBlogComment').once().withArgs(loggedInUser, 'blog_xyz', commentContent.comment).returns(Promise.resolve());

				response.on('end', function () {
					res = response._getData();
					assert.equal(res.status.statusCode, 201)
					done();
				});
				blogController.postComment(request, response);
			});

			it('test the commenting on post if comment is undefined', function (done) {
				var req = http_mocks.createRequest({
					params: {
						blogId: 'blog_xyz'
					},
					userInfo: loggedInUser
				});
				mockedBlogService.expects('addBlogComment').once().withArgs(loggedInUser, 'blog_xyz', undefined).returns(Promise.reject());

				response.on('end', function () {
					res = response._getData();
					assert.equal(res.status.statusCode, 500)
					done();
				});
				blogController.postComment(req, response);
			});

			afterEach(function (done) {
				mockedBlogService.restore();
				done();
			})
		})

		describe('get blogs for loggedInUser', function () {
			var mockedBlogService;
			var request, response, blogMockResponse;
			beforeEach(function (done) {

				blogMockResponse = {
					"blog_id": 'blogxyz123',
					"content": 'sample',
					"tags": ["java", "dotNet"],
					"comments": [{}, {}],
					"created_by": {},
					"viewed_by": ["Mxxxxx@mindtree.com", "Myyyyy@mindtree.com"],
					"liked_by": ["Mxxxxx@mindtree.com"],
					"created_at": '',
					"title": 'SA'
				}

				mockedBlogService = sinon.mock(blogService);

				/**
				 * request to create blog.
				 */
				request = http_mocks.createRequest({
					userInfo: loggedInUser,
					query: {
						pno: 1,
						psize: 1
					}
				});
				response = http_mocks.createResponse({
					eventEmitter: require('events').EventEmitter
				});
				done()

			});

			it('get blogs for loggedInUser', function (done) {
				mockedBlogService.expects('getBlogsForLoggedInUser').once().withArgs(loggedInUser, 1, 1).returns(Promise.resolve(blogMockResponse));

				response.on('end', function () {
					res = response._getData();
					expect(res.data.blogs).to.deep.equal(blogMockResponse);
					done();
				});
				blogController.getBlogsForLoggedInUser(request, response);
			});

			it('get blogs for loggedInUser', function (done) {
				var req = http_mocks.createRequest({
					userInfo: null,
					query: {
						pno: 1,
						psize: 1
					}
				});
				mockedBlogService.expects('getBlogsForLoggedInUser').once().withArgs(null, 1, 1).returns(Promise.reject());

				response.on('end', function () {
					res = response._getData();
					assert.equal(res.status.statusCode, 404)
					done();
				});
				blogController.getBlogsForLoggedInUser(req, response);
			});

			afterEach(function (done) {
				mockedBlogService.restore();
				done();
			})
		})


		describe('delete comment in blog', function () {
			var mockedBlogService, request, response;
			beforeEach(function (done) {
				request = http_mocks.createRequest({
					userInfo: loggedInUser,
					params: { blogId: 'blog_xyz', commentId: 'comm_xyz' }
				});

				response = http_mocks.createResponse({
					eventEmitter: require('events').EventEmitter
				});

				mockedBlogService = sinon.mock(blogService);
				done();

			})

			it('should return response of 200 for deleting comment in discussion', function (done) {
				var expectedResponse = {
					"data": {},
					"status": { "statusCode": "200", "message": "successfully deleted comment" }
				}
				mockedBlogService.expects('deleteCommentForBlog').once().withArgs(loggedInUser, 'blog_xyz', 'comm_xyz').returns(
					Promise.resolve([]));
				response.on('end', function () {
					var res = response._getData();
					expect(res).to.deep.equal(expectedResponse);
					done();
				});
				blogController.deleteComment(request, response);
			})

			it('should return error response of deleting comment in discussion', function (done) {
				var req = http_mocks.createRequest({
					params: { blogId: 'blog_xyz', commentId: 'comm_xyz' }
				});

				var expectedResponse = {
					"data": {},
					"status": { "statusCode": "500", "message": "could not delete the comment -" + { "err": { "message": "", "stack": "" } } }
				}
				mockedBlogService.expects('deleteCommentForBlog').once().withArgs(undefined, 'blog_xyz', 'comm_xyz').returns(
					Promise.reject({ "err": { "message": "", "stack": "" } }));
				response.on('end', function () {
					var res = response._getData();
					expect(res).to.deep.equal(expectedResponse);
					done();
				});
				blogController.deleteComment(req, response);
			})

			afterEach(function (done) {
				mockedBlogService.restore();
				done();
			})
		});

		describe('delete blog by id', function () {
			var mockedBlogService, request, response;
			beforeEach(function (done) {
				request = http_mocks.createRequest({
					userInfo: loggedInUser,
					params: { "id": 'blog_xyz' }
				});

				response = http_mocks.createResponse({
					eventEmitter: require('events').EventEmitter
				});

				mockedBlogService = sinon.mock(blogService);
				done();

			})

			it('should return response of 204 for deleting blog', function (done) {
				var expectedResponse = {
					"data": {},
					"status": { "statusCode": "204", "message": "blog deleted successfully" }
				}
				mockedBlogService.expects('deleteBlog').once().withArgs(loggedInUser, 'blog_xyz').returns(
					Promise.resolve([]));
				response.on('end', function () {
					var res = response._getData();
					expect(res).to.deep.equal(expectedResponse);
					done();
				});
				blogController.deleteBlog(request, response);
			})

			it('should return error response for deleting blog', function (done) {
				var req = http_mocks.createRequest({
					params: { "id": 'blog_xyz' }
				});

				var expectedResponse = {
					"data": {},
					"status": { "statusCode": "500", "message": "could not delete the blog post" }
				}
				mockedBlogService.expects('deleteBlog').once().withArgs(undefined, 'blog_xyz').returns(
					Promise.reject({ "err": { "message": "", "stack": "" } }));
				response.on('end', function () {
					var res = response._getData();
					expect(res).to.deep.equal(expectedResponse);
					done();
				});
				blogController.deleteBlog(req, response);
			})

			afterEach(function (done) {
				mockedBlogService.restore();
				done();
			})
		});


		describe('edit blog', function () {
			var mockedBlogService, request, response;
			beforeEach(function (done) {
				request = http_mocks.createRequest({
					userInfo: loggedInUser,
					query: { "blogId": 'blog_xyz' },
					body:{content:"blog content"}
				});

				response = http_mocks.createResponse({
					eventEmitter: require('events').EventEmitter
				});

				mockedBlogService = sinon.mock(blogService);
				done();

			})

			it('should return response of 200 for editing blog', function (done) {
				var expectedResponse = {
					"data": {},
					"status": { "statusCode": "200", "message": "edited blog post successfully" }
				}
				mockedBlogService.expects('editBlog').once().withArgs(loggedInUser, {content:"blog content"}, 'blog_xyz').returns(
					Promise.resolve());
				response.on('end', function () {
					var res = response._getData();
					expect(res).to.deep.equal(expectedResponse);
					done();
				});
				blogController.editBlog(request, response);
			})

			it('should return error response for editing blog', function (done) {
				var req = http_mocks.createRequest({
					query: { "blogId": 'blog_xyz' },
					body:{content:"blog content"}
				});

				var expectedResponse = {
					"data": {},
					"status": { "statusCode": "500", "message": "could not edit the blog post "+ { "err": { "message": "", "stack": "" } }}
				}
				mockedBlogService.expects('editBlog').once().withArgs(undefined, {content:"blog content"}, 'blog_xyz').returns(
					Promise.reject({ "err": { "message": "", "stack": "" } }));
				response.on('end', function () {
					var res = response._getData();
					expect(res).to.deep.equal(expectedResponse);
					done();
				});
				blogController.editBlog(req, response);
			})

			afterEach(function (done) {
				mockedBlogService.restore();
				done();
			})
		});

	})


