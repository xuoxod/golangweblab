package utils

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/xuoxod/weblab/pkg/constants"
)

func GenerateJWT(id uint64) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)

	claims["authorized"] = true
	claims["user_id"] = id
	claims["exp"] = time.Now().Add(time.Second * 23).Unix()

	tokenString, err := token.SignedString(constants.SecretKey)

	if err != nil {
		_ = fmt.Errorf("Something Went Wrong: %s", err.Error())
		return "", err
	}
	return tokenString, nil
}
