package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/xuoxod/weblab/internal/forms"
	"github.com/xuoxod/weblab/internal/helpers"
	"github.com/xuoxod/weblab/internal/models"
)

const TESTCODE = "OUQTUINVU"

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

	user, userOk := m.App.Session.Get(r.Context(), "user_id").(models.User)

	if !userOk {
		log.Println("Cannot get user_id data from session")
		m.App.ErrorLog.Println("Can't get user_id data from the session")
		m.App.Session.Put(r.Context(), "error", "Can't get user_id data from session")
		http.Redirect(w, r, "/user", http.StatusTemporaryRedirect)
		return
	}

	var phoneNumber string = user.Phone

	/* TODO: write a more thorough phone validator */
	if !strings.Contains(phoneNumber, "+") {
		phoneNumber = fmt.Sprintf("+1%s", user.Phone)
	}

	fmt.Println("Sending verification code to phone number: ", phoneNumber)

	obj := make(map[string]interface{})
	obj["status"] = true
	obj["phone"] = phoneNumber
	obj["code"] = TESTCODE

	// obj := helpers.SendSmsVerify(phoneNumber)

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
func (m *Respository) PostVerifyPhone(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Post verify phone")

	user, userOk := m.App.Session.Get(r.Context(), "user_id").(models.User)

	if !userOk {
		log.Println("Cannot get user_id data from session")
		m.App.ErrorLog.Println("Can't get user_id data from the session")
		m.App.Session.Put(r.Context(), "error", "Can't get user_id data from session")
		http.Redirect(w, r, "/user", http.StatusTemporaryRedirect)
		return
	}

	/*
		m.App.Session.Remove(r.Context(), "user_id")
		m.App.Session.Put(r.Context(), "user_id", user) */

	fmt.Println("Phone verified? ", user.PhoneVerified)

	err := r.ParseForm()

	if err != nil {
		fmt.Printf("\n\tError parsing phone verification form\n\n")
		helpers.ServerError(w, err)
		return
	}

	code := r.Form.Get("verify-phone-input")
	var phoneNumber string = user.Phone

	/* TODO: write a more thorough phone number validator */
	if !strings.Contains(phoneNumber, "+") {
		phoneNumber = fmt.Sprintf("+1%s", user.Phone)
	}

	fmt.Printf("Received verification code: %v from user\n", code)
	fmt.Printf("User's phone number: %v\n\n", phoneNumber)

	obj := models.ObjModel{}

	good, vErr := helpers.VerifyCode(phoneNumber, code)

	if vErr != nil {
		obj.Status = false
		obj.Reason = vErr.Error()
	} else {
		obj.Code = code
		obj.Status = good
	}

	// obj := helpers.SendSmsVerify(phoneNumber)

	fmt.Printf("\tReturn map:\t %v\n\n", obj)

	out, err := json.MarshalIndent(obj, "", " ")

	if err != nil {
		log.Println(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	_, rErr := w.Write(out)

	if rErr != nil {
		log.Println(err.Error())
	}
}
