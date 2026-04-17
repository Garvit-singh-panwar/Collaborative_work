import express from "express";
import { login } from "../controllers/loginController.js";
import { signUp } from "../controllers/signupController.js";

const router = express.Router();

router.post("/signup" , signUp);
router.post("/login" , login)


export default router;