var userService = require('../../services/user.service');
var Response = require("../response.js");
var logger = require("../../../logger.js");
var Promise = require("bluebird");

var userController = {
	/**
	 * add user.
	 */
	addUserInfo : addUser,
	/**
	 * get all the users.
	 */
	getAllUsers : getAllUsers,
	/**
	 * returns the userinfo.
	 */
	getUserInfo : getUserInfo,
    /**
	 * update the email address of user.
	 */
	updateEmail : updateEmail,
    /**
	 * update the profile pics noderef and filename.
	 */
	updateProfilePic : updateProfilePic,
	/**
	 * get the total counts of blogs,discussions and answers for author.
	 */
	getTotalCountsByAuthor : getTotalCountsByAuthor,
    /**
	 * add the followers to user.
	 */
	followUser : followUser,
    /**
	 * get all followers of a user.
	 */
	getMyFollowingUsers : getMyFollowingUsers,
	 /**
	 * get the most followed user.
	 */
	getMostFollowedUsers:getMostFollowedUsers
}

function getMostFollowedUsers(req, res) {
	var response = new Response();
	var pageSize = req.query.psize;
	userService.getMostFollowedUsers(pageSize).then(function (users) {
		response.data.users = users;
		response.status.statusCode = '200';
		response.status.message = 'retrieved most followed users';
		res.status(200).send(response);
	}).then(undefined, function (err) {
		response.status.statusCode = '500';
		response.status.message = 'could not retrieve most followed users';
		res.status(500).send(response);
	})
}

/**
 * add user details.
 */
function addUser(req, res) {
	var response = new Response();
	userService.createUser(req.body).then(function (user) {
		response.data.user = user;
		response.status.statusCode = '200';
		response.status.message = 'created the user';
		res.status(200).send(response);
	}).then(undefined, function (err) {
		response.status.statusCode = '500';
		response.status.message = 'could not create user';
		res.status(500).send(response);
	})
}

function getAllUsers(req, res) {
	var response = new Response();
	userService.getAllUsers().then(function (users) {
		response.data.users = users;
		response.status.statusCode = '200';
		response.status.message = 'fetching all users';
		res.status(200).send(response);
	}).then(undefined, function (err) {
		response.status.statusCode = '404';
		response.status.message = 'unable to fetch users';
		res.status(200).send(response);
	})
}

function getUserInfo(req, res) {
	var response = new Response();
	var user = req.userInfo;
	var username;
	if (req.query.username == null) {
		username = user.user_name;
	} else {
		username = req.query.username;
	}
	userService.getUserByUsername(username).then(function (user) {
		response.data.user = user;
		response.status.message = 'getting the user info';
		response.status.statuCode = '200';
		res.status(200).send(response);
	}).then(undefined, function () {
		response.status.message = "no user found";
		response.status.statuCode = "404";
		res.status(404).send(response);
	})
}


function updateEmail(req, res) {
	var response = new Response();
	var user = req.userInfo;
	var userEmail = req.body.email;
	return userService.updateEmail(user, userEmail).
		then(function (data) {
			response.status.statusCode = '201';
			response.status.message = 'updated user successfully';
			res.status(201).send(response);
		}).then(undefined, function (err) {
			logger.error("could not update the user", err);
			response.status.statusCode = '500';
			response.status.message = 'could not update the user';
			res.status(500).send(response);
		})
}

function updateProfilePic(req, res) {
	var response = new Response();
	var user = req.userInfo;
	var profilePicFileName = req.body.profile_pic_filename;
	var profilePicNodeRef = req.body.profile_pic_noderef;
	if (profilePicFileName != undefined && profilePicNodeRef != undefined) {
		userService.updateProfilePic(user, profilePicFileName, profilePicNodeRef).then(function (data) {
			response.status.statusCode = '201';
			response.status.message = 'updated user picture successfully';
			res.status(201).send(response);
		}).catch(function (err) {
			logger.error("could not update the user", err.message);
			response.status.statusCode = '500';
			response.status.message = 'could not update the profile pic';
			res.status(500).send(response);
		})
	} else {
		response.status.statusCode = '400';
		response.status.message = 'profile pic filename and noderef are undefined';
		res.status(400).send(response);
	}

}

function getTotalCountsByAuthor(req, res) {
	var response = new Response();
	var user = req.userInfo;
	var username = req.query.username;

	if (!username) {
		username = user.user_name;
	}
	userService.getTotalCountsByUser(username).then(function (counts) {
		response.data = counts;
		response.status.statusCode = '200';
		response.status.message = 'fetched the TotalCount';
		res.status(200).send(response);
	}).catch(function (err) {
        logger.error("could not get the total counts of author", err);
		response.status.statusCode = '404';
		response.status.message = 'could not get the TotalCounts';
		res.status(404).send(response);
	})
}

function followUser(req, res) {
    var response = new Response();
	var user = req.userInfo;
	var followerUserName = req.params.username;
	var followValue = req.params.followValue;
	userService.followUser(user, followerUserName, followValue).then(function (counts) {
		response.status.statusCode = '200';
		response.status.message = 'added users to followings list';
		res.status(200).send(response);
	}).catch(function (err) {
        logger.error("could not follow the user", err);
		response.status.statusCode = '500';
		response.status.message = 'could not follow user';
		res.status(500).send(response);
	})
}

function getMyFollowingUsers(req, res) {
	var response = new Response();
	var user = req.userInfo;
	userService.getMyFollowingUsers(user).then(function (users) {
		response.data.followedUsers = users;
		response.status.statusCode = '200';
		response.status.message = 'fetch the followings list';
		res.status(200).send(response);
	}).catch(function (err) {
        logger.error("could not get following list", err);
		response.status.statusCode = '404';
		response.status.message = 'could not get the followings list';
		res.status(404).send(response);
	})

}



module.exports = userController;
