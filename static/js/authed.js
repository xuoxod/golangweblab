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

  /* Form submission results handlers */
  const handleAccountUpdateResults = (data) => {
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

  /* Click Handlers */

  // Account Link

  const handleAccount = async () => {
    const form = await Swal.fire({
      title: "Account",
      icon: "info",
      showConfirmButton: true,
      confirmButtonText: "Confirm",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      allowEscapeKey: true,
      allowEnterKey: true,

      html: `
  <form id="account-form">
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
          const signinForm = document.querySelector("#account-form");
          const email = document.querySelector("#email").value;
          const token = document.querySelector("#csrf").value;

          if (email && token) {
            const formData = new FormData(signinForm);
            formData.append("csrf_token", token);
            try {
              fetch("/user", {
                method: "post",
                body: formData,
              })
                .then((response) => response.json())
                .then((data) => {
                  handleAccountUpdateResults(data);
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

  const accountLinkHandler = () => {
    log(`Account link clicked`);
    handleAccount();
  };

  const profileLinkHandler = () => {
    log(`Profile link clicked`);
  };

  const settingsLinkHandler = () => {
    log(`Settings link clicked`);
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
