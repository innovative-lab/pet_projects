var userMapper = require("./user.mapper");

var channelMapper =  {
    mapChannelToResponse : mapChannelToResponse
}

function mapChannelToResponse(channel) {
    var channelResponse = {};
    channelResponse.channel_id = channel.channel_id;
    channelResponse.channel_name = channel.channel_name;
    channelResponse.members = channel.members.map(function (member) {
        return userMapper.userShortMapper(member.user);
    })
    return channelResponse;
}

module.exports = channelMapper;