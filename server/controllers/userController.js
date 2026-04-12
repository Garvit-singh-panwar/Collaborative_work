import User from "../models/userModel.js"

const createUser = async (req,res)=>{
    try {
          const {userName , email , password} = req.body

          if(!userName || !email || !password ){

            let notPresent = "";
            !userName? notPresent += "username,": notPresent +="" ;
            !email? notPresent += "email,": notPresent +="";
            !password? notPresent += "password ": notPresent +="";

            return res.status(400).json(
                {
                    success: false,
                    message: `${notPresent} they are not available  `
                }
            )
          }

          const newUser = User(
                                {
                                    userName,
                                    email,
                                    password    
                                }
                            ) 

          const updatedUser = await newUser.save();

          res.status(200).json(
            {
                success: true,
                data: updatedUser,
                message: "data saved successfully"
            }
          )

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


export {createUser}

