const board = document.getElementById("board");
const boardMsg = document.getElementById("boardMsg");
const gameMsg = document.getElementById("gameMsg");

const X_CLASS = "x";
const O_CLASS = "o";
let oTurn;
let n = 3;
let m = 3;
let currentPlayer = "p1";

const initBoard = () => {
  oTurn = false;
  sessionStorage.setItem("player1", 0);
  sessionStorage.setItem("player2", 0);
  n = document.getElementById("ngrids").value || 3;
  m = document.getElementById("win-streak").value || 3;
  if (m > 0) {
    document
      .getElementById("createBoard")
      .addEventListener("click", createBoard);
    document.getElementById("next").addEventListener("click", next);
  }
  if (m > n) {
    document.getElementById("msg").innerHTML =
      "Win streak must be less than Number of grids.";
  } else {
    document.getElementById("msg").innerHTML = `No. of wins needed: ${m}`;
  }
  board.style.gridTemplateColumns = `repeat(${n}, ${100 / n}%)`;

  for (let i = 0; i < n * n; i++) {
    // creating cell element
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("data-cell", "");
    board.appendChild(cell);
  }
  gameMsg.classList.remove("show");
};
initBoard();

const removeCells = () => {
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }
};

function createBoard() {
  oTurn = false;  
  n = document.getElementById("ngrids").value || 3;
  m = document.getElementById("win-streak").value || 3;
  document.getElementById("next").innerHTML = "NEXT GAME";
  document.getElementById("next").addEventListener("click", next);
  if (m > n) {
    document.getElementById("msg").innerHTML =
      "Win streak must be less than Number of grids.";
  } else {
    document.getElementById("msg").innerHTML = `No. of wins needed: ${m}`;
  }
  board.style.gridTemplateColumns = `repeat(${n}, ${100 / n}%)`;

  removeCells();

  for (let i = 0; i < n * n; i++) {
    // creating cell element
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("data-cell", "");
    board.appendChild(cell);
  }
  cellElements = document.querySelectorAll(".cell");
  startGame();
}

function next() {
  createBoard();
}

function checkStreak() {
  if(parseInt(sessionStorage.getItem("player1"))===m-1){
    gameMsg.innerText = `Player1 ends the streak.`;
    return true;
  }
  else if(parseInt(sessionStorage.getItem("player2"))===m-1){
    gameMsg.innerText = `Player2 ends the streak.`;
    return true;
  }
  else{
    return false
  }
}
function setPlayer() {
  currentPlayer = currentPlayer === "p1" ? "p2" : "p1";
}

import { checkWin } from "./checkWin.js";
let cellElements = document.querySelectorAll(".cell");

function startGame() {
  boardMsg.classList.remove("show");
  cellElements.forEach((cell) => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(O_CLASS);
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = oTurn ? O_CLASS : X_CLASS;
  placeMark(cell, currentClass);
  if (checkWin(n, cellElements, currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
  }
}

function isDraw() {
  return [...cellElements].every((cell) => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
  });
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
  let mark = document.createElement("div");
  mark.classList.add("mark");
  let icon = document.createElement("i");
  mark.classList.add("mark");
  if (currentClass === "x") {
    icon.classList.add("fa-solid", "fa-x");
    mark.appendChild(icon);
  } else {
    icon.classList.add("fa-solid", "fa-o");
    mark.appendChild(icon);
  }
  cell.appendChild(mark);
}

function endGame(draw) {
  if (draw) {
    gameMsg.innerText = "Draw!";
  } else {
    const complete = checkStreak();
    if(!complete){
      if (oTurn) {
        gameMsg.innerText = `${
          currentPlayer === "p1" ? "p2" : "p1"
        } wins the game`;
        currentPlayer === "p1"
          ? sessionStorage.setItem(
              "player2",
              parseInt(sessionStorage.getItem("player2")) + 1
            )
          : sessionStorage.setItem(
              "player1",
              parseInt(sessionStorage.getItem("player1")) + 1
            );
      } else {
        gameMsg.innerText = `${currentPlayer} wins the game`;
        currentPlayer === "p1"
          ? sessionStorage.setItem(
              "player1",
              parseInt(sessionStorage.getItem("player1")) + 1
            )
          : sessionStorage.setItem(
              "player2",
              parseInt(sessionStorage.getItem("player2")) + 1
            );
      }
    }
    else{
      sessionStorage.setItem("player1",0)
      sessionStorage.setItem("player2",0)
      document.getElementById("next").addEventListener("click", ()=>{window.location.reload()});
      document.getElementById("next").innerHTML = "Restart the game";
      console.log("Game ENDED!")
    }
    setPlayer();
  }
  boardMsg.classList.add("show");
  cellElements.forEach((cell) => {
    cell.removeEventListener("click", handleClick);
  });
}

function swapTurns() {
  oTurn = !oTurn;
}

startGame();
