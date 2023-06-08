const mongoose = require("mongoose");
const messageSchema = mongoose.Schema({
    sender:String,
    reipient:String,
    message:String,
    timeStamp:{type:Date,default:Date.now}
})

const Message = mongoose.model("messages",messageSchema);

module.exports ={Message}