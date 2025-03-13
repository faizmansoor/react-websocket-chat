// const privateMessageSocket = (io) => {
//   // Store active users
//   const users = new Map();

//   io.on("connection", (socket) => {
//     console.log("New connection for private messaging:", socket.id);

//     // Handle user joining a private chat room
//     socket.on("joinPrivateRoom", ({ userId, receiverId }) => {
//       console.log(`${userId} joined private room with ${receiverId}`);

//       // Create a unique room name (sorted to ensure same room regardless of order)
//       const roomName = [userId, receiverId].sort().join("-");

//       // Join the room
//       socket.join(roomName);

//       // Store user information
//       users.set(userId, {
//         socketId: socket.id,
//         room: roomName,
//       });
//     });

//     // Handle user leaving a room
//     socket.on("leavePrivateRoom", ({ userId, receiverId }) => {
//       const roomName = [userId, receiverId].sort().join("-");
//       socket.leave(roomName);
//       users.delete(userId);
//     });

//     // Handle private message
//     socket.on("sendPrivateMessage", ({ senderId, receiverId, text, image }) => {
//       const roomName = [senderId, receiverId].sort().join("-");

//       // Broadcast to the room
//       io.to(roomName).emit("receivePrivateMessage", {
//         senderId,
//         text,
//         image,
//       });
//     });

//     // Handle typing indicator
//     socket.on("privateTyping", ({ userId, receiverId, isTyping }) => {
//       const roomName = [userId, receiverId].sort().join("-");

//       // Broadcast typing status to the room
//       socket.to(roomName).emit("userPrivateTyping", {
//         userId,
//         isTyping,
//       });
//     });

//     // Handle disconnection for private messaging
//     socket.on("disconnect", () => {
//       // Find and remove the disconnected user
//       for (const [userId, userData] of users.entries()) {
//         if (userData.socketId === socket.id) {
//           users.delete(userId);
//           break;
//         }
//       }
//     });
//   });
// };

// export default privateMessageSocket;
