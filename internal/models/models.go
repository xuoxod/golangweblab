package models

import (
	"time"
)

type VerifyStatus struct {
	Status bool   `json:"status"`
	Code   string `json:"code"`
}

type Signin struct {
	Email    string
	Password string
}

// User registration data
type Registration struct {
	FirstName       string
	LastName        string
	Email           string
	Phone           string
	PasswordCreate  string
	PasswordConfirm string
}

type RegistrationErrData struct {
	Data map[string]string
}

// User
type User struct {
	ID            int
	FirstName     string
	LastName      string
	Email         string
	Phone         string
	Password      string
	EmailVerified bool
	PhoneVerified bool
	AccessLevel   int
	CreatedAt     time.Time
	UpdatedAt     time.Time
}

// User profile
type Profile struct {
	ID        int
	UserID    int
	UserName  string
	Image     byte
	Address   string
	City      string
	State     string
	Zipcode   string
	UpdatedAt time.Time
	CreatedAt time.Time
}

// User preferences
type Preferences struct {
	ID                       int
	UserID                   int
	EnablePublicProfile      bool
	EnableSmsNotifications   bool
	EnableEmailNotifications bool
	Visible                  bool
	PermanentVisible         bool
	UpdatedAt                time.Time
	CreatedAt                time.Time
}

// Auth variable
type Authentication struct {
	Auth bool
}

// All users
type Collection interface {
	CreateCollection()
}

type AllUsers struct {
	Collection map[string]User
}

type ObjModel struct {
	Status bool   `json:"status"`
	Ok     bool   `json:"ok"`
	Code   string `json:"code"`
	To     string `json:"to"`
	Reason string `json:"reason"`
	ErrMsg string `json:"errmsg"`
	WarMsg string `json:"warmsg"`
	SucMsg string `json:"sucmsg"`
}
