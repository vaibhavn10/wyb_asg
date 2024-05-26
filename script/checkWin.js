// Function to check if anyone won the game.
export function checkWin(n, cellElements, currentClass) {
  const cells = [...cellElements];
  console.log();

  // Check rows
  for (let row = 0; row < n; row++) {
    let win = true;
    for (let col = 0; col < n; col++) {
      if (!cells[row * n + col].classList.contains(currentClass)) {
        win = false;
        break;
      }
    }
    if (win) return true;
  }

  // Check columns
  for (let col = 0; col < n; col++) {
    let win = true;
    for (let row = 0; row < n; row++) {
      if (!cells[row * n + col].classList.contains(currentClass)) {
        win = false;
        break;
      }
    }
    if (win) return true;
  }

  //   Check diagonal top-left to bottom-right
  let win = true;
  for (let i = 0; i < n; i++) {
    if (!cells[i * n + i].classList.contains(currentClass)) {
      win = false;
      break;
    }
  }
  if (win) return true;
  

  // Check diagonal top-right to bottom-left
  win = true;
  for (let i = 0; i < n; i++) {
    if (!cells[i * n + (n - 1 - i)].classList.contains(currentClass)) {
      win = false;
      break;
    }
  }
  if (win) return true;

  return false;
}
