FROM node:12.22.10-alpine3.15

# RUN  apk update && apk add --no-cache libtool autoconf automake linux-headers gcc g++ cmake python3 git make

WORKDIR /app
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY tsconfig.json tsconfig.json
COPY tsconfig.build.json tsconfig.build.json
RUN npm ci
COPY src /app/src
RUN npm run build
CMD npm run start
