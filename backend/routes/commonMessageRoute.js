import express from "express";
import { ensureAuthenticated } from "../middleware/authMiddleware.js";
import { getCommonMessages, sendCommonMessage } from "../controllers/commonMessageController.js";


const router = express.Router();


router.get("/",ensureAuthenticated, getCommonMessages)

router.post("/send",ensureAuthenticated,sendCommonMessage)


export default router;