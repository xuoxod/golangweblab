package helpers

import (
	"errors"
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
	params.SetLocale("en")

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
			results["lookup"] = resp.Lookup
			results["sna"] = resp.Sna
			results["url"] = resp.Url
			results["createdat"] = resp.DateCreated
			results["updatedat"] = resp.DateUpdated
			// results["sid"] = resp.Sid
		} else {
			fmt.Println(resp.Sid)
			results["results"] = resp.Status
			results["status"] = true
			results["to"] = resp.To
			results["sid"] = resp.Sid
			results["channel"] = resp.Channel
			results["servicesid"] = resp.ServiceSid
			results["lookup"] = resp.Lookup
			results["sna"] = resp.Sna
			results["url"] = resp.Url
			results["createdat"] = resp.DateCreated
			results["updatedat"] = resp.DateUpdated
		}
	}

	return results
}

func VerifyCode(phoneNumber, verificationCode string) (bool, error) {
	// Find your Account SID and Auth Token at twilio.com/console
	// and set the environment variables. See http://twil.io/secure
	// 	const accountSid = process.env.TWILIO_ACCOUNT_SID;
	// const authToken = process.env.TWILIO_AUTH_TOKEN;

	accountSid := os.Getenv("TWILIO_ACCOUNT_SID")
	authToken := os.Getenv("TWILIO_AUTH_TOKEN")

	// const client = require('twilio')(accountSid, authToken);

	client := twilio.NewRestClientWithParams(twilio.ClientParams{
		Username: accountSid,
		Password: authToken,
	})

	params := &verify.CreateVerificationCheckParams{}
	params.SetTo(phoneNumber)
	params.SetCode(verificationCode)

	resp, err := client.VerifyV2.CreateVerificationCheck(accountSid, params)
	if err != nil {
		fmt.Printf("\n\t\tVerification Error\n")
		// fmt.Printf("\tStatus:\t%v\n", resp.Status)
		// fmt.Printf("\tTo:\t%v\n", resp.To)
		// fmt.Printf("\tSID:\t%v\n", resp.Sid)
		// fmt.Printf("\tErrorMessage:\t%v\n\n", err.Error())
		return false, err
	} else {
		status := strings.ToLower(strings.TrimSpace(*resp.Status))
		fmt.Printf("\n\t\tVerification Status\n\t%s", status)
		fmt.Printf("\n\t\tVerification Response\n\t%v\n\n", resp)
		// return true, nil
		switch status {
		case "approved":
			return true, nil
		default:
			return false, errors.New("The verification code failed")
		}
	}
}
