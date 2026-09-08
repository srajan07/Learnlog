const mongoose=require("mongoose");

const CommentSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"JourneyPost",
        required:true
    },
    content:{
        type:String,
        required:true,
        trim:true,
        maxlength: 1000,
    }
},{
    timestamps:true
}) 
module.exports=mongoose.model("Comment",CommentSchema);