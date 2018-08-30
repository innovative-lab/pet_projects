var corsFilter = function(router) {
    router.use('/collab-services/*', function(request, response, next) {
        response.set({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
            'Access-Control-Max-Age': '3600',
            'Access-Control-Allow-Headers': 'Origin,X-Requested-With,Content-Type,Accept,Authorization'
        });

        if (request.method === 'OPTIONS') {
            response.status(200).send();
        } else {
            next(); // call next() here to move on to next middleware/router
        }
    });
}

module.exports = corsFilter;
