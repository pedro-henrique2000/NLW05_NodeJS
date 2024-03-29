const socket = io();
let connectionsUsers = [];

socket.on("admin_list_all_users", (connections) => {
  document.getElementById("list_users").innerHTML = "";
  connectionsUsers = connections;

  let template = document.getElementById("template").innerHTML;

  connections.forEach((connection) => {
    const rendered = Mustache.render(template, {
      email: connection.user.email,
      id: connection.socket_id,
    });

    document.getElementById("list_users").innerHTML += rendered;
  });
});

function call(id) {
  const connection = connectionsUsers.find(
    (connection) => connection.socket_id === id
  );

  const template = document.getElementById("admin_template").innerHTML;

  const rendered = Mustache.render(template, {
    email: connection.user.email,
    id: connection.user_id,
  });

  document.getElementById("supports").innerHTML += rendered;

  const params = {
    user_id: connection.user_id,
  };

  socket.emit("admin_user_in_support", params);

  socket.emit("admin_list_messages_by_user", params, (messages) => {
    const divMessages = document.getElementById(
      `allMessages${connection.user_id}`
    );

    messages.forEach((message) => {
      const createDiv = document.createElement("div");

      if (message.admin_id === null) {
        createDiv.className = "admin_message_client";
        createDiv.innerHTML = `<span>${connection.user.email} - ${message.text} </span>`;

        createDiv.innerHTML += `<span>${dayjs(message.created_at).format(
          "DD/MM/YYYY HH:mm:ss"
        )} </span>`;
      } else {
        createDiv.className = "admin_message_admin";
        createDiv.innerHTML = `<span>Atendente - ${message.text} </span>`;

        createDiv.innerHTML += `<span>${dayjs(message.created_at).format(
          "DD/MM/YYYY HH:mm:ss"
        )} </span>`;
      }
      divMessages.appendChild(createDiv);
    });
  });
}

function sendMessage(id) {
  const text = document.getElementById(`send_message_${id}`);

  const params = {
    text: text.value,
    user_id: id,
  };

  socket.emit("admin_send_message", params);

  const divMessages = document.getElementById(`allMessages${id}`);

  const createDiv = document.createElement("div");
  createDiv.className = "admin_message_admin";
  createDiv.innerHTML = `<span>Atendente - ${text.value} </span>`;
  createDiv.innerHTML += `<span>${dayjs().format(
    "DD/MM/YYYY HH:mm:ss"
  )} </span>`;

  divMessages.appendChild(createDiv);

  text.value = "";
}
socket.on("admin_receive_message", (data) => {
  const connection = connectionsUsers.find(
    (connection) => connection.socket_id === data.socket_id
  );

  const createDiv = document.createElement("div");

  const divMessages = document.getElementById(
    `allMessages${connection.user_id}`
  );

  createDiv.className = "admin_message_client";
  createDiv.innerHTML = `<span>${connection.user.email} - ${data.message.text} </span>`;

  createDiv.innerHTML += `<span>${dayjs(data.message.created_at).format(
    "DD/MM/YYYY HH:mm:ss"
  )} </span>`;

  divMessages.appendChild(createDiv);
});
