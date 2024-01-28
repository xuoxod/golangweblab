document.addEventListener("DOMContentLoaded", () => {
  /* Controls */

  // Account Picture
  const accountPicture = document.querySelector("#account-picture");
  const uploadPictureButton = document.querySelector("#upload-picture-button");
  const changePasswordParent = document.querySelector(
    "#change-password-parent"
  );

  // Change Password
  const changePasswordDiv = document.querySelector("#change-password-div");
  const changePasswordButton = document.querySelector(
    "#change-password-button"
  );

  // Change Email
  const changeEmailParent = document.querySelector("#change-email-parent");
  const changeEmailDiv = document.querySelector("#change-email-div");
  const changeEmailButton = document.querySelector("#change-email-button");

  // Change Phone
  const changePhoneParent = document.querySelector("#change-phone-parent");
  const changePhoneDiv = document.querySelector("#change-phone-div");
  const changePhoneButton = document.querySelector("#change-phone-button");

  // Input Values
  const password = document.querySelector("#password").value;
  const email = document.querySelector("#email").value;
  const phone = document.querySelector("#phone").value;
});
