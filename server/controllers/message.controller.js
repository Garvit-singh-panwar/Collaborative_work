import User from "../models/user.model.js";
import Room from "../models/room.model.js";
import Message from "../models/message.model.js";

export const getMessages = async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.user._id;

        
        // Fetch room and check if it exists
        const roomDetail = await Room.findById(roomId);
        if (!roomDetail) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }

        //  Security Check: Is the user a member?
        const isParticipant = roomDetail.participants.some(
            (id) => id.toString() === userId.toString()
        );

        if (!isParticipant) {
            return res.status(403).json({ 
                success: false, 
                message: "You are not authorized to view messages in this room" 
            });
        }

        // Pagination Settings
        const page = parseInt(req.query.page) || 0; 
        const limit = 20;

        const messages = await Message.find({ room: roomId })
            .sort({ createdAt: -1 }) // Get newest first
            .skip(page * limit)      // Skip previous pages
            .limit(limit)            // Only take 20
            .populate("sender", "username profilePic")
            .lean();

        // Important: Reverse them so they are in chronological order for the UI
        const chronologicalMessages = messages.reverse();

        return res.status(200).json({
            success: true,
            messages: chronologicalMessages,
            currentPage: page
        });

    } catch (error) {
        return res.status(500).json(
            { 
                success: false, 
                message: error.message 
            }
        );
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { roomId } = req.params;
        const { Attachments } = req.body;
        let { message } = req.body; // Use let so we can trim/modify it
        const userId = req.user._id;


        // 1. Validation Logic
        const hasText = message && message.trim().length > 0;
        const hasAttachments = Attachments && Attachments.length > 0;

        if (!hasText && !hasAttachments) {
            return res.status(400).json({
                success: false,
                message: "Cannot send an empty message"
            });
        }

        const cleanMessage = hasText ? message.trim() : null;


        // 2. Room Verification
        const roomDetail = await Room.findById(roomId);
        if (!roomDetail) {
            return res.status(404).json({ success: false, message: "Room not found" });
        }


        // 3. Authorization Check
        const isParticipant = roomDetail.participants.some(
            (id) => id.toString() === userId.toString()
        );

        if (!isParticipant) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }


        // 4. Create Message
        const createdMessage = await Message.create({
            room: roomId, // Check if your schema uses 'room' or 'roomId'
            sender: userId,
            text: cleanMessage,
            Attachments: Attachments || [],
            readBy: [userId] // Initially only read by the sender
        });

        // 5. Update Room's Last Message
        await Room.findByIdAndUpdate(roomId, { 
            lastMessage: createdMessage._id 
        });

        // 6. Populate sender before sending back (to show name/pic in UI)
        const populatedMessage = await createdMessage.populate("sender", "username profilePic");

        return res.status(201).json({
            success: true,
            data: populatedMessage,
            message: "Message sent successfully"
        });

    }catch (error) {
        console.error(error);
        return res.status(500).json(
            { 
                success: false, 
                message: error.message 
            });
    }
};

export const deleteMessage = async (req,res) =>{

    try{
        const {messageId} = req.params;
        const deletedBy = req.user._id;

        const message = await Message.findById(messageId);
        if(!message){
            return res.seatus(400).json(
                {
                    success:false,
                    message: "message not exist",
                }
            );
        }
        if(!deletedBy.equals(message.sender)){
            return res.status(400).json(
                {
                    success:false,
                    message: "only sender can delete message",
                }
            )
        }

        await Message.findByIdAndDelete(messageId);

        // Update the Room's lastMessage if it was this one
        // If we don't do this, the sidebar will try to fetch a deleted ID
        const room = await Room.findOne({ lastMessage: messageId });
        
        if (room) {
            // Find the NEW last message for this room
            const newLastMessage = await Message.findOne({ room: room._id })
                .sort({ createdAt: -1 });

            await Room.findByIdAndUpdate(room._id, { 
                lastMessage: newLastMessage ? newLastMessage._id : null 
            });
        }

        res.status(200).json(
            {
                success: true,
                message: "message deleted successfully"
            }
        )


    }catch(error){

        console.error(error);
        res.status(500).json(
            {
                success:false,
                error: error.message,
                message: "Internal server error"
            }
        );

    }

};
