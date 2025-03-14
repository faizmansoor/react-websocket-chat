import express from "express";
import passport from "passport";
import User from "../models/User.js";
import { ensureAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// Google OAuth Login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/chat`);
  }
);

router.get("/users", ensureAuthenticated, async (req, res) => {
  try {
    const users = await User.find({}, "username");

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in authRoutes (getting all users): ", error.message);
    res.status(500).json({ error: "Server Error" });
  }
});

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
      res.status(200).clearCookie();
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
