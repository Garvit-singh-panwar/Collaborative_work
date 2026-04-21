import Room from "../models/room.model.js";
import User from "../models/user.model.js";

export const getMyRooms = async (req, res) => {
    try {
        
        const userId = req.user._id;

        const rooms = await Room.find({ participants: userId })
            .populate({
                path: "participants",
                select: "userName profilePic bio" // Specifically asking for these
            }) // Get the details!
            .sort("-updatedAt")
            .lean(); // Most recent chats on top

        // Logic to help the frontend:
        const formattedRooms = rooms.map(room => {
            if (!room.isGroup) {
                // Find the OTHER person in the room
                const otherUser = (room.participants || []).find(
                    (p) => p._id.toString() !== userId.toString()
                );
                
                return {
                    ...room,
                    roomName:   otherUser.userName || "Unknown User",
                    roomPic:  otherUser.ProfilePic || null,
                    // Useful for frontend to know exactly who the "other" is
                    otherUserId: otherUser._id || null ,
                };
            }
            
            // If it's a group, it already has a 'name'
            return {
                ...room,
                roomName: room.name,
                roomPic: room.groupIcon || null,
                isAdmin: room.groupAdmin?.toString() === userId.toString()
            };
        });

        return res.status(200).json({ 
            success: true, 
            count: formattedRooms.length, 
            data: formattedRooms 
        });

    } catch (error) {
        
        return res.status(500).json(
            {
                success:false,
                error: error.message,
                message: "Internal server error"
            }
        )
    }
};