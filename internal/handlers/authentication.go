package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/xuoxod/weblab/internal/forms"
	"github.com/xuoxod/weblab/internal/helpers"
	"github.com/xuoxod/weblab/internal/models"
)

func (m *Respository) Authenticate(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Post Login")

	obj := make(map[string]interface{})

	err := r.ParseForm()

	if err != nil {
		log.Println(err.Error())
		return
	}

	signinform := models.Signin{
		Email:    r.Form.Get("email"),
		Password: r.Form.Get("password"),
	}

	fmt.Println("Signin posted")

	// Validate form
	form := forms.New(r.PostForm)
	form.Required("email", "password")
	form.IsEmail("email")

	if !form.Valid() {
		obj["ok"] = false
		obj["form"] = form
		obj["msg"] = form.Errors.Get("email")
		obj["type"] = "error"
		obj["signinform"] = signinform

		out, err := json.MarshalIndent(obj, "", " ")

		if err != nil {
			log.Println(err)
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(200)
		_, rErr := w.Write(out)

		if rErr != nil {
			log.Println(err)
		}
		return
	}

	// Authenticate user
	u, p, s, err := m.DB.Authenticate(signinform.Email, signinform.Password)

	if err != nil {
		fmt.Println("Authentication Error:\t", err.Error())

		obj["ok"] = false
		obj["msg"] = "Invalid Login Credentials"
		obj["type"] = "error"

		out, err := json.MarshalIndent(obj, "", " ")

		if err != nil {
			log.Println(err)
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(200)
		_, rErr := w.Write(out)

		if rErr != nil {
			log.Println(err)
		}
		return
	}

	var user models.User
	var profile models.Profile
	var preferences models.Preferences

	user = u
	profile = p
	preferences = s

	// Put user in session
	m.App.Session.Put(r.Context(), "user_id", user)
	m.App.Session.Put(r.Context(), "profile", profile)
	m.App.Session.Put(r.Context(), "preferences", preferences)

	if user.AccessLevel == 1 {
		m.App.Session.Put(r.Context(), "admin_id", user)
	}

	// Send back JSON results
	obj["title"] = "Home"
	obj["ok"] = true

	out, err := json.MarshalIndent(obj, "", " ")

	if err != nil {
		log.Println(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	_, rErr := w.Write(out)

	if rErr != nil {
		log.Println(err)
	}
}

func (m *Respository) PostRegister(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Post Register")

	obj := make(map[string]interface{})
	err := r.ParseForm()

	if err != nil {
		helpers.ServerError(w, err)
		return
	}

	registration := models.Registration{
		FirstName:       r.Form.Get("fname"),
		LastName:        r.Form.Get("lname"),
		Email:           r.Form.Get("email"),
		Phone:           r.Form.Get("phone"),
		PasswordCreate:  r.Form.Get("pwd1"),
		PasswordConfirm: r.Form.Get("pwd2"),
	}

	fmt.Println("Registration posted")

	form := forms.New(r.PostForm)
	form.Required("fname", "lname", "email", "phone", "pwd1", "pwd2")
	form.MinLength("fname", 2, r)
	form.MinLength("lname", 2, r)
	form.IsEmail("email")
	form.PasswordsMatch("pwd1", "pwd2", r)

	if !form.Valid() {
		obj["ok"] = false
		obj["error"] = true
		obj["form"] = form
		obj["type"] = "error"

		out, err := json.MarshalIndent(obj, "", " ")

		if err != nil {
			log.Println(err)
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(200)
		_, rErr := w.Write(out)

		if rErr != nil {
			log.Println(err)
		}
		return
	}

	// Send user sms to confirm that it's them

	// Create user
	userId, err := m.DB.CreateUser(registration)

	if err != nil {
		obj["ok"] = false
		obj["type"] = "error"
		obj["msg"] = "User already registered"

		out, err := json.MarshalIndent(obj, "", " ")

		if err != nil {
			log.Println(err)
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(200)
		_, rErr := w.Write(out)

		if rErr != nil {
			log.Println(err)
		}
		return
	}

	// Send back JSON results
	obj["ok"] = true
	obj["userId"] = userId

	out, err := json.MarshalIndent(obj, "", " ")

	if err != nil {
		log.Println(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(200)
	_, rErr := w.Write(out)

	if rErr != nil {
		log.Println(err)
	}

}
