import express from "express";

// controllers
import { getMyRooms } from "../controllers/getContacts.controller.js";

// middlewares
import { authenticate } from "../middlewares/Auth.middlewares.js";


const ContactsRouter = express.Router(); 

// get all your rooms
ContactsRouter.get("/",authenticate , getMyRooms );

export default ContactsRouter;