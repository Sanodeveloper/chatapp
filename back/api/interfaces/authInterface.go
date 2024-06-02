package interfaces

type SignupInput struct {
	Name string `json:"name" binding:"required"`
	Email string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type SignupOutput struct {
	Signup bool `json:"signup"`
}

type LoginInput struct {
	Name string `json:"name" binding:"required"`
	Password string `json:"password" binding:"required"`
}

type LoginOutput struct {
	Auth bool `json:"auth" binding:"required"`
}

type SessionOutput struct {
	Auth bool `json:"auth"`
}