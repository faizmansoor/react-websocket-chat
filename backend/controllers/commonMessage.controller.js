import User from "../models/User";
import Common from "../models/Common";

export const getCommonMessages = async (req, res) => {
    try {
        const commonMessages = await Common.find()
            .sort({ _id: -1 }) //newest first
            .limit(50); 

        res.status(200).json(commonMessages);
    } catch (error) {
        console.error("Error in getCommonMessages: ", error.message);
        res.status(500).json({ error: "Server Error" });
    }
};


export const sendCommonMessage = async (req, res) => {
    try{
        const {text, image} = req.body;
        const senderId = req.user._id;
        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newCommonMessage = new Common({
            senderId,
            text,
            image: imageUrl
        });
        await newCommonMessage.save();
        ////to do : real time message sending using socket.io
        res.status(201).json(newCommonMessage);
    } catch (error) {
        console.log("Error in sendCommonMessage controller: ", error.message);
        res.status(500).json({ error: "Server Error" });
        
    }
}