const mongoose = require("mongoose");
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:27017/multiTictac")

const gameSchema = new mongoose.Schema({
    playerOne:{
        type: mongoose.Schema.Types.ObjectId
    },
    playerOneSid:String,
    secondPlayer:{
        type: String
    },

})
const Games = mongoose.model("game", gameSchema);
module.exports = Games;
