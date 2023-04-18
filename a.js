import { Dijkstra } from "./shortest.js";

const WIDTH = 1000;
const HEIGHT = 400;

class Cell {
  constructor(linha, coluna, square_size, area) {
    this.linha = linha;
    this.coluna = coluna;
    this.square_size = square_size;
    this.area = area;
    this.div = document.createElement("div");
    this.div.setAttribute("id", `div-${linha}-${coluna}`);
    this.div.classList.add("square");
    this.div.style.height = `${square_size}px`;
    this.div.style.width = `${square_size}px`;
    this.div.style.top = `${linha * square_size}px`;
    this.div.style.left = `${coluna * square_size}px`;
    this.area.appendChild(this.div);
    this.type = "available";
  }

  setType(type) {
    this.type = type;
    if (type === "wall") {
      this.div.classList.add("wall");
      this.div.classList.remove("selected");
    } else if (type === "available") {
      this.div.classList.remove("wall", "selected", "visited", "path");
    } else if (type === "selected") {
      this.div.classList.add("selected");
      this.div.classList.remove("wall", "visited", "path");
    } else if (type === "visited") {
      this.div.classList.add("visited");
      this.div.classList.remove("wall", "selected", "path");
    } else if (type === "path") {
      this.div.classList.add("path");
      this.div.classList.remove("wall", "visited", "selected");
    }
  }

  isWall() {
    return this.type === "wall";
  }

  isAvailable() {
    return this.type === "available";
  }

  isSelected() {
    return this.type === "selected";
  }

  isVisited() {
    return this.type === "visited";
  }

  isPath() {
    return this.type === "path";
  }
}

class Board {
  constructor(rows, columns, square_size, area) {
    this.rows = rows;
    this.columns = columns;

    this.square_size = square_size;
    this.area = area;
    this.cells = new Array(this.rows);
    this.selectedCells = [];
    this.wallSelected = false;
    this.mouseCheck = false;
  }

  getIndex(id) {
    const [_, row, column] = id.split("-");
    return [parseInt(row), parseInt(column)];
  }

  isWallSelected() {
    return this.wallSelected;
  }

  removeCellSelected(cell, row, column) {
    const removedCell = this.selectedCells.findIndex(
      (selected) => selected[0] == row && selected[1] == column
    );
    this.selectedCells.splice(removedCell, 1);
    cell.setType("available");
  }

  selectCell(cell, row, column) {
    cell.setType("selected");
    this.selectedCells.push([row, column]);
  }

  addWall(cell, row, column) {
    if (cell.isSelected()) this.removeCellSelected(cell, row, column);
    cell.setType("wall");
  }

  deleteBoard() {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        this.cells[i][j].div.remove();
      }
    }
    this.selectedCells = [];
    this.cells = [];
  }

  createBoard() {
    for (let i = 0; i < this.rows; i++) {
      this.cells[i] = new Array(this.columns);
      for (let j = 0; j < this.columns; j++) {
        this.cells[i][j] = new Cell(i, j, this.square_size, this.area);
      }
    }
  }
}

class Area {
  constructor() {
    this.board = new Board(20, 50, 20, document.getElementById("area"));

    this.wallBtn = document.getElementById("wall-btn");
    this.resetBtn = document.getElementById("reset-btn");
    this.calculateBtn = document.getElementById("calculate-btn");
    this.sizeBtn = document.getElementById("size-btn");
    this.speedBtn = document.getElementById("speed-btn");
    this.mazeBtn = document.getElementById("maze-btn");
    this.delayTime = 0.01;
  }

  handleBoardClick() {
    this.board.area.addEventListener(
      "click",
      function (event) {
        const target = event.target;
        const [row, column] = this.board.getIndex(target.id);
        const cell = this.board.cells[row][column];
        if (this.board.isWallSelected()) {
          this.board.addWall(cell, row, column);
          this.board.mouseCheck = !this.board.mouseCheck;
        } else if (!cell.isWall()) {
          if (cell.isSelected())
            this.board.removeCellSelected(cell, row, column);
          else if (this.board.selectedCells.length < 2)
            this.board.selectCell(cell, row, column);
        } else cell.setType("selected");
      }.bind(this)
    );

    this.board.area.addEventListener(
      "mousemove",
      function (event) {
        const target = event.target;
        const [row, column] = this.board.getIndex(target.id);
        if (this.board.mouseCheck)
          this.board.cells[row][column].setType("wall");
      }.bind(this)
    );
  }

  handleButtons() {
    this.wallBtn.addEventListener("click", () => {
      this.wallBtn.classList.toggle("pressed");
      this.board.wallSelected = !this.wallSelected;
    });

    this.resetBtn.addEventListener("click", () => {
      for (let i = 0; i < this.board.rows; i++)
        for (let j = 0; j < this.board.columns; j++)
          this.board.cells[i][j].setType("available");
      this.board.selectedCells = [];
    });

    this.sizeBtn.addEventListener(
      "click",
      function (event) {
        const size = this.sizeBtn.innerHTML;
        this.board.deleteBoard();

        if (size == "20x50") {
          this.sizeBtn.innerHTML = "10x25";
          this.board.rows = 10;
          this.board.columns = 25;
          this.board.square_size = 40;
        } else if (size == "40x100") {
          this.sizeBtn.innerHTML = "20x50";
          this.board.rows = 20;
          this.board.columns = 50;
          this.board.square_size = 20;
        } else {
          this.sizeBtn.innerHTML = "40x100";
          this.board.rows = 40;
          this.board.columns = 100;
          this.board.square_size = 10;
        }

        this.board.createBoard();
      }.bind(this)
    );

    this.speedBtn.addEventListener("click", () => {
      const speed = this.speedBtn.innerHTML;
      if (speed == "Normal") {
        this.speedBtn.innerHTML = "Fast";
        this.delayTime = 0.003;
      }
      if (speed == "Fast") {
        this.speedBtn.innerHTML = "Slow";
        this.delayTime = 0.05;
      }
      if (speed == "Slow") {
        this.speedBtn.innerHTML = "Normal";
        this.delayTime = 0.01;
      }
    });

    this.calculateBtn.addEventListener("click", () => {
      const dijkstra = new Dijkstra(
        this.board.cells,
        this.board.rows,
        this.board.columns,
        this.board.selectedCells[0],
        this.board.selectedCells[1],
        this.delayTime
      );
      console.log(dijkstra.delayTime);
      const solution = dijkstra.dijkstra();
      if (solution) {
        const { distance, path } = solution;
        console.log(`Distância mínima: ${solution.distance}`);

        let time = 0;

        setTimeout(() => {
          for (let i = 1; i < solution.path.length; i++) {
            const [row, col] = solution.path[i];
            const div = document.getElementById("div-" + row + "-" + col);
            this.board.cells[row][col].setType("path");
            div.style.animationDelay = `${time}s`;
            div.classList.add("path");
            div.classList.remove("visited");
            time += 0.03;
          }
        }, dijkstra.delay * 1000);
      } else {
        console.log("nao encontrou solução");
      }
    });
  }

  run() {
    this.board.createBoard();
    this.handleBoardClick();
    this.handleButtons();
  }
}

let area = new Area();
area.run();
