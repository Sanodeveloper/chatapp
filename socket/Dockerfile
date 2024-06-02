FROM golang:1.22.2

WORKDIR /socket

COPY ./socket/socket .

RUN go mod download
RUN go build

CMD ["./socket"]
