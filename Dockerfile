FROM golang:1.21-alpine AS go-env
WORKDIR /usr/src/app/go-ssh/
COPY . ./
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o app .

FROM node:16-alpine AS node-env
WORKDIR /usr/src/app/go-app/
COPY frontend ./frontend
RUN cd frontend && npm install && npm run build

FROM scratch
WORKDIR /root/
COPY --from=go-env /usr/src/app/go-ssh/app ./
COPY --from=node-env /usr/src/app/go-app/frontend/build ./frontend
EXPOSE 9000/tcp
ENTRYPOINT ["./app"]
