# syntax=docker/dockerfile:1
FROM golang:1.20

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . ./

RUN apt update && apt -y install wkhtmltopdf

RUN CGO_ENABLED=0 GOOS=linux go build -o /cvhq

EXPOSE 8080

CMD ["/cvhq"]
