package render

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/CloudyKit/jet"
	"github.com/xuoxod/weblab/internal/config"
	"github.com/xuoxod/weblab/pkg/utils"
)

// may also use an absolute path:
var root, _ = os.Getwd()
var views = jet.NewHTMLSet(filepath.Join(root, "views"))
var App *config.AppConfig

func NewRenderer(a *config.AppConfig) {
	App = a
}

func InitViews() {
	views.SetDevelopmentMode(true)
	views.AddGlobal("appver", "0.0.3")
	views.AddGlobal("copyright", utils.CopyrightDate())
	views.AddGlobal("appname", "Awesome Web App")
	views.AddGlobal("appdate", fmt.Sprintf("%v", utils.DateTimeStamp()))
}

func Render(w http.ResponseWriter, r *http.Request, tmpl string, variables jet.VarMap, data map[string]interface{}) error {
	var vars jet.VarMap
	var datum map[string]interface{}

	if variables != nil {
		vars = variables
	} else {
		vars = make(jet.VarMap)
	}

	if data != nil {
		datum = data
	} else {
		datum = make(map[string]interface{})
	}

	view, err := views.GetTemplate(tmpl)

	if err != nil {
		log.Println(err.Error())
		return err
	}

	err = view.Execute(w, vars, datum)

	if err != nil {
		log.Println(err.Error())
		return err
	}

	return nil
}
