

var environments = {};

environments.staging = {
    "httpPort" : 8080,
    "envName":'staging',
    "hashingSecret":"itIsASecret"
}

environments.production = {
    "httpPort" : 5000,
    "envName":'production',
    "hashingSecret":"itIsASecret"
}

var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not default to staging
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;