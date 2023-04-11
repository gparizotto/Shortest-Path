let [linhas, colunas] = document.getElementById('size-btn').innerHTML.split('x');
console.log(linhas, colunas);
// Define a matriz
const ROWS = 20;
const COLS = 50;
const matrix = new Array(ROWS).fill().map(() => new Array(COLS).fill(1));

// Define o ponto de partida e o ponto de destino
const start = [5, 5];
const end = [19, 5];

let delayTime = 0.01;

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

export let delay = 0;

// Define a função dijkstra para encontrar o caminho mínimo
export function dijkstra(start, end, matrix) {
  // Define a matriz de distâncias e de visitados
  const distances = new Array(ROWS)
    .fill()
    .map(() => new Array(COLS).fill(Infinity));
  const visited = new Array(ROWS).fill().map(() => new Array(COLS).fill(false));

  delay = 0;

  // Define a fila de prioridade e adiciona o ponto de partida com distância zero
  const queue = new PriorityQueue();
  queue.enqueue(start, 0);

  // Define a matriz de predecessores
  const predecessors = {};

  // Define a distância do ponto de partida como zero
  distances[start[0]][start[1]] = 0;

  while (!queue.isEmpty()) {
    // Obtém o ponto com menor distância na fila de prioridade
    const current = queue.dequeue();

    // Se o ponto for o destino, retorna o caminho mínimo
    if (current[0] === end[0] && current[1] === end[1]) {
      const path = [];
      let distance = distances[current[0]][current[1]];
      let predecessor = predecessors[current];

      while (predecessor) {
        path.unshift(predecessor);
        predecessor = predecessors[predecessor];
      }

      return { distance, path };
    }

    // Marca o ponto como visitado
    visited[current[0]][current[1]] = true;

    // Obtém os vizinhos do ponto atual
    const neighbors = getNeighbors(current, matrix);

    // Para cada vizinho do ponto atual
    for (let i = 0; i < neighbors.length; i++) {
      const neighbor = neighbors[i];

      // Se o vizinho já foi visitado, continua para o próximo vizinho
      if (visited[neighbor[0]][neighbor[1]]) {
        continue;
      }

      // Calcula a distância do ponto atual até o vizinho
      const distance = distances[current[0]][current[1]] + 1;

      // Se a distância for menor que a distância registrada no vizinho, atualiza a distância e adiciona o vizinho à fila de prioridade
      if (distance < distances[neighbor[0]][neighbor[1]]) {
        distances[neighbor[0]][neighbor[1]] = distance;
        predecessors[neighbor] = current;
        queue.enqueue(neighbor, distance);

        const div = document.getElementById('div-' + neighbor[0] + '-' + neighbor[1]);
        div.style.animationDelay = `${delay}s`;
        div.classList.add('visited');
        delay += delayTime;
        matrix[current[0]][current[1]] = 3;
      }
    }
  }

  // Se o destino não foi alcançado, retorna null
  return null;
}

// Define a função getNeighbors para obter os vizinhos de uma célula
function getNeighbors(cell, matrix) {
  const ROWS = matrix.length;
  const COLS = matrix[0].length;
  const [row, col] = cell;

  const neighbors = [];

  if (row > 0 && matrix[row - 1][col]) {
    neighbors.push([row - 1, col]);
  }

  // if (row > 0 && col > 0 && matrix[row - 1][col - 1]) {
  //   neighbors.push([row - 1, col - 1]);
  // }

  // if (row < ROWS - 1 && col > 0 && matrix[row + 1][col - 1]) {
  //   neighbors.push([row + 1, col - 1]);
  // }

  if (col > 0 && matrix[row][col - 1]) {
    neighbors.push([row, col - 1]);
  }

  if (row < ROWS - 1 && matrix[row + 1][col]) {
    neighbors.push([row + 1, col]);
  }

  if (col < COLS - 1 && matrix[row][col + 1]) {
    neighbors.push([row, col + 1]);
  }

  // if (row < ROWS - 1 && col < COLS - 1 && matrix[row + 1][col + 1]) {
  //   neighbors.push([row + 1, col + 1]);
  // }
  // if (row > 0 && col < COLS - 1 && matrix[row - 1][col + 1]) {
  //   neighbors.push([row - 1, col + 1]);
  // }

  return neighbors;
}

// // Chama a função dijkstra para encontrar o caminho mínimo e marca as células do caminho na matriz
// const result = dijkstra(start, end, matrix);
// if (result) {
//   const { distance, path } = result;
//   console.log(`Distância mínima: ${distance}`);

//   for (let i = 0; i < path.length; i++) {
//     const [row, col] = path[i];
//     matrix[row][col] = 'X';
//   }

//   console.log(matrix);
// } else {
//   console.log('Não há caminho possível.');
// }

const speedBtn = document.getElementById('speed-btn');
speedBtn.addEventListener('click', () =>{
  let speed = speedBtn.innerHTML;
  if(speed == 'Slow') {
    speedBtn.innerHTML = 'Normal';
    delayTime = 0.01;
  }
  else if(speed == 'Normal') {
    speedBtn.innerHTML = 'Fast';
    delayTime = 0.003;
  }
  else if(speed == 'Fast'){
    speedBtn.innerHTML = 'Slow';
    delayTime = 0.05;
  }
  console.log(delayTime);
})
