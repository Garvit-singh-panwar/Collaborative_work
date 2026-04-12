import mongoose from "mongoose";
import dotenv from 'dotenv';

// use to use take data from .env files 
dotenv.config();

// call function in app to connecting mongoDB  
const connectDB = async ()=>{
        await mongoose.connect(process.env.DATABASE_URL)
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