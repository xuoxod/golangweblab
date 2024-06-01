// Verify phone
const verifyPhoneButton = document.querySelector("#verify-phone-button");
const verifyPhoneInput = document.querySelector("#verify-phone-input");
const phoneContainer = document.querySelector(".verify-phone-container");
const verifyPhoneForm = document.querySelector("#verify-phone-form");

const handlePhoneVerificationFormError = (data) => {
  log(`Phone Verification Failed\n`);
  log(`Phone Verification Form Error:\t${data["err"]}\n`);
  notify("error", `Phone verification failed with message ${data["reason"]}`);
};

const handlePhoneVerificationFormSuccess = (data) => {
  log(`Phone Verification Succeeded\n`);
  notify("success", `A verification code was sent to your phone`, 2);
  verifyPhoneForm.removeEventListener("submit", verifyPhoneFormHandler);
  verifyPhoneForm.addEventListener("submit", verifySentCode);
  setAttribute(verifyPhoneInput, "type", "number");
  setAttribute(verifyPhoneInput, "min", "1111111");
  setAttribute(verifyPhoneInput, "max", "9999999");
  removeAttribute(verifyPhoneInput, "readonly");
};

const sendPhoneVerification = () => {
  if (verifyPhoneInput.value) {
    log(`Sending phone verification code\n`);
    const formData = new FormData(verifyPhoneForm);

    try {
      fetch("/user/phone/verify", {
        method: "post",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data["ok"] == false) {
            handlePhoneVerificationFormError(data);
          } else {
            handlePhoneVerificationFormSuccess();
          }
        });
    } catch (err) {
      log(err);
    }

    verifyPhoneInput.value = "";
  }
};

// Init button click handler
const verifyPhoneButtonHandler = () => {
  if (countChildren(phoneContainer) > 1) {
    removeChildAt(phoneContainer, 1);
  }

  verifyPhoneInput.value = `Enter code`;
  verifyPhoneButton.innerText = `Submit`;

  const row = newElement("div");
  const col = newElement("div");
  const group = newElement("div");
  const label = newElement("label");
  const button = newElement("button");

  addAttribute(row, "class", "row mt-2");
  addAttribute(col, "class", "col");
  addAttribute(group, "class", "input-group");
  addAttribute(label, "class", "input-group-text fw-bold");
  addAttribute(button, "class", "btn btn-outline-primary");

  appendChild(phoneContainer, row);
  appendChild(row, col);
  appendChild(col, group);
  appendChild(group, label);
  appendChild(group, button);

  label.innerText = `Didn't get the code?`;
  button.innerText = `Send a new one`;
  button.addEventListener("click", () => {
    row.remove();
    verifyPhoneButtonHandler();
    verifyPhone();
  });
};

// Code verifier
function verifySentCode(e) {
  e.preventDefault();

  if (verifyPhoneInput.value) {
    const url = "/user/phone/verify";
    const csrfToken = document.querySelector(".csrf-token").value;
    const formData = new FormData(verifyPhoneForm);

    log(`\n\tSending token ${csrfToken}\n\n`);

    const options = {
      method: "post",
      body: formData,
    };

    try {
      fetch(url, options)
        .then((response) => response.json)
        .then((data) => {
          log(`\n\t\tResponse Data\n\t${JSON.stringify(data)}\n\n`);
          handleCodeVerificationResults(data);
        });
    } catch (err) {
      log(`\n\t\tFetch Error\n\n\t${JSON.stringify(err)}\n\n`);
      return;
    }
  } else {
    log(`Code not provided`);
    notify("warning", "Enter the verification code you had received via sms");
  }
}

function handleCodeVerificationResults(data) {
  log(`Server sent verification status: ${data["status"]}\n`);
  if (undefined != data && null != data) {
    if (data["status"] == true) {
      notify("success", `Phone verified\n`);
    } else {
      notify("error", `Code verification failed\n`);
    }
  } else {
    notify("error", `Error happened posting to URL`, 5);
  }
  return;
}

function verifyPhone() {
  log(`Requested phone verification`);

  const url = "/user/phone/verify";

  try {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        phoneVerificationResponseHandler(data);
      })
      .catch((err) => {
        log(err);
      });
  } catch (err) {
    log("Phone verification failed\n");
  }
}

function phoneVerificationResponseHandler(response) {
  log(`phone verification raw response: ${stringify(response)}`);
  if (response["status"]) {
    handlePhoneVerificationFormSuccess(response);
  } else {
    handlePhoneVerificationFormError(response);
  }
}

function verifyPhoneFormHandler(e) {
  e.preventDefault();
  verifyPhoneButtonHandler();
  verifyPhone();
}

// Verify email
const verifyEmailButton = document.querySelector("#verify-email-button");
const verifyEmailInput = document.querySelector("#verify-email-input");
const emailContainer = document.querySelector(".email-container");
const verifyEmailForm = document.querySelector("#verify-email-form");

const handleEmailVerificationFormError = (data) => {
  log(`Email Verification Failed\n`);
  log(`Email Verification Form Error:\t${data["form"]}\n`);
  notify("error", `Email verification failed with message ${data["form"]}`);
};

const handleEmailVerificationFormSuccess = (data) => {
  log(`Email Verification Succeeded\n`);
  notify("success", `Email verification successful`);

  const timeout = setTimeout(() => {
    clearTimeout(timeout);
    location.href = "/user/settings";
  }, 3000);
};

const sendEmailVerification = () => {
  if (verifyEmailInput.value) {
    log(`Sending email verification code\n`);
    const formData = new FormData(verifyEmailForm);

    try {
      fetch("/user/email/verify", {
        method: "post",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data["ok"] == false) {
            handleEmailVerificationFormError(data);
          } else {
            handleEmailVerificationFormSuccess();
          }
        });
    } catch (err) {
      log(err);
    }

    verifyEmailInput.value = "";
  }
};

const verifyEmailButtonHandler = () => {
  verifyEmailInput.value = `Enter code`;
  verifyEmailButton.innerText = `Submit`;

  const row = newElement("div");
  const col = newElement("div");
  const group = newElement("div");
  const label = newElement("label");
  const button = newElement("button");

  addAttribute(row, "class", "row mt-2");
  addAttribute(col, "class", "col");
  addAttribute(group, "class", "input-group");
  addAttribute(label, "class", "input-group-text fw-bold");
  addAttribute(button, "class", "btn btn-outline-primary");

  appendChild(emailContainer, row);
  appendChild(row, col);
  appendChild(col, group);
  appendChild(group, label);
  appendChild(group, button);

  label.innerText = `Didn't get the code?`;
  button.innerText = `Send a new one`;

  button.addEventListener("click", () => {
    row.remove();
    verifyEmailButtonHandler();
  });
  verifyEmail();
};

function verifyEmail() {
  if (emailContainer) {
    log(`Requested email verification`);

    const url = "/user/email/verify";

    try {
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          emailVerificationResponseHandler(data);
        });
    } catch (err) {
      log(err);
    }
  }
}

function emailVerificationResponseHandler(response) {
  if (response["ok"]) {
    log(`Email verification succeeded\n`);
  } else {
    log(`Email verification failed\n`);
  }
}

// Register form events
if (verifyPhoneForm) {
  verifyPhoneForm.addEventListener("submit", verifyPhoneFormHandler);
}

if (verifyEmailButton) {
  verifyEmailButton.addEventListener("click", verifyEmailButtonHandler);
}
