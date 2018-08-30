var Response = require("../response.js");

var gramophone = require('gramophone');

var categoryController = {
   extractTagsForContent : extractTagsForContent
}

function extractTagsForContent(req,res) {
	var response = new Response();
	var content = req.body.content;
	var tags = gramophone.extract(content, {ngrams:[1],min:4});
	response.data.tags = tags;
	response.status.statusCode = '200';
	response.status.message = 'extracted tags for content';
	res.send(response);
}

module.exports = categoryController;