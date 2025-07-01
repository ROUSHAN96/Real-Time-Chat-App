const socket = io();
let name;
let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message__area");
do {
  name = prompt("Please enter your name: ");
} while (!name);

textarea.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    sendMessage(e.target.value);
  }
});

function sendMessage(message) {
  let msg = {
    user: name,
    message: message.trim(),
  };
  // Append message to the message area
  appendMessage(msg, "outgoing");
  textarea.value = "";
  scrollToBottom();

  // Send message to the server
  socket.emit("message", msg);
}
//function to append message to the message area without avatar
// function appendMessage(msg, type) {
//   let mainDiv = document.createElement("div");
//   let className = type;
//   mainDiv.classList.add(className, "message");

//   let markup = `
//         <h4>${msg.user}</h4>
//         <p>${msg.message}</p>
//     `;
//   mainDiv.innerHTML = markup;
//   messageArea.appendChild(mainDiv);
// }

function appendMessage(msg, type = "incoming") {
  const avatarUrl =
    type === "incoming"
      ? "https://randomuser.me/api/portraits/women/44.jpg"
      : "https://randomuser.me/api/portraits/men/32.jpg";

  const messageDiv = document.createElement("div");
  messageDiv.className = "message " + type;
  messageDiv.innerHTML = `
    <div style="display: flex; align-items: center; gap: 10px;">
      <img class="avatar" src="${avatarUrl}" alt="avatar" />
      <h4 style="margin:0;font-size:14px;color:#888;">${msg.user}</h4>
    </div>
    <div class="message-content">${msg.message}</div>
  `;
  document.querySelector(".message__area").appendChild(messageDiv);
}

// Recieve messages from the server
socket.on("message", (msg) => {
  appendMessage(msg, "incoming");
  scrollToBottom();
});

function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight;
}
// Count online users
const userCountDiv = document.getElementById("user-count");
socket.on("userCount", (count) => {
  userCountDiv.textContent = `Online: ${count}`;
});
