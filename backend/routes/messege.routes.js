import express from "express";
import { getMessages, sendMessage } from "../controllers/messege.controller.js";
import protectRoute from "../middleware/protectRoute.js";
const router = express.Router();


router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", sendMessage);



export default router;