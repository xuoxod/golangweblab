// Update Account Picture

// Update Password
const changePasswordContainer = document.querySelector(
  ".change-password-container"
);
const changePasswordRow = document.querySelector(".change-password-row");
const changePasswordParent = document.querySelector("#change-password-parent");
const changePasswordDiv = document.querySelector("#change-password-div");

export const updatePassword = () => {
  prepareToSendVerificationCode();
};

function prepareToSendVerificationCode() {
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
        enterCode(results);
      } else {
        Swal.closeModal();
      }
    })
    .catch((err) => {
      log(err);
      Swal.closeModal();
    });
}

function enterCode(results) {
  const hide = "d-none";
  changePasswordParent.classList.add(hide);
  if (!document.querySelector(".enter-verification-container")) {
    appendChild(changePasswordRow, enterVerificationCode());
  }
  if (results.email) {
    log(`Send verification to your email`);
  } else {
    log(`Send verification to your phone`);
  }
}

function enterVerificationCode() {
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

  resendButton.addEventListener("click", prepareToSendVerificationCode);
  cancelButton.addEventListener("click", () => {
    container.remove();
    changePasswordParent.classList.remove("d-none");
  });

  return container;
}

function createNewPassword() {
  const cancelButton = document.createElement("button");
  const confirmButton = document.createElement("button");
  const buttonGroup = document.createElement("div");
  //   const firstLabel = document.createElement("span");
  //   const secondLabel = document.createElement("span");
  //   const thirdLabel = document.createElement("span");
  const pwd1Input = document.createElement("input");
  const pwd2Input = document.createElement("input");
  const pwd3Input = document.createElement("input");
  //   const pwd1InputGroup = document.createElement("div");
  //   const pwd2InputGroup = document.createElement("div");
  //   const pwd3InputGroup = document.createElement("div");
  const newPasswordDiv = document.createElement("div");

  addAttribute(cancelButton, "class", "btn btn-outline-primary");
  cancelButton.innerText = "Cancel";
  addAttribute(confirmButton, "class", "btn btn-outline-primary");
  cancelButton.innerText = "Confirm";
  addAttribute(
    buttonGroup,
    "class",
    "d-grid justify-content-center align-items-center"
  );
  appendChild(buttonGroup, confirmButton);
  appendChild(buttonGroup, cancelmButton);

  addAttribute(pwd1Input, "type", "password");
  addAttribute(pwd2Input, "type", "password");
  addAttribute(pwd3Input, "type", "password");
  addAttribute(pwd1Input, "class", "form-control");
  addAttribute(pwd2Input, "class", "form-control");
  addAttribute(pwd3Input, "class", "form-control");
  addAttribute(pwd1Input, "placeholder", "Current Password");
  addAttribute(pwd2Input, "placeholder", "New Password");
  addAttribute(pwd3Input, "placeholder", "Confirm Password");
  addAttribute(newPasswordDiv, "class", "d-grid v-gap-2");
  appendChild(newPasswordDiv, pwd1Input);
  appendChild(newPasswordDiv, pwd12nput);
  appendChild(newPasswordDiv, pwd13nput);
  appendChild(newPasswordDiv, buttonGroup);
  return newPasswordDiv;
}

// Update Email
const changeEmailParent = document.querySelector("#change-email-parent");
export const updateEmail = () => {
  removeChildren(changeEmailParent);
};

// Update Phone
const changePhoneParent = document.querySelector("#change-phone-parent");
export const updatePhone = () => {
  removeChildren(changePhoneParent);
};
