var idGenerator =  {
	generateRandomId : generateId
}

function generateId(stringLength){
	var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
    var randomString = '';
    for (var i = 0; i < stringLength; i++) {
         var rnum = Math.floor(Math.random() * chars.length);
         randomString += chars.substring(rnum, rnum + 1);
    }
    return randomString;
}

module.exports = idGenerator;