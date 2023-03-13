const http = require("http");
const socketIO = require("socket.io");

const server = http.createServer();
const io = socketIO(server);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("sendMessage", (message) => {
    // Handle the new message and emit a "newMessage" event to all connected clients
    io.emit("newMessage", message);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(5000, () => {
  console.log("listening on *:5000");
});
