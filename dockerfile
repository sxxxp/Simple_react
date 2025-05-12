FROM node:lts-slim
WORKDIR .
COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
RUN npm install
COPY public ./public
COPY src ./src
CMD ["npm", "start", "run"] 
EXPOSE 3000
