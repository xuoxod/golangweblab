package utils

import (
	"fmt"
	"log"
	"math/rand"
	"strings"
	"time"

	gonanoid "github.com/matoous/go-nanoid/v2"
)

func DateTimeStamp() string {
	// dts := fmt.Sprint("Date: ", time.Now())

	// d := time.Date(2000, 2, 1, 12, 30, 0, 0, time.UTC)

	d := time.Date(time.Now().Year(), time.Now().Month(), time.Now().Day(), 12, 30, 0, 0, time.UTC)
	year, month, day := d.Date()

	return fmt.Sprintf("%v %v, %v", month, day, year)
}
func DateStamp() string {
	// dts := fmt.Sprint("Date: ", time.Now())

	// d := time.Date(2000, 2, 1, 12, 30, 0, 0, time.UTC)

	d := time.Date(time.Now().Year(), time.Now().Month(), time.Now().Day(), 12, 30, 0, 0, time.UTC)
	year, month, day := d.Date()

	return fmt.Sprintf("%v %v %v", month, day, year)
}

func DTS() string {
	// dts := fmt.Sprint("Date: ", time.Now())
	// d := time.Date(2000, 2, 1, 12, 30, 0, 0, time.UTC)

	d := time.Date(time.Now().Year(), time.Now().Month(), time.Now().Day(), 12, 30, 0, 0, time.UTC)
	year, month, day := d.Date()
	hour, minute, second := time.Now().Local().Clock()

	var suffix string
	var strDay string = fmt.Sprintf("%d", day)

	if strings.HasSuffix(strDay, "1") {
		suffix = "st"
	} else if strings.HasSuffix(strDay, "2") {
		suffix = "nd"
	} else if strings.HasSuffix(strDay, "3") {
		suffix = "rd"
	} else {
		suffix = "th"
	}

	return fmt.Sprintf("%v %v%s %v %v:%v:%v", month, day, suffix, year, hour, minute, second)
}

func DS() string {
	d := time.Date(time.Now().Year(), time.Now().Month(), time.Now().Day(), 12, 30, 0, 0, time.UTC)
	year, month, day := d.Date()
	var suffix string
	var strDay string = fmt.Sprintf("%d", day)

	if strings.HasSuffix(strDay, "1") {
		suffix = "st"
	} else if strings.HasSuffix(strDay, "2") {
		suffix = "nd"
	} else if strings.HasSuffix(strDay, "3") {
		suffix = "rd"
	} else {
		suffix = "th"
	}

	return fmt.Sprintf("%v %v%s %v", month, day, suffix, year)
}

func TS() string {
	hour, minute, second := time.Now().Local().Clock()
	return fmt.Sprintf("%v:%v:%v", hour, minute, second)
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
