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

io.on("connection",(socket)=>{
    console.log("New connection")
    socket.on("message",(msg)=>{
        io.emit("message",msg)
    })

    socket.on("disconnect",()=>{
        console.log("User disconnected")
    })
})



server.listen(3000,()=>{
    console.log("Server is running on port 3000")
})