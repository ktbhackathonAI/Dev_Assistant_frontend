# 1. Node.js에서 React 빌드
FROM node:18 AS build

# 2. 작업 디렉토리 설정
WORKDIR /usr/src/app

# 3. 패키지 설치 및 빌드
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
RUN yarn build

# 4. Nginx를 사용하여 정적 파일 배포
FROM nginx:alpine

# 5. 빌드된 React 파일을 Nginx의 웹 루트로 복사
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# 6. Nginx 실행
CMD ["nginx", "-g", "daemon off;"]