import {
  updatePassword,
  updateEmail,
  updatePhone,
  updatePicture,
} from "./account-ui.js";

document.addEventListener("DOMContentLoaded", () => {
  /* Controls */

  // Account Picture
  const accountPicture = document.querySelector("#account-picture");
  const uploadPictureButton = document.querySelector("#upload-picture-button");

  // Change Password
  const changePasswordButton = document.querySelector(
    "#change-password-button"
  );
  changePasswordButton.addEventListener("click", updatePassword);

  // Change Email
  const changeEmailButton = document.querySelector("#change-email-button");
  changeEmailButton.addEventListener("click", updateEmail);

  // Change Phone
  const changePhoneButton = document.querySelector("#change-phone-button");
  changePhoneButton.addEventListener("click", updatePhone);

  // Input Values
  const password = document.querySelector("#password").value;
  const email = document.querySelector("#email").value;
  const phone = document.querySelector("#phone").value;
});
