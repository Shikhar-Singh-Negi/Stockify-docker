## Dev Stage
FROM node:22-alpine as Dev

# working dir
WORKDIR /app

# copy pack file to container
COPY backend/package.json ./
RUN npm install

#copy all file to container
COPY backend/ .

CMD ["npx", "nodemon", "server.js"]


# Prod stage
FROM node:22-alpine as prod

# working dir
WORKDIR /app

# copy pack file to container
COPY backend/package.json ./
RUN npm install --production

#copy all file to container
COPY backend/ .

CMD ["node", "server.js"]
