package dbrepo

import (
	"database/sql"

	"github.com/xuoxod/weblab/internal/config"
	"github.com/xuoxod/weblab/internal/repository"
)

type postgresDbRepo struct {
	App *config.AppConfig
	DB  *sql.DB
}

func NewPostgresRepo(conn *sql.DB, a *config.AppConfig) repository.DatabaseRepo {
	return &postgresDbRepo{
		App: a,
		DB:  conn,
	}
}
