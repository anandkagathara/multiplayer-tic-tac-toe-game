const Users = require("../models/Users");
const Games = require("../models/Game");

const deleteGame = async (socket) => {
  console.log(socket);
  await Games.findOneAndDelete({
    $or: [{ playerOneSid: socket }, { playerTwoSid: socket }],
  });
};

const deleteUser = async (socket) => {
  await Users.findOneAndDelete({ playersocketid: socket });
};

const allDataDelete = async () => {
  await Games.deleteMany({});
  await Users.deleteMany({});
};
module.exports = { deleteUser, deleteGame, allDataDelete };
