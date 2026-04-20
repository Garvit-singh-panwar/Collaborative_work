import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            maxLength: 50,
            unique: true,
            index: true,
            required: true,
            trim: true
        }
        , email: {
            type: String,
            unique: true,
            index: true,
            required: true,
            trim: true,
            lowercase: true
        },
        ProfilePic: {
            type: String,
            default: "https://example.com/default-avatar.png" 
        },
        password: {
            type:String,
            required: true,
            minLength: 8,
            select: false
        },
        rooms: [
            {
                type: mongoose.Types.ObjectId,
                index: true,
                ref: "Room"
            }
        ],
        bio: {
            type: String,
            maxLength: 160
        },
        socketId: { 
            type: String 
        },
        status: {
            type: String,
            enum: ["online", "offline"],
            default: "offline"
        },
        lastSeen: { 
            type: Date, 
            default: Date.now 
        }
    },
    { timestamps: true }
)

// Custom method to hash password before saving
userSchema.methods.hashPassword = async function() {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
};

// saving hash password before saving userData in DB
userSchema.pre("save", async function (next){
    if (!this.isModified("password")) return ;
    await this.hashPassword();   // call the custom method
    
})

// method to compare password 
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User",userSchema);

export default User;
