FROM node
WORKDIR /
RUN mkdir app
WORKDIR /app
COPY . /app/
WORKDIR /app
RUN npm install
