
const Users = require("../models/Users");
// const Games = require("../models/Game")

// const deleteGame = async (socket) => {
//     await Games.findOneAndDelete({ playerOneSid: socket });
//     await Users.findOneAndDelete({ socketid: socket });
//   };

  const deleteUser = async (socket) => {
    // await Games.findOneAndDelete({ playerOneSid: socket });
    await Users.findOneAndDelete({ playersocketid: socket });
  };
  
  module.exports = deleteUser;
  