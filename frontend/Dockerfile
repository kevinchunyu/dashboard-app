# Build stage
FROM node:21-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build


FROM nginx:1.19-alpine AS server
COPY --from=build ./app/build /usr/share/nginx/html