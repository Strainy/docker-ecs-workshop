FROM node:7

# use changes to package.json to force Docker not to use the cache
# when we change our application's nodejs dependencies:
COPY package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /app && cp -a /tmp/node_modules /app/

# copy source code into app folder to trigger re-builds where code
# changes occur
COPY . /app
WORKDIR /app

CMD ["node", "index.js"]
