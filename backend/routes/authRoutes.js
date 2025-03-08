import express from "express";
import passport from "passport";
import User from "../models/User.js";  
import { ensureAuthenticated } from "../middleware/authMiddleware.js";  

const router = express.Router();

// Google OAuth Login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("http://localhost:5173/chat");  // ✅ Redirect to frontend /chat after login
  }
);

// Get Authenticated User
router.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

// Logout Route
router.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    req.logout(() => {
      res.redirect("http://localhost:5173/");
    });
  });
});

// Set Username Route
router.post("/set-username", ensureAuthenticated, async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: "Username already taken" });
  }

  req.user.username = username;
  await req.user.save();

  res.json({ message: "Username updated", user: req.user });
});

export default router;
