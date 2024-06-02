package services

import (
	"api/interfaces"
	"api/models"
	"api/repositories"
	"math/rand"
	"time"
)

type IRoomService interface {
	GetRooms(roomname string) (*[]models.Room, error)
	GetRoom(roomid int) (*models.Room, error)
	GetNeedPass(roomid int) (string, error)
	RoomAuth(roomid int, password string) (bool, error)
	CreateRoom(token string ,room interfaces.CreateRoomInput) (int, error)
	GetRoomInfo(roomid int, token string) ( string, *models.Room, error)
	GetAllTalkLog( roomid int ) (*[]models.TalkLog, error)
}

type RoomService struct {
	repository repositories.IRoomRepository
}

func NewRoomService(repository repositories.IRoomRepository) IRoomService {
	return &RoomService{repository: repository}
}

func (s *RoomService) GetRooms(roomname string) (*[]models.Room, error) {
	return s.repository.GetRooms(roomname)
}

func (s *RoomService) GetRoom(roomid int) (*models.Room, error) {
	return s.repository.GetRoom(roomid)
}

func (s *RoomService) GetNeedPass(roomid int) (string, error) {
	return s.repository.GetNeedPass(roomid)
}

func (s *RoomService) RoomAuth(roomid int, password string) (bool, error) {
	pass, err := s.repository.GetPassword(roomid)
	if err != nil {
		return false, err
	}

	if pass != password {
		return false, nil
	}

	return true, nil
}

func (s *RoomService) CreateRoom(token string ,room interfaces.CreateRoomInput) (int ,error) {
	userName, err := s.repository.GetNameFromSession(token)
	if err != nil {
		return -1, err
	}

	newRoomId := RandomInt()
	newIntRoomId := int(newRoomId)

	var member []string

	newRoom := models.Room{
		Roomname: room.Roomname,
		Roomid: newIntRoomId,
		Description: room.Description,
		Needpass: room.Needpass,
		Createdby: userName,
		Member: member,
		People: 0,
	}

	addroomerr := s.repository.AddRoom(newRoom)
	if addroomerr != nil {
		return -1 ,addroomerr
	}

	if room.Needpass == "yes" {
		passerr := s.repository.AddRoomPassword(newIntRoomId, room.Password)
		if passerr != nil {
			return -1, passerr
		}
	}

	return newIntRoomId, nil
}

func RandomInt() uint32 {
	seed := time.Now().UnixNano()
	r := rand.New(rand.NewSource(seed))
	val := r.Uint32()
	return val
}

func (s *RoomService) GetRoomInfo(roomid int, token string) (string, *models.Room, error) {
	userName, nameerr := s.repository.GetNameFromSession(token)
	if nameerr !=nil {
		return "", nil, nameerr
	}

	room, roomerr := s.repository.GetRoom(roomid)
	if roomerr != nil {
		return "", nil, roomerr
	}

	if userName == "" {
		userName = "ゲスト"
	}

	newRoom, updataerr := s.repository.UpdateRoom(*room, userName)
	if updataerr != nil {
		return "", nil, updataerr
	}

	return userName, newRoom, nil
}

func (s *RoomService) GetAllTalkLog( roomid int) (*[]models.TalkLog, error) {
   log, logerr := s.repository.GetAllTalkLog(roomid);
   if logerr != nil {
	  return nil, logerr
   }

   return log, nil
}
