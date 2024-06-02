package models

type Room struct {
	Roomname string
	Roomid int
	Description string
	Needpass string
	Createdby string
	Member []string
	People int
}

type Rooms struct {
	Roomname string
	Roomid int
	Description string
	Needpass string
	Createdby string
	People int
}

type RoomMember struct {
	Roomid int
	Member string
}