package utils

import (
	"encoding/json"
	"fmt"
	"go/types"
	"strings"
	"time"

	"github.com/gookit/color"
	"github.com/xuoxod/weblab/internal/models"
)

type Argument interface {
	int | int32 | int64 | float32 | float64 | string | types.Map | types.Array | types.Interface | types.Struct | types.TypeList | types.Named | types.Tuple | models.User
}

type Function func()

func SuccessMessage(arg string) {
	color.Green.Printf("%v\n", arg)
}

func WarningMessage(arg string) {
	color.Yellow.Printf("%v\n", arg)
}

func ErrorMessage(arg string) {
	color.Red.Printf("%v\n", arg)
}

func InfoMessage(arg string) {
	color.Info.Printf("%v\n", arg)
}

func CustomMessage(arg string, red uint8, green uint8, blue uint8) {
	c := color.RGB(red, green, blue)
	c.Printf("%v\n", arg)
}

func ExecuteAfterTime(seconds int, f Function) {
	duration := time.Duration(seconds) * time.Second
	timer := time.NewTimer(duration)
	<-timer.C
	f()
}

func ToString[K comparable](argument K) string {
	return strings.TrimSpace(fmt.Sprintf("%v", argument))
}

func PrettyPrint[K comparable](arg K) {
	p, x := json.MarshalIndent(arg, "", " ")

	if x != nil {
		fmt.Println("Error ", x.Error())
	}

	fmt.Printf("\n\t%v\n\n\n", string(p))
}

func Sleep(seconds int) {
	duration := time.Duration(seconds) * time.Second
	if seconds > 0 {
		time.Sleep(duration * time.Second)
	}
}
