package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	// "github.com/golang-jwt/jwt"
	"github.com/dgrijalva/jwt-go"
	"github.com/justinas/nosurf"
	"github.com/xuoxod/weblab/internal/forms"
	"github.com/xuoxod/weblab/internal/helpers"
	"github.com/xuoxod/weblab/internal/models"
	"github.com/xuoxod/weblab/internal/render"
	"github.com/xuoxod/weblab/pkg/utils"
)

// @desc        User dashboard
// @route       GET /user
// @access      Private
func (m *Respository) Dashboard(w http.ResponseWriter, r *http.Request) {
	user, userOk := m.App.Session.Get(r.Context(), "user_id").(models.User)
	profile, profileOk := m.App.Session.Get(r.Context(), "profile").(models.Profile)
	preferences, preferencesOk := m.App.Session.Get(r.Context(), "preferences").(models.Preferences)

	if !userOk {
		log.Println("Cannot get user_id data from session")
		m.App.ErrorLog.Println("Can't get user_id data from the session")
		m.App.Session.Put(r.Context(), "error", "Can't get user_id data from session")
		http.Redirect(w, r, "/user", http.StatusTemporaryRedirect)
		return
	}

	if !profileOk {
		log.Println("Cannot get profile data from session")
		m.App.ErrorLog.Println("Can't get profile data from the session")
		m.App.Session.Put(r.Context(), "error", "Can't get profile data from session")
		http.Redirect(w, r, "/user", http.StatusTemporaryRedirect)
		return
	}

	if !preferencesOk {
		log.Println("Cannot get preferences data from session")
		m.App.ErrorLog.Println("Can't get preferences data from the session")
		m.App.Session.Put(r.Context(), "error", "Can't get preferences data from session")
		http.Redirect(w, r, "/user", http.StatusTemporaryRedirect)
		return
	}

	data := make(map[string]interface{})
	data["user"] = user
	data["profile"] = profile
	data["preferences"] = preferences
	data["isAuthenticated"] = helpers.IsAuthenticated(r)
	data["title"] = "Dashboard"
	data["csrf_token"] = nosurf.Token(r)

	cookie, cookieErr := r.Cookie("deezCookies")

	if cookieErr != nil {
		fmt.Println("Cookie Error")
		fmt.Println(cookieErr.Error())
	}

	if cookie != nil {
		// fmt.Println("Cooke Name:\t", cookie.Name)
		token, isValid, err := utils.ValidateToken(cookie)

		if isValid {
			// fmt.Println("Token: ", *token)
			claims := token.Claims.(*jwt.StandardClaims)

			userId, _ := strconv.Atoi(claims.Issuer)
			expiresAt := claims.ExpiresAt

			fmt.Printf("Current User? %t\n", userId == user.ID)
			fmt.Println("Expires At: ", expiresAt)

			fmt.Printf("\n")
			fmt.Printf("\n")
		} else {
			fmt.Println("Token parsing failed")
			fmt.Println(err.Error())
			fmt.Printf("\n")
		}
	}

	err := render.Render(w, r, "user/dashboard.jet", nil, data)

	if err != nil {
		log.Println(err.Error())
	}
}

// @desc        User dashboard
// @route       GET /user
// @access      Private
func (m *Respository) Settings(w http.ResponseWriter, r *http.Request) {
	user, userOk := m.App.Session.Get(r.Context(), "user_id").(models.User)
	profile, profileOk := m.App.Session.Get(r.Context(), "profile").(models.Profile)
	preferences, preferencesOk := m.App.Session.Get(r.Context(), "preferences").(models.Preferences)

	if !userOk {
		log.Println("Cannot get user_id data from session")
		m.App.ErrorLog.Println("Can't get user_id data from the session")
		m.App.Session.Put(r.Context(), "error", "Can't get user_id data from session")
		http.Redirect(w, r, "/user", http.StatusTemporaryRedirect)
		return
	}

	if !profileOk {
		log.Println("Cannot get profile data from session")
		m.App.ErrorLog.Println("Can't get profile data from the session")
		m.App.Session.Put(r.Context(), "error", "Can't get profile data from session")
		http.Redirect(w, r, "/user", http.StatusTemporaryRedirect)
		return
	}

	if !preferencesOk {
		log.Println("Cannot get preferences data from session")
		m.App.ErrorLog.Println("Can't get preferences data from the session")
		m.App.Session.Put(r.Context(), "error", "Can't get preferences data from session")
		http.Redirect(w, r, "/user", http.StatusTemporaryRedirect)
		return
	}

	data := make(map[string]interface{})
	data["user"] = user
	data["profile"] = profile
	data["preferences"] = preferences
	data["isAuthenticated"] = helpers.IsAuthenticated(r)
	data["title"] = "Settings"
	data["csrf_token"] = nosurf.Token(r)

	cookie, cookieErr := r.Cookie("deezCookies")

	if cookieErr != nil {
		fmt.Println("Cookie Error")
		fmt.Println(cookieErr.Error())
	}

	if cookie != nil {
		// fmt.Println("Cooke Name:\t", cookie.Name)
		token, isValid, err := utils.ValidateToken(cookie)

		if isValid {
			// fmt.Println("Token: ", *token)
			claims := token.Claims.(*jwt.StandardClaims)

			userId, _ := strconv.Atoi(claims.Issuer)
			expiresAt := claims.ExpiresAt

			fmt.Printf("Current User? %t\n", userId == user.ID)
			fmt.Println("Expires At: ", expiresAt)

			fmt.Printf("\n")
			fmt.Printf("\n")
		} else {
			fmt.Println("Token parsing failed")
			fmt.Println(err.Error())
			fmt.Printf("\n")
		}
	}

	err := render.Render(w, r, "user/settings.jet", nil, data)

	if err != nil {
		log.Println(err.Error())
	}
}

// @desc        User account
// @route       GET /user/account
// @access      Private
func (m *Respository) Account(w http.ResponseWriter, r *http.Request) {
	user, userOk := m.App.Session.Get(r.Context(), "user_id").(models.User)
	profile, profileOk := m.App.Session.Get(r.Context(), "profile").(models.Profile)
	preferences, preferencesOk := m.App.Session.Get(r.Context(), "preferences").(models.Preferences)

	if !userOk {
		log.Println("Cannot get user_id data from session")
		m.App.ErrorLog.Println("Can't get user_id data from the session")
		m.App.Session.Put(r.Context(), "error", "Can't get user_id data from session")
		http.Redirect(w, r, "/user", http.StatusTemporaryRedirect)
		return
	}

	if !profileOk {
		log.Println("Cannot get profile data from session")
		m.App.ErrorLog.Println("Can't get profile data from the session")
		m.App.Session.Put(r.Context(), "error", "Can't get profile data from session")
		http.Redirect(w, r, "/user", http.StatusTemporaryRedirect)
		return
	}

	if !preferencesOk {
		log.Println("Cannot get preferences data from session")
		m.App.ErrorLog.Println("Can't get preferences data from the session")
		m.App.Session.Put(r.Context(), "error", "Can't get preferences data from session")
		http.Redirect(w, r, "/user", http.StatusTemporaryRedirect)
		return
	}

	data := make(map[string]interface{})
	data["user"] = user
	data["profile"] = profile
	data["preferences"] = preferences
	data["isAuthenticated"] = helpers.IsAuthenticated(r)
	data["title"] = "Account"
	data["csrf_token"] = nosurf.Token(r)

	err := render.Render(w, r, "user/account.jet", nil, data)

	if err != nil {
		log.Println(err.Error())
	}
}

// @desc        Update profile
// @route       POST /user/profile
// @access      Private
func (m *Respository) ProfilePost(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Post profile")

	err := r.ParseForm()

	if err != nil {
		fmt.Printf("\n\tError parsing user profile form")
		helpers.ServerError(w, err)
		return
	}

	parsedProfile := models.Profile{
		UserName: r.Form.Get("uname"),
		Address:  r.Form.Get("address"),
		City:     r.Form.Get("city"),
		State:    r.Form.Get("state"),
		Zipcode:  r.Form.Get("zipcode"),
	}

	parsedUser := models.User{
		FirstName: r.Form.Get("fname"),
		LastName:  r.Form.Get("lname"),
		Email:     r.Form.Get("email"),
		Phone:     r.Form.Get("phone"),
	}

	// form validation
	form := forms.New(r.PostForm)
	form.IsEmail("email")
	form.Required("fname", "lname", "email", "phone")

	obj := make(map[string]interface{})

	if !form.Valid() {
		fmt.Println("Form Errors: ", form.Errors)
		obj["profileform"] = parsedProfile
		obj["ok"] = false

		if form.Errors.Get("email") != "" {
			obj["email"] = form.Errors.Get("email")
		}

		if form.Errors.Get("iurl") != "" {
			obj["iurl"] = form.Errors.Get("iurl")
		}
		if form.Errors.Get("fname") != "" {
			obj["fname"] = form.Errors.Get("fname")
		}
		if form.Errors.Get("lname") != "" {
			obj["lname"] = form.Errors.Get("lname")
		}
		if form.Errors.Get("email") != "" {
			obj["email"] = form.Errors.Get("email")
		}
		if form.Errors.Get("phone") != "" {
			obj["phone"] = form.Errors.Get("phone")
		}

		out, err := json.MarshalIndent(obj, "", " ")

		if err != nil {
			log.Println(err)
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(200)
		num, rErr := w.Write(out)

		if rErr != nil {
			log.Println(err)
		}

		log.Printf("Response Writer's returned integer: %d\n", num)
		return
	} else {
		// Update user and their profile then return it
		updatedUser, updatedProfile, err := m.DB.UpdateUser(parsedUser, parsedProfile)

		if err != nil {
			fmt.Println(err)
		}

		// replace user_id and profile in the session manager
		m.App.Session.Remove(r.Context(), "user_id")
		m.App.Session.Remove(r.Context(), "profile")

		m.App.Session.Put(r.Context(), "user_id", updatedUser)
		m.App.Session.Put(r.Context(), "profile", updatedProfile)

		obj["ok"] = true

		out, err := json.MarshalIndent(obj, "", " ")

		if err != nil {
			log.Println(err)
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(200)
		num, rErr := w.Write(out)

		if rErr != nil {
			log.Println(err)
		}

		log.Printf("Response Writer's returned integer: %d\n", num)
		return
	}
}

// @desc        Update settings
// @route       POST /user/settings
// @access      Private
func (m *Respository) PreferencesPost(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Post settings")
	obj := make(map[string]interface{})
	preferences, preferencesOk := m.App.Session.Get(r.Context(), "preferences").(models.Preferences)

	if !preferencesOk {
		log.Println("Cannot get preferences data from session")
		m.App.ErrorLog.Println("Can't get preferences data from the session")
		m.App.Session.Put(r.Context(), "error", "Can't get preferences data from session")
		http.Redirect(w, r, "/user", http.StatusTemporaryRedirect)
		return
	}

	err := r.ParseForm()

	if err != nil {
		fmt.Printf("\n\tError parsing user preferences form")
		helpers.ServerError(w, err)
		return
	}

	var parsedPreferences models.Preferences

	parsedPreferences.ID = preferences.ID
	parsedPreferences.UserID = preferences.UserID

	for key := range r.Form {
		fmt.Println("Key: ", key)
		if key == "permvis" {
			parsedPreferences.PermanentVisible = true
		}

		if key == "smsnots" {
			parsedPreferences.EnableSmsNotifications = true
		}

		if key == "emailnots" {
			parsedPreferences.EnableEmailNotifications = true
		}

		if key == "publicpro" {
			parsedPreferences.EnablePublicProfile = true
		}

	}

	log.Printf("\n\tParsed Settings Form: \n\t%v\n\n", parsedPreferences)

	// Update user and their profile then return it
	updatedPreferences, err := m.DB.UpdatePreferences(parsedPreferences)

	if err != nil {
		fmt.Println(err)

		obj["ok"] = false

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

	m.App.Session.Remove(r.Context(), "preferences")
	m.App.Session.Put(r.Context(), "preferences", updatedPreferences)

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

// @desc        Signout user
// @route       GET /user/signout
// @access      Private
func (m *Respository) SignOut(w http.ResponseWriter, r *http.Request) {
	cookie := http.Cookie{}
	cookie.Value = ""
	cookie.Name = "deezCookies"
	cookie.Expires = time.Now().Add(-time.Hour)
	cookie.HttpOnly = true
	_ = m.App.Session.Destroy(r.Context())
	_ = m.App.Session.RenewToken(r.Context())

	http.Redirect(w, r, "/", http.StatusSeeOther)
}
