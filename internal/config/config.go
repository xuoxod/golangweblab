package config

import (
	"log"

	"github.com/alexedwards/scs/v2"
	"github.com/xuoxod/weblab/internal/models"
)

type AppConfig struct {
	InfoLog      *log.Logger
	ErrorLog     *log.Logger
	InProduction bool
	Session      *scs.SessionManager
	DBConnection string
	AllUser      *models.AllUsers
}
