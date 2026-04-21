import User from "../models/user.model.js";
import Room from "../models/room.model.js";
import Message from "../models/message.model.js";

export const createRoom = async (req, res) => {
    try {
        const { isGroup, participants, name } = req.body;
        const admin = req.user._id;

        // 1. Basic Validation
        if (!participants || !Array.isArray(participants) || participants.length === 0) {
            return res.status(400).json(
                { 
                    success: false, 
                    message: "Participants are required as an array." 
                }
            );
        }

        // 2. Handle Group Chat Logic
        if (isGroup) {
            if (!name) {
                return res.status(400).json(
                    { 
                        success: false, 
                        message: "Group name is required." 
                    }
                );
            }
            if (participants.length < 2) {
                return res.status(400).json(
                    { 
                        success: false, 
                        message: "Groups require at least 2 other members." 
                    }
                );
            }

            // Verify all participants exist in one go
            const validUsers = await User.find({ _id: { $in: participants } }).select('_id');
            if (validUsers.length !== participants.length) {
                return res.status(400).json(
                    { 
                        success: false, 
                        message: "One or more users do not exist." 
                    }
                );
            }


            // Prepare final participant list (include the admin)
            const allParticipants = [...participants, admin];

            // Create the Room
            const newRoom = await Room.create({
                isGroup: true,
                participants: allParticipants,
                groupAdmin: admin, // Make sure your model uses groupAdmin or admin
                name: name
            });

            // Update all users' "rooms" array in ONE call
            await User.updateMany(
                { _id: { $in: allParticipants } },
                { $addToSet: { rooms: newRoom._id } } // $addToSet avoids duplicates
            );

            return res.status(201).json(
                { 
                    success: true, 
                    data: newRoom 
                }
            );
        } 
        
        // 3. Handle 1-to-1 Logic (The "Else" part)
        else {
            const receiverId = participants[0]; // In 1-to-1, take the first ID

            // Check if room already exists
            const existingRoom = await Room.findOne({
                isGroup: false,
                participants: { $all: [admin, receiverId] },
                participants: { $size: 2 }
            });

            if (existingRoom) {
                return res.status(200).json(
                    { 
                        success: true, 
                        data: existingRoom 
                    }
                );
            }

            const newRoom = await Room.create({
                isGroup: false,
                participants: [admin, receiverId]
            });

            await User.updateMany(
                { _id: { $in: [admin, receiverId] } },
                { $addToSet: { rooms: newRoom._id } }
            );

            return res.status(201).json(
                { 
                    success: true, 
                    data: newRoom 
                });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json(
            { 
                success: false, 
                message: "Internal Server Error" 
            }
        );
    }
};




export const addParticipants = async(req,res)=>{

    try {

        // taking roomid,participants id or AddedBy from req
        const {room,participants} = req.body;
        const AddBy = req.user._id;


        // if the filed is not present send response
        if(!room || !participants || !Array.isArray(participants) ){
            res.status(400).json(
                {
                    success:false,
                    message: "All fileds are required",
                }
            )
        }

        
        
        // if the room is not presernt send res

        const currentRoom = await Room.findById(room);

        if(!currentRoom || !currentRoom.isGroup){
            return res.status(400).json(
                {
                    success:false,
                    message: "Group not exist"
                }
            )
        }


        // if the one who is adding is not user send response
        if(!AddBy.equals(currentRoom.groupAdmin)){
            return res.status(400).json(
                {
                    success:false,
                    message: "Only admin can add Participants"
                }
            )
        };

    
        // if participants are not valid send response
        const validUsers = await User.find({ _id: { $in: participants } }).select('_id');

        if (validUsers.length !== participants.length) {
            return res.status(400).json(
                { 
                    success: false, 
                    message: "users not exist." 
                }
            );
        }

        // add new participants in room 
        const updatedRoom = await Room.findByIdAndUpdate(
                room, 
                { $addToSet: {participants: { $each: participants } } }
                ,{new: true}
            );
        
        
        // adding room id in all participants rooms 
        await User.updateMany(
            { _id: { $in: participants } },
            {$addToSet: { rooms: room } },
        ) 

        // sending success response
        res.status(200).json(
            {
                success:true,
                room: updatedRoom,
                message: "all participants are added"
            }
        )
        


    // Catching errors    
    } catch (error) {
        console.error(error);
        return res.status(500).json(
            { 
                success: false, 
                message: "Internal Server Error" 
            }
        );
    }
};




export const removeParticipants = async(req,res)=>{
     try {

        // taking roomid,participants id or AddedBy from req
        const {room,participants} = req.body;
        const DeleteBy = req.user._id;


        // if the filed is not present send response
        if(!room || !participants || !Array.isArray(participants) ){
            res.status(400).json(
                {
                    success:false,
                    message: "All fileds are required",
                }
            )
        }

        
        
        // if the room is not presernt send res

        const currentRoom = await Room.findById(room);

        if(!currentRoom || !currentRoom.isGroup){
            return res.status(400).json(
                {
                    success:false,
                    message: "Group not exist"
                }
            )
        }



        // if the one who is adding is not user send response
        if(!DeleteBy.equals(currentRoom.groupAdmin)){
            return res.status(400).json(
                {
                    success:false,
                    message: "Only admin can add Participants"
                }
            )
        };

    
        
        // add new participants in room 
        const updatedRoom = await Room.findByIdAndUpdate(
                room, 
                { $pull: {participants:{ $in: participants } } },
                { new: true }
            );
        
        // deleting rooms from users 
        await User.updateMany(
            { _id: { $in: participants } },
            { $pull: { rooms: room } } 
        );


        // sending success response
        res.status(200).json(
            {
                success:true,
                room: updatedRoom,
                message: "all participants are added"
            }
        )
       


    // Catching errors    
    } catch (error) {
        console.error(error);
        return res.status(500).json(
            { 
                success: false, 
                message: "Internal Server Error" 
            }
        );
    }
};



export const removeRoom = async(req,res)=>{

    try {
        const { room } = req.body;
        const deletedBy = req.user._id;
        
        if(!room){
            return res.status(400).json(
                {
                    success:false,
                    message: "required all fields",
                }
            );
        }

        // Fetch room first to check permissions
        const roomDetail = Room.findById(room);
        if(!roomDetail ){
            return res.status(400).json(
                {
                    success:false,
                    message: "room not exist"
                }
            );
        }

        // Admin Check
        if(!deletedBy.equals(roomDetail.groupAdmin)){
            return res.status(400).json(
                {
                    success:false,
                    message: "only admin can delete",
                }
            );
        }


        // Delete the Room 
        // This returns the document so we can still see who the participants WERE
        const updatedRoom = Room.findByIdAndDelete(id);

        // Cleanup Users
        // We remove this room ID from the 'rooms' array of all members
        await User.updateMany(
            {_id: {$in: updatedRoom.participants } } ,
            {$pull:  { rooms: room } }
        );

        // removing all the messages releted to that room 
        Message.deleteMany({ room: room })
        .then(() => {
            console.log("Messages cleaned up in the background");
        }).catch(err => console.error("Cleanup failed", err));

        res.status(200).json(
            {
                success:true,
                message: "Room deleted successfully"
            }
        )


    } catch (error) {
        
        console.error(error.message);
        res.status(500).json(
            {
                success:false,
                error: error.message,
                message:"Internal server error"
            }
        );

    }

};