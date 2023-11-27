package handlers

import (
	"log"
	"net/http"

	"github.com/justinas/nosurf"
	"github.com/xuoxod/weblab/internal/config"
	"github.com/xuoxod/weblab/internal/driver"
	"github.com/xuoxod/weblab/internal/render"
	"github.com/xuoxod/weblab/internal/repository"
	"github.com/xuoxod/weblab/internal/repository/dbrepo"
)

// Repo the repository used by the handlers
var Repo *Respository

// Repository the Repository type
type Respository struct {
	App *config.AppConfig
	DB  repository.DatabaseRepo
}

// NewRepo creates a new Repository
func NewRepo(a *config.AppConfig, db *driver.DB) *Respository {
	return &Respository{
		App: a,
		DB:  dbrepo.NewPostgresRepo(db.SQL, a),
	}
}

// NewHandler sets the repository for the handlers
func NewHandler(r *Respository) {
	Repo = r
	render.InitViews()
}

func (m *Respository) Home(w http.ResponseWriter, r *http.Request) {
	data := make(map[string]interface{})
	data["title"] = "Home"
	data["csrf_token"] = nosurf.Token(r)

	err := render.Render(w, r, "landing/home.jet", nil, data)

	if err != nil {
		log.Println(err.Error())
	}
}

func (m *Respository) About(w http.ResponseWriter, r *http.Request) {
	data := make(map[string]interface{})
	data["title"] = "About"
	data["csrf_token"] = nosurf.Token(r)

	err := render.Render(w, r, "landing/about.jet", nil, data)

	if err != nil {
		log.Println(err.Error())
	}
}

func (m *Respository) Register(w http.ResponseWriter, r *http.Request) {
	data := make(map[string]interface{})
	data["title"] = "Register"

	err := render.Render(w, r, "landing/register.jet", nil, data)

	if err != nil {
		log.Println(err.Error())
	}
}
