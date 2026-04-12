import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true, // Only really used if isGroup is true
        },
        isGroup: {
            type: Boolean,
            default: false,
        },
        // In MongoDB, we store participant IDs directly in the Room
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        lastMessage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
        groupAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);
export default Room;