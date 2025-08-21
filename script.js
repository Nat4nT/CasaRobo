var vizinhanca = [];
var vetMovimento = [];
var vetBuraco = [];
// Metodo Varredura
var posRobo, posCasa, casa, robo, buraco;

var posBuraco;

var pos = 0;
const DIMENSAO = 8;

function registrarPassos(e) {
  vetMovimento.push(Number(e.id));
  document.getElementById("passos").innerHTML += e.innerText + ",";
}

function moverRobo() {
  let [l, c] = posRobo.split(",").map(Number);
  let el = vetMovimento[pos]; 
  let novaLinha = l;
  let novaColuna = c;

  switch (el) {
    case 0:
      novaColuna++;
      break;
    case 1:
      novaColuna--;
      break;
    case 2:
      novaLinha--;
      break;
    case 3:
      novaLinha++;
      break;
  }

  // Verificamos se a nova posição é um buraco
  const novaPosicao = novaLinha + "," + novaColuna;
  if (vetBuraco.includes(novaPosicao)) {

    clearInterval(intervalo);
    alert("robô  destruído!");
    robo.className += " entrar";

    return;
  }

  
  pos++; 
  document.getElementById(posRobo).innerHTML = "";
  posRobo = novaPosicao;
  document.getElementById(posRobo).appendChild(robo);
}

function posicionaImagens() {
  robo = document.createElement("img");
  robo.onclick = iniciar;
  robo.className = "imagens";
  robo.src = "img/robo.png";

  casa = document.createElement("img");
  casa.className = "imagens";
  casa.src = "img/casa.png";

  let l = Math.floor(Math.random() * 4);
  let c = Math.floor(Math.random() * 8);
  posRobo = l + "," + c;
  document.getElementById(posRobo).appendChild(robo);

  l = Math.floor(Math.random() * 4) + 4;
  c = Math.floor(Math.random() * 8);
  posCasa = l + "," + c;
  document.getElementById(posCasa).appendChild(casa);

  for (let i = 0; i < 10; i++) {
    buraco = document.createElement("img");
    buraco.className = "imagens buraco";
    buraco.src = "img/buraco.png";
    l = Math.floor(Math.random() * 8);
    c = Math.floor(Math.random() * 8);
    posBuraco = l + "," + c;
    if (document.getElementById(posBuraco).childElementCount > 0) {
      i--;
    } else {
      vetBuraco.push(posBuraco);
      document.getElementById(posBuraco).appendChild(buraco);
    }
  }
  // encontrarCaminhoDFS()
  // selecionarVizinhos();
}

function selecionarVizinhos() {
  vizinhanca = [];

  [linhaCentral, colunaCentral] = posRobo.split(",").map(Number);

  for (let linha = linhaCentral - 1; linha <= linhaCentral + 1; linha++) {
    for (
      let coluna = colunaCentral - 1;
      coluna <= colunaCentral + 1;
      coluna++
    ) {
      if (linha == linhaCentral - 1 && coluna <= colunaCentral + 1) continue;

      if (linha >= 0 && linha < DIMENSAO && coluna >= 0 && coluna < DIMENSAO) {
        vizinhanca.push(linha + "," + coluna);
      }
    }
  }
  calculaDistancia();
}

function criaTabela() {
  const tabela = document.createElement("table");
  let idCel = 1;
  for (let i = 0; i < DIMENSAO; i++) {
    const linha = document.createElement("tr");
    for (let j = 0; j < DIMENSAO; j++) {
      const celula = document.createElement("td");
      celula.id = i + "," + j;
      linha.appendChild(celula);
    }
    tabela.appendChild(linha);
  }
  document.getElementById("conteiner").appendChild(tabela);
}

var intervalo;

function iniciar() {
  intervalo = setInterval(function () {
    if (pos < vetMovimento.length) {
      moverRobo();
    } else {
      clearInterval(intervalo);
      gameOver();
    }
  }, 1000);
}

function gameOver() {
  txt = posRobo == posCasa ? "Chegou ao destino" : "Não chegou ao destino";
  setTimeout(() => {
    robo.className += " entrar";
    alert(txt);
  }, 250);
}

