import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

// used to access variables from .env files 
dotenv.config();

// function to check password is correct or not 
const checkPassword = async (password,hashpassword) => {
    return await bcrypt.compare(password,hashpassword);
}


// making controller function for login 

const login = async(req , res)=>{
    try {

        // parsing email and password from res.body 
        const {email,password} = req.body;

        // if they are not present then sending a response
        if(!email || ! password){
            return res.status(400).json(
                {
                    success: false,
                    message: "send all the required data",
                }
            );
        }

        if(password.length < 8){
            return res.status(400).json(
                {
                    success:"false",
                    message: "password length should be grater than 8"
                }
            )
        }

        // 1. Define the Regex
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        // 2. Test the email
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address format"
            });
        }
        
        // verifying the user is present or not 
        const verifyuser = await User.findOne({email}).lean();

        // if not sending a res user not found 
        if(!verifyuser){
            return res.status(401).json(
                {
                    success:false,
                    message: "user not found for given email",
                }
            )
        }     
        
        
        // checking the password entered by user is correct or not 
        const isMatch = await checkPassword(password,verifyuser.password);
        // if not match then sending this response 
        if(!isMatch){
            return res.status(401).json(
                {
                    success:false,
                    message: "please enter the correct password"
                }
            )
        }

        // defining payload of jwt token 
        const payload = {
            id : verifyuser._id,
            email: verifyuser.email
        }

        // defining cookie opitions 
        const CookieOptions = {
            maxAge:  3*24*60*60*1000, // just need milliseconds
            httpOnly: true, // Secure
            secure: true,   // HTTPS
            sameSite: 'lax'
        }

        // making a jwt token
        const token = jwt.sign(payload,process.env.JWT_SECRET , {expiresIn: "3d"});

        // deleting password from userobject
        delete verifyuser.password;

        // adding token in user object
        verifyuser.token = token;

        // sending a success res with cookie
        res.cookie("token", token , CookieOptions).status(200).json(
            {
                success: true,
                data: verifyuser,
                message: "Logged in successfully"
            }
        )

    // handling error if any thing happens wrong
    } catch (error) {

        console.error(error);
        res.status(500).json(
            {
                success:false,
                error: error.message,
                message: "Internal server error"
            }
        )

        
    }



}

export {login};