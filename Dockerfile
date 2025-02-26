# syntax=docker/dockerfile:1.4

### 1️⃣ React 빌드 ###
FROM node:lts AS build

# 작업 디렉토리 설정
WORKDIR /app

# 환경 변수 전달 (GitHub Actions에서 넘긴 값 적용)
ARG REACT_APP_API_URL
ARG REACT_APP_ENV

# package.json과 package-lock.json을 복사 후 의존성 설치
COPY package.json package-lock.json ./
RUN npm ci

# 전체 소스 코드 복사 후 빌드 실행
COPY . .

# 환경 변수를 빌드 시 적용
RUN echo "REACT_APP_API_URL=$REACT_APP_API_URL" >> .env
RUN echo "REACT_APP_ENV=$REACT_APP_ENV" >> .env
RUN npm run build

# CI 환경 변수 설정
ENV CI=true
ENV PORT=3000


### 2️⃣ Nginx 설정 및 최종 배포 ###
FROM nginx:alpine

# Nginx 설정 복사
COPY --from=build /app/.nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Nginx의 기본 작업 디렉토리 설정
WORKDIR /usr/share/nginx/html

# 기본 Nginx HTML 파일 제거
RUN rm -rf ./*

# React 빌드된 정적 파일 복사
COPY --from=build /app/build .

# Nginx 실행
ENTRYPOINT ["nginx", "-g", "daemon off;"]
