import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
 roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        required: true
    },
    attachments: [String], // URLs for images/files
    readBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
}, { timestamps: true });

messageSchema.index({ roomId: 1 , createdAt: -1 });
const Message = mongoose.model("Message",messageSchema);

export default Message;