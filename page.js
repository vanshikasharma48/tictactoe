const db = firebase.database();
const boardRef = db.ref("game/board");
const turnRef = db.ref("game/turn");
const statusText = document.getElementById("status");

let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];

// Listen for board changes
boardRef.on("value", (snapshot) => {
  const data = snapshot.val();
  if (data) {
    board = data;
    updateBoard();
  }
});

// Listen for turn changes
turnRef.on("value", (snapshot) => {
  const turn = snapshot.val();
  if (turn) {
    currentPlayer = turn;
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
});

// Setup event listeners
document.querySelectorAll(".cell").forEach(cell => {
  cell.addEventListener("click", () => {
    const index = cell.getAttribute("data-index");

    if (board[index] === "") {
      board[index] = currentPlayer;
      boardRef.set(board);

      if (checkWinner()) {
        statusText.textContent = `Player ${currentPlayer} wins!`;
      } else if (board.every(cell => cell !== "")) {
        statusText.textContent = "It's a draw!";
      } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        turnRef.set(currentPlayer);
      }
    }
  });
});

function updateBoard() {
  document.querySelectorAll(".cell").forEach((cell, index) => {
    cell.textContent = board[index];
  });
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  boardRef.set(board);
  currentPlayer = "X";
  turnRef.set(currentPlayer);
  statusText.textContent = "Player X's turn";
}

function checkWinner() {
  const winCombos = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  return winCombos.some(combo => {
    const [a,b,c] = combo;
    return board[a] && board[a] === board[b] && board[b] === board[c];
  });
}
