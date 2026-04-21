import express from "express";

// controllers
import { deleteMessage, getMessages, sendMessage } from "../controllers/message.controller.js";

// middlewares
import { authenticate } from "../middlewares/Auth.middlewares.js";



const messageRouter = express.Router();

// fetch message
messageRouter.get("/:roomId", authenticate, getMessages);

// send message
messageRouter.post("/:roomId", authenticate, sendMessage)

// delete message
messageRouter.delete("/:roomId", authenticate , deleteMessage);

export default messageRouter;   