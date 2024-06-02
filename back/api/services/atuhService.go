package services

import (
	"api/repositories"
	"api/models"
	"math/rand"
)

type IAuthService interface {
	Signup(name string, mail string, password string) (bool, error)
	Login(name string, password string) (*string, bool, error)
	Session(token string) (bool, error)
}

type AuthService struct {
	repository repositories.IAuthRepository
}

func NewAuthService(repository repositories.IAuthRepository) IAuthService {
	return &AuthService{repository: repository}
}

func (s *AuthService) Signup(name string, email string, password string) (bool, error) {
	check, checkerr := s.repository.CheckUser(name)
	if checkerr != nil {
		return false, checkerr
	}

	if check {
		return false, nil
	}

	data := models.User{Name: name, Email: email, Password: password}
	err := s.repository.CreateUser(data)
	if err != nil {
		return false, err
	}
	return true, nil
}

func (s *AuthService) Login(name string, password string) (*string, bool, error) {
	check, checkerr := s.repository.CheckSignupUser(name, password)
	if checkerr != nil {
		return nil, false, checkerr
	}

	if !check {
		return nil, false, nil
	}

	token := CreateToken()
	isUser, tokenerr := s.repository.CheckUserFromSession(name)
	if tokenerr != nil {
		return nil, false ,tokenerr
	}

	if !isUser {
		err := s.repository.AddSessionId(name, token)
		if err != nil {
			return nil, false, err
		}
	} else {
		err := s.repository.UpdateSessionId(name, token)
		if err != nil {
			return nil, false, err
		}
	}

	return &token, true, nil
}

func CreateToken() string {
	var letterRunes = []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

    b := make([]rune, 10)
    for i := range b {
        b[i] = letterRunes[rand.Intn(len(letterRunes))]
    }
    return string(b)
}

func (s *AuthService) Session(token string) (bool, error) {
	return s.repository.CheckSessionId(token)
}