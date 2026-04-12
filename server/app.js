import express from 'express';
import connectDB from './config/connectDB.js';
import dotenv from 'dotenv';
import router from './routes/routes.js';

dotenv.config();

const app = express();
app.use(express.json())
const port = process.env.PORT || 3000;


connectDB();

app.listen(port , ()=>{
    console.log("Server started sucessfully at port " , port);
})

app.use("/api/v1" , router);

