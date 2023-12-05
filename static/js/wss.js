let socket = null;
const clients = {};
const alwaysAcceptMessagesFrom = {};
let transcripts = [];

function addTranscript(objT) {
  const { email, fname, message } = objT;
  const transcriptData = {};
  transcriptData.email = email;
  transcriptData.fname = fname;
  transcriptData.message = message;
  transcripts.push(transcriptData);
  return;
}

function removeTranscript(email) {
  transcripts = transcripts.filter((t) => email != t.email);
}

function transcriptCount() {
  return transcripts.length;
}

function addAlways(userObj) {
  alwaysAcceptMessagesFrom[userObj.email] = userObj;
}

function removeAlways(email) {
  delete alwaysAcceptMessagesFrom[email];
}

function isAlways(email) {
  const exist = alwaysAcceptMessagesFrom[email] || null;
  return exist != null;
}

function addClient(userObj) {
  if (!clients[userObj.email]) {
    clients[userObj.email] = userObj;
  }
}

function removeClient(email) {
  delete clients[email];
}

function countClients() {
  return Object.keys(clients).length;
}

document.addEventListener("DOMContentLoaded", function () {
  // These algorithms will blur these elements after a click action
  if (document.querySelector(".accordion-item")) {
    const aButtons = document.querySelectorAll(".accordion-button");

    aButtons.forEach((item) => {
      item.addEventListener("mouseup", () => {
        item.blur();
        item.parentElement.focus();
      });
    });
  }

  if (document.querySelector("#visible-input")) {
    document
      .querySelector("#visible-input")
      .addEventListener("mouseup", (e) => {
        e.target.blur();
      });
  }

  try {
    socket = new ReconnectingWebSocket("ws://192.168.1.57:8080/ws", null, {
      debug: false,
      reconnectInterval: 3000,
    });

    socket.onopen = () => {
      log("Successfully connected");
      // notify("success", "Connected to server");
      const action = "initconnect";
      const fname = document.querySelector("#fname").value;
      const lname = document.querySelector("#lname").value;
      const email = document.querySelector("#email").value;
      const visible = document.querySelector("#visible").value;
      const permvisible = document.querySelector("#perm-visible").value;
      const jsonData = {};
      jsonData.action = action;
      jsonData.fname = fname;
      jsonData.lname = lname;
      jsonData.email = email;
      jsonData.visible = visible;
      jsonData.permvisible = permvisible;
      sendMessage(jsonData);
    };

    socket.onclose = () => {
      log("Connection closed");
    };

    socket.onerror = (error) => {
      log("\n\nThere was an error:\t", error);
    };

    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      switch (data.action) {
        case "userlist":
          handleUserList(data);

          handleOnlineUsers();
          break;

        case "ptp":
          handlePersonToPersonMessage(data);
          break;

        case "broadcast":
          addTranscript(data);
          handleBroadcastMessage(data);
          break;
      }
    };
  } catch (err) {
    log("\n\nWS Connection Error:\t", err);
    log(`\n\n`);
  }

  initActivity();
  handleOnlineUsers();
});

function handleUserList(data) {
  let onlineUserCount = 0;

  for (const d in data) {
    if (d == "users") {
      const clients = data[d];

      for (const c in clients) {
        const client = clients[c];
        const ip = c;
        const fname = client[0];
        const lname = client[1];
        const email = client[2];
        const visible = client[3];
        const busy = client[4];
        let userObj;

        if (email == document.querySelector("#email").value) {
          if (visible == "true") {
            document.querySelector("#visible-input").checked = true;
            onlineUserCount += 1;
            userObj = {};
            userObj.ip = ip;
            userObj.fname = fname;
            userObj.lname = lname;
            userObj.email = email;
            userObj.visible = visible;
            userObj.busy = busy;
            addClient(userObj);
          } else {
            document.querySelector("#visible-input").checked = false;
            removeClient(email);
          }
        } else {
          if (visible == "true") {
            onlineUserCount += 1;
            userObj = {};
            userObj.ip = ip;
            userObj.fname = fname;
            userObj.lname = lname;
            userObj.email = email;
            userObj.visible = visible;
            userObj.busy = busy;
            addClient(userObj);
          } else {
            removeClient(email);
          }
        }
      }
    }
  }
  handleOnlineUserCount(onlineUserCount);
  return;
}