function calculaDistancia() {
  // Verificar se já chegou
  if (posRobo === posCasa) {
    gameOver();
    return;
  }

  let menor = DIMENSAO;
  let selecionado;
  for (let i = 0; i < vizinhanca.length; i++) {
    [x1, y1] = vizinhanca[i].split(",").map(Number);
    [x2, y2] = posCasa.split(",").map(Number);

    let dist = Math.abs(x1 - x2) + Math.abs(y1 - y2);

    //Verifica através de leve gambiarra se a casa possui filhos(img dentro da div) ou se o valor da posição visinhança é igual ao valor da posição da casa
    if (
      dist < menor &&
      (!document.getElementById(vizinhanca[i]).children.length ||
        vizinhanca[i] == posCasa)
    ) {
      menor = dist;
      selecionado = vizinhanca[i];
    }
  }
  if (selecionado) {
    // Movero robô visualmente
    document.getElementById(posRobo).innerHTML = "";
    posRobo = selecionado;
    document.getElementById(posRobo).appendChild(robo);

    // Chama Funçao selecionarvizinhos recursivamente;
    setTimeout(() => {
      selecionarVizinhos();
    }, 600);
  } else {
    console.warn("Não chegou ao destino");
  }
}

// Metodo profundidade
var visitadosDFS;
var caminhoDFS;

function encontrarCaminhoDFS() {
  // Inicializa a matriz de visitados e de caminhos
  visitadosDFS = new Array(DIMENSAO)
    .fill(null)
    .map(() => new Array(DIMENSAO).fill(false));
  caminhoDFS = new Array(DIMENSAO)
    .fill(null)
    .map(() => new Array(DIMENSAO).fill(null));

  let [l, c] = posRobo.split(",").map(Number);

  // Chama a função recursiva para iniciar a busca
  if (buscaProfundidade(l, c)) {
    reconstruirCaminhoDFS();
  } else {
    alert("Não foi possível encontrar um caminho!");
  }
}

function buscaProfundidade(linha, coluna) {
  // Marca a célula atual como visitada
  visitadosDFS[linha][coluna] = true;

  // Se o destino for alcançado, retorna verdadeiro
  if (linha + "," + coluna === posCasa) {
    return true;
  }

  // Direções: cima, baixo, esquerda, direita
  let direcoes = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  // Explora os vizinhos
  for (let i = 0; i < direcoes.length; i++) {
    let novaLinha = linha + direcoes[i][0];
    let novaColuna = coluna + direcoes[i][1];

    // Verifica se a nova posição é válida e não é um buraco
    const vizinhoPos = novaLinha + "," + novaColuna;
    if (
      novaLinha >= 0 &&
      novaLinha < DIMENSAO &&
      novaColuna >= 0 &&
      novaColuna < DIMENSAO &&
      !visitadosDFS[novaLinha][novaColuna] &&
      !vetBuraco.includes(vizinhoPos)
    ) {
      // Armazena o caminho
      caminhoDFS[novaLinha][novaColuna] = { linha, coluna };

      // Chama a função recursivamente para o próximo vizinho
      if (buscaProfundidade(novaLinha, novaColuna)) {
        return true;
      }
    }
  }

  // Se nenhum caminho for encontrado a partir daqui, retorna falso
  return false;
}

function reconstruirCaminhoDFS() {
  // Lógica  para reconstruir o caminho
  let [l, c] = posCasa.split(",").map(Number);
  let caminhoFinal = [];

  while (caminhoDFS[l][c] !== null) {
    caminhoFinal.push({ linha: l, coluna: c });
    let { linha, coluna } = caminhoDFS[l][c];
    l = linha;
    c = coluna;
  }
  caminhoFinal.push({ linha: l, coluna: c });
  caminhoFinal.reverse(); // Inverte o array para a ordem correta
  animarCaminho(caminhoFinal);
}

// Esta função vai animar o robô, movendo ele passo a passo
function animarCaminho(caminho) {
  let i = 0;

  // Configura um intervalo para mover o robô
  const intervalo = setInterval(() => {
    if (i < caminho.length) {
      // Remove o robô da posição atual
      document.getElementById(posRobo).innerHTML = "";

      // Atualiza a posição do robô para o próximo passo
      posRobo = caminho[i].linha + "," + caminho[i].coluna;

      // Adiciona o robô na nova posição
      document.getElementById(posRobo).appendChild(robo);

      // Incrementa o contador para o próximo passo
      i++;
    } else {
      // Quando o caminho termina, limpa o intervalo
      clearInterval(intervalo);
      gameOver(); // Chama a função para verificar se chegou ao destino
    }
  }, 600);
}
