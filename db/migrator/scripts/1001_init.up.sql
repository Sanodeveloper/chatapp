CREATE TABLE users (
    `name` varchar(20) PRIMARY KEY,
    `email` varchar(100) NOT NULL,
    `password` varchar(100) NOT NULL
);

CREATE TABLE rooms (
    `roomid` bigint PRIMARY KEY,
    `roomname` varchar(20) NOT NULL,
    `description` text,
    `needpass` varchar(3) NOT NULL,
    `createdby` varchar(20) NOT NULL,
    `people` int NOT NULL
);

CREATE TABLE room_member (
    `id` bigint PRIMARY KEY AUTO_INCREMENT,
    `member` varchar(20) NOT NULL,
    `roomid` bigint NOT NULL
);

CREATE TABLE room_password (
    `roomid` bigint PRIMARY KEY,
    `roompassword` varchar(100) NOT NULL
);

CREATE TABLE talk_log (
    `id` bigint PRIMARY KEY AUTO_INCREMENT,
    `roomid` bigint NOT NULL,
    `username` varchar(20) NOT NULL,
    `message` text NOT NULL
);

CREATE TABLE session_info (
    `name` varchar(20) PRIMARY KEY,
    `token` varchar(100) NOT NULL
);