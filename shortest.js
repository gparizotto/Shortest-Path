// Define a classe PriorityQueue para a fila de prioridade
class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(item, priority) {
    this.queue.push({ item, priority });
    this.queue.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    return this.queue.shift().item;
  }

  isEmpty() {
    return this.queue.length === 0;
  }
}

export class Dijkstra {
  constructor(cells, rows, columns, start, end, delayTime) {
    this.cells = cells;
    this.rows = rows;
    this.columns = columns;
    this.start = start;
    this.end = end;
    this.distances;
    this.visited;
    this.queue;
    this.predecessors;
    this.delay = 0;
    this.delayTime = delayTime;
    this.answer = [];
    this.path = [];
    this.distance = 0;
  }

  dijkstra() {
    this.distances = new Array(this.rows)
      .fill()
      .map(() => new Array(this.columns).fill(Infinity));
    this.visited = new Array(this.rows)
      .fill()
      .map(() => new Array(this.columns).fill(false));
    this.queue = new PriorityQueue();
    this.queue.enqueue(this.start, 0);
    this.predecessors = {};
    this.distances[this.start[0]][this.start[1]] = 0;
    const [row, column] = this.end;
    while (!this.queue.isEmpty()) {
      const current = this.queue.dequeue();
      const div = document.getElementById(
        "div-" + current[0] + "-" + current[1]
      );
      div.style.animationDelay = `${this.delay}s`;
      div.classList.add("visited");
      this.delay += this.delayTime;

      if (current[0] == row && current[1] == column) {
        this.path = [];
        this.distance = this.distances[current[0]][current[1]];
        let predecessor = this.predecessors[current];
        while (predecessor) {
          this.path.unshift(predecessor);
          predecessor = this.predecessors[predecessor];
        }
        // this.answer.push({ distance, path });
        return { distance: this.distance, path: this.path };
      }
      // Marca o ponto como visitado
      this.visited[current[0]][current[1]] = true;
      // Obtém os vizinhos do ponto atual
      const neighbors = this.getNeighbors(current, this.cells);
      // Para cada vizinho do ponto atual
      for (let i = 0; i < neighbors.length; i++) {
        const neighbor = neighbors[i];

        // Se o vizinho já foi visitado, continua para o próximo vizinho
        if (this.visited[neighbor[0]][neighbor[1]]) {
          continue;
        }

        // Calcula a distância do ponto atual até o vizinho
        const distance = this.distances[current[0]][current[1]] + 1;

        // Se a distância for menor que a distância registrada no vizinho, atualiza a distância e adiciona o vizinho à fila de prioridade
        if (distance < this.distances[neighbor[0]][neighbor[1]]) {
          this.distances[neighbor[0]][neighbor[1]] = distance;
          this.predecessors[neighbor] = current;
          this.queue.enqueue(neighbor, distance);
        }
      }
    }

    this.distance = 0;
    return { distance: this.distance, path: this.path};
  }

  getNeighbors(current, cells) {
    const [row, col] = current;
    const neighbors = [];

    if (row > 0 && cells[row - 1][col].type != "wall") {
      neighbors.push([row - 1, col]);
    }
    if (col > 0 && cells[row][col - 1].type != "wall") {
      neighbors.push([row, col - 1]);
    }
    if (row < this.rows - 1 && cells[row + 1][col].type != "wall") {
      neighbors.push([row + 1, col]);
    }
    if (col < this.columns - 1 && cells[row][col + 1].type != "wall") {
      neighbors.push([row, col + 1]);
    }
    return neighbors;
  }
}
