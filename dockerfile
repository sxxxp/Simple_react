FROM node:lts-slim
WORKDIR .
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "start", "run"] 
EXPOSE 3000
