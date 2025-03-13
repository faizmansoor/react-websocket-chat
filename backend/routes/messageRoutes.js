import express from "express";
import { ensureAuthenticated } from "../middleware/authMiddleware.js";
import {
  getUsersForSideBar,
  getMessages,
  sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", ensureAuthenticated, getUsersForSideBar);

router.get("/:id", ensureAuthenticated, getMessages);

router.post("/send/:id", ensureAuthenticated, sendMessage);

export default router;
