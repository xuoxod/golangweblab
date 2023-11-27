let socket = null;

document.addEventListener("DOMContentLoaded", function () {
  // socket = new WebSocket("ws://127.0.0.1:8080/ws");
  try {
    socket = new ReconnectingWebSocket("ws://192.168.1.57:8080/ws", null, {
      debug: true,
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
      createAndSendMessage(
        action,
        null,
        null,
        null,
        null,
        null,
        null,
        fname,
        lname,
        email,
        visible
      );
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
      }
    };
  } catch (err) {
    log("\n\nWS Connection Error:\t", err);
    log(`\n\n`);
  }
});

function handleUserList(data) {
  const { action, users } = data;
  log(`Users:\t${stringify(users)}\n\n`);
  log(`Array?:\t${Array.isArray(users)}\n\n`);
}

function handleUserCount(data) {
  document.querySelector(
    "#user-count"
  ).innerHTML = `<strong class="text-center">${data}</strong>`;
}

function updateUserList(data) {}

function sendMessage(jsonData = {}) {
  socket.send(JSON.stringify(jsonData));
}

/**
 * @param action String
 * @param message String
 * @param messageType String
 * @param from String
 * @param to String
 * @param level String
 * @param title String
 * @param fname String
 * @param lname String
 * @param email String
 * @param visible String
 */
function createAndSendMessage(
  action,
  message = null,
  messageType = null,
  from = null,
  to = null,
  level = null,
  title = null,
  fname = null,
  lname = null,
  email = null,
  visible = false
) {
  const jsonData = {};
  jsonData.action = action;

  if (null != message) {
    jsonData.message = message;
  }

  if (null != messageType) {
    jsonData.messageType = messageType;
  }

  if (null != from) {
    jsonData.from = from;
  }

  if (null != to) {
    jsonData.to = to;
  }

  if (null != level) {
    jsonData.level = level;
  }

  if (null != title) {
    jsonData.title = title;
  }

  if (null != fname) {
    jsonData.fname = fname;
  }

  if (null != lname) {
    jsonData.lname = lname;
  }

  if (null != email) {
    jsonData.email = email;
  }

  if (null != visible) {
    jsonData.visible = visible;
  }

  sendMessage(jsonData);
}

window.addEventListener("beforeunload", (event) => {
  dlog(`\tbeforeunload window event fired`, `wss.js`);
  createAndSendMessage(
    "exit",
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null
  );
  return;
});
