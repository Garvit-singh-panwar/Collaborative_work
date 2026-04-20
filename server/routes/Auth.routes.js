import express from 'express';

// controllers
import { signup,login,logout } from '../controllers/auth.controllers.js';

// middlewares
import { authLimiter } from '../middlewares/rateLimiter.middleware.js';



const authRouter = express.Router();

// signup
authRouter.post("/signup", authLimiter , signup);

// login 
authRouter.post("/login", authLimiter , login);

// delete
authRouter.post("/logout", authLimiter , logout);


export default authRouter;
