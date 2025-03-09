import express from "express";
import { ensureAuthenticated } from "../middleware/authMiddleware.js";
import {
  getCommonMessages,
  sendCommonMessage,
} from "../controllers/commonMessage.controller.js";

const router = express.Router();

router.get("/", getCommonMessages);

router.post("/send", sendCommonMessage);

export default router;

// router.get("/",ensureAuthenticated, getCommonMessages)
// router.post("/send",ensureAuthenticated,sendCommonMessage)
// export default router;
