import express from "express";
import Env from "./utils/Env.js";
import connectDB from "./config/connectDB.js";

// Routes
import authRouter from "./routes/Auth.routes.js";
import messageRouter from "./routes/Message.routes.js";
import ContactsRouter from "./routes/Contact.routes.js";
import RoomRouter from "./routes/Room.routes.js";

// parsing middlewares
import cookieParser from "cookie-parser";

// protection middlewares 
import helmet from "helmet";
import { generalLimiter } from "./middlewares/rateLimiter.middleware.js";
import mongoSanitize from 'express-mongo-sanitize';




// initializing middlewares
const app = express();


// 1. TRUST PROXY (Required for rate limiting on most hosting platforms)
app.set('trust proxy', 1);

// 2. SECURITY MIDDLEWARES

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        // Allow images to be loaded from your server ('self') and Cloudinary
        "img-src": ["'self'", "data:", "://cloudinary.com"],
      },
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((req, res, next) => {
  mongoSanitize.sanitize(req.body, { replaceWith: '_' });
  mongoSanitize.sanitize(req.query, { replaceWith: '_' });
  mongoSanitize.sanitize(req.params, { replaceWith: '_' });
  next();
});



// routes

app.use("/api/v1",generalLimiter);
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/room" , RoomRouter);
app.use("/api/v1/contacts",ContactsRouter);
app.use("/api/v1/message",messageRouter);


// calling function to connect with DB

const startServer = async () => {
  try {
    await connectDB();
    app.listen(Env.PORT, () => {
      console.log(`Server connected at PORT : ${Env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};


startServer();

