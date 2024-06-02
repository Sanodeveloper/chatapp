FROM golang:1.22.2

WORKDIR /api

COPY ./back/api .

RUN go mod download
RUN go build

CMD ["./api"]
