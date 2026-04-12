import mongoose from "mongoose";


// this is a user schema 
const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            trim: true,
            maxLength: 50,
            index: true, // Speeds up searching for users
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            maxLength: 100,
        },
        password: {
            type: String,
            required: [true, "password is required "],
            maxLength: 15,
            trim: true
        },
        profile_picture: {
            type: String,
            default: "https://example.com/default-avatar.png", // Always good to have a fallback
        },
        status: {
            type: String,
            enum: ["online", "offline", "away"],
            default: "offline",
        },
        // 1. Store Friend IDs for a "Contacts" list
        friends: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ],

        // 2. Store Room IDs for a "My Chats" sidebar
        rooms: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Room",
            }
        ],
        lastSeen: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true } 
);

const User = mongoose.model("User", userSchema);
export default User;
