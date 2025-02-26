# 1. Node.js에서 React 빌드
FROM node:18 AS build

# 2. 작업 디렉토리 설정
WORKDIR /usr/src/app

# 3. package.json 복사
COPY package.json ./

# 4. yarn.lock 파일이 있을 경우만 복사
# COPY yarn.lock ./ || true

# 5. 패키지 설치
RUN yarn install --frozen-lockfile

# 6. 전체 소스 코드 복사 후 빌드 실행
COPY . .
RUN yarn build

# 7. Nginx를 사용하여 정적 파일 배포
FROM nginx:alpine

# 8. 빌드된 React 파일을 Nginx의 웹 루트로 복사
COPY --from=build /usr/src/app/build /usr/share/nginx/html

# 9. Nginx 실행
CMD ["nginx", "-g", "daemon off;"]