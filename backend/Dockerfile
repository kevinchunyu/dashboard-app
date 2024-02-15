FROM node:21-alpine
WORKDIR /app
COPY . .
RUN npm install --omit=dev
EXPOSE 7777
CMD ["npm", "run", "deploy"]