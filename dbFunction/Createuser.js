const Users = require("../models/Users");
const { ObjectId } = require("mongodb");
const Games = require("../models/Game");

const createUser = async (socket) => {
  let addUser = new Users({
    playersocketid: socket,
  });
  addUser = await addUser.save();
  return addUser;
};

const updateGame = async (gameId, playerTwo, playerTwoSid) => {
  try {
    const updatedGame = await Games.findByIdAndUpdate(
      gameId,
      {
        playerTwo: playerTwo.toString(),
        playerTwoSid: playerTwoSid,
        totalPlayer : 2
      },
      { new: true }
    );
    return updatedGame;
  } catch (error) {
    return error;
  }
};

const winnerUpdate = async (gameId, symbol) => {
  try {
    const updatedGame = await Games.findByIdAndUpdate(
      gameId,
      {
        winner: symbol,
      },
      { new: true }
    );
    return updatedGame;
  } catch (error) {
    return error;
  }
};

module.exports = { createUser, updateGame, winnerUpdate };
