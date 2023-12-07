package utils

import (
	"fmt"

	"github.com/golang-jwt/jwt/v5"
	"github.com/xuoxod/weblab/pkg/constants"
)

func ValidateTokenfunc(tokenString string) (bool, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return false, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return constants.SecretKey, nil
	})

	if err != nil {
		fmt.Println(err)
		return false, err

	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok {
		fmt.Println(claims["user"], claims["nbf"])
		return true, nil
	} else {
		fmt.Println(err)
		return false, err
	}
}
