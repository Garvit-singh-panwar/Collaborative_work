import jwt from 'jsonwebtoken';
import Env from '../utils/Env.js';
import User from '../models/user.model.js';


const authenticate = async (req,res,next)=>{
    try{

        let token;

       // Extract token from cookies, body, or headers

        if (req.cookies && req.cookies.token) {     // From cookies
            token = req?.cookies?.token;
        }
        else if (req.body && req.body.token) {      // From body
            token = req?.body?.token;
        }
        else if (req.headers.authorization) {       // From Authorization header
            token = req?.headers?.authorization?.replace("Bearer ", "");
        }


        //if token not found send some response  

        if(!token || token.length == 0){
            return res.status(400).json(
                {
                    success:false,
                    message: "Please log in again"
                }
            );
        }

        // decode token 
        const decode = jwt.verify(token,Env.JWT_SECRET);

        // if token is not able to decode send some response
        if(!decode){
            return res.status(400).json(
                {
                    success:false,
                    message:"Invalid or expired token",
                }
            );
        }


        // serch user exist or not 
        const user = await User.findById(decode.userId);

        // if user not exist send a response
        if(!user){
            return res.status(400).json(
                {
                    success:false,
                    message: "User not found or token invalid"
                }
            )
        }

        req.user = user;
        next();

    // Handling errors
    }catch(error){
        console.error(error.message);
        res.status(500).json(
            {
                success:false,
                error: error.message,
                message: "Internal server error"
            }
        );
    }
}

export { authenticate};