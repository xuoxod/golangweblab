package helpers

import (
	"fmt"
	"os"
	"regexp"
	"strings"

	"github.com/twilio/twilio-go"
	verify "github.com/twilio/twilio-go/rest/verify/v2"
)

func SendSmsVerify(phoneNumber string) map[string]interface{} {
	// client := twilio.NewRestClient()
	results := make(map[string]interface{})
	phone := ""
	accountSid := os.Getenv("TWILIO_VERIFY_SID")
	// apiKey := os.Getenv("TWILIO_SID")
	// authToken := os.Getenv("TWILIO_AUTH_TOKEN")

	client := twilio.NewRestClient()

	if strings.Contains(phoneNumber, "+") {
		matched, err := regexp.MatchString(`^\+[0-9]{11}`, phoneNumber)

		if err != nil {
			fmt.Println("Error:\t", err.Error())
			results["status"] = false
			results["err"] = err.Error()
			results["reason"] = "Regexp failed"
			return results
		}

		if matched {
			phone = phoneNumber

		} else {
			results["status"] = false
			results["err"] = "Phone number formatted wrong"
			results["reason"] = phoneNumber
			return results
		}
	}

	/* params := &verify.CreateVerificationParams{}
	params.SetTo(phone)
	params.SetCustomFriendlyName("RmediaTech")
	params.SetChannel("sms")

	resp, err := client.VerifyV2.CreateVerification(accountSid, params)
	if err != nil {
		fmt.Println(err.Error())
		results["status"] = false
		results["err"] = err.Error()
		results["reason"] = resp.Status
	} else {
		if resp.Sid != nil {
			fmt.Println(*resp.Sid)
			results["status"] = resp.Status
			results["sid"] = resp.Sid
		} else {
			fmt.Println(*resp)
			results["status"] = resp.Status
		}
	} */

	params := &verify.CreateVerificationParams{}
	params.SetTo(phone)
	params.SetChannel("sms")

	resp, err := client.VerifyV2.CreateVerification(accountSid, params)
	if err != nil {
		fmt.Println(err.Error())
		results["status"] = false
		results["err"] = err.Error()
		results["reason"] = resp.Status
	} else {
		if resp.Sid != nil {
			fmt.Println(*resp.Sid)
			results["status"] = resp.Status
			results["to"] = resp.To
			results["sid"] = resp.Sid
			results["channel"] = resp.Channel
			results["servicesid"] = resp.ServiceSid
			// results["sid"] = resp.Sid
		} else {
			fmt.Println(resp.Sid)
			results["results"] = resp.Status
			results["status"] = true
			results["to"] = resp.To
			results["sid"] = resp.Sid
			results["channel"] = resp.Channel
			results["servicesid"] = resp.ServiceSid
		}
	}

	return results
}

func VerifyCode(phoneNumber, verificationCode string) bool {
	// Find your Account SID and Auth Token at twilio.com/console
	// and set the environment variables. See http://twil.io/secure
	client := twilio.NewRestClient()

	accountSid := os.Getenv("TWILIO_VERIFY_SID")

	params := &verify.CreateVerificationCheckParams{}
	params.SetTo(phoneNumber)
	params.SetCode(verificationCode)

	resp, err := client.VerifyV2.CreateVerificationCheck(accountSid, params)
	if err != nil {
		fmt.Printf("\n\t\tVerification Error\n\t%s\n\n", err.Error())
		return false
	} else {
		status := strings.ToLower(strings.TrimSpace(*resp.Status))
		fmt.Printf("\n\t\tVerification Status\n\t%s", status)
		fmt.Printf("\n\t\tVerification Response\n\t%v\n\n", resp)

		switch status {
		case "approved":
			return true
		default:
			return false

		}
	}
}
