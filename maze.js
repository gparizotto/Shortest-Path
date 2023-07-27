export class Maze {
  constructor(cells, rows, columns) {
    this.cells = cells;
    this.rows = rows;
    this.columns = columns;
    this.visited = [];
    this.mazeMatrix = [];
  }

  init() {
    for (let i = 0; i < this.rows; i++) {
      this.mazeMatrix[i] = new Array(this.columns);
      this.visited[i] = new Array(this.columns);
      for (let j = 0; j < this.columns; j++) {
        if (i % 2 != 0) this.mazeMatrix[i][j] = 0;
        else if (j % 2 != 0) this.mazeMatrix[i][j] = 0;
        else this.mazeMatrix[i][j] = 1;

        this.visited[i][j] = false;
      }
    }
  }

  backtracking(current) {
    const [row, col] = current;
    const neighbors = this.getNeighbors(current);

    this.visited[row][col] = true;

    while (neighbors.length > 0) {
      let index = Math.floor(Math.random() * neighbors.length);
      let next = neighbors[Math.floor(Math.random() * neighbors.length)];
      neighbors.splice(index, 1);

      if (!this.visited[next[0]][next[1]]) {
        this.setWall(current, next);
        this.backtracking(next);
      }
    }
  }

  setWall(current, next) {
    const rowVar = next[0] - current[0];
    const colVar = next[1] - current[1];

    if (rowVar != 0) {
      if (rowVar > 0) this.mazeMatrix[current[0] + 1][current[1]] = 1;
      if (rowVar < 0) this.mazeMatrix[current[0] - 1][current[1]] = 1;
    } else if (colVar != 0) {
      if (colVar > 0) this.mazeMatrix[current[0]][current[1] + 1] = 1;
      if (colVar < 0) this.mazeMatrix[current[0]][current[1] - 1] = 1;
    }
  }

  generateMaze() {
    this.init();
    this.backtracking([0, 0]);
    this.drawMaze();
  }

  getNeighbors(current) {
    const [row, col] = current;
    const neighbors = [];

    if (row + 2 < this.rows && !this.visited[row + 2][col])
      neighbors.push([row + 2, col]);
    if (row - 2 >= 0 && !this.visited[row - 2][col])
      neighbors.push([row - 2, col]);
    if (col + 2 < this.columns && !this.visited[row][col + 2])
      neighbors.push([row, col + 2]);
    if (col - 2 >= 0 && !this.visited[row][col - 2])
      neighbors.push([row, col - 2]);

    return neighbors;
  }

  drawMaze() {
    for (let i = 0; i < this.rows; i++)
      for (let j = 0; j < this.columns; j++)
        this.cells[i][j].setType("available");

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        if (this.mazeMatrix[i][j] == 0) this.cells[i][j].setType("wall");
      }
    }
  }
}
