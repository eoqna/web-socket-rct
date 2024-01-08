// 1
const { Server } = require("socket.io");

// 2
const io = new Server("5000", {
  cors: {
    origin: "http://localhost:3000",
  },
});

// 3
io.sockets.on("connection", (socket) => {
  // 4
  socket.on("message", (data) => {
    // 5
    // io.sockets.emit("sMessage", data);
    // 1 - broadcast 적용
    socket.broadcast.emit("sMessage", data);
  });

  socket.on("login", (data) => {
    // io.sockets.emit("sLogin", data);
    // 2 - broadcast 적용
    socket.broadcast.emit("sLogin", data);
  });

  // 6
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});