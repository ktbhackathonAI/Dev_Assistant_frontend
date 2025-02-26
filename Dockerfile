# syntax=docker/dockerfile:1.4

### 1️⃣ React 빌드 ###
FROM node:lts AS build

# 작업 디렉토리 설정
WORKDIR /app

# package.json과 package-lock.json을 복사 후 의존성 설치
COPY package.json package-lock.json ./
RUN npm ci

# 전체 소스 코드 복사 후 빌드 실행
COPY . .

# 환경 변수 적용
ARG REACT_APP_API_URL
ARG REACT_APP_ENV
RUN echo "REACT_APP_API_URL=$REACT_APP_API_URL" >> .env
RUN echo "REACT_APP_ENV=$REACT_APP_ENV" >> .env

# React 정적 파일 빌드
RUN npm run build

### 2️⃣ Nginx 설정 및 최종 배포 ###
FROM nginx:alpine

# Nginx 설정 복사
COPY .nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Nginx의 기본 작업 디렉토리 설정
WORKDIR /usr/share/nginx/html

# 기본 Nginx HTML 파일 제거
RUN rm -rf ./*

# React 빌드된 정적 파일 복사
COPY --from=build /app/build .

# Nginx 실행
ENTRYPOINT ["nginx", "-g", "daemon off;"]
