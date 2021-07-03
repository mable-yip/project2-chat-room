const server = require("http").createServer();
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = 4000;
const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const USER_JOINRED_EVENT = "userJoined";
const USER_LEAVED_EVENT = "userLeft";

let usersInRooms = []

io.on("connection", (socket) => {
  // Join a conversation
  const { roomId, userName } = socket.handshake.query;
  socket.join(roomId);
  usersInRooms.push({
    roomId: roomId,
    users: userName
  })

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
    io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, data);
  });

  // Leave the room if the user closes the socket
  socket.on("disconnect", () => {
    socket.leave(roomId);
  });
  console.log(usersInRooms)
});


server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});