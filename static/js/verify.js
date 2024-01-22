// Verify phone
const verifyPhoneButton = document.querySelector("#verify-phone-button");
const verifyPhoneInput = document.querySelector("#verify-phone-input");
const phoneContainer = document.querySelector(".phone-container");

const handlePhoneVerificationFormError = (data) => {
  log(`Phone Verification Failed\n`);
  log(`Phone Verification Form Error:\t${data["form"]}\n`);
  notify("error", `Phone verification failed with message ${data["form"]}`);
};

const handlePhoneVerificationFormSuccess = (data) => {
  log(`Phone Verification Succeeded\n`);
  notify("success", `Phone verification successful`);

  const timeout = setTimeout(() => {
    location.href = "/user/settings";
  }, 3000);
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

const verifyPhoneButtonHandler = () => {
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
  verifyPhone();
};

function verifyPhone() {
  log(`Requested phone verification`);

  const url = "/user/phone/verify";

  try {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        phoneVerificationResponse(data);
      });
  } catch (err) {
    log(err);
  }
}

function phoneVerificationResponse(response) {
  if (response["ok"]) {
    log(`Phone verification succeeded\n`);
  } else {
    log(`Phone verification failed\n`);
  }
}

// Verify email
const verifyEmailButton = document.querySelector("#verify-email-button");
const verifyEmailInput = document.querySelector("#verify-email-input");
const emailContainer = document.querySelector(".email-container");

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
  verifyEmail();
};

function verifyEmail() {
  log(`Requested email verification`);

  const url = "/user/email/verify";

  try {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        emailVerificationResponse(data);
      });
  } catch (err) {
    log(err);
  }
}

function emailVerificationResponse(response) {
  if (response["ok"]) {
    log(`Email verification succeeded\n`);
  } else {
    log(`Email verification failed\n`);
  }
}

// Register click event
if (verifyPhoneButton) {
  verifyPhoneButton.addEventListener("click", verifyPhoneButtonHandler);
}

if (verifyEmailButton) {
  verifyEmailButton.addEventListener("click", verifyEmailButtonHandler);
}
