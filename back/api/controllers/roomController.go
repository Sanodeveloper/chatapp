package controllers

import (
	"api/interfaces"
	"api/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type IRoomController interface {
	SearchRoom(ctx *gin.Context)
	RoomDetail(ctx *gin.Context)
	NeedPass(ctx *gin.Context)
	RoomAuth(ctx *gin.Context)
	CreateRoom(ctx *gin.Context)
	RoomInfo(ctx *gin.Context)
	TalkLog(ctx *gin.Context)
}

type RoomController struct {
	service services.IRoomService
}

func NewRoomController(service services.IRoomService) IRoomController {
	return &RoomController{service: service}
}

func (c *RoomController) SearchRoom(ctx *gin.Context) {
	query := ctx.Query("roomname")
	if query == "" {
		ctx.JSON(http.StatusOK, gin.H{"roominfo": []int{}})
		return
	}
	data, err := c.service.GetRooms(query)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "server error"})
		return
	}

	rooms := make([]interfaces.RoomDetailOutput, 0, len(*data))
	for _, v := range *data {
		rooms = append(rooms, interfaces.RoomDetailOutput{
			Roomname: v.Roomname,
			Roomid: v.Roomid,
			Description: v.Description,
			Needpass: v.Needpass,
			Createdby: v.Createdby,
			Member: v.Member,
			People: v.People,
		})
	}

	ctx.JSON(http.StatusOK, interfaces.RoomSearchOutput{Roominfo: rooms})
}

func (c *RoomController) RoomDetail(ctx *gin.Context) {
	query := ctx.Query("roomid")
	if query == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "cannot get query"})
		return
	}

	intQuery, _ := strconv.Atoi(query)

	newData, err := c.service.GetRoom(intQuery)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error" : "server error"})
		return
	}

	output := interfaces.RoomDetailOutput{
		Roomname: newData.Roomname,
		Roomid: newData.Roomid,
		Description: newData.Description,
		Needpass: newData.Needpass,
		Createdby: newData.Createdby,
		Member: newData.Member,
		People: newData.People,
	}

	ctx.JSON(http.StatusOK, output)
}

func (c *RoomController) NeedPass(ctx *gin.Context) {
	query := ctx.Query("roomid")
	if query == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "cannot get query"})
		return
	}

	intQuery, _ := strconv.Atoi(query)

	needpass, err := c.service.GetNeedPass(intQuery)
	if err != nil || needpass == "" {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "server error"})
		return
	}

	ctx.JSON(http.StatusOK, interfaces.NeedPassOutput{Needpass: needpass})
}

func (c *RoomController) RoomAuth(ctx *gin.Context) {
	var input interfaces.RoomAuthInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error" : "cannot get parameter"})
		return
	}

	intRoomid, _ := strconv.Atoi(input.Roomid)

	auth, err := c.service.RoomAuth(intRoomid, input.Password)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error" : "server error"})
		return
	}

	if !auth {
		ctx.JSON(http.StatusForbidden, interfaces.RoomAuthOutput{Auth: false})
	}

	ctx.JSON(http.StatusOK, interfaces.RoomAuthOutput{Auth: true})
}

func (c *RoomController) CreateRoom(ctx *gin.Context) {
	var input interfaces.CreateRoomInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error" : "cannot get parameter"})
		return
	}

	token, err := ctx.Cookie("sessionid")
	if err != nil {
		ctx.JSON(http.StatusForbidden, gin.H{"error" : "forbidden"})
		return
	}

	roomid, err := c.service.CreateRoom(token, input)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error" : "server error"})
		return
	}

	ctx.JSON(http.StatusCreated, interfaces.CreateRoomOutput{Roomid: roomid})
}

func (c *RoomController) RoomInfo(ctx *gin.Context) {
	query := ctx.Query("roomid")
	if query == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "cannot get query"})
		return
	}

	intQuery, _ := strconv.Atoi(query)

	token, err := ctx.Cookie("sessionid")
	if err != nil {
		token = ""
	}

	userName, room, roomerr := c.service.GetRoomInfo(intQuery, token)
	if roomerr != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "server error"})
		return
	}

	ctx.JSON(http.StatusOK, interfaces.RoomInfoOutput{Username: userName, Roomname: room.Roomname, Member: room.Member})
}

func (c *RoomController) TalkLog(ctx *gin.Context) {
	query := ctx.Query("roomid")
	if query == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "cannot get query"})
		return
	}

	intQuery, _ := strconv.Atoi(query);

	logs, err := c.service.GetAllTalkLog(intQuery);
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "server error"})
		return
	}

	newLogs := make([]interfaces.Logs, 0, len(*logs))
	for _, v := range *logs {
		newLogs = append(newLogs, interfaces.Logs{
			Roomid: v.Roomid,
			Username: v.Username,
			Message: v.Message,
		})
	}

	ctx.JSON(http.StatusOK, interfaces.TalkLogOutput{Logs: newLogs});
}