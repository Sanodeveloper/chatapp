package repositories

import (
	"api/models"

	"gorm.io/gorm"
)


type IAuthRepository interface {
	CreateUser(user models.User) error
	CheckUser(name string) (bool, error)
	CheckSignupUser(name string, password string) (bool, error)
	AddSessionId(name string, token string) error
	CheckSessionId(token string) (bool, error)
	CheckUserFromSession(name string) (bool, error)
	UpdateSessionId(name string, token string) error
}

type AuthRepository struct {
	db *gorm.DB
}

func NewAuthRepository(db *gorm.DB) IAuthRepository {
	return &AuthRepository{db: db}
}

func (r *AuthRepository) CreateUser(user models.User) error {
	result := r.db.Table("users").Create(&user)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (r *AuthRepository) CheckUser(name string) (bool, error) {
	var user = models.User{}
	result := r.db.Table("users").First(&user, "name = ?", name)
	if result.Error != nil {
		if result.Error.Error() == "record not found" {
			return false, nil
		}
		return false, result.Error
	}
	return true, nil
}

func (r *AuthRepository) CheckSignupUser(name string, password string) (bool, error) {
	var user = models.User{}
	result := r.db.Table("users").First(&user, "name = ? and password = ?", name, password)
	if result.Error != nil {
		if result.Error.Error() == "record not found" {
			return false, nil
		}
		return false, result.Error
	}
	return true, nil
}

func (r * AuthRepository) AddSessionId(name string, token string) error {
	result := r.db.Table("session_info").Create(&models.Session{Name: name, Token: token})
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func (r *AuthRepository) CheckSessionId(token string) (bool, error) {
	result := r.db.Table("session_info").First(&models.Session{}, "token = ?", token)
	if result.Error != nil {
		if result.Error.Error() == "record not found" {
			return false, nil
		}
		return false, result.Error
	}
	return true, nil
}

func (r *AuthRepository) CheckUserFromSession(name string) (bool, error) {
	result := r.db.Table("session_info").First(&models.Session{}, "name = ?", name)
	if result.Error != nil {
		if result.Error.Error() == "record not found" {
			return false, nil
		}
		return false, result.Error
	}
	return true, nil
}


func (r *AuthRepository) UpdateSessionId(name string, token string) error {
	result := r.db.Table("session_info").Where("name = ?", name).Update("token", token)
	if result.Error != nil {
		return result.Error
	}
	return nil
}