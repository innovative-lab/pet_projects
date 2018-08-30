var userMapper = require("./user.mapper");

var messageMapper =  {
    mapMessageToResponse : mapMessageToResponse
}

function mapMessageToResponse(message) {
    var messageResponse = {};
    messageResponse.message_id = message.message_id;
    messageResponse.channel_id = message.channel_id;
    messageResponse.content = message.content;
    messageResponse.created_by = userMapper.userShortMapper(message.created_by);;
    if (message.file) {
        messageResponse.file = {};
        messageResponse.file.name = message.file.name;
        if (message.file.ref != null) {
            var lastIndex = message.file.ref.split("/").length - 1;
            messageResponse.file.ref = message.file.ref.split("/")[lastIndex];
        } else {
            messageResponse.file.ref = null;
        }
    } else {
        messageResponse.file = null;
    }
    messageResponse.created_at = message.created_at;
    return messageResponse;
}

module.exports = messageMapper;