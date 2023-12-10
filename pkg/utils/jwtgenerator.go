package utils

import (
	"errors"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/xuoxod/weblab/pkg/constants"
)

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
