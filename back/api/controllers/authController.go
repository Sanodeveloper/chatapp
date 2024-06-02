package controllers

import (
	"api/interfaces"
	"api/services"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

type IAuthController interface {
	Session(ctx *gin.Context)
	Signup(ctx *gin.Context)
	Login(ctx *gin.Context)
}

type AuthController struct {
	service services.IAuthService
}

func NewAuthController(service services.IAuthService) IAuthController {
	return &AuthController{service: service}
}

func (c *AuthController) Signup(ctx *gin.Context) {
	var input interfaces.SignupInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error" : "cannot get parameter"})
		return
	}
	isSinup, err := c.service.Signup(input.Name, input.Email, input.Password)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error" : "server error"})
		return
	}
	ctx.JSON(http.StatusCreated, interfaces.SignupOutput{Signup: isSinup})
}

func (c *AuthController) Login(ctx *gin.Context) {
	var input interfaces.LoginInput
	if err := ctx.ShouldBindJSON(&input); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error" : "cannot get parameter"})
		return
	}

	token, islogin, err := c.service.Login(input.Name, input.Password)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error" : "server error"})
		return
	}

	if !islogin {
		ctx.JSON(http.StatusCreated, interfaces.LoginOutput{Auth: false})
		return
	}

	strToken := *token
	domain, e := os.LookupEnv("COOKIE_DOMAIN")
	if !e {
		domain = "localhost"
	}
	ctx.SetCookie("sessionid", strToken, (60 * 60 * 12), "/", domain , false, true)
	ctx.JSON(http.StatusCreated, interfaces.LoginOutput{Auth: true})
}

func (c *AuthController) Session(ctx *gin.Context) {
	token, err := ctx.Cookie("sessionid")
	if err != nil {
		ctx.JSON(http.StatusForbidden, gin.H{"error" : "forbidden"})
		return
	}

	issession, sessionerr := c.service.Session(token)
	if sessionerr != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error" : "server error"})
		return
	}

	ctx.JSON(http.StatusOK, interfaces.SessionOutput{Auth: issession})
}