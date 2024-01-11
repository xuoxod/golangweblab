document.addEventListener("DOMContentLoaded", function () {
  const accountLink = document.querySelector(".account-link");
  const profileLink = document.querySelector(".profile-link");
  const settingsLink = document.querySelector(".settings-link");
  const mobileAccountLink = document.querySelector(".mobile-account-link");
  const mobileProfileLink = document.querySelector(".mobile-profile-link");
  const mobileSettingsLink = document.querySelector(".mobile-settings-link");
  const indexAccountLink = document.querySelector("#index-account");
  const indexProfileLink = document.querySelector("#index-profile");
  const indexSettingsLink = document.querySelector("#index-settings");
  const deleteAccountButton = document.querySelector("#delete-account");

  /* Profile form submission results handler */
  const handleProfileUpdateResults = (data) => {
    if (data["ok"]) {
      this.location.href = "/user";
    } else {
      // notify(data["type"], data["msg"]);
      const type = "error";
      const msg = [];

      if (data["email"]) {
        msg.push({ title: "email", message: data["email"] });
      }

      if (data["phone"]) {
        msg.push({ title: "phone", message: data["phone"] });
      }

      if (data["fname"]) {
        msg.push({ title: "first name", message: data["fname"] });
      }

      if (data["lname"]) {
        msg.push({ title: "last name", message: data["lname"] });
      }

      let errors = "";

      for (let i = 0; i < msg.length; i++) {
        const m = msg[i];
        if (i < msg.length - 1) {
          errors += `${cap(m.title)}:\t${m.message}, `;
        } else {
          errors += `${cap(m.title)}:\t${m.message}`;
        }
      }
      const options = {};
      options.type = "error";
      options.text = errors;
      options.stay = true;
      notie.alert(options);
    }
  };

  /* Preferences form submission results handler */
  const handlePreferencesUpdateResults = (data) => {
    if (data["ok"]) {
      log(`Settings Changed\n\n`);
      this.location.href = "/user";
    } else {
      log(`Settings Error`);
    }
  };

  /* Click Handlers */

  // Account Link
  const accountLinkHandler = () => {
    log(`Account link clicked`);
    this.location.href = "/user/account";
  };

  // Profile Link
  const handleProfile = async () => {
    const form = await Swal.fire({
      title: "Profile",
      icon: "info",
      showConfirmButton: true,
      confirmButtonText: "Submit",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      allowEscapeKey: true,
      allowEnterKey: true,

      html: `
  <form id="profile-form">
    <div class="input-group">
      <label class="input-group-text">
        <strong>
          <i class="bi bi-alphabet fs-3"></i>
        </strong>
      </label>

      <input type="text" id="afname" name="fname" value=${cap(
        document.querySelector("#fname").value
      )} placeholder="Enter first name" autocomplete="false"
        class="form-control">
    </div>

    <div class="input-group">
      <label class="input-group-text">
        <strong>
          <i class="bi bi-alphabet fs-3"></i>
        </strong>
      </label>

      <input type="text" id="alname" name="lname" value=${cap(
        document.querySelector("#lname").value
      )} placeholder="Enter last name" autocomplete="false"
        class="form-control" required>
    </div>

    <div class="input-group">
      <label class="input-group-text">
        <strong>
          <i class="bi bi-person-vcard fs-3"></i>
        </strong>
      </label>

      <input type="text" id="auname" name="uname" value=${cap(
        document.querySelector("#uname").value
      )} placeholder="Enter user name" autocomplete="false"
        class="form-control">
    </div>

    <div class="input-group">
      <label class="input-group-text">
        <strong>
          <i class="bi bi-envelope-fill fs-3"></i>
        </strong>
      </label>

      <input type="email" id="aemail" name="email" value=${
        document.querySelector("#email").value
      } placeholder="Enter email address" autocomplete="false"
        class="form-control" required>
    </div>

    <div class="input-group">
      <label class="input-group-text">
        <strong>
          <i class="bi bi-telephone-fill fs-3"></i>
        </strong>
      </label>

      <input type="tel" id="aphone" name="phone" value=${
        document.querySelector("#phone").value
      } placeholder="Enter phone number" autocomplete="false"
        class="form-control" required>
    </div>

    <div class="input-group">
      <label class="input-group-text">
        <strong>
          <i class="bi bi-geo-fill fs-3"></i>
        </strong>
      </label>

      <input type="text" id="aaddress" name="address" value=${
        document.querySelector("#address").value
      } placeholder="Enter address" autocomplete="false"
        class="form-control">
    </div>

    <div class="input-group">
      <label class="input-group-text">
        <strong>
          <i class="bi bi-geo-fill fs-3"></i>
        </strong>
      </label>

      <input type="text" id="acity" name="city" value=${
        document.querySelector("#city").value
      } placeholder="Enter city" autocomplete="false"
        class="form-control">
    </div>

    <div class="input-group">
      <label class="input-group-text">
        <strong>
          <i class="bi bi-geo-fill fs-3"></i>
        </strong>
      </label>

      <input type="text" id="astate" name="state" value=${
        document.querySelector("#state").value
      } placeholder="Enter state" autocomplete="false"
        class="form-control">
    </div>

    <div class="input-group">
      <label class="input-group-text">
        <strong>
          <i class="bi bi-geo-fill fs-3"></i>
        </strong>
      </label>

      <input type="number" min="11111" max="99999" id="azipcode" name="zipcode" value=${
        document.querySelector("#zipcode").value
      } placeholder="Enter zipcode" autocomplete="false"
        class="form-control">
    </div>

  </form>
  `,
      focusConfirm: true,
      preConfirm: () => {
        return [
          document.querySelector("#afname").value,
          document.querySelector("#alname").value,
          document.querySelector("#auname").value,
          document.querySelector("#aemail").value,
          document.querySelector("#aphone").value,
          document.querySelector("#aaddress").value,
          document.querySelector("#acity").value,
          document.querySelector("#astate").value,
          document.querySelector("#azipcode").value,
        ];
      },
    })
      .then((results) => {
        log(`Results\t${stringify(results)}\n\n`);
        const { isConfirmed } = results;
        if (isConfirmed) {
          log(`Confirmed`);
          const profileForm = document.querySelector("#profile-form");
          const email = document.querySelector("#email").value;
          const token = document.querySelector("#csrf").value;

          if (email && token) {
            const formData = new FormData(profileForm);
            formData.append("csrf_token", token);
            try {
              fetch("/user", {
                method: "post",
                body: formData,
              })
                .then((response) => response.json())
                .then((data) => {
                  handleProfileUpdateResults(data);
                });
            } catch (err) {
              log(err);
            }
            log(`Submitted Signin Form\n`);
          } else {
            Swal.closeModal();
          }
        } else {
          log(`Dismissed`);
          Swal.closeModal();
        }
      })
      .catch((err) => {
        log(err);
      });
  };

  const profileLinkHandler = () => {
    log(`Profile link clicked`);
    handleProfile();
  };

  // Settings Link
  const handleSettings = async () => {
    const form = await Swal.fire({
      title: "Settings",
      icon: "info",
      showConfirmButton: true,
      confirmButtonText: "Submit",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      allowEscapeKey: true,
      allowEnterKey: true,

      html: `
  <form id="settings-form">
    <div class="input-group mb-3">
      <div class="input-group-text">
        <input class="form-check-input mt-0" id="asmsnots" name="smsnots" ${
          document.querySelector("#enablesmsnots").value == "true"
            ? "checked"
            : ""
        } type="checkbox" value="" aria-label="Enable SMS Notifications">
      </div>
      <input type="text" class="form-control" aria-label="Enable SMS Notifications" value="Enable SMS Notifications" readonly>
    </div>

    <div class="input-group mb-3">
      <div class="input-group-text">
        <input class="form-check-input mt-0" id="aemailnots" name="emailnots" ${
          document.querySelector("#enableemailnots").value == "true"
            ? "checked"
            : ""
        } type="checkbox" value="" aria-label="Enable Email Notifications">
      </div>
      <input type="text" class="form-control" aria-label="Enable Email Notifications" value="Enable Email Notifications" readonly>
    </div>

    <div class="input-group mb-3">
      <div class="input-group-text">
        <input class="form-check-input mt-0" id="publicpro" name="publicpro" ${
          document.querySelector("#enablepublicprofile").value == "true"
            ? "checked"
            : ""
        } type="checkbox" value="" aria-label="Enable Public Profile">
      </div>
      <input type="text" class="form-control" aria-label="Enable Public Profile" value="Enable Public Profile" readonly>
    </div>

    <div class="input-group mb-3">
      <div class="input-group-text">
        <input class="form-check-input mt-0" id="permvis" name="permvis" ${
          document.querySelector("#permvisible").value == "true"
            ? "checked"
            : ""
        } type="checkbox" value="" aria-label="Stay Visible">
      </div>
      <input type="text" class="form-control" aria-label="Stay Visible" value="Stay Visible" readonly>
    </div>


  </form>
  `,
      focusConfirm: true,
      preConfirm: () => {
        return [
          document.querySelector("#asmsnots").value,
          document.querySelector("#aemailnots").value,
          document.querySelector("#permvis").value,
        ];
      },
    })
      .then((results) => {
        log(`Results\t${stringify(results)}\n\n`);
        const { isConfirmed } = results;
        if (isConfirmed) {
          log(`Confirmed`);
          const settingsForm = document.querySelector("#settings-form");
          const token = document.querySelector("#csrf").value;

          if (token) {
            const formData = new FormData(settingsForm);
            formData.append("csrf_token", token);
            try {
              fetch("/user/settings", {
                method: "post",
                body: formData,
              })
                .then((response) => response.json())
                .then((data) => {
                  handlePreferencesUpdateResults(data);
                });
            } catch (err) {
              log(err);
            }
            log(`Submitted Signin Form\n`);
          } else {
            Swal.closeModal();
          }
        } else {
          log(`Dismissed`);
          Swal.closeModal();
        }
      })
      .catch((err) => {
        log(err);
      });
  };

  const settingsLinkHandler = () => {
    log(`Settings link clicked`);
    handleSettings();
  };

  // Delete Account Button
  const deleteAccountHandler = () => {
    confirm(
      "You are about to permantly delete your account, once this done it can not be undone. Are you sure you want to do this?",
      null,
      null,
      () => {
        log(`Deleted your account`);
      },
      () => {
        log(`Cancelled account deletion`);
      }
    );
  };

  if (accountLink && profileLink && settingsLink) {
    addClickHandler(accountLink, accountLinkHandler);

    addClickHandler(profileLink, profileLinkHandler);

    addClickHandler(settingsLink, settingsLinkHandler);

    addClickHandler(mobileAccountLink, accountLinkHandler);

    addClickHandler(mobileProfileLink, profileLinkHandler);

    addClickHandler(mobileSettingsLink, settingsLinkHandler);

    addClickHandler(indexAccountLink, accountLinkHandler);

    addClickHandler(indexProfileLink, profileLinkHandler);

    addClickHandler(indexSettingsLink, settingsLinkHandler);

    addClickHandler(deleteAccountButton, deleteAccountHandler);
  }
});

function siteMenuEffect() {
  var x = document.getElementById("site-menu");
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
  } else {
    x.className = x.className.replace(" w3-show", "");
  }
}
