let socket = null;
const clients = {};
const alwaysAcceptMessagesFrom = {};

function addAlways(userObj) {
  alwaysAcceptMessagesFrom[`${userObj.email}`] = userObj;
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
          break;

        case "ptp":
          handlePersonToPersonMessage(data);
          break;

        case "broadcast":
          displayMessage(data);
          break;
      }
    };
  } catch (err) {
    log("\n\nWS Connection Error:\t", err);
    log(`\n\n`);
  }
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
  setupActivity();
  return;
}

function setupActivity() {
  if (countClients() > 0) {
    for (const c in clients) {
      const client = clients[c];
      log(`Client: ${stringify(client)}\n`);
    }
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

document.querySelector("#visible-input").addEventListener("click", (e) => {
  const jsonData = {};
  if (e.target.checked) {
    jsonData.action = "unhide";
  } else {
    jsonData.action = "hide";
  }
  sendMessage(jsonData);
});

window.addEventListener("beforeunload", (event) => {
  dlog(`\tbeforeunload window event fired`, `wss.js`);
  const jsonData = {};
  jsonData.action = "exit";
  sendMessage(jsonData);
  return;
});
