import mongoose from 'mongoose';

const commonMessageSchema = new mongoose.Schema({
    senderId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    text:{
        type : String,
    },
    image:{
        type : String,
    },
},
{
    timestamps : true,
}
);

const Common = mongoose.model('Common', commonMessageSchema);

export default Common;