import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            requires: true,
            index: true, // Important for dast message retrieval
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required : true,
        },
        content: {
            type: String,
            required : true,
            trim: true,
        },
        messageType:{
            type: String,
            enum: ["text", "image" , "file" , "video"],
            default: "text",
        },
        attachmentUrl: {
            type: String, //URL to S3 or Cloudinary if messageType isn't text
        },
        readBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
            },
        ],

    },
    {timestramps: true }
)

const Message = mongoose.model("Message" , messageSchema);
export default Message;