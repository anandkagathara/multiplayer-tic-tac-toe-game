var socket = io.connect(),
  myTurn = true,
  symbol;

var matches = ["XXX", "OOO"];

const loadpage = () => {
  window.location = "http://localhost:3000/";
};

function getBoardState() {
  var obj = {};

  $(".cell").each(function () {
    obj[$(this).attr("id")] = $(this).text() || "";
  });

  console.log("state: ", obj);
  return obj;
}

// socket.on("full", (data) => {
//   $("#messages").html(data);
//   $(`button`).attr("disabled", true);
// });

function isGameOver() {
  var state = getBoardState();
  console.log("Board State: ", state);

  var rows = [
    state.a0 + state.a1 + state.a2,
    state.b0 + state.b1 + state.b2,
    state.c0 + state.c1 + state.c2,
    state.a0 + state.b1 + state.c2,
    state.a2 + state.b1 + state.c0,
    state.a0 + state.b0 + state.c0,
    state.a1 + state.b1 + state.c1,
    state.a2 + state.b2 + state.c2,
  ];

  for (var i = 0; i < rows.length; i++) {
    if (rows[i] === matches[0] || rows[i] === matches[1]) {
      // setTimeout(loadpage, 2000);
      return true;
    }
  }
  return false;
}

const loginSubmit = () => {
  // document.getElementById("#button").disabled= true
  loadpage();
};

function renderTurnMessage() {
  if (!myTurn) {
    $("#messages").text("Your opponent's turn");
    $(".cell").attr("disabled", true);
  } else {
    $("#messages").text("Your turn.");
    $(".cell").removeAttr("disabled");
  }
}

function makeMove(e) {
  e.preventDefault();
  if (!myTurn) {
    return;
  }

  if ($(this).text().length) {
    return;
  }

  socket.emit("make.move", {
    symbol: symbol,
    position: $(this).attr("id"),
  });
}

socket.on("move.made", function (data) {
  // document.getElementById("playbtn").style.display = "none";

  $("#" + data.position).text(data.symbol);

  myTurn = data.symbol !== symbol;

  if (!isGameOver()) {
    return renderTurnMessage();
  }

  if (myTurn) {
    $("#messages").text("Game over. You lost.");
    window.alert(`Game over. You lost.`);
  // document.getElementById("playbtn").style.display = "block";
  $("#playbtn").attr("disabled", false);


  } else {
    $("#messages").text("Game over. You won!");
    window.alert(`Game over. You won.`);
  // document.getElementById("playbtn").style.display = "block";
  $("#playbtn").attr("disabled", false);


  }

  $(".cell").attr("disabled", true);
});

socket.on("game.begin", function (data) {
  $("#playbtn").attr("disabled", true);
  $("#symbol").html(data.symbol); // symbol
  symbol = data.symbol;

  myTurn = data.symbol === "X";
  renderTurnMessage();
});

socket.on("opponent.left", async function () {
  $("#messages").text("Your opponent left the game.");
  $(".cell").attr("disabled", true);
  console.log("disconnect");
  // setTimeout(loadpage, 1000);
});

$(function () {
  $(".board button").attr("disabled", true);
  $(".cell").on("click", makeMove);
});
