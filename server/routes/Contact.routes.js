import express from "express";

// controllers
import { getMyRooms } from "../controllers/getContacts.controller";

// middlewares
import { authenticate } from "../middlewares/Auth.middlewares";


const ContactsRouter = express.Router(); 

// get all your rooms
ContactsRouter.get("/chats",authenticate , getMyRooms );

export default ContactsRouter;