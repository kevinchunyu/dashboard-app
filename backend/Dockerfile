FROM node:21-alpine

# Install Python + build deps + Azure CLI via pip
RUN apk add --no-cache \
      python3 \
      py3-pip \
      libffi \
      openssl \
      curl \
      bash \
    && pip3 install --no-cache-dir azure-cli \
    && apk del py3-pip

# App setup
WORKDIR /app
COPY . .

# Install Node prod dependencies
RUN npm install --omit=dev

# Expose & run
EXPOSE 7777
CMD ["npm", "run", "deploy"]