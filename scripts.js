let state = {
  try: 0,
  ceil: 4,
  current: 0,
  floor: 0
};

const selectedWord = 'ALIAS'

const board = document.getElementById("board");

function generateBoard() {
  for (let i = 0; i < 25; i++) {
    const cell = document.createElement("div");
    cell.id = `cell-${i}`
    cell.classList.add("cell")
    cell.classList.add("border-empty")
    board.append(cell)
  }
}

function goToNextRound() {
  if (state.current > state.ceil) {
    state.try++;
    state.floor = state.current;
    state.ceil += 5; 
  }

  return;
}

function removeFromCell() {
  if (state.current > state.floor) {
    state.current--;

    const cell = document.getElementById(`cell-${state.current}`);
    cell.innerText = null;
    cell.classList.replace("border-filled", "border-empty");
  }

  return;
}

function addToCell(key) {
  if (state.current > state.ceil) {
    return;
  }

  const cell = document.getElementById(`cell-${state.current}`);
  const text = document.createElement("p");

  text.innerText = key;
  
  cell.appendChild(text);
  cell.classList.replace("border-empty", "border-filled");
  state.current++;
}

function onKeyPress() {
  const {key, keyCode, charCode} = event;

  console.log(key, keyCode, charCode);
  
  if (keyCode === 32) {
    return;
  } else if (keyCode === 13) {
    goToNextRound();
  } else if (keyCode === 8 || keyCode === 46) {
    removeFromCell();
  } else if (state.try !== 5) {
    addToCell(key);
  }
}

document.addEventListener("click", () => console.log(state));
document.onkeydown = onKeyPress

generateBoard();