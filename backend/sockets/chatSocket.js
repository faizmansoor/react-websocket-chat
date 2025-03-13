import User from "../models/User.js";
import Message from "../models/message.js";

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

    socket.on("joinPrivateRoom", async ({ username, receiver }) => {
      try {
        const senderUser = await User.findOne({ username });
        const receiverUser = await User.findOne({ username: receiver });

        if (!senderUser || !receiverUser) {
          console.log("User not found!");
          return;
        }

        const senderId = senderUser._id.toString();
        const receiverId = receiverUser._id.toString();

        const roomName = [senderId, receiverId].sort().join("-");
        socket.join(roomName);
        console.log(`${username} (${senderId}) joined room: ${roomName}`);
      } catch (error) {
        console.log("Error finding users:", error.message);
      }
    });

    // Handle private messages with persistence
    socket.on("privateMessage", async ({ sender, receiver, text, image }) => {
      console.log("New private message:", { sender, receiver, text, image });
      try {
        const senderUser = await User.findOne({ username: sender });
        const receiverUser = await User.findOne({ username: receiver });

        if (!senderUser || !receiverUser) {
          console.log("User not found!");
          return;
        }

        const senderId = senderUser._id.toString();
        const receiverId = receiverUser._id.toString();

        // Save message to database for persistence
        const newMessage = new Message({
          senderId,
          receiverId,
          text,
          image,
        });
        await newMessage.save();

        // Emit to room for real-time delivery
        const roomName = [senderId, receiverId].sort().join("-");
        io.to(roomName).emit("receivePrivateMessage", {
          sender: senderUser.username,
          senderId,
          receiverId,
          text,
          image,
          _id: newMessage._id,
        });

        console.log(`Message sent from ${sender} to ${receiver}: ${text}`);
      } catch (error) {
        console.log("Error sending message:", error.message);
      }
    });

    socket.on("leavePrivateRoom", ({ username, receiver }) => {
      try {
        console.log(`${username} is leaving private room with ${receiver}`);

        if (!username || !receiver) return;

        User.findOne({ username }).then((senderUser) => {
          User.findOne({ username: receiver }).then((receiverUser) => {
            if (!senderUser || !receiverUser) return;

            const senderId = senderUser._id.toString();
            const receiverId = receiverUser._id.toString();
            const roomName = [senderId, receiverId].sort().join("-");

            socket.leave(roomName);
            console.log(`${username} (${senderId}) left room: ${roomName}`);
          });
        });
      } catch (error) {
        console.log("Error leaving room:", error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

export default chatSocket;
