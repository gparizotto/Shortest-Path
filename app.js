import { dijkstra } from "./shortest.js";

const area = document.getElementById("area");
const linhas = 20;
const colunas = 50;
const square_size = 20;

const wallBtn = document.getElementById("wall-btn");
let wallSelected = false;

let cells = new Array();
let cell, row, column;

export let selectedCells = new Array();

for (let i = 0; i < linhas; i++) {
  cells[i] = new Array(colunas);
  for (let j = 0; j < colunas; j++) {
    cells[i][j] = 1; // Define um valor padrão para cada elemento
    let div = document.createElement("div"); //creates a div
    div.setAttribute("id", "div-" + i + "-" + j);
    div.classList.add("square"); //makes it a square
    div.style.top = i * 20 + "px"; //sets the position
    div.style.left = j * 20 + "px";
    area.appendChild(div);
  }
}

let mouseCheck = false;

function get_index(id) {
  const [_, linha, coluna] = id.split("-");
  return [parseInt(linha), parseInt(coluna)];
}

area.addEventListener("click", function (event) {
  cell = event.target;
  let [linha, coluna] = get_index(cell.id);
  if (!wallSelected) {
    if (cell.classList.contains("selected")) {
      const removed = selectedCells.findIndex(
        (selected) => selected.i == linha && selected.j == coluna
      );
      selectedCells.splice(removed, 1);
      cell.classList.remove("selected");
    } else if (selectedCells.length < 2) {
      if (cell.classList.contains("wall")) {
        cell.classList.remove("wall");
      }
      cell.classList.add("selected");
      //cells[linha][coluna] = "selected";
      selectedCells.push({ i: linha, j: coluna });
    }
  } else {
    if (cell.classList.contains("selected")) {
      const removed = selectedCells.findIndex(
        (selected) => selected.i == linha && selected.j == coluna
      );
      selectedCells.splice(removed, 1);
      cell.classList.remove("selected");
    }
    cell.classList.add("wall");
    cells[linha][coluna] = 0;
    if (!mouseCheck) mouseCheck = true;
    else mouseCheck = false;
  }
});

area.addEventListener("mousemove", function (event) {
  cell = event.target;
  let [linha, coluna] = get_index(cell.id);
  if (mouseCheck) {
    cell.classList.add("wall");
    cells[linha][coluna] = 0;
  }
});

wallBtn.addEventListener("click", () => {
  wallBtn.classList.toggle("pressed");
  if (wallBtn.classList.contains("pressed")) wallSelected = true;
  else wallSelected = false;
});

const calculatebtn = document.getElementById("calculate-btn");
calculatebtn.addEventListener("click", () => {
  const result = dijkstra(
    [selectedCells[0].i, selectedCells[0].j],
    [selectedCells[1].i, selectedCells[1].j],
    cells
  );
  if (result) {
    console.log(`Distância mínima: ${result.distance}`);

    let delay = 0;
    for (let i = 1; i < result.path.length; i++) {
      const [row, col] = result.path[i];
      const div = document.getElementById("div-" + row + "-" + col);
      div.style.animationDelay = `${delay}s`;
      div.classList.add("path");
      delay += 0.05;
      cells[row][col] = "X";
    }
  } else console.log("Não foi possível encontrar uma solução");
});

function reset() {
  let div;
  for (let i = 0; i < linhas; i++)
    for (let j = 0; j < colunas; j++) {
      div = document.getElementById("div-" + i + "-" + j);
      div.classList.remove("wall");
      div.classList.remove("path");
      cells[i][j] = 1;
    }
  console.log(cells);
}

const resetbtn = document.getElementById("reset-btn");
resetbtn.addEventListener("click", reset);
