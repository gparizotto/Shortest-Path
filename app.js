let area = document.getElementById("area");

const matriz = [];

const linhas = 20;
const colunas = 50;

for (let i = 0; i < linhas; i++) {
  matriz[i] = [];
  for (let j = 0; j < colunas; j++) {
    matriz[i][j] = "none"; // Define um valor padrão para cada elemento
  }
}

let celulasSelecionadas = [];

for (let i = 0; i < 20; i++) {
  for (let j = 0; j < 50; j++) {
    let div = document.createElement("div");
    div.classList.add("square");
    div.style.top = i * 20 + "px";
    div.style.left = j * 20 + "px";

    div.addEventListener("mouseover", () => {
      div.style.backgroundColor = "grey";
    });
    div.addEventListener("mouseout", () => {
      div.style.backgroundColor = "white";
    });

    div.addEventListener("click", () => {
      if (celulasSelecionadas.length < 2) {
        div.classList.add("selected");
        celulasSelecionadas.push({ linha: i, coluna: j });
      } else {
        let celulaAntiga = celulasSelecionadas.shift();
        let celulaAntigaDiv = area.childNodes[celulaAntiga.linha * colunas + celulaAntiga.coluna];
        celulaAntigaDiv.classList.remove("selected");

        div.classList.add("selected");
        celulasSelecionadas.push({ linha: i, coluna: j });
      }
    });

    area.appendChild(div);
  }
}

function dijsktra() {
    console.log("pressed");
  }