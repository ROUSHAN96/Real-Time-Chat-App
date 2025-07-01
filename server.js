const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static(__dirname + "/Public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/Public/index.html");
});
const Port = process.env.PORT || 3000;
http.listen(Port, () => {
  console.log(`Server is running on port ${Port}`);
});
// socket.io RJ Server setup

io.on("connection", (socket) => {
  console.log("Connected...");
  socket.on("message", (msg) => {
    socket.broadcast.emit("message", msg);
  });
});
//count people
let userCount = 0;

io.on("connection", (socket) => {
  userCount++;
  io.emit("userCount", userCount); // Notify all clients of the new user count

  socket.on("disconnect", () => {
    userCount--;
    io.emit("userCount", userCount); // Update all clients on user count change
  });
});
