package controllers

import (
	"socket/models"
	"gorm.io/gorm"
)

type IRoomController interface {
	LeaveRoom(roomid int, name string) error
	DecrementMember(roomid int) error
	AddTalkLog(roomid int, message string, name string) error
}

type RoomController struct {
	db *gorm.DB
}

func NewRoomController(db *gorm.DB) IRoomController {
	return &RoomController{db: db}
}

func (c *RoomController) LeaveRoom(roomid int, name string) error {
	if name != "ゲスト" {
		result := c.db.Table("room_member").Delete(&models.RoomMember{}, "roomid = ? and member = ?", roomid, name)
		if result.Error != nil {
			return result.Error
		}
	}
	return nil
}

func (c *RoomController) DecrementMember(roomid int) error {
	var room models.Rooms
	result := c.db.Table("rooms").First(&room, "roomid = ?", roomid)
	if result.Error != nil {
		return result.Error
	}

	room.People -= 1

	if room.People == 0 {
		result = c.db.Table("rooms").Delete(&models.Rooms{}, "roomid = ?", roomid)
		if result.Error != nil {
			return result.Error
		}

		if room.Needpass == "yes" {
			result = c.db.Table("room_password").Delete(&models.RoomPassword{}, "roomid = ?", roomid)
			if result.Error != nil {
				return result.Error
			}
		}

		result := c.db.Table("talk_log").Delete(&models.TalkLog{}, "roomid = ?", roomid)
		if result.Error != nil {
			return result.Error
		}
	} else {
		result = c.db.Table("rooms").Where("roomid = ?", roomid).Update("people", room.People)
		if result.Error != nil {
			return result.Error
		}
	}

	return nil
}

func (c *RoomController) AddTalkLog(roomid int, message string, name string) error {
	result := c.db.Table("talk_log").Create(&models.TalkLog{Roomid: roomid, Message: message, Username: name})
	if result.Error != nil {
		return result.Error
	}
	return nil
}
