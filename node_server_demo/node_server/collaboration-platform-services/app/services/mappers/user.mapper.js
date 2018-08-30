var userMapper = {
    userDetailsMapper : userDetailsMapper,
    userShortMapper : userShortMapper
}

function userDetailsMapper(user) {
    var userResponse = {};
    userResponse.user_name = user.user_name;
    userResponse.profile_pic_file = {
        ref: user.profile_pic_file.ref,
        name: user.profile_pic_file.name
    };
    userResponse.full_name = user.full_name;
    userResponse.email = user.email;
    userResponse.last_name = user.last_name;
    userResponse.first_name = user.first_name;
    userResponse.employee_id = user.employee_id;
    userResponse.subscribed_streams = user.subscribed_streams;
    userResponse.followings = user.followings;
    userResponse._id = user._id;
    return userResponse;
}

function userShortMapper(user) {
    var userResponse = {};
    userResponse.user_name = user.user_name;
    userResponse.profile_pic_file = {
        ref: user.profile_pic_file.ref,
        name: user.profile_pic_file.name
    };
    userResponse.last_name = user.last_name;
    userResponse.first_name = user.first_name;
    return userResponse;
}

module.exports = userMapper;