## Dev Stage
FROM node:22-alpine as Dev

# working dir
WORKDIR /app

# copy pack file to container
COPY frontend/package.json ./
RUN npm install

#copy all file to container
COPY frontend/ .

#start app
CMD ["npm", "start"]



## build stage
FROM node:22-alpine as build

# working dir
WORKDIR /app

# copy pack file to container
COPY frontend/package.json ./
RUN npm install

#copy all file to container
COPY frontend/ .

# run build
RUN npm run build



## prod 
FROM nginx:alpine as prod

# working dir
COPY --from=build /app/build /usr/share/nginx/html

## Start nginx

CMD ["nginx", "-g", "daemon off;"]