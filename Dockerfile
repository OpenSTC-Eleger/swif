FROM ubuntu:12.04
MAINTAINER Siclic

# Set some ENV variables
ENV TERM linux
ENV DEBIAN_FRONTEND noninteractive

# Setup nginx and NodeJS repository
RUN echo "deb http://archive.ubuntu.com/ubuntu precise main universe" > /etc/apt/sources.list
RUN apt-get update
RUN apt-get install -y python-software-properties g++ make wget git
RUN echo 'deb http://nginx.org/packages/ubuntu/ precise nginx' > /etc/apt/sources.list.d/nginx.list
RUN wget --quiet --no-check-certificate -O - http://nginx.org/packages/keys/nginx_signing.key | apt-key add -
RUN add-apt-repository ppa:chris-lea/node.js
RUN apt-get update

# Install nginx and NodeJS
RUN apt-get install -y nginx nodejs

# Install grunt
RUN npm install -g grunt-cli

# Prepare app directories
RUN mkdir -p /var/www
RUN mkdir -p /srv/swif
RUN mkdir -p /swif/sites

# Put app sources
ADD fonts /srv/swif/fonts
ADD medias /srv/swif/medias
ADD config /srv/swif/config
ADD grunt /srv/swif/grunt
ADD grunt_docker/Gruntfile.js /srv/swif/Gruntfile.js
ADD properties.json /srv/swif/properties.json
ADD grunt_docker/package.json /srv/swif/package.json
ADD style /srv/swif/style
ADD templates /srv/swif/templates
ADD i18n /srv/swif/i18n
ADD js /srv/swif/js
ADD app-interventions /srv/swif/app-interventions
ADD app-reservations /srv/swif/app-reservations
ADD index.html /srv/swif/index.html
ADD landing_page.html /var/www/index.html

# Grunt compilation
WORKDIR /srv/swif
RUN npm install
RUN grunt

# Nginx config
ADD nginx/ssl /etc/nginx/ssl
ADD nginx/nginx.conf /etc/nginx/nginx.conf
ADD nginx/default.conf /etc/nginx/conf.d/default.conf

# Run script
ADD run /usr/local/bin/run
RUN chmod +x /usr/local/bin/run

EXPOSE 80
EXPOSE 443

CMD /usr/local/bin/run
