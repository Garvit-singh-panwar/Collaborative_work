import mongoose from "mongoose";
import Env from "../utils/Env.js";



// call function in app to connecting mongoDB  
const connectDB = async ()=>{
        await mongoose.connect(Env.DATABASE_URL)
        .then(
                ()=>{
                        console.log("connected with DB successfully ")
                    }
            )
        .catch(
                (error)=>{
                            console.log("error while connecting to database :- " , error);
                            console.error("error while connecting to database :- " , error)
                            process.exit(1);
                        }
            )
}

export default connectDB;