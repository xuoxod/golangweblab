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
const message = (event) => {
  Swal.fire({
    title: "",
    text: "Message",
    icon: "success",
    confirmButtonText: "Send",
    showCloseButton: true,
    showCancelButton: true,
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
    preConfirm: () => {
      return document.querySelector("#msg").value;
    },
  })
    .then((results) => {
      const { isConfirmed, isDenied, isDismissed, value } = results;
      log(results, "\n");

      const fromInput = document.querySelector("#fname").value;
      const email = document.querySelector("#email").value;
      const toInput = event.target.id.split("-")[1];
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
const oneToOneMessage_ = (msgObj) => {
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
    toast: true,
    position: "center",
    width: "58rem",
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

function handlePersonToPersonMessage(data) {
  const { fname, email, message } = data;

  if (isAlways(email)) {
    const chatTranscript = document.querySelector("#chat-transcript");
    const p = document.createElement("p");

    appendChild(chatTranscript, p);

    addAttribute(
      p,
      "class",
      "bg-warning-subtle rounded-3 text-primary-emphasis text-end p-3 text-break"
    );
    p.innerHTML = `<strong>${cap(fname)}</strong>: ${message}`;
    return;
  } else {
    // Confirm with user to accept this ptp message
    Swal.fire({
      title: `Message from ${cap(fname)}`,
      text: "Message",
      icon: "question",
      confirmButtonText: "Accept",
      showCloseButton: true,
      showCancelButton: true,
      toast: true,
      position: "center",
      width: "58rem",
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
      preConfirm: () => {
        return document.querySelector("#accepted-user").checked;
      },
    })
      .then((results) => {
        const { isConfirmed, isDenied, isDismissed, value } = results;
        log(results, "\n");

        if (value) {
          log(`Added user to accepted list\n${stringify(data)}\n`);
          const userObj = {};
          userObj.email = email;
          userObj.fname = fname;
          addAlways(userObj);
        }

        if (isConfirmed) {
          const chatTranscript = document.querySelector("#chat-transcript");
          const p = document.createElement("p");

          appendChild(chatTranscript, p);

          addAttribute(
            p,
            "class",
            "bg-warning-subtle rounded-3 text-primary-emphasis text-end p-3 text-break"
          );
          p.innerHTML = `<strong>${cap(fname)}</strong>: ${message}`;
          return;
        } else {
          Swal.closeModal();
        }
      })
      .catch((err) => {
        log(err);
      });
  }
}

function s_howMessage(msgObj) {
  const { from, message } = msgObj;
  Swal.fire({
    title: `Message from ${cap(from)}`,
    text: `${message}`,
    icon: "success",
    showCloseButton: true,
    toast: true,
    position: "bottom-end",
    width: "48rem",
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

function handleBroadcastMessage(data) {
  const { email, fname, message } = data;
  const chatTranscript = document.querySelector("#chat-transcript");
  const p = document.createElement("p");

  appendChild(chatTranscript, p);

  if (email == document.querySelector("#email").value) {
    addAttribute(
      p,
      "class",
      "bg-primary-subtle rounded-3 text-primary-emphasis text-start p-3 text-break"
    );
    p.innerHTML = `<strong>${cap("me")}</strong>: ${message}`;
  } else {
    addAttribute(
      p,
      "class",
      "bg-warning-subtle rounded-3 text-primary-emphasis text-end p-3 text-break"
    );
    p.innerHTML = `<strong>${cap(fname)}</strong>: ${message}`;
  }
}

function messageHandler(e) {
  // Display a prompt to capture user's message
  Swal.fire({
    title: "",
    text: "Message",
    icon: "success",
    confirmButtonText: "Send",
    showCloseButton: true,
    showCancelButton: true,
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
    preConfirm: () => {
      return [document.querySelector("#msg").value];
    },
  })
    .then((results) => {
      const { isConfirmed, isDenied, isDismissed } = results;
      log(results, "\n");

      const email = document.querySelector("#email").value;
      const fname = document.querySelector("#fname").value;
      const to = e.target.id.split("-")[1];
      const message = document.querySelector("#msg").value;

      if (isConfirmed) {
        log(`From ${email}\tName ${fname}\n`);
        log(`To ${to}\n`);
        log(`Message ${message}\n`);

        const jsonData = {};
        jsonData.action = "ptp";
        jsonData.to = to;
        jsonData.fname = fname;
        jsonData.email = email;
        jsonData.message = message;
        sendMessage(jsonData);
      } else {
        Swal.closeModal();
      }

      Swal.closeModal();
    })
    .catch((err) => {
      log(err);
    });
}
