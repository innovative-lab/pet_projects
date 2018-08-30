var fs = require('fs');
var swaggerFileName = '../public/swagger-ui/data/swagger.json';
var swaggerJsonFile = require(swaggerFileName);
var logger = require('../logger.js');


var env = 'LOCAL';
var props = {
    LOCAL: {
        app: {
            port: 9000
        },
        db: {
            host: 'dev-coe-cp.cloudapp.net',
            port: 51017,
            dbName: 'collaboration_platform_local',
            userName: 'root',
            password:'Welcome123',
            authenticationDB:'admin'
        },
        es: {
            host: 'dev-coe-cp.cloudapp.net',
            port: 51002,
            index: 'collaboration-platform_local',
            userType: 'users',
            blogType: 'blogs',
            discussionType: 'discussions',
            answerType: 'answers',
            streamType: 'streams',
            postType: 'posts'
        },
        logs: {
            location: 'logs'
        },
        swagger: {
            protocol: 'http',
            host: 'localhost',
            port: 9000
        },
        alfresco: {
            uploadUrl: 'http://dev-coe-cp.cloudapp.net:51005/alfresco/s/collab-services/upload?alf_ticket=',
            loginUrl: 'http://dev-coe-cp.cloudapp.net:51005/alfresco/service/api/login',
            fileDownloadUrl: 'http://dev-coe-cp.cloudapp.net:51005/alfresco/service/api/node/content/workspace/SpacesStore/noderef?a=true&alf_ticket='
        },
        redis: {
            host: 'dev-coe-cp.cloudapp.net',
            port: 51078,
            password:'Welcome123'
        }
    },
    DEV: {
        app: {
            port: process.env.CP_SERV_PORT || 9000
        },
        db: {
            host: process.env.CP_DB_HOST || 'dev-coe-cp.cloudapp.net',
            port: process.env.CP_DB_PORT || 51017,
            dbName: 'collaboration_platform',
            userName: 'root',
            password:'Welcome123',
            authenticationDB:'admin'
        },
        es: {
            host: process.env.CP_ES_HOST || 'dev-coe-cp.cloudapp.net',
            port: process.env.CP_ES_PORT || 51002,
            index: 'collaboration-platform',
            userType: 'users',
            blogType: 'blogs',
            discussionType: 'discussions',
            answerType: 'answers',
            streamType: 'streams',
            postType: 'posts'
        },
        logs: {
            location: 'logs'
        },
        swagger: {
            protocol: 'https',
            host: 'dev-coe-cp.cloudapp.net',
            port: 443
        },
        alfresco: {
            uploadUrl: 'https://dev-coe-cp.cloudapp.net/alfresco/s/collab-services/upload?alf_ticket=',
            loginUrl: 'http://dev-coe-cp.cloudapp.net:51005/alfresco/service/api/login',
            fileDownloadUrl: 'http://dev-coe-cp.cloudapp.net:51005/alfresco/service/api/node/content/workspace/SpacesStore/noderef?a=true&alf_ticket='
        },
        redis: {
            host: process.env.CP_RDS_HOST || 'dev-coe-cp.cloudapp.net',
            port: process.env.CP_RDS_PORT || 51079,
            password:'Welcome123'
        }
    },
    PROD: {
        app: {
            port: process.env.CP_SERV_PORT || 9000
        },
        db: {
            host: process.env.CP_DB_HOST || 'dev-coe-cp.cloudapp.net',
            port: process.env.CP_DB_PORT || 51017,
            dbName: 'collaboration_platform',
            userName: 'root',
            password:'Welcome123',
            authenticationDB:'admin'
        },
        es: {
            host: process.env.CP_ES_HOST || 'dev-coe-cp.cloudapp.net',
            port: process.env.CP_ES_PORT || 51002,
            index: 'collaboration-platform',
            userType: 'users',
            blogType: 'blogs',
            discussionType: 'discussions',
            answerType: 'answers',
            streamType: 'streams',
            postType: 'posts'
        },
        logs: {
            location: 'logs'
        },
        swagger: {
            protocol: 'https',
            host: 'dev-coe-cp.cloudapp.net',
            port: 443
        },
        alfresco: {
            uploadUrl: 'https://dev-coe-cp.cloudapp.net/alfresco/s/collab-services/upload?alf_ticket=',
            loginUrl: 'http://dev-coe-cp.cloudapp.net:51005/alfresco/service/api/login',
            fileDownloadUrl: 'http://dev-coe-cp.cloudapp.net:51005/alfresco/service/api/node/content/workspace/SpacesStore/noderef?a=true&alf_ticket='
        },
        redis: {
            host: process.env.CP_RDS_HOST || 'dev-coe-cp.cloudapp.net',
            port: process.env.CP_RDS_PORT || 51079,
            password:'Welcome123'
        }
    }
};

var getprops = function () {
    return props[env];
}

var changeSwaggerConfigurations = function () {
    if (swaggerJsonFile.host != (getprops().swagger.host + ":" + getprops().swagger.port || swaggerJsonFile.schemes[0] != getprops().swagger.protocol)) {
        swaggerJsonFile.host = getprops().swagger.host + ":" + getprops().swagger.port;
        swaggerJsonFile.schemes = [];
        swaggerJsonFile.schemes.push(getprops().swagger.protocol);

        fs.writeFile(swaggerFileName, JSON.stringify(swaggerJsonFile, null, 2), function (err) {
            if (err) return console.log(err);
            console.log("Changed swagger json file for ", env, " environment");
        });
    }
};

var setEnv = function (newEnv) {
    if (props[newEnv]) {
        env = newEnv;
    }
    logger.info("Setting up properties for ", env, " environment");
    changeSwaggerConfigurations();
};

module.exports = {
    props: getprops,
    setEnv: setEnv
};
