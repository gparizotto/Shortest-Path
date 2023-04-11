import { dijkstra, delay } from "./shortest.js";

const area = document.getElementById("area");
let linhas = 20;
let colunas = 50;
let square_size = 20;
const canva_width = 1000;
const canva_height = 400;
const canva_area = canva_width * canva_height;

const wallBtn = document.getElementById("wall-btn");
let wallSelected = false;

let cells = new Array();
let cell, row, column;

export let selectedCells = new Array();

function delete_board() {
  for (let i = 0; i < linhas; i++) {
    for (let j = 0; j < colunas; j++) {
      let div = document.getElementById("div-" + i + "-" + j);
      div.remove();
    }
  }
}

function generate_board() {
  for (let i = 0; i < linhas; i++) {
    cells[i] = new Array(colunas);
    for (let j = 0; j < colunas; j++) {
      cells[i][j] = 1; // Define um valor padrão para cada elemento
      let div = document.createElement("div"); //creates a div
      div.setAttribute("id", "div-" + i + "-" + j);
      div.classList.add("square"); //makes it a square
      div.style.height = square_size + 'px';
      div.style.width = square_size + 'px';
      div.style.top = i * square_size + "px"; //sets the position
      div.style.left = j * square_size + "px";
      area.appendChild(div);
    }
  }
}

generate_board();

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

    let time = 0;

    setTimeout(() => {
      for (let i = 1; i < result.path.length; i++) {
        const [row, col] = result.path[i];
        const div = document.getElementById("div-" + row + "-" + col);
        cells[row][col] = 2;
        div.style.animationDelay = `${time}s`;
        div.classList.add("path");
        div.classList.remove("visited");
        time += 0.03;
      }
    }, delay * 1000);
  } else console.log("Não foi possível encontrar uma solução");
});

function reset() {
  let div;
  for (let i = 0; i < linhas; i++)
    for (let j = 0; j < colunas; j++) {
      div = document.getElementById("div-" + i + "-" + j);
      div.classList.remove("wall");
      div.classList.remove("path");
      div.classList.remove("visited");
      cells[i][j] = 1;
    }
  console.log(cells);
}

const sizeBtn = document.getElementById("size-btn");
sizeBtn.addEventListener("click", () => {
  let size = sizeBtn.innerHTML;
  delete_board();
  if (size == "20x50") {
    sizeBtn.innerHTML = "10x25";
    linhas = 10;
    colunas = 25;
    square_size = 40;
  } else if (size == "40x100") {
    sizeBtn.innerHTML = "20x50";
    linhas = 20;
    colunas = 50;
    square_size = 20;
  } else if (size == "10x25") {
    sizeBtn.innerHTML = "40x100";
    linhas = 40;
    colunas = 100;
    square_size = 10;
  }
  
  generate_board();
  console.log(cells);
});

function teste() {
}

teste();

const resetbtn = document.getElementById("reset-btn");
resetbtn.addEventListener("click", reset);
