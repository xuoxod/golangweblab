document.addEventListener("DOMContentLoaded", function () {
  const signinLink = document.querySelector("#mobile-sign-in");
  const registerLink = document.querySelector("#mobile-register");
  const aboutLink = document.querySelector("#mobile-about-link");
  const signinMenuLink = document.querySelector("#sign-in");
  const registerMenuLink = document.querySelector("#register");
  const aboutMenuLink = document.querySelector("#about-link");

  if (aboutLink && registerLink && aboutLink) {
    addClickHandler(aboutLink, about);

    addClickHandler(registerLink, register);

    addClickHandler(signinLink, signin);

    addClickHandler(aboutMenuLink, about);

    addClickHandler(registerMenuLink, register);

    addClickHandler(signinMenuLink, signin);
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

const about = async () => {
  const form = await Swal.fire({
    titleText: "About",
    icon: "info",
    animation: true,
    position: "center",
    timer: 4555,
    allowOutsideClick: true,
    allowEscapeKey: true,
    html: `
  <div class="container-fluid">
    <div class="row justify-content-center">
      <div class="input-group">
        <label class="input-group-text">
          <strong>
            <i class="bi bi-c-circle-fill fs-3 text-primary-emphasis"></i>
          </strong>
        </label>

        <input type="text" value=${
          document.querySelector("#copyright").value +
          " " +
          document.querySelector("#appdate").value
        } autocomplete="false" readonly class="form-control">
      </div>

      <div class="input-group mt-3">
        <label class="input-group-text">
          <strong>
            <i class="bi bi-file-code-fill fs-3 text-primary-emphasis"></i>
          </strong>
        </label>

        <input type="text" value=v${
          document.querySelector("#appver").value
        } autocomplete="false" readonly class="form-control">
      </div>

      <div class="input-group mt-3">
        <label class="input-group-text">
          <strong>
            <i class="bi bi-buildings-fill fs-3 text-primary-emphasis"></i>
          </strong>
        </label>

        <input type="text" value=${
          document.querySelector("#appname").value
        } readonly  class="form-control">
      </div>
    </div>
  </div>
  `,
    showCloseButton: true,
  })
    .then((results) => {
      log(results);
    })
    .catch((err) => {
      log(err);
    });
};

const signin = async () => {
  const form = await Swal.fire({
    title: "Log In",
    icon: "info",
    showConfirmButton: true,
    confirmButtonText: "Confirm",
    showCancelButton: true,
    cancelButtonText: "Cancel",
    allowEscapeKey: true,
    allowEnterKey: true,

    html: `
  <form id="signin-form">
    <div class="input-group">
      <label class="input-group-text">
        <strong>
          <i class="bi bi-envelope-at-fill fs-3"></i>
        </strong>
      </label>

      <input id="email" type="email" name="email" placeholder="Enter email address" autocomplete="false"
        class="form-control">
    </div>

    <div class="input-group mt-3">
      <label class="input-group-text">
        <strong>
          <i class="bi bi-lock-fill fs-3"></i>
        </strong>
      </label>

      <input id="password" type="password" name="password" placeholder="Enter password" autocomplete="true"
        class="form-control">
    </div>
  </form>
  `,
    focusConfirm: true,
    preConfirm: () => {
      return [
        document.querySelector("#email").value,
        document.querySelector("#password").value,
      ];
    },
  })
    .then((results) => {
      const { isConfirmed } = results;
      if (isConfirmed) {
        log(`Confirmed`);
        const signinForm = document.querySelector("#signin-form");
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;
        const token = document.querySelector("#csrf").value;

        if (email && password && token) {
          const formData = new FormData(signinForm);
          formData.append("csrf_token", token);
          try {
            fetch("/login", {
              method: "post",
              body: formData,
            })
              .then((response) => response.json())
              .then((data) => {
                handleSigninResults(data);
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

const register = async () => {
  const form = await Swal.fire({
    title: "Register",
    icon: "info",
    showConfirmButton: true,
    confirmButtonText: "Confirm",
    showCancelButton: true,
    cancelButtonText: "Cancel",
    allowEscapeKey: true,
    allowEnterKey: true,

    html: `
  <form id="register-form">
      <div class="input-group">
        <span class="input-group-text">
          <strong>
            <i class="bi bi-alphabet fs-3"></i>
          </strong>
        </span>

          <input type="text" id="fname" name="fname" placeholder=" Enter first name"
            autocomplete="false" class="form-control">
      </div>

      <div class="input-group mt-3">
        <span class="input-group-text">
          <strong>
            <i class="bi bi-alphabet fs-3"></i>
          </strong>
        </span>

          <input type="text" id="lname" name="lname" placeholder=" Enter last name"
            autocomplete="false" class="form-control">
      </div>

      <div class="input-group mt-3">
        <span class="input-group-text">
          <strong>
            <i class="bi bi-envelope-at-fill fs-3"></i>
          </strong>
        </span>

          <input type="email" id="email" name="email" placeholder=" Enter email address"
            autocomplete="false" class="form-control">
      </div>

      <div class="input-group mt-3">
        <span class="input-group-text">
          <strong>
            <i class="bi bi-telephone-fill fs-3"></i>
          </strong>
        </span>

          <input type="phone" id="phone" name="phone" placeholder=" Enter phone number"
            autocomplete="false" class="form-control">
      </div>

      <div class="input-group mt-3">
        <span class="input-group-text">
          <strong>
            <i class="bi bi-lock-fill fs-3"></i>
          </strong>
        </span>

          <input type="password" id="pwd1" name="pwd1" placeholder="Create password"
            autocomplete="true" class="form-control">

        <span class="input-group-text">
          <i id="pwd1-toggler" class="bi bi-eye-slash-fill fs-3"></i>
        </span>
      </div>

      <div class="input-group mt-3">
        <span class="input-group-text">
          <strong>
            <i class="bi bi-lock-fill fs-3"></i>
          </strong>
        </span>

          <input type="password" id="pwd2" name="pwd2" placeholder="Confirm password"
            autocomplete="true" class="form-control">
      </div>
  </form>
  `,
    focusConfirm: true,
    preConfirm: () => {
      return [
        document.querySelector("#fname").value,
        document.querySelector("#lname").value,
        document.querySelector("#email").value,
        document.querySelector("#phone").value,
        document.querySelector("#pwd1").value,
        document.querySelector("#pwd2").value,
      ];
    },
  })
    .then((results) => {
      const { isConfirmed } = results;
      if (isConfirmed) {
        log(`Confirmed`);
        const registerForm = document.querySelector("#register-form");
        const fname = document.querySelector("#fname").value;
        const lname = document.querySelector("#lname").value;
        const email = document.querySelector("#email").value;
        const phone = document.querySelector("#phone").value;
        const pwd1 = document.querySelector("#pwd1").value;
        const pwd2 = document.querySelector("#pwd2").value;
        const token = document.querySelector("#csrf").value;
        const showPassword = document.querySelector("pwd1-toggler");

        if (fname && lname && email && phone && pwd1 && pwd2) {
          if (pwd1 != pwd2) {
            notify("error", "Passwords don't match");
            return;
          }

          const formData = new FormData(registerForm);
          formData.append("csrf_token", token);
          try {
            fetch("/register", {
              method: "post",
              body: formData,
            })
              .then((response) => response.json())
              .then((data) => {
                handleRegistrationigninResults(data);
              });
          } catch (err) {
            log(err);
          }

          log(`Submitted registration Form\n`);
        } else {
          notify("error", "Missing required field(s)");
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

let showPasswordToggler = false;

document.addEventListener("click", (e) => {
  if (e.target.id.trim() == "pwd1-toggler") {
    log(`${e.target.id} was clicked\n`);
    const pwd1 = document.querySelector("#pwd1");
    const pwd2 = document.querySelector("#pwd2");
    showPasswordToggler = !showPasswordToggler;

    if (showPasswordToggler) {
      e.target.classList.remove("bi-eye-slash-fill");
      e.target.classList.add("bi-eye-fill");
      pwd1.type = "text";
      pwd2.type = "text";
    } else {
      e.target.classList.add("bi-eye-slash-fill");
      e.target.classList.remove("bi-eye-fill");
      pwd1.type = "password";
      pwd2.type = "password";
    }
  }
});
