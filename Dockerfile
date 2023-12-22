FROM node:20 as base
WORKDIR /
COPY . /
#TODO replace hard coded port number with ENV variable
EXPOSE 3000
ENV NODE_ENV=PRODUCTION
RUN npm install
RUN npm run build:css
CMD ["npm", "start"]