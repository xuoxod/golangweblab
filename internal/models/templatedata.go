package models

import "github.com/xuoxod/weblab/internal/forms"

// Holds data sent from handler to template
type TemplateData struct {
	Data            map[string]interface{}
	CSRFToken       string
	Flash           string
	Warning         string
	Error           string
	Form            *forms.Form
	IsAuthenticated bool
	IsAdmin         bool
	User            User
}
