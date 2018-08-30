## Introduction
This page explains docker images and commands to setup Collaboration Platform.

## MongoDB
Pull the image
`Docker pull mongo:3.3.11`

Start the container
`docker run -d -p 27017:27017 --name cp-mongo -v /opt/cp-docker-data/mongo:/data/db mongo:3.3.11`
MongoDB Server can be accessed through port 27017.

## Elasticsearch
Pull the image
`Docker pull elasticsearch:2.3`

Start the container
`docker run -d -p 9200:9200 -p 9300:9300 --name cp-es -v /opt/cp-docker-data/es:/usr/share/elasticsearch/data elasticsearch`
Elasticsearch server can be accessed through porta 9200 and 9300.

## Redis
Pull the image
`Docker pull redis:3.2`

Start the container
`docker run -d -p 6379:6379 --name cp-redis -v /opt/cp-docker-data/redis:/data redis`
Redis Server can be accessed through port 6379.

## Alfresco
Build image from Dockerfile
Go into alfresco directory
`cd alfresco`
`docker build -t cp-alfresco-image .`

Start the container
`docker run -p 8080:8080 --name cp-alfresco -v /opt/cp-docker-data/alfresco:/opt/alfresco/alf_data cp-alfresco`