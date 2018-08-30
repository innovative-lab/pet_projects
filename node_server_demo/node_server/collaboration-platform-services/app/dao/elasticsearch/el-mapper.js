var logger = require('../../../logger.js');

/**
 * this is responsible for indexing the required fields in the elastic search.
 */
var elMapper = {
	/**
	 * maps the blog fields to be indexed
	 */
	mapBlogFieldsToBeIndexed: mapBlogFieldsToBeIndexed,
	/**
	 * maps the discussion fields to be indexed
	 */
	mapDiscussionFieldsToBeIndexed: mapDiscussionFieldsToBeIndexed,
	/**
	 * maps the user fields to be indexed
	 */
	mapUserFieldsToBeIndexed: mapUserFieldsToBeIndexed,
	/**
	 * maps the answer fields to be indexed.
	 */
    mapAnswerFieldsToBeIndexed: mapAnswerFieldsToBeIndexed,
	/**
	 * maps the category fields to be indexed.
	 */
	//mapCategoryFieldsToBeIndexed : mapCategoryFieldsToBeIndexed,
	/**
	 * maps the post fields to be indexed.
	 */
	mapPostFieldsToBeIndexed: mapPostFieldsToBeIndexed,
	/**
	 * Maps the fields to be indexed in elasticsearch
	 */
	mapStreamFieldsToBeIndexed: mapStreamFieldsToBeIndexed
};


function mapBlogFieldsToBeIndexed(blog, created_by) {
	var result = { created_by: {} };
	result.title = blog.title;
	result.blog_id = blog.blog_id;
	result.tags = blog.tags;
	result.created_at = blog.created_at;
	result.created_by.user_name = created_by.user_name;
	result.created_by.first_name = created_by.first_name;
	result.created_by.last_name = created_by.last_name;
	return result;
}


function mapDiscussionFieldsToBeIndexed(discussion, created_by) {
	var result = { created_by: {} };
	result.title = discussion.title;
	result.discussion_id = discussion.discussion_id;
	result.tags = discussion.tags;
	result.created_at = discussion.created_at;
	result.created_by.user_name = created_by.user_name;
	result.created_by.first_name = created_by.first_name;
	result.created_by.last_name = created_by.last_name;
	return result;
}

function mapAnswerFieldsToBeIndexed(answer, discussion, created_by) {
	var result = { created_by: {}, discussion: {} };
	result.created_at = answer.created_at;
	result.tags = answer.tags;
	result.content = answer.content;
	result.answer_id = answer.answer_id;
	result.created_by.user_name = created_by.user_name;
	result.created_by.first_name = created_by.first_name;
	result.created_by.last_name = created_by.last_name;
	result.discussion.title = discussion.title;
	result.discussion.discussion_id = discussion.discussion_id;
	return result;
}

function mapUserFieldsToBeIndexed(user) {
	var result = {};
	result.user_name = user.user_name;
	result.first_name = user.first_name;
	result.last_name = user.last_name;
	result.employee_id = user.employee_id;
	result.full_name = user.full_name;
	result.profile_pic_file = {
		name: user.profile_pic_file.name,
		ref: user.profile_pic_file.ref
	};
	result.email = user.email;
	return result;
}

/*function mapCategoryFieldsToBeIndexed(category) {
    return new Promise(function (resolve, reject) {
        var category = {};
		category.category = doc.o.category;
		category.tags = doc.o.tags;
		category._id = doc.o._id.toString();
		result = category;
		resolve(result);
	})
}*/

function mapPostFieldsToBeIndexed(post, created_by) {
	var result = { created_by: {}, file: null };
	result.post_id = post.post_id;
	result.content = post.content;
	result.created_at = post.created_at;
	result.created_by.user_name = created_by.user_name;
	result.created_by.first_name = created_by.first_name;
	result.created_by.last_name = created_by.last_name;
	result.tags = post.tags;
	result.file = post.file;
	return result;
}

function mapStreamFieldsToBeIndexed(stream) {
	var result = {};
	result.name = stream.name;
	return result;
}

module.exports = elMapper;
