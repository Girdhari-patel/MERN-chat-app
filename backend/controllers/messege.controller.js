import Conversation from "../models/conversation.Model.js";
import Message from "../models/message.Model.js";

export const sendMessage =  async (req, res)=>{
    
    try{
        const { message } = req.body;
        console.log(message);
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});
         
       
		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
                messages:[],
			});
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			message,
		});
      
		if (newMessage) {
			conversation.messages.push(newMessage._id);
            console.log(conversation);
		}

		// await conversation.save();
		// await newMessage.save();

		// this will run in parallel
		await Promise.all([conversation.save(), newMessage.save()]);
        
        // SOCKET IO FUNCTIONALITY WILL GO HERE

    }catch(error){
        console.log("error in sendMessage controller " ,{error});
        res.status(500).json({error:"enternal server error"})
    }
}


export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

		if (!conversation) return res.status(200).json([]);

		const messages = conversation.messages;

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error in getMessages controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};