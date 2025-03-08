import express from "express"
import { createServer } from "http";
import path from 'path';
import { fileURLToPath } from 'url';
import cors from "cors";
import { Server } from "socket.io";

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 

const app = express();
const server = createServer(app)
const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173"
    }
});

app.use(cors({ origin: "http://localhost:5173" }));


app.get('/',(req,res)=>{
    res.send("Server is ready")
})

io.on("connection", (socket) => {
    console.log("New connection");
    
    socket.on("message", (messageData) => {
      // Broadcast the message data (containing both username and text)
      io.emit("message", messageData);
      console.log(`Message from ${messageData.user}: ${messageData.text}`);
    });

    socket.on("typing", (data) => {
      // Broadcast to all clients except the sender
      socket.broadcast.emit("typing", data);
      
      if (data.isTyping) {
        console.log(`${data.user} is typing...`);
      } else {
        console.log(`${data.user} stopped typing`);
      }
    });
  
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });



server.listen(3000,()=>{
    console.log("Server is running on port 3000")
})