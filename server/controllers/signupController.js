import User from "../models/userModel.js"
import bcrypt from 'bcryptjs';

// function to hash our password 
const hashing = async(plaintext)=>{
    return await bcrypt.hash(plaintext,10);
}


// this is signup controller function
const signUp = async (req,res)=>{
    try {

        // taking value from user parsing from request.body 
          const {userName , email , password} = req.body

        //   if any of them is not present then send this response
          if(!userName || !email || !password ){

            return res.status(400).json(
                {
                    success: false,
                    message: `send all the required data  `
                }
            )
          }

        //   checking the user is already present or not 
          const existingUser = await User.findOne({ email });
        //   if the user already present send this response 
          if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
          }

        //   hashing the password send by user
          const newPassword = await hashing(password)

        // if error occured while hashing send a response 
          if(!newPassword){
            return res.status(403).json(
                {
                    success: false,
                    message: "something went wrong while generating password"
                }
            );
          }

        //   making a new user 
          const newUser = new User(
                                {
                                    userName,
                                    email,
                                    password : newPassword  
                                }
                            ) 


        // saving the new user
          const updatedUser = await newUser.save();

        //   making the saved user dicument into object 
          const userObject = updatedUser.toObject();
        //   deleting password from object
          delete userObject.password;


        // sending success res 
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: userObject,
        });

    // handling error which comes while trying this all 
    } catch (error) {
        
        console.log(error);
        console.error(error);
        res.status(500).json(
            {
                success: false,
                error: error.message,
                message: "Internal server error"
            }
        )
    }
};

// exporting this controller function
export {signUp}

