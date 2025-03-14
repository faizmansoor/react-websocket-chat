import User from "../models/User.js";
import Message from "../models/message.js";

export const getUsersForSideBar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("username");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSideBar: ", error.message);
    res.status(500).json({ error: "Server Error" });
  }
};
export const getMessages = async (req, res) => {
  try {
    const { receiver } = req.params;
    const myId = req.user._id;
    const receiverUser = await User.findOne({ username: receiver });

    if (!receiverUser) {
      return res.status(404).json({ message: "Receiver not found" });
    }
    const receiverId = receiverUser._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: receiverId },
        { senderId: receiverId, receiverId: myId },
      ],
    }).populate("senderId", "username");

    // Transform messages to include sender username
    const formattedMessages = messages.map((msg) => ({
      senderId: msg.senderId._id,
      senderUsername: msg.senderId.username,
      receiverId: msg.receiverId,
      text: msg.text,
      image: msg.image,
    }));

    res.status(200).json(formattedMessages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { receiver } = req.params;
    const receiverUser = await User.findOne({ username: receiver });
    if (!receiverUser) {
      return res.status(404).json({ message: "Receiver not found" });
    }
    const receiverId = receiverUser._id;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Server Error" });
  }
};