function handleOnlineUsers() {
  if (countClients() > 0) {
    const hstack = document.querySelector("#hor-list");
    if (countChildren(hstack) > 0) {
      removeChildren(hstack);
    }

    for (const c in clients) {
      const client = clients[c];
      log(`Client: ${stringify(client)}\n`);

      if (client.email != document.querySelector("#email").value) {
        const div = document.createElement("div");
        const divGroup = document.createElement("div");
        const msgIcon = document.createElement("i");
        const namePara = document.createElement("p");
        const span = document.createElement("span");

        namePara.innerHTML = `<strong>${cap(client.fname)}</strong>`;

        addAttribute(divGroup, "class", "input-group d-flex gap-2");
        addAttribute(div, "class", "p-2 border border-primary-subtle rounded");
        addAttribute(
          msgIcon,
          "class",
          "bi bi-chat-right-text fw-bold fw-2 icon p-0 m-0 text-primary-emphasis"
        );
        addAttribute(msgIcon, "id", `icon-${client.email}`);
        addAttribute(span, "class", "input-group-text p-0 m-0 border-0");
        addAttribute(span, "id", `${client.fname}`);
        addAttribute(
          namePara,
          "class",
          "form-control border-0 rounded m-0 p-0 bg-transparent text-primary-emphasis"
        );

        appendChild(hstack, div);
        appendChild(div, divGroup);
        appendChild(divGroup, span);
        appendChild(divGroup, namePara);
        appendChild(span, msgIcon);

        msgIcon.addEventListener("click", (e) => {
          const to = e.target.id.split("-")[1];
          const fname = document.querySelector("#fname").value;
          const email = document.querySelector("#email").value;

          Swal.fire({
            title: `Direct Message To ${cap(e.target.parentElement.id)}`,
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

              const fname = document.querySelector("#fname").value;
              const email = document.querySelector("#email").value;
              const to = e.target.id.split("-")[1];
              const message = document.querySelector("#msg").value;

              if (value) {
                if (isConfirmed) {
                  log(`From ${fname}\n`);
                  log(`To ${to}\n`);
                  log(`Message ${message}\n`);

                  const jsonData = {};
                  jsonData.action = "ptp";
                  jsonData.to = to;
                  jsonData.fname = fname;
                  jsonData.email = email;
                  jsonData.message = message;
                  sendMessage(jsonData);
                  return;
                } else {
                  Swal.closeModal();
                }
              }

              Swal.closeModal();
            })
            .catch((err) => {
              log(err);
            });
        });
      }
    }
  } else {
    const hstack = document.querySelector("#hor-list");
    if (countChildren(hstack) > 0) {
      removeChildren(hstack);
    }

    // const rowDef = document.createElement("div");
    // const colDef = document.createElement("div");
    const pDef = document.createElement("p");

    // addAttribute(
    //   rowDef,
    //   "class",
    //   "row d-flex justify-content-center align-items-center"
    // );
    // addAttribute(colDef, "class", "col-auto p-3");
    addAttribute(
      pDef,
      "class",
      "text-center fw-bold fs-3 text-primary-emphasis"
    );

    // appendChild(hstack, rowDef);
    // appendChild(rowDef, colDef);
    appendChild(hstack, pDef);

    pDef.innerHTML = `<strong>No Users Online</strong>`;
  }
}

function handleOnlineUserCount(count) {
  let suf = "";

  switch (count) {
    case 1:
      suf = `${count} online user`;
      break;

    default:
      suf = `${count} online users`;
      break;
  }

  document.querySelector("#user-count-input").innerText = `${suf}`;
}

function sendMessage(jsonData = {}) {
  socket.send(JSON.stringify(jsonData));
}

function displayTranscripts() {
  if (transcriptCount() > 0) {
    const chatTranscriptParent = document.querySelector("#chat-transcript");

    for (const t in transcripts) {
      const transcriptData = transcripts[t];
      const message = transcriptData.message;
      const email = transcriptData.email;
      const fname = transcriptData.fname;

      if (email == document.querySelector("#email").value) {
        log(`Transcript By: Me says ${message}`);
      } else {
        log(`Transcript By: ${fname} says ${message}`);
      }
    }
  }
}

document.querySelector("#visible-input").addEventListener("click", (e) => {
  const jsonData = {};
  if (e.target.checked) {
    jsonData.action = "unhide";
  } else {
    jsonData.action = "hide";
  }
  sendMessage(jsonData);
});

function initActivity() {
  const activityParent = document.querySelector("#activity-parent");
  const rowTop = document.createElement("div");
  const rowMiddle = document.createElement("div");
  const rowBottom = document.createElement("div");

  addAttribute(rowTop, "class", "row");
  addAttribute(rowMiddle, "class", "row");
  addAttribute(rowBottom, "class", "row");

  const colTop = document.createElement("div");
  const colMiddle = document.createElement("div");
  const colBottom = document.createElement("div");

  addAttribute(colTop, "class", "col-12");
  addAttribute(colMiddle, "class", "col-12");
  addAttribute(colBottom, "class", "col-12  ");

  const hstack = document.createElement("div");
  addAttribute(hstack, "id", "hor-list");
  addAttribute(hstack, "class", "hstack gap-2 my-2");
  appendChild(colTop, hstack);

  appendChild(activityParent, rowTop);
  appendChild(activityParent, rowMiddle);
  appendChild(activityParent, rowBottom);

  appendChild(rowTop, colTop);
  appendChild(rowMiddle, colMiddle);
  appendChild(rowBottom, colBottom);

  const chatTranscript = document.createElement("div");
  addAttribute(chatTranscript, "id", "chat-transcript");
  addAttribute(
    chatTranscript,
    "class",
    "chat-transcript bg-light-subtle border border-light-subtle rounded"
  );
  appendChild(colMiddle, chatTranscript);

  const chatControls = document.createElement("div");
  const textInput = document.createElement("input");
  const sendButton = document.createElement("button");
  const span = document.createElement("span");

  sendButton.innerHTML = `<strong class="text-center text-primary-emphasis">Send</strong>`;

  addAttribute(chatControls, "class", "input-group my-2");
  addAttribute(textInput, "class", "form-control text-input");

  addAttribute(
    sendButton,
    "class",
    "btn btn-outline-primary border-primary-subtle"
  );
  addAttribute(span, "class", "input-group-text");

  appendChild(chatControls, textInput);
  appendChild(chatControls, span);
  appendChild(span, sendButton);
  appendChild(colBottom, chatControls);

  sendButton.addEventListener("click", () => {
    if (textInput.value) {
      const jsonData = {};
      jsonData.fname = document.querySelector("#fname").value;
      jsonData.email = document.querySelector("#email").value;
      jsonData.message = textInput.value;
      jsonData.action = "broadcast";
      sendMessage(jsonData);
      textInput.value = "";
    }
  });
}

window.addEventListener("beforeunload", (event) => {
  dlog(`\tbeforeunload window event fired`, `wss.js`);
  const jsonData = {};
  jsonData.action = "exit";
  sendMessage(jsonData);
  return;
});
