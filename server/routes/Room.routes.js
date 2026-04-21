import express from 'express';

// Middlewares
import { authenticate } from '../middlewares/Auth.middlewares.js';

// controllers
import  {createRoom, addParticipants, removeParticipants, removeRoom } from '../controllers/room.controller.js';


const RoomRouter = express.Router();

// create room 
RoomRouter.post("/", authenticate, createRoom);

// add user in group
RoomRouter.patch("/participant" ,authenticate, addParticipants);

// delete user in group
RoomRouter.delete("/participant" , authenticate, removeParticipants );

// delete room
RoomRouter.delete("/" , authenticate , removeRoom);


export default RoomRouter;
