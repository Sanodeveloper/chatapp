package main

import (
	"api/controllers"
	"api/dbConnection"
	"api/middlewares"
	"api/repositories"
	"api/services"
	"fmt"
	"log"
	"os"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load()
	if err != nil {
		fmt.Println(err.Error())
	}

	db := dbconnection.SetupDB()

	authRepository := repositories.NewAuthRepository(db)
	authService := services.NewAuthService(authRepository)
	authController := controllers.NewAuthController(authService)

	roomRepository := repositories.NewRoomRepository(db)
	roomService := services.NewRoomService(roomRepository)
	roomController := controllers.NewRoomController(roomService)

	router := gin.Default()

	path := os.Getenv("HOST_PATH")

	if path == "" {
		path = "http://localhost:3000"
	}

	router.Use(middlewares.GinMiddleware(path))


	router.GET("/api/session", authController.Session)
	router.POST("/api/login", authController.Login)
	router.POST("/api/signup", authController.Signup)


	router.GET("/api/room/detail", roomController.RoomDetail)
	router.GET("/api/room/need", roomController.NeedPass)
	router.GET("/api/room/search", roomController.SearchRoom)
	router.GET("/api/room/info", roomController.RoomInfo)
	router.GET("/api/room/talklog", roomController.TalkLog)
	router.POST("/api/room/auth", roomController.RoomAuth)
	router.POST("/api/room/create", roomController.CreateRoom)

	if err := router.Run(); err != nil {
		log.Fatal("failed run app: ", err)
	} else {
		log.Println("Server start !!")
	}

}