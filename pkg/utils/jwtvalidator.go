package utils

import (
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"github.com/xuoxod/weblab/pkg/constants"
)

func ValidateToken(cookie *http.Cookie) (*jwt.Token, bool, error) {
	token, err := jwt.ParseWithClaims(cookie.Value, &jwt.StandardClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(constants.SecretKey), nil
	})

	if err != nil {
		return nil, false, err
	}

	return token, token.Valid, nil

}
