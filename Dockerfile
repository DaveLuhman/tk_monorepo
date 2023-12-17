FROM node:21-alpine as base
WORKDIR /src
COPY . /
#TODO replace hard coded port number with ENV variable
EXPOSE 3000
ENV NODE_ENV=PRODUCTION
RUN npm install -g npm@latest
RUN npm install
RUN npm run build:css
CMD ["npm", "start"]