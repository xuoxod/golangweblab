const log = (msg) => console.log(msg);

const stringify = (obj) => JSON.stringify(obj);

const parser = (strObj) => JSON.parse(strObj);

const addHandler = (theElement, whichEvent, method) => {
  if (null != theElement && null != whichEvent && typeof method == "function") {
    theElement.addEventListener(whichEvent, method);
  }
};

const addClickHandler = (theElement, handler) => {
  if (null != theElement && typeof handler == "function") {
    addHandler(theElement, "click", handler);
  }
};

const addKeyupHandler = (theElement, handler) => {
  if (null != theElement && typeof handler == "function") {
    addHandler(theElement, "keyup", handler);
  }
};

const addKeydownHandler = (theElement, handler) => {
  if (null != theElement && typeof handler == "function") {
    addHandler(theElement, "keydown", handler);
  }
};

const addOnFocusHandler = (theElement, handler) => {
  if (null != theElement && typeof handler == "function") {
    addHandler(theElement, "focus", handler);
  }
};

const addOnChangeHandler = (theElement, handler) => {
  if (null != theElement && typeof handler == "function") {
    addHandler(theElement, "change", handler);
  }
};

const addOffFocusHandler = (theElement, handler) => {
  if (null != theElement && typeof handler == "function") {
    addHandler(theElement, "focusout", handler);
  }
};

const appendChild = (parent, child) => {
  if (null != parent && null != child) {
    parent.appendChild(child);
  }
};

const appendBeforeLastChild = (parent, child) => {
  if (null != parent && null != child) {
    const lastChildIndex = parent.children.length - 1;
    const lastChild = parent.children[lastChildIndex];
    parent.insertBefore(child, lastChild);
  }
};

const append = (parent, child) => {
  parent.append(child);
};

const removeChildren = (parent) => {
  parent.querySelectorAll("*").forEach((dialog) => {
    dialog.remove();
  });
};

const countChildren = (parent) => {
  if (null != parent) {
    return parent.children.length;
  }
  return null;
};

const addAttribute = (theElement, whichAttribute, attributeValue) => {
  if (null != theElement) {
    theElement.setAttribute(whichAttribute, attributeValue);
  }
};

const setAttribute = (theElement, whichAttribute, attributeValue) => {
  if (null != theElement) {
    theElement.setAttribute(whichAttribute, attributeValue);
  }
};

const getAttribute = (theElement, whichAttribute) => {
  if (null != theElement && null != whichAttribute) {
    return theElement.getAttribute(`${whichAttribute}`) || null;
  }
  return "Element is null";
};

const removeAttribute = (theElement, whichAttribute) => {
  if (null != theElement) {
    if (theElement.hasAttribute(whichAttribute)) {
      theElement.removeAttribute(whichAttribute);
    }
  }
};

const getElement = (nameIdClass) => {
  let element = null;
  if (null != (element = document.querySelector(`${nameIdClass}`))) {
    return element;
  }
  if (null != (element = document.querySelector(`#${nameIdClass}`))) {
    return element;
  }
  if (null != (element = document.querySelector(`.${nameIdClass}`))) {
    return element;
  }
  return null;
};

const cap = (arg) => {
  let word_split = null,
    line = "",
    word = arg.toString();
  if (null !== word && undefined !== word) {
    if (
      word.trim().toLowerCase() === "id" ||
      word.trim().toLowerCase() === "ssn" ||
      word.trim().toLowerCase() === "sku" ||
      word.trim().toLowerCase() === "vm" ||
      word.trim().toLowerCase() === "mac" ||
      word.trim().toLowerCase() === "imei" ||
      word.trim().toLowerCase() === "os" ||
      word.trim().toLowerCase() === "atm" ||
      word.trim().toLowerCase() === "pa" ||
      word.trim().toLowerCase() === "rjw"
    ) {
      return word.toUpperCase();
    } else if (word.match(/[-]/)) {
      if (null !== (word_split = word.split(["-"])).length > 0) {
        for (let i = 0; i < word_split.length; i++) {
          if (i < word_split.length - 1) {
            line +=
              word_split[i].substring(0, 1).toUpperCase() +
              word_split[i].substring(1) +
              "-";
          } else {
            line +=
              word_split[i].substring(0, 1).toUpperCase() +
              word_split[i].substring(1);
          }
        }
        return line;
      }
    } else if (word.match(/[ ]/)) {
      if (null !== (word_split = word.split([" "])).length > 0) {
        for (let i = 0; i < word_split.length; i++) {
          if (i < word_split.length - 1) {
            line +=
              word_split[i].substring(0, 1).toUpperCase() +
              word_split[i].substring(1) +
              " ";
          } else {
            line +=
              word_split[i].substring(0, 1).toUpperCase() +
              word_split[i].substring(1);
          }
        }
        return line;
      }
    } else {
      return word.substring(0, 1).toUpperCase() + word.substring(1);
    }
  }
};

const newElement = (type) => {
  if (null != type && typeof type == " string") {
    return document.createElement(type);
  }
  return null;
};

const handleSigninSuccess = (data) => {
  log(`Sign in successful`);
  location.href = "/user";
};

const handleSigninFailure = (data) => {
  log(`Sign in failed`);
  notify(data["type"], data["msg"]);
};

const handleSigninResults = (data) => {
  if (data["ok"]) {
    handleSigninSuccess();
  } else {
    handleSigninFailure(data);
  }
};

const handleRegistrationSuccess = (data) => {
  log(`Registration successful`);
  notify("success", "Registration Successful");
};

const handleRegistrationFailure = (data) => {
  log(`Registration failed`);
};

const handleRegistrationigninResults = (data) => {
  if (data["ok"]) {
    handleRegistrationSuccess();
  } else {
    handleRegistrationFailure(data);
  }
};

// notify display a custom alert to user
// type string: success, error or warning
// msg string: message to user
const notify = (type, msg, time = 3) => {
  notie.alert({
    type: type,
    text: msg,
    time: time,
  });
};

// modal display custom modal
// title string: modal's title
// text string: the message to user
// icon built-in: success, warning, error, info or question
// btnText string: button's text
// showStatus: true or false
const modal = (
  title,
  text,
  icon = "info",
  btnText = "Okay",
  btnClose = true,
  showStatus = true
) => {
  Swal.fire({
    title: title,
    text: text,
    icon: icon,
    confirmButtonText: btnText,
    showCloseButton: btnClose,
    showLoading: showStatus,
  });
};

// modal display custom toast
// title string: modal's title
// text string: the message to user
// icon built-in: success, warning, error, info or question
// btnText string: button's text
// showStatus: true or false
const message = (element) => {
  Swal.fire({
    title: "",
    text: "Message",
    icon: "success",
    confirmButtonText: "Send",
    showCloseButton: true,
    showCancelButton: true,
    showLoading: true,
    toast: true,
    position: "center",
    width: "58rem",

    html: `
  <div class="container-fluid">
    <div class="input-group">
      <textarea id="msg" type="text" name="msg" autocomplete="false"
        class="form-control"></textarea>
    </div>
  </div>
  `,
    focusConfirm: true,
    preConfirm: () => {
      return [document.querySelector("#msg").value];
    },
  })
    .then((results) => {
      const { isConfirmed, isDenied, isDismissed } = results;
      log(results, "\n");

      const fromInput = document.querySelector("#fname").value;
      const email = document.querySelector("#email").value;
      const toInput = element.id.split("-")[1];
      const message = document.querySelector("#msg").value;

      if (fromInput && message && toInput) {
        if (isConfirmed) {
          log(`From ${fromInput}\n`);
          log(`To ${toInput}\n`);
          log(`Message ${message}\n`);
          const jsonData = {};
          jsonData.action = "onetoone";
          jsonData.to = toInput;
          jsonData.from = fromInput;
          jsonData.email = email;
          jsonData.message = message;
          sendMessage(jsonData);
        } else {
          Swal.closeModal();
        }
      }

      Swal.closeModal();
    })
    .catch((err) => {
      log(err);
    });
};

// modal display custom toast
// title string: modal's title
// text string: the message to user
// icon built-in: success, warning, error, info or question
// btnText string: button's text
// showStatus: true or false
const oneToOneMessage = (msgObj) => {
  const { from, message, email } = msgObj;

  if (isAccepted(email)) {
    showMessage(msgObj);
    return;
  }

  Swal.fire({
    title: `Message from ${cap(from)}`,
    text: "Message",
    icon: "question",
    confirmButtonText: "Accept",
    showCloseButton: true,
    showCancelButton: true,
    showLoading: true,
    toast: true,
    position: "center",
    width: "58rem",
    focusConfirm: true,
    html: `
  <div class="container-fluid">
    <div class="form-check">
      <input id="accepted-user" class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
      <label class="form-check-label" for="flexCheckDefault">
        Always accept messages from this user
      </label>
    </div>
  </div>
  `,
    focusConfirm: true,
    preConfirm: () => {
      return document.querySelector("#accepted-user").checked;
    },
  })
    .then((results) => {
      const { isConfirmed, isDenied, isDismissed, value } = results;
      log(results, "\n");

      if (value) {
        log(`Added user to accepted list\n${stringify(msgObj)}\n`);
        const userObj = {};
        userObj.email = msgObj.email;
        userObj.fname = msgObj.from;
        addUser(userObj);
      }

      if (isConfirmed) {
        showMessage(msgObj);
        return;
      } else {
        Swal.closeModal();
      }
    })
    .catch((err) => {
      log(err);
    });
};

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
            <i class="bi bi-c-circle fs-3"></i>
          </strong>
        </label>

        <input type="text" value="2023" autocomplete="false" readonly class="form-control">
      </div>

      <div class="input-group mt-3">
        <label class="input-group-text">
          <strong>
            <i class="bi bi-tag fs-3"></i>
          </strong>
        </label>

        <input type="text" value="v0.0.3" autocomplete="false" readonly class="form-control">
      </div>

      <div class="input-group mt-3">
        <label class="input-group-text">
          <strong>
            <i class="bi bi-patch-check fs-3"></i>
          </strong>
        </label>

        <input type="text" value="RmediaTech" readonly  class="form-control">
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

function showMessage(msgObj) {
  const { from, message } = msgObj;
  Swal.fire({
    title: `Message from ${cap(from)}`,
    text: `${message}`,
    icon: "success",
    showCloseButton: true,
    showLoading: true,
    toast: true,
    position: "bottom-end",
    width: "48rem",
    focusClose: true,
    toast: true,
  })
    .then((results) => {
      const { isConfirmed, isDenied, isDismissed } = results;
      log(results, "\n");
      Swal.closeModal();
    })
    .catch((err) => {
      log(err);
    });
}

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
