package main

import (
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/xuoxod/weblab/internal/handlers"
)

func routes() http.Handler {
	mux := chi.NewRouter()
	mux.Use(middleware.Compress(5))
	// mux.Use(middleware.Recoverer)
	// mux.Use(SessionLoad)
	// mux.Use(RecoverPanic)
	mux.Use(WriteToConsole)
	mux.Use(middleware.NoCache)
	mux.Use(NoSurf)

	mux.Route("/ws", func(mux chi.Router) {
		mux.Get("/", handlers.WsEndpoint)
	})

	mux.Route("/", func(mux chi.Router) {
		mux.Use(SessionLoad)
		mux.Use(Unauth)
		mux.Get("/", handlers.Repo.Home)
		mux.Get("/about", handlers.Repo.About)
		mux.Post("/login", handlers.Repo.Authenticate)
		mux.Post("/register", handlers.Repo.PostRegister)
	})

	mux.Route("/user", func(mux chi.Router) {
		mux.Use(SessionLoad)
		mux.Use(Auth)
		mux.Get("/account", handlers.Repo.Account)
		mux.Get("/", handlers.Repo.Dashboard)
		mux.Post("/", handlers.Repo.ProfilePost)
		mux.Get("/signout", handlers.Repo.SignOut)
		mux.Post("/profile", handlers.Repo.ProfilePost)
		mux.Post("/preferences", handlers.Repo.PreferencesPost)
		mux.Get("/email/verify", handlers.Repo.VerifyEmail)
		mux.Post("/email/verify", handlers.Repo.VerifyEmailPost)
		mux.Get("/phone/verify", handlers.Repo.VerifyPhone)
		mux.Post("/phone/verify", handlers.Repo.VerifyPhonePost)
		mux.Get("/settings", handlers.Repo.Settings)
	})

	mux.Route("/auth", func(mux chi.Router) {
		mux.Use(SessionLoad)
		mux.Use(Auth)
		mux.Get("/", handlers.Repo.VerifyIdentity)
	})

	fileserver := http.FileServer(http.Dir("./static/"))
	mux.Handle("/static/*", http.StripPrefix("/static", fileserver))

	return mux
}
