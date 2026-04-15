FROM golang:1.26.2-alpine AS build

WORKDIR /app
COPY . .
RUN go build -o gateway

FROM alpine:latest
WORKDIR /app
COPY --from=build /app/gateway .

EXPOSE 8080
ENTRYPOINT ["./gateway"]