const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("New connection");

    socket.on("message", (messageData) => {
      io.emit("message", messageData);
      console.log(`Message from ${messageData.user}: ${messageData.text}`);
    });

    socket.on("typing", (data) => {
      socket.broadcast.emit("typing", data);
      if (data.isTyping) {
        console.log(`${data.user} is typing...`);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

export default chatSocket;
