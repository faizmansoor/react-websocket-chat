import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import passport from "passport";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import chatSocket from "./sockets/chatSocket.js";
import "./config/passport.js"; // Import passport config

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", process.env.FRONTEND_URL],
    credentials: true,
  },
});

// Database Connection
connectDB();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.FRONTEND_URL],
    credentials: true,
  })
);

//use connect-mongo or redis to store session data for production
//When a session is created, express-session automatically sets a cookie on the client.
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json()); // Ensure JSON body parsing

// Routes
app.use("/auth", authRoutes);
app.use("/message", messageRoutes);

app.get("/", (req, res) => {
  res.send("Server is ready");
});

// Sockets
chatSocket(io);

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
