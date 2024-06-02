package main

import (
	"encoding/json"
	"fmt"
	"log"
	"socket/controllers"
	dbconnection "socket/dbConnection"
	"socket/middlewares"
	"strconv"
	"github.com/joho/godotenv"
	"github.com/gin-gonic/gin"

	socket "github.com/googollee/go-socket.io"
)

type Message struct {
	Username string `json:"username" binding:"required"`
	Message string `json:"message" binding:"required"`
	Roomid string `json:"roomid" binding:"required"`
}

type Room struct {
	Roomid string `json:"roomid"`
}

type DisConnInfo struct {
	Username string `json:"username" binding:"required"`
	Roomid string `json:"roomid" binding:"required"`
}

func main() {
	err := godotenv.Load()
	if err != nil {
		fmt.Println(err.Error())
	}

	db := dbconnection.SetupDB()
	controller := controllers.NewRoomController(db)

	server := socket.NewServer(nil)
	server.OnConnect("/", func(s socket.Conn) error {
		s.SetContext("")
		log.Println("Connected:", s.ID())
		return nil
	})

	server.OnEvent("/", "joinRoom", func (s socket.Conn, room string) {
		var roomid Room
		json.Unmarshal([]byte(room), &roomid)
		s.Join(roomid.Roomid)
		fmt.Println(server.Rooms("/"))
	})

	server.OnEvent("/", "chatToServer", func (s socket.Conn, msg string) {
		var data Message
		json.Unmarshal([]byte(msg), &data)
		fmt.Println("data: ", data)

		intId, _ := strconv.Atoi(data.Roomid)

		controller.AddTalkLog(intId, data.Message, data.Username)

		newData := &Message{Username: data.Username, Message: data.Message, Roomid: data.Roomid}
		jsonData, _ := json.Marshal(newData)
		server.BroadcastToRoom("/", data.Roomid, "chatToClient", string(jsonData))
	})

	server.OnEvent("/", "closeConnection", func (s socket.Conn, room string) error {
		var disconninfo DisConnInfo
		json.Unmarshal([]byte(room), &disconninfo)
		s.Leave(disconninfo.Roomid)
		fmt.Println(server.Rooms("/"))
		intId, _ := strconv.Atoi(disconninfo.Roomid)
		controller.LeaveRoom(intId, disconninfo.Username)
		controller.DecrementMember(intId)
		fmt.Println("Disconnection!!")
		s.Close()
		return nil
	})

	server.OnDisconnect("/", func(s socket.Conn, reason string) {
		fmt.Println("closed", reason)
	})

	go func() {
		if err := server.Serve(); err != nil {
			log.Fatalf("socketio listen error: %s\n", err)
		}
	}()
	defer server.Close()

	router := gin.Default()

	router.Use(middlewares.GinMiddleware("http://localhost:3000"))
	router.GET("/socket.io/*any", gin.WrapH(server))
	router.POST("/socket.io/*any", gin.WrapH(server))

	if err := router.Run(":8000"); err != nil {
		log.Fatal("failed run app: ", err)
	} else {
		log.Println("Server start !!")
	}

}