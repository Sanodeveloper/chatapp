package interfaces

type RoomDetailInput struct {
	Roomid int `json:"roomid" binding:"required"`
}

type RoomDetailOutput struct {
	Roomname    string   `json:"roomname" binding:"required"`
	Roomid      int      `json:"roomid" binding:"required"`
	Description string   `json:"description" binding:"required"`
	Needpass    string   `json:"needpass" binding:"required"`
	Createdby   string   `json:"createdby" binding:"required"`
	Member      []string `json:"member" binding:"required"`
	People      int      `json:"people" binding:"required"`
}

type NeedPassInput struct {
	Roomid int `json:"roomid" binding:"required"`
}

type NeedPassOutput struct {
	Needpass string `json:"needpass" binding:"required"`
}

type RoomAuthInput struct {
	Roomid   string `json:"roomid" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type RoomAuthOutput struct {
	Auth bool `json:"auth" binding:"required"`
}

type CreateRoomInput struct {
	Roomname    string `json:"roomname" binding:"required"`
	Needpass    string `json:"needpass" binding:"required"`
	Password    string `json:"password"`
	Description string `json:"description"`
}

type CreateRoomOutput struct {
	Roomid int `json:"roomid" binding:"required"`
}

type RoomSearchInput struct {
	Roomname string `json:"roomname" binding:"required"`
}

type RoomSearchOutput struct {
	Roominfo []RoomDetailOutput `json:"roominfo" binding:"required"`
}

type RoomInfoInput struct {
	Roomid int `json:"roomid" binding:"required"`
}

type RoomInfoOutput struct {
	Username string   `json:"username" binding:"required"`
	Roomname string   `json:"roomname" binding:"required"`
	Member   []string `json:"member" binding:"required"`
}

type TalkLogInput struct {
	Roomid int `json:"roomid" binding:"required"`
}

type Logs struct {
	Roomid int `json:"roomid" binding:"required"`
	Username string `json:"username" binding:"required"`
	Message string `json:"message" binding:"required"`
}

type TalkLogOutput struct {
	Logs []Logs `json:"logs" binding:"required"`
}