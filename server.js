const { userInfo } = require("os");
const createUser = require("./dbFunction/CreateUser");
const User = require('./models/Users')
const deleteGame = require('./dbFunction/deleteData')
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
  console.log("Connection established...", socket.id);

  await createUser(socket.id)
  
  joinGame(socket);
  
  if (getOpponent(socket)) {
    socket.emit("game.begin", {      
      symbol: players[socket.id].symbol,
    });
    getOpponent(socket).emit("game.begin", {
      symbol: players[getOpponent(socket).id].symbol,
    });
  }

  socket.on("make.move", function (data) {
    if (!getOpponent(socket)) {
      return;
    }
    console.log("Move made by : ", data);
    socket.emit("move.made", data);
    getOpponent(socket).emit("move.made", data);
  });

  socket.on("disconnect", async function () {
    if (getOpponent(socket)) {
      console.log("disconnected player",socket.id)
      getOpponent(socket).emit("opponent.left");
      await deleteGame(socket.id);
    }
  });
});
