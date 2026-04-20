import express from "express";

// controllers
import { deleteMessage, getMessages, sendMessage } from "../controllers/message.controller.js";

// middlewares
import { authenticate } from "../middlewares/Auth.middlewares.js";



const messageRouter = express.Router();

// fetch message
messageRouter.get("/message", authenticate, getMessages);

// send message
messageRouter.post("/message", authenticate, sendMessage)

// delete message
messageRouter.delete("/message", authenticate , deleteMessage);

export default messageRouter;