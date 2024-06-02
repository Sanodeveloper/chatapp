package repositories

import (
	"api/models"
	"fmt"

	"gorm.io/gorm"
)


type IRoomRepository interface {
	GetRooms(roomname string) (*[]models.Room, error)
	GetRoom(roomid int) (*models.Room, error)
	UpdateRoom(room models.Room, name string) (*models.Room, error)
	GetNeedPass(roomid int) (string, error)
	GetPassword(roomid int) (string, error)
	GetNameFromSession(token string) (string, error)
	AddRoom(room models.Room) error
	AddRoomPassword(roomid int, password string) error
	GetAllTalkLog(roomid int) (*[]models.TalkLog, error)
}

type RoomRepository struct {
	db *gorm.DB
}

func NewRoomRepository(db *gorm.DB) IRoomRepository {
	return &RoomRepository{db: db}
}

func (r *RoomRepository) GetRooms(roomname string) (*[]models.Room, error) {
	var rooms []models.Rooms
	result := r.db.Table("rooms").Find(&rooms, "roomname LIKE ?", fmt.Sprintf("%%%s%%", roomname))
	if result.Error != nil {
		return nil, result.Error
	}

	var newRooms []models.Room

	for _, room :=  range rooms {
		var roomMember []models.RoomMember
		roomresult := r.db.Table("room_member").Find(&roomMember, "roomid = ?", room.Roomid)
		if roomresult.Error != nil {
			return nil, roomresult.Error
		}

		newRoom := models.Room{
			Roomname: room.Roomname,
			Roomid: room.Roomid,
			Description: room.Description,
			Needpass: room.Needpass,
			Createdby: room.Createdby,
			Member: []string{},
			People: room.People,
		}

		for _, member := range roomMember {
			newRoom.Member = append(newRoom.Member, member.Member)
		}

		newRooms = append(newRooms, newRoom)
	}

	return &newRooms, nil
}

func (r *RoomRepository) GetRoom(roomid int) (*models.Room, error) {
	var room models.Rooms
	result := r.db.Table("rooms").First(&room, "roomid = ?", roomid)
	if result.Error != nil {
		return nil, result.Error
	}

	var roomMember []models.RoomMember
	roomresult := r.db.Table("room_member").Find(&roomMember, "roomid = ?", room.Roomid)
	if roomresult.Error != nil {
		return nil, roomresult.Error
	}

	newRoom := models.Room{
		Roomname: room.Roomname,
		Roomid: room.Roomid,
		Description: room.Description,
		Needpass: room.Needpass,
		Createdby: room.Createdby,
		Member: []string{},
		People: room.People,
	}

	for _, member := range roomMember {
		newRoom.Member = append(newRoom.Member, member.Member)
	}

	return &newRoom, nil
}

func (r *RoomRepository) GetNeedPass(roomid int) (string, error) {
	var room models.Rooms
	result := r.db.Table("rooms").First(&room, "roomid = ?", roomid)
	if result.Error != nil {
		return "yes", result.Error
	}

	return room.Needpass, nil
}

func (r *RoomRepository) GetPassword(roomid int) (string, error) {
	var roomPass models.RoomPassword
	result := r.db.Table("room_password").First(&roomPass, "roomid = ?", roomid)
	if result.Error != nil {
		return "", result.Error
	}
	return roomPass.Roompassword, nil
}

func (r *RoomRepository) GetNameFromSession(token string) (string, error) {
	var sess models.Session
	result := r.db.Table("session_info").First(&sess, "token = ?", token)
	if result.Error != nil {
		if result.Error.Error() == "record not found" {
			return "", nil
		}
		return "", result.Error
	}
	return sess.Name, nil
}

func (r *RoomRepository) AddRoom(room models.Room) error {
	rooms := models.Rooms{
		Roomid: room.Roomid,
		Roomname: room.Roomname,
		Description: room.Description,
		Needpass: room.Needpass,
		Createdby: room.Createdby,
		People: room.People,
	}

	result := r.db.Table("rooms").Create(&rooms)
	if result.Error != nil {
		return result.Error
	}

	return nil
}

func (r *RoomRepository) AddRoomPassword(roomid int, password string) error {
	result := r.db.Table("room_password").Create(&models.RoomPassword{Roomid: roomid, Roompassword: password})
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (r *RoomRepository) UpdateRoom(room models.Room, name string) (*models.Room, error) {
	var rooms models.Rooms

	if name == "ゲスト" {
		rooms = models.Rooms{
			Roomid: room.Roomid,
			Roomname: room.Roomname,
			Description: room.Description,
			Needpass: room.Needpass,
			Createdby: room.Createdby,
			People: room.People + 1,
		}
		result := r.db.Table("rooms").Where("roomid = ?", room.Roomid).Updates(&rooms)
		if result.Error != nil {
			return nil, result.Error
		}
		return &room, nil
	}

	checkResult := r.db.Table("room_member").First(&models.RoomMember{}, "roomid = ? and member = ?", room.Roomid, name)
	if checkResult.Error != nil {
		if checkResult.Error.Error() == "record not found" {
			memResult := r.db.Table("room_member").Create(&models.RoomMember{Roomid: room.Roomid, Member: name})
			if memResult.Error != nil {
				return nil, memResult.Error
			}
			room.Member = append(room.Member, name)
			room.People += 1

			rooms = models.Rooms{
				Roomid: room.Roomid,
				Roomname: room.Roomname,
				Description: room.Description,
				Needpass: room.Needpass,
				Createdby: room.Createdby,
				People: room.People,
			}

			result := r.db.Table("rooms").Where("roomid = ?", room.Roomid).Updates(&rooms)
			if result.Error != nil {
				return nil, result.Error
			}

			newRoom := models.Room{
				Roomid: room.Roomid,
				Roomname: room.Roomname,
				Description: room.Description,
				Needpass: room.Needpass,
				Createdby: room.Createdby,
				Member: room.Member,
				People: room.People,
			}

			return &newRoom, nil
		}
	}

	return &room, nil
}

func (r *RoomRepository) GetAllTalkLog(roomid int) (*[]models.TalkLog, error) {
	var logs []models.TalkLog
	subQuery := r.db.Table("talk_log").Where("roomid = ?", roomid).Order("id desc").Limit(50)
	result := r.db.Table("talk_log").Table("(?) as u", subQuery).Order("id asc").Find(&logs)
	if result.Error != nil {
		return nil, result.Error
	}

	return &logs, nil
}

