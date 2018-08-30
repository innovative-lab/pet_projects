FROM pdubois/docker-alfresco

COPY olympus-alfresco-extensions.amp /opt/alfresco/amps/
RUN /opt/alfresco/java/bin/java -jar /opt/alfresco/bin/alfresco-mmt.jar install /opt/alfresco/amps/olympus-alfresco-extensions.amp /opt/alfresco/tomcat/webapps/alfresco.war –verbose
RUN /opt/alfresco/java/bin/java -jar  /opt/alfresco/bin/alfresco-mmt.jar install  /opt/alfresco/amps/olympus-alfresco-extensions.amp  /opt/alfresco/tomcat/webapps/share.war -verbose