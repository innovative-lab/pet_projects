#MongoDB

####Export

    mongodump --db collaboration_platform_local --host dev-coe-cp.cloudapp.net:51017 --username root --password Welcome123 --authenticationDatabase admin --out collaboration_platform_local

####Import(not tested)

    mongorestore --db collaboration_platform_local --host dev-coe-cp.cloudapp.net:51017 --username root --password Welcome123 --authenticationDatabase admin D:\MongoDB\Server\3.2\bin\collaboration_platform_local\collaboration_platform_local


#ElasticSearch

####Export

    es-export-mappings --url dev-coe-cp.cloudapp.net:51002 --file mappings.json

    es-export-bulk --url dev-coe-cp.cloudapp.net:51002 --file bulk.json

    es-export-settings --url dev-coe-cp.cloudapp.net:51002 --file settings.json

    es-export-aliases --url dev-coe-cp.cloudapp.net:51002 --file aliases.json

####Import(not tested)

    es-import-mappings --url dev-coe-cp.cloudapp.net:51002 --file mappings.json

    es-import-bulk --url dev-coe-cp.cloudapp.net:51002 --file bulk.json

    es-import-settings --url dev-coe-cp.cloudapp.net:51002 --file settings.json

    es-import-aliases --url dev-coe-cp.cloudapp.net:51002 --file aliases.json
