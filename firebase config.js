// firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyA6PwXg0q_xhkpZMq8-VYNWnVF4R2xcfSM",
  authDomain: "tictactoe-9669a.firebaseapp.com",
  projectId: "tictactoe-9669a",
  storageBucket: "tictactoe-9669a.appspot.com",
  messagingSenderId: "980342756755",
  appId: "1:980342756755:web:93955a6c9d59ef524c4466",
  measurementId: "G-9MMRLQ5YXV",
  databaseURL: "https://tictactoe-9669a-default-rtdb.asia-southeast1.firebasedatabase.app"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA6PwXg0q_xhkpZMq8-VYNWnVF4R2xcfSM",
  authDomain: "tictactoe-9669a.firebaseapp.com",
  projectId: "tictactoe-9669a",
  storageBucket: "tictactoe-9669a.firebasestorage.app",
  messagingSenderId: "980342756755",
  appId: "1:980342756755:web:93955a6c9d59ef524c4466",
  measurementId: "G-9MMRLQ5YXV"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const gameRef = db.ref("game");

// Game elements
const cells = document.querySelectorAll(".cell");
const status = document.getElementById("status");

// Listen for board updates
gameRef.on("value", (snapshot) => {
  const data = snapshot.val();

  if (!data) return;

  const board = data.board;
  const currentPlayer = data.currentPlayer;
  const winner = data.winner;

  // Update board UI
  cells.forEach((cell, i) => {
    cell.textContent = board[i];
  });

  // Update status
  if (winner) {
    status.textContent = winner === "Draw" ? "It's a draw!" : `${winner} wins!`;
  } else {
    status.textContent = `Turn: ${currentPlayer}`;
  }
});

// On cell click
cells.forEach(cell => {
  cell.addEventListener("click", () => {
    const index = cell.getAttribute("data-cell");

    gameRef.once("value", (snapshot) => {
      const data = snapshot.val();
      if (!data || data.winner || data.board[index]) return;

      const newBoard = [...data.board];
      newBoard[index] = data.currentPlayer;
      const nextPlayer = data.currentPlayer === "X" ? "O" : "X";
      const winner = getWinner(newBoard);

      gameRef.set({
        board: newBoard,
        currentPlayer: nextPlayer,
        winner: winner
      });
    });
  });
});

// Reset game
function resetGame() {
  gameRef.set({
    board: Array(9).fill(""),
    currentPlayer: "X",
    winner: ""
  });
}

// Winner check function
function getWinner(board) {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // columns
    [0,4,8], [2,4,6]           // diagonals
  ];

  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return board[a];
    }
  }

  return board.includes("") ? "" : "Draw";
}

// Initialize game if first time
gameRef.once("value", (snapshot) => {
  if (!snapshot.exists()) {
    resetGame();
  }
});
