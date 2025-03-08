import express from "express"
import { createServer } from "http";
import path from 'path';
import { fileURLToPath } from 'url';
import cors from "cors";
import { Server } from "socket.io";
import passport from "passport";
import session from "express-session";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename); 

dotenv.config();
const app = express();
const server = createServer(app)
const io = new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        credentials:true

    }
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error(err));

    app.use(cors({ 
      origin: "http://localhost:5173", 
      credentials: true  
  }));
  

const userSchema = new mongoose.Schema({
  googleId: String,
  name: String,
  email: String,
});
const User = mongoose.model("User", userSchema);

// Passport Session Setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());


app.get('/',(req,res)=>{
    res.send("Server is ready")
})
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,  // <-- Use env variable
}, async (accessToken, refreshToken, profile, done) => {
  let user = await User.findOne({ googleId: profile.id });
  if (!user) {
      user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value
      });
  }
  done(null, user);
}));


// Auth Routes
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/" }),
    (req, res) => res.redirect("http://localhost:5173/dashboard")

);
app.get("/auth/user", (req, res) => {
  if (req.isAuthenticated()) {
      res.json(req.user);
  } else {
      res.status(401).json({ message: "Not authenticated" });
  }
});

app.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
      if (err) return next(err);
      req.logout(() => {
          res.redirect("/");
      });
  });
});


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
        
      }
    });
  
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });



server.listen(3000,()=>{
    console.log("Server is running on port 3000")
})