FROM node:latest
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev libkrb5-dev
RUN mkdir /myapp
WORKDIR /myapp
ADD /myapp /myapp
RUN npm install
RUN apt-get update
RUN apt-get install mc -y
RUN npm i -g nodemon
