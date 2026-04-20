import mongoose from 'mongoose';

const roomSchema = mongoose.Schema({
        name:{
            type: String,
            trim: true,

            // only required if group is true
            default: null
        },
        isGroup:{
            type: Boolean,
            default: false
        },
        participants: [
            {
                type: mongoose.Types.ObjectId,
                ref: "User",
                required: true,
            }
        ],
        lastMessage: {
            type: mongoose.Types.ObjectId,
            ref: "Message",
        },
        // For Group Chats
        groupAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        groupIcon: {
            type: String,       
            default: ""
        }
    },
    { timestamps: true }

);

roomSchema.index({ participants: 1, isGroup: 1 });
const Room = mongoose.model("Room" , roomSchema);
export default Room;
