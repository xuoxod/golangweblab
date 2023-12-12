package utils

import (
	"fmt"
	"log"
	"math/rand"
	"time"

	gonanoid "github.com/matoous/go-nanoid/v2"
	"github.com/xuoxod/weblab/pkg/constants"
)

func DateTimeStamp() string {
	return time.Now().Format(constants.NumLongDateNormalTimeFull)
}
func DateStamp() string {
	return time.Now().Format(constants.NumLongDateNormalTimeFull)
}

func DS() string {
	return time.Now().Format(constants.NumLongDateNormalTime)
}

func TS() string {
	return time.Now().Format(constants.NumNormalTimeFull)
}

func Print(msg string) {
	fmt.Println(msg)
}

func GenerateRandomNumberMinMax() (int, error) {
	min := 111111
	max := 999999
	return min + rand.Intn(max-min), nil
}

func CopyrightDate() string {
	d := time.Date(time.Now().Year(), time.Now().Month(), time.Now().Day(), 12, 30, 0, 0, time.UTC)
	year, _, _ := d.Date()

	return fmt.Sprintf("RmediaTech.com %v", year)
}

func GenerateMinMaxRandomNumber() (int, error) {
	min := 111111
	max := 999999
	return min + rand.Intn(max-min), nil
}

func GenerateUserDefinedRandomNumber(min, max int) (int, error) {
	return min + rand.Intn(max-min), nil
}

func GenerateRandomNumber() (int, error) {
	min := 1
	max := 999999
	return min + rand.Intn(max-min), nil
}

func GenerateID() string {
	id, err := gonanoid.New()

	if err != nil {
		log.Println(err.Error())
		return "0"
	}
	return id
}

func GenerateName(size int) string {
	if size < 1 {
		size = 13
	}

	name, err := gonanoid.Generate("abcdefghijklmopqrstuvwxyzACDEFGHIJKLMOPQRSTUVWXYZ~!@#$%^&*,.?>}]|", size)

	if err != nil {
		log.Println(err.Error())
		return ""
	}

	return name
}

func GenerateUID() string {
	uid, err := gonanoid.Generate("0123456789", 14)

	if err != nil {
		log.Println(err.Error())
		return ""
	}
	return uid
}

func GenerateWord(size int) string {
	if size < 1 {
		size = 13
	}

	name, err := gonanoid.Generate("aeiouylmqrsvAEIOUYBCDNP", size)

	if err != nil {
		log.Println(err.Error())
		return ""
	}

	return name
}
