# 1단계: React 앱 빌드
FROM node:lts as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2단계: 정적 파일 nginx로 서비스
FROM nginx:alpine

# React 빌드된 결과를 nginx에 복사
COPY --from=build /app/build /usr/share/nginx/html

# nginx 포트 개방
EXPOSE 80

# nginx 기본 명령어 실행
CMD ["nginx", "-g", "daemon off;"]
