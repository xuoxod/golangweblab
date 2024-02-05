const hide = "d-none";

// Update Email
const emailParent = document.querySelector("#change-email-parent");
const emailRow = document.querySelector(".change-email-row");
export const updateEmail = () => {
  prepareToSendVerificationCode((results) => {
    const { status, email, phone } = results;
    if (status) {
      if (email) {
        log(`Send verification to your email`);
      } else {
        log(`Send verification to your phone`);
      }
      emailParent.classList.add(hide);
      appendChild(emailRow, enterVerificationCode("email"));
    }
  });
};

// Update Password
const changePasswordContainer = document.querySelector(
  ".change-password-container"
);
const changePasswordRow = document.querySelector(".change-password-row");
const changePasswordParent = document.querySelector("#change-password-parent");
const changePasswordDiv = document.querySelector("#change-password-div");
export const updatePassword = () => {
  prepareToSendVerificationCode((results) => {
    const { status, email, phone } = results;
    if (status) {
      if (email) {
        log(`Send verification to your email`);
      } else {
        log(`Send verification to your phone`);
      }
      changePasswordParent.classList.add(hide);
      appendChild(changePasswordRow, enterVerificationCode("password"));
    }
  });
};

// Update Phone
const changePhoneParent = document.querySelector("#change-phone-parent");
const changePhoneDiv = document.querySelector("#change-phone-div");
export const updatePhone = () => {
  prepareToSendVerificationCode((results) => {
    const { status, email, phone } = results;
    if (status) {
      if (email) {
        log(`Send verification to your email`);
      } else {
        log(`Send verification to your phone`);
      }
      changePhoneDiv.classList.add(hide);
      appendChild(changePhoneParent, enterVerificationCode("phone"));
    }
  });
};

export const updatePicture = () => {
  prepareToSendVerificationCode((results) => {
    const { status, email, phone } = results;
    if (status) {
      if (email) {
        log(`Send verification to your email`);
      } else {
        log(`Send verification to your phone`);
      }
    }
  });
};

// Creates an alert to send verification code
function prepareToSendVerificationCode(cb) {
  const text =
    "We'll send you a verification code to verify it's you. How do you want to receive it?";
  Swal.fire({
    title: text,
    text: "Message",
    icon: "success",
    confirmButtonText: "Confirm",
    showCloseButton: true,
    showCancelButton: true,
    toast: true,
    position: "top",
    width: "58rem",

    html: `
  <div class="container-fluid">
    <input type="radio" class="btn-check" name="options-base" id="option5" autocomplete="off" checked>
    <label class="btn" for="option5">Email</label>

    <input type="radio" class="btn-check" name="options-base" id="option6" autocomplete="off">
    <label class="btn" for="option6">SMS</label>
  </div>
  `,
    preConfirm: async () => {
      try {
        return stringify({
          status: true,
          email: document.querySelector("#option5").checked,
          phone: document.querySelector("#option6").checked,
        });
      } catch (err) {
        return stringify({ status: false });
      }
    },
  })
    .then((results) => {
      const { isConfirmed, isDenied, isDismissed, value } = results;
      if (isConfirmed) {
        const results = JSON.parse(value);
        cb(results);
      } else {
        Swal.closeModal();
      }
    })
    .catch((err) => {
      log(err);
      Swal.closeModal();
    });
}

function enterVerificationCode(whichBlock) {
  const container = document.createElement("div");
  const row1 = document.createElement("div");
  const row2 = document.createElement("div");
  const row3 = document.createElement("div");
  const inputGroup1 = document.createElement("div");
  const inputGroup2 = document.createElement("div");
  const inputGroup3 = document.createElement("div");
  const label1 = document.createElement("span");
  const label2 = document.createElement("span");
  const label3 = document.createElement("span");
  const input = document.createElement("input");
  const resendButton = document.createElement("button");
  const cancelButton = document.createElement("button");
  const bi = document.createElement("i");

  addAttribute(
    container,
    "class",
    "container my-2 enter-verification-container"
  );
  addAttribute(row1, "class", "row mb-2");
  addAttribute(row2, "class", "row mb-2");
  addAttribute(row3, "class", "row");
  addAttribute(inputGroup1, "class", "input-group input-group-lg");
  addAttribute(inputGroup2, "class", "input-group input-group-lg");
  addAttribute(inputGroup3, "class", "input-group input-group-lg");
  addAttribute(label1, "class", "input-group-text fw-bold");
  addAttribute(label2, "class", "input-group-text fw-bold");
  addAttribute(label3, "class", "input-group-text fw-bold");
  addAttribute(input, "type", "number");
  addAttribute(input, "class", "form-control fw-bold");
  addAttribute(input, "placeholder", "Enter verification code");
  addAttribute(resendButton, "type", "button");
  addAttribute(resendButton, "class", "btn btn-outline-primary fw-bold");
  addAttribute(cancelButton, "type", "button");
  addAttribute(cancelButton, "class", "btn btn-outline-success fw-bold");
  addAttribute(bi, "class", "bi bi-123");

  label2.innerText = "Didn't get the code?";
  label3.innerText = "Changed your mind?";
  resendButton.innerText = "Send new code";
  cancelButton.innerText = "Cancel";

  appendChild(label1, bi);
  appendChild(inputGroup1, label1);
  appendChild(inputGroup1, input);
  appendChild(inputGroup2, label2);
  appendChild(inputGroup2, resendButton);
  appendChild(inputGroup3, label3);
  appendChild(inputGroup3, cancelButton);
  appendChild(row1, inputGroup1);
  appendChild(row2, inputGroup2);
  appendChild(row3, inputGroup3);
  appendChild(container, row1);
  appendChild(container, row2);
  appendChild(container, row3);

  resendButton.addEventListener("click", () => {
    switch (whichBlock.toLowerCase().trim()) {
      case "password":
        prepareToSendVerificationCode((results) => {
          const { status, email, phone } = results;
          if (status) {
            if (email) {
              log(`Send verification to your email`);
            } else {
              log(`Send verification to your phone`);
            }
            if (!document.querySelector(".enter-verification-container")) {
              changePasswordParent.classList.add(hide);
              appendChild(changePasswordRow, enterVerificationCode("password"));
            }
          }
        });
        break;

      case "email":
        prepareToSendVerificationCode((results) => {
          const { status, email, phone } = results;
          if (status) {
            if (email) {
              log(`Send verification to your email`);
            } else {
              log(`Send verification to your phone`);
            }
            if (!document.querySelector(".enter-verification-container")) {
              emailParent.classList.add(hide);
              appendChild(emailRow, enterVerificationCode("email"));
            }
          }
        });
        break;

      case "phone":
        prepareToSendVerificationCode((results) => {
          const { status, email, phone } = results;
          if (status) {
            if (email) {
              log(`Send verification to your email`);
            } else {
              log(`Send verification to your phone`);
            }
            if (!document.querySelector(".enter-verification-container")) {
              changePhoneDiv.classList.add(hide);
              appendChild(changePhoneParent, enterVerificationCode("phone"));
            }
          }
        });
    }
  });
  cancelButton.addEventListener("click", () => {
    container.remove();
    switch (whichBlock.toLowerCase().trim()) {
      case "password":
        changePasswordParent.classList.remove("d-none");
        break;

      case "email":
        emailParent.classList.remove("d-none");
        break;

      case "phone":
        changePhoneDiv.classList.remove("d-none");
        break;
    }
  });

  return container;
}
