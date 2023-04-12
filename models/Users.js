const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/multiTictac")

const usersSchema = new mongoose.Schema({
    // username:String,
    isavailable:{
        type:Boolean,
        default:true
    },
    // gameid:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"game"
    // },
    playersocketid:String,
})
const Users = mongoose.model("users", usersSchema);
module.exports = Users;
