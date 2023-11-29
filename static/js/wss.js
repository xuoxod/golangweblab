let socket = null;
let usersObject = {};

document.addEventListener("DOMContentLoaded", function () {
  // socket = new WebSocket("ws://127.0.0.1:8080/ws");
  if (document.querySelector(".accordion-item")) {
    const aButtons = document.querySelectorAll(".accordion-button");

    aButtons.forEach((item) => {
      item.addEventListener("mouseup", () => {
        item.blur();
        item.parentElement.focus();
      });
    });
  }
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
      const permvisible = document.querySelector("#perm-visible").value;
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
        visible,
        permvisible
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

  const visibleSwitch = document.querySelector("#visible-input");
  visibleSwitch.addEventListener("click", (e) => {
    const checked = e.target.checked;

    if (checked) {
      log(`User is visible`);
      const jsonData = {};
      jsonData.action = "unhide";
      sendMessage(jsonData);
    } else {
      log(`User is invisible`);
      const jsonData = {};
      jsonData.action = "hide";
      sendMessage(jsonData);
    }
  });
});

function handleUserList(data) {
  const { users } = data;
  count = 0;
  userObject = {};

  for (const obj in users) {
    const arr = users[obj];
    fname = arr[0];
    lname = arr[1];
    email = arr[2];
    visible = arr[3];
    permvisible = arr[4];

    if (document.querySelector("#email").value.trim() == email) {
      updateUserVisibility(visible, permvisible);
    }
    if (visible == true || visible == "true") {
      count += 1;
      userObject[`${email}`] = [fname, lname, email, visible];
    }
  }
  handleUserCount(count);
  handleUserObject(userObject);
}

function handleUserCount(count) {
  let userslist = "";

  switch (count) {
    case 1:
      userslist = ` Online User`;
      break;

    default:
      userslist = ` Online Users`;
      break;
  }

  document.querySelector(
    "#user-count-span"
  ).innerHTML = `<strong class="text-center">${count}</strong>`;

  document.querySelector("#user-count-input").innerText = `${userslist}`;
}

function handleUserObject(userObj) {
  log(`Handling user object\n`);
  usersObject = userObj;
  populateActivityParent();
}

function populateActivityParent() {
  if (Object.keys(usersObject).length > 0) {
    const activityParent = document.querySelector("#activity-parent");

    if (countChildren(activityParent) > 0) {
      removeChildren(activityParent);
    }

    // const activityRow = newElement("div");
    const activityRow = document.createElement("div");
    addAttribute(activityRow, "class", "row justify-content-center");

    // const colTop = newElement("div");
    const colTop = document.createElement("div");
    addAttribute(colTop, "class", "col-12 my-1");

    // const colBottom = newElement("div");
    const colMiddle = document.createElement("div");
    addAttribute(colMiddle, "class", "col-12 my-1");

    const colBottom = document.createElement("div");
    addAttribute(colBottom, "class", "col-12 my-1");

    // const userList = newElement("ul");
    const userList = document.createElement("ul");
    addAttribute(
      userList,
      "class",
      "list-group list-group-horizontal online-users"
    );

    appendChild(activityParent, activityRow);
    appendChild(activityRow, colTop);
    appendChild(activityRow, colMiddle);
    appendChild(activityRow, colBottom);

    const activityWindow = document.createElement("div");
    addAttribute(activityWindow, "class", "activity-window bg-light rounded");
    appendChild(colMiddle, activityWindow);

    const divControlsParent = document.createElement("div");
    addAttribute(divControlsParent, "class", "input-group border rounded");

    const sendInput = document.createElement("input");
    addAttribute(sendInput, "class", "form-control");
    addAttribute(sendInput, "id", "send-input");

    const sendButtonSpan = document.createElement("span");
    addAttribute(sendButtonSpan, "class", "input-group-text");

    const sendButton = document.createElement("button");
    addAttribute(sendButton, "class", "btn btn-primary");
    addAttribute(sendButton, "id", "send-button");
    sendButton.innerText = "Send";

    appendChild(colBottom, divControlsParent);
    appendChild(divControlsParent, sendInput);
    appendChild(divControlsParent, sendButtonSpan);
    appendChild(sendButtonSpan, sendButton);

    for (const uo in usersObject) {
      // const listItem = newElement("li");
      const listItem = document.createElement("li");
      addAttribute(listItem, "class", "list-group-item");

      // const div = newElement("div");
      const div = document.createElement("div");
      addAttribute(div, "class", "user-list-item");

      // const messageIcon = newElement("i");
      if (document.querySelector("#email").value.trim() != usersObject[uo][2]) {
        const messageIcon = document.createElement("i");
        addAttribute(messageIcon, "id", `icon-${usersObject[uo][2]}`);
        addAttribute(
          messageIcon,
          "class",
          "bi bi-chat-square-text-fill text-primary-emphasis fw-bold icon"
        );
        appendChild(div, messageIcon);
      }

      // const userName = newElement("span");
      const userName = document.createElement("span");
      addAttribute(userName, "id", `span-${usersObject[uo][2]}`);
      addAttribute(
        userName,
        "class",
        "badge text-primary-emphasis fw-bold text"
      );

      const userNameTextNode = document.createTextNode(
        `${cap(usersObject[uo][0])}`
      );
      appendChild(colTop, userList);
      appendChild(userList, listItem);
      appendChild(listItem, div);
      appendChild(div, userName);
      appendChild(userName, userNameTextNode);
    }
  } else {
    log(`No online users\n`);
    const activityParent = document.querySelector("#activity-parent");

    if (countChildren(activityParent) > 0) {
      removeChildren(activityParent);
    }

    const activityRow = document.createElement("div");
    addAttribute(activityRow, "class", "row justify-content-center");

    // const colTop = newElement("div");
    const activityCol = document.createElement("div");
    addAttribute(activityCol, "class", "col-12 my-1");

    const activityPara = document.createElement("p");
    addAttribute(activityPara, "class", "fs-2 text-center");
    activityPara.innerHTML = `<strong>No Participants</strong>`;

    appendChild(activityParent, activityRow);
    appendChild(activityRow, activityCol);
    appendChild(activityCol, activityPara);
  }
}

function updateUserVisibility(isVisible, permVisible) {
  if (permVisible == "true") {
    document.querySelector("#visible-input2").checked = true;
    document.querySelector("#visible-input").checked = true;
    document.querySelector("#visible2-parent").classList.remove("d-none");
  } else {
    document.querySelector("#visible-input2").checked = false;
    // document.querySelector("#visible2-parent").classList.add("d-none");
    if (isVisible == "true") {
      document.querySelector("#visible-input").checked = true;
    } else {
      document.querySelector("#visible-input").checked = false;
    }
  }
  return;
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
  visible = false,
  permvisible = true
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

  if (null != permvisible) {
    jsonData.permvisible = permvisible;
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
