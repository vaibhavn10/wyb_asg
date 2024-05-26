const board = document.getElementById("board");
const boardMsg = document.getElementById("boardMsg");
const gameMsg = document.getElementById("gameMsg");

const X_CLASS = "x";
const O_CLASS = "o";
let oTurn;
let n = 3;
let m = 3;
let currentPlayer = "p1";

// function to initialize the game
const initBoard = () => {
  oTurn = false; // X mark to be placed first
  sessionStorage.setItem("player1", 0); //initializing the streak score of player1
  sessionStorage.setItem("player2", 0); //initializing the streak score of player2
  n = document.getElementById("ngrids").value || 3; //taking the input (default value is 3)
  m = document.getElementById("win-streak").value || 3; //taking the input (default value is 3)
  // adding event listeners to the buttons
  document.getElementById("createBoard").addEventListener("click", createBoard); // After clicking on button with createBoard id a new board will be created
  document.getElementById("next").addEventListener("click", next); // After clicking on button with next a new game will be started
  if (m > n) {
    // win streak must be less than or equal to grid size.
    document.getElementById("msg").innerHTML =
      "Win streak must be less than Number of grids.";
  } else {
    document.getElementById("msg").innerHTML = `No. of wins needed: ${m}`;
  }
  //  creating the board of n = 3
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
//  initializing the board
initBoard();

//  function to remove all the cells (elements) from the board.
const removeCells = () => {
  while (board.firstChild) {
    board.removeChild(board.firstChild);
  }
};

// function to create a new board
function createBoard() {
  oTurn = false; // X to be placed first
  n = document.getElementById("ngrids").value || 3; //Taking new inputs or creating new board
  m = document.getElementById("win-streak").value || 3; //Taking new inputs or creating new board
  document.getElementById("next").innerHTML = "NEXT GAME";
  document.getElementById("next").addEventListener("click", next);

  //win streak must be less than or equal to grid size
  if (m > n) {
    document.getElementById("msg").innerHTML =
      "Win streak must be less than Number of grids.";
  } else {
    document.getElementById("msg").innerHTML = `No. of wins needed: ${m}`;
  }
  board.style.gridTemplateColumns = `repeat(${n}, ${100 / n}%)`;

  // removing all the cells
  removeCells();

  //creating new cells and adding them to the board
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

// import the function to check if anyone won the game
import { checkWin } from "./checkWin.js";
let cellElements = document.querySelectorAll(".cell"); // getting all the cells of the board

function startGame() {
  //Removing marks and events from every cells and adding a event which will execute only once
  boardMsg.classList.remove("show");
  cellElements.forEach((cell) => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(O_CLASS);
    cell.removeEventListener("click", handleClick);
    cell.addEventListener("click", handleClick, { once: true });
  });
}

function handleClick(e) {
  // After clicking on a cell mark will be placed and using checkWin function we can check if someone won or the game is draw if none of them turns are swapped(oTurn=!oTurn)
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
  //if every cell has x or y in their classLists then the game is draw
  return [...cellElements].every((cell) => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
  });
}

function placeMark(cell, currentClass) {
  // using fontawesome mark X or O are placed if oTurn is true then O mark is placed and if it is false then X mark is placed
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
  // This function is executed if all cells are marked or some one won the game. firstly it checks if the game is draw or not, if not then it checks if the streak is broken by any player or not, if not it checks who is the winner and name is displayed  and the score is updated. then current player who is going to start first in the next game is swapped and is given x mark first.
  if (draw) {
    sessionStorage.setItem("player1", 0);
    sessionStorage.setItem("player2", 0);
    gameMsg.innerText = "Draw!";
  } else {
    const complete = checkStreak();
    if (!complete) {
      if (oTurn) {
        gameMsg.innerText = `${
          currentPlayer === "p1" ? "p2" : "p1"
        } wins the game. ${currentPlayer} will play first.`;
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
        gameMsg.innerText = `${currentPlayer} wins the game. ${
          currentPlayer === "p1" ? "p2" : "p1"
        } will play first.`;
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
    } else {
      //after the streak is broken players score is reset and game is reloaded after displaying who broke the streak first
      sessionStorage.setItem("player1", 0);
      sessionStorage.setItem("player2", 0);
      document.getElementById("next").addEventListener("click", () => {
        window.location.reload();
      });
      document.getElementById("next").innerHTML = "Restart the game";
      console.log("Game ENDED!");
    }
    setPlayer();
  }
  boardMsg.classList.add("show");
  cellElements.forEach((cell) => {
    cell.removeEventListener("click", handleClick);
  });
}

//function to swap turns (x to o , y to x)
function swapTurns() {
  oTurn = !oTurn;
}

//function to start new game
function next() {
  createBoard();
}

// function to check if some one broke the streak or not
function checkStreak() {
  if (parseInt(sessionStorage.getItem("player1")) === m - 1) {
    gameMsg.innerText = `Player1 ends the streak.`;
    return true;
  } else if (parseInt(sessionStorage.getItem("player2")) === m - 1) {
    gameMsg.innerText = `Player2 ends the streak.`;
    return true;
  } else {
    return false;
  }
}
// function to set current player who is going to start first
function setPlayer() {
  currentPlayer = currentPlayer === "p1" ? "p2" : "p1";
}

//starting the game
startGame();
