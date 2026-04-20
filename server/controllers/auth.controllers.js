import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";


export const signup = async (req,res)=>{
try {
    // taking  email , password , userName from req.body
    const {userName , password , email} = req.body; 

    // any one of them is not present return response
    if(!userName || !password || !email){
        return res.status(400).json(
            {
                success:false,
                message: "required all user credentials"
            }
        );
    }

    if(password.length < 8){
        return res.status(400).json(
            {
                success: false,
                message: "password minLength = 8"
            }
        )
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
 
    if(!emailRegex.test(email)){
        return res.status(400).json(
            {
                success:false,
                message: "Invalid email syntax",
            }
        )
    }


    const isUser = await User.findOne({email:email});
    if(isUser){
        return res.status(401).json(
            {
                success: false,
                message: "user already exist",
            }
        )
    }

    const user = await User.create(
        {
            userName: userName,
            email: email,
            password: password
        }
    );

    generateToken(user._id , res);

    res.status(201).json(
        {
            success:true,
            user: user,
            message: "user created successfully"

        }
    );


// handle errors 

} catch (error) {
    
    console.error(error.message);
    res.status(500).json(
        {
            success: false,
            error: error.message,
            message: "Internal server error"
        }
    );

}

};







export const login = async(req,res)=>{

    try {
        
        // take email , password from response body 
        const {email , password} = req.body;

        // if not present send response
        if(!email || !password){
            return res.status(400).json(
                {
                    success:false,
                    message: "require all user cridentials"
                }
            )

        }


        // compare email with this formate
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
 
        // if wrong format send response
        if(!emailRegex.test(email)){
            return res.status(400).json(
                {
                    success:false,
                    message: "require valid user credentials",
                }
            )
        }

        // if password length is less than 8 send response

        if(password.length < 8){
            return res.status(400).json(
                {
                    success:false,
                    message:"require valid user credentials "
                }
            )
        }


        // if user not present for this email send response 

        const user = await User.findOne({email:email}).select('+password');
        if(!user){
            return res.status(400).json(
                {
                    success:false,
                    message:"require valid user credentials "
                }
            )
        }

        // if password not match send response 
        const isMatch = await user.comparePassword(password) || null;
        if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: "Invalid credentials"
        });
        }

        // genereate token and embeded it in res.cookie
        generateToken(user._id , res);

        // Hide password before sending response
        user.password = undefined;
        // if nothing goes wrong send success response
        res.status(200).json(
            {
                success:true,
                user: user,
                message:"logged in successfully"
            }
        )

        // handling error

    } catch (error) {
        
         console.error(error.message);
        res.status(500).json(
            {
                success: false,
                error: error.message,
                message: "Internal server error"
            }
        );
    }

};



export const logout = (req, res) => {
  try {
    // Clear the cookie named "token"
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict"
    });

    // sending success response
    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });

    // handling error
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal server error"
    });
  }
};

