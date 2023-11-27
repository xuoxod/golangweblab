package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/xuoxod/weblab/internal/forms"
	"github.com/xuoxod/weblab/internal/helpers"
	"github.com/xuoxod/weblab/internal/models"
	"github.com/xuoxod/weblab/internal/render"
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

	err := render.Render(w, r, "user/dashboard.jet", nil, data)

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
	form.IsUrl("iurl")
	form.Required("fname", "lname", "email", "phone")

	obj := make(map[string]interface{})

	if !form.Valid() {
		fmt.Println("Form Errors: ", form.Errors)
		obj["profileform"] = parsedProfile
		obj["userform"] = parsedUser
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
		if key == "enable-public-profile" {
			parsedPreferences.EnablePublicProfile = true
		}

		if key == "enable-sms-notifications" {
			parsedPreferences.EnableSmsNotifications = true
		}

		if key == "enable-email-notifications" {
			parsedPreferences.EnableEmailNotifications = true
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
	_ = m.App.Session.Destroy(r.Context())
	_ = m.App.Session.RenewToken(r.Context())

	http.Redirect(w, r, "/", http.StatusSeeOther)
}

// @desc        Verify Email
// @route       GET /user/email/verify
// @access      Private
func (m *Respository) VerifyEmail(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Get verify email")

	obj := make(map[string]interface{})
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

// @desc        Verify Phone Post
// @route       POST /user/phone/verify
// @access      Private
func (m *Respository) VerifyEmailPost(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Post verify email")

	obj := make(map[string]interface{})

	err := r.ParseForm()

	if err != nil {
		fmt.Printf("\n\tError parsing phone verification form")
		helpers.ServerError(w, err)
		return
	}

	// form validation
	form := forms.New(r.PostForm)
	form.Required("email")

	if !form.Valid() {
		log.Printf("Email form error: %s\n\n", form.Errors.Get("email"))
		obj["ok"] = false
		obj["form"] = form.Errors.Get("email")

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

	user, userOk := m.App.Session.Get(r.Context(), "user_id").(models.User)

	if !userOk {
		log.Println("Cannot get user_id data from session")
		m.App.ErrorLog.Println("Can't get user_id data from the session")
		m.App.Session.Put(r.Context(), "error", "Can't get user_id data from session")
		http.Redirect(w, r, "/user", http.StatusTemporaryRedirect)
		return
	}

	user.EmailVerified = true

	m.App.Session.Remove(r.Context(), "user_id")
	m.App.Session.Put(r.Context(), "user_id", user)

	fmt.Println("Email verified? ", user.EmailVerified)

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

// @desc        Verify Phone
// @route       GET /user/phone/verify
// @access      Private
func (m *Respository) VerifyPhone(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Get verify phone")

	obj := make(map[string]interface{})
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

// @desc        Verify Phone Post
// @route       POST /user/phone/verify
// @access      Private
func (m *Respository) VerifyPhonePost(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Post verify phone")

	obj := make(map[string]interface{})

	err := r.ParseForm()

	if err != nil {
		fmt.Printf("\n\tError parsing phone verification form")
		helpers.ServerError(w, err)
		return
	}

	// form validation
	form := forms.New(r.PostForm)
	form.Required("phone")

	if !form.Valid() {
		log.Printf("Phone form error: %s\n\n", form.Errors.Get("phone"))
		obj["ok"] = false
		obj["form"] = form.Errors.Get("phone")

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

	user, userOk := m.App.Session.Get(r.Context(), "user_id").(models.User)

	if !userOk {
		log.Println("Cannot get user_id data from session")
		m.App.ErrorLog.Println("Can't get user_id data from the session")
		m.App.Session.Put(r.Context(), "error", "Can't get user_id data from session")
		http.Redirect(w, r, "/user", http.StatusTemporaryRedirect)
		return
	}

	user.PhoneVerified = true

	m.App.Session.Remove(r.Context(), "user_id")
	m.App.Session.Put(r.Context(), "user_id", user)

	fmt.Println("Phone verified? ", user.PhoneVerified)

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
