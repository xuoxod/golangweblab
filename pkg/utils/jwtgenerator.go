package utils

import (
	"errors"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/xuoxod/weblab/pkg/constants"
)

/* func GenerateJWT(id uint64) (string, error) {
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
} */

func GenerateJwt(id int) (string, error) {
	strId := strconv.Itoa(id)
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, &jwt.StandardClaims{
		Issuer:    strId,
		ExpiresAt: time.Now().Add(time.Hour * 24).Unix(),
	})

	token, err := claims.SignedString([]byte(constants.SecretKey))

	if err != nil {
		return "", errors.New("Unabled to generate token")
	}

	return token, nil
}
