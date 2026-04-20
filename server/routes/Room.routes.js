import express from 'express';

// Middlewares
import { authenticate } from '../middlewares/Auth.middlewares.js';

// controllers
import  {createRoom, addParticipants, removeParticipants, removeRoom } from '../controllers/room.controller.js';


const RoomRouter = express.Router();

// create room 
RoomRouter.post("/room", authenticate, createRoom);

// add user in group
RoomRouter.patch("/room/participant" ,authenticate, addParticipants);

// delete user in group
RoomRouter.delete("/room/participant" , authenticate, removeParticipants );

// delete room
RoomRouter.delete("/room" , authenticate , removeRoom);


export default RoomRouter;
