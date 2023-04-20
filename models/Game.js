const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:27017/multiTictac");

const gameSchema = new mongoose.Schema({
  playerOne: {
    type: String,
  },
  playerOneSid: String,
  playerTwo: {
    type: String,
    require: false,
  },
  playerTwoSid: {
    type: String,
    require: false,
  },
  totalPlayer:{
    type:Number,
    require:false,
    default:1
  },
  winner: {
    type: String,
    require: false,
  },
  gameStep:{
    type:Array,
    require: false,
  }
});
const Games = mongoose.model("game", gameSchema);
module.exports = Games;
