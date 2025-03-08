import express from "express";
import { ensureAuthenticated } from "../middleware/authMiddleware";
import { getUsersForSideBar, getMessages, sendMessage } from "../controllers/message.controller";

const router = express.Router();

router.get("/",ensureAuthenticated, getUsersForSideBar)

router.get("/:id",ensureAuthenticated, getMessages)

router.post("/send/:id",ensureAuthenticated,sendMessage)

export default router;