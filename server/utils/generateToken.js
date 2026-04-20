import jwt from "jsonwebtoken";
import Env from "./Env.js";
const generateToken  = (userId, res)=>{
    const payload = {
        userId: userId
    }
    const token = jwt.sign(
                        payload,
                        Env.JWT_SECRET,
                        {expiresIn:"3d"}
                    );

    const cookieOptions = {
        maxAge: 3*24*60*60*1000,
        httpOnly: true,      // Prevents client-side JS from accessing the cookie
        secure: true,        // Ensures cookie is sent only over HTTPS
        sameSite: "strict",  // Controls cross-site requests (strict, lax, none)
    }

    res.cookie("token",token,cookieOptions);                

}

export default generateToken;