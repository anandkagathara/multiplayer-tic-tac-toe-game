const { userInfo } = require("os");
const {
  createUser,
  updateGame,
  winnerUpdate,
} = require("./dbFunction/CreateUser");
const Games = require("./models/Game");
const {
  deleteGame,
  deleteUser,
  allDataDelete,
} = require("./dbFunction/deleteData");
const Users = require("./models/Users");
var express = require("express"),
  app = express(),
  http = require("http").Server(app);

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

let port = 3000;

http.listen(port, function () {
  console.log(`Tic-tac-toe game server running on port ${port}`);
});

const io = require("socket.io")(http);
var players = {},
  unmatched;

function joinGame(socket) {
  players[socket.id] = {
    opponent: unmatched,
    symbol: "X",
    socket: socket,
  };

  if (unmatched) {
    players[socket.id].symbol = "O";
    players[unmatched].opponent = socket.id;
    unmatched = null;
  } else {
    unmatched = socket.id;
  }
}

function getOpponent(socket) {
  if (!players[socket.id].opponent) {
    return;
  }
  return players[players[socket.id].opponent].socket;
}
io.on("connection", async function (socket) {
  var isUserAdded = await createUser(socket.id);
  let gameData = await Games.findOne().sort({ _id: -1 });

  if (!gameData) {
    gameData = {
      totalPlayer: 0,
      _id: null,
    };
  }

  if (gameData.totalPlayer == 1) {
    await updateGame(gameData._id, isUserAdded._id, socket.id);
  } else {
    if (isUserAdded) {
      let createGame = new Games({
        playerOne: isUserAdded._id,
        playerOneSid: isUserAdded.playersocketid,
        playerTwo: null,
        playerTwoSid: null,
      });
      createGame = await createGame.save();
    }
  }
  // }

  joinGame(socket);

  if (getOpponent(socket)) {
    socket.emit("game.begin", {
      symbol: players[socket.id].symbol,
    });
    getOpponent(socket).emit("game.begin", {
      symbol: players[getOpponent(socket).id].symbol,
    });
  }

  socket.on("play-again", async function (data) {
    console.log("data-------------------------------------", data);
  });

  socket.on("make.move", async function (data) {
    if (!getOpponent(socket)) {
      return;
    }
    arr = [];
    arr.push(data);
    console.log("data", arr);
    console.log("Move made by : ", data);
    var gameId = await Games.findOne().sort({ _id: -1 });
    console.log("gameID", gameId._id);
    await Games.updateOne({ _id: gameId._id }, { $push: { gameStep: data } });
    socket.emit("move.made", data);
    console.log("move.madedata", data.symbol);
    console.log(
      "gameId.gameStep.length-----------------------",
      gameId.gameStep.length
    );
    if (gameId.gameStep.length == 8) {
      await Games.updateOne(
        { _id: gameId._id },
        { $set: { winner: "Match draw" } }
      );
      getOpponent(socket).emit("move.made", data);
    } else await Games.updateOne({ _id: gameId._id }, { $set: { winner: data.symbol } });
    getOpponent(socket).emit("move.made", data);
  });

  socket.on("disconnect", async function () {
    if (getOpponent(socket)) {
      getOpponent(socket).emit("opponent.left");
      // await deleteUser(socket.id);
      // await setTimeout(() => {
      //   deleteGame(socket.id);
      //   allDataDelete();
      // }, 2000);
    }
  });
});
