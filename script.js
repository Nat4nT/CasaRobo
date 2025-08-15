var vizinhanca,vetMovimento = [];
var posRobo,posCasa,casa,robo,buraco;

// var posBuraco;

var pos = 0;
const DIMENSAO = 8;

function registrarPassos(e) {
    vetMovimento.push(Number(e.id));
    document.getElementById("passos").innerHTML += e.innerText + ",";
}

function moverRobo() {
    document.getElementById(posRobo).innerHTML = "";
    let [l, c] = posRobo.split(",").map(Number);
    el = vetMovimento[pos++];
    switch (el) {
        case 0:
            c++;
            break;
        case 1:
            c--
            break;
        case 2:
            l--;
            break;
        case 3:
            l++;
            break;
    }
    posRobo = l + "," + c;
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

    /*
    for (let i = 0; i < 10; i++) {
        buraco = document.createElement("img");
        buraco.className = "imagens";
        buraco.src = "img/buraco.png";
        l = Math.floor(Math.random() * 8);
        c = Math.floor(Math.random() * 8);
        posBuraco = l + "," + c;

        document.getElementById(posBuraco).appendChild(buraco);
    }
    */
   
    selecionarVizinhos();

}

function selecionarVizinhos() {
    vizinhanca = [];

    [linhaCentral,colunaCentral] = posRobo.split(",").map(Number);

    for(let linha = linhaCentral -1; linha <= linhaCentral + 1; linha++){
        for(let coluna = colunaCentral -1; coluna <= colunaCentral + 1; coluna++){
            
            if(linha == linhaCentral - 1 && coluna <= colunaCentral + 1) continue;

            if(linha >= 0 && linha < DIMENSAO && coluna >= 0 && coluna < DIMENSAO){
                vizinhanca.push(linha + ',' + coluna)
            }

        }
    }
    calculaDistancia();

}

function criaTabela() {
    const tabela = document.createElement('table');
    let idCel = 1;
    for (let i = 0; i < DIMENSAO; i++) {
        const linha = document.createElement('tr');
        for (let j = 0; j < DIMENSAO; j++) {
            const celula = document.createElement('td');
            celula.id = i + "," + j;
            linha.appendChild(celula);
        }
        tabela.appendChild(linha);
    }

    document.getElementById('conteiner').appendChild(tabela);
}

function iniciar() {
    const intervalo = setInterval(function () {
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
    alert(txt);
}

function calculaDistancia(){

    // Verificar se já chegou
    if(posRobo === posCasa){
        console.log("Robô Chegou!");
        setTimeout(()=>{
            robo.className += " entrar"
        },250)
        return
    }

    let menor = DIMENSAO
    let selecionado;

    for (let i = 0; i < vizinhanca.length; i++) {
        [x1,y1] = vizinhanca[i].split(',').map(Number);
        [x2,y2] = posCasa.split(",").map(Number)

        let dist = Math.abs(x1 - x2) + Math.abs(y1 - y2)

        if (dist < menor) {
            menor = dist
            selecionado = vizinhanca[i]
        }
        
    }

    // if(selecionado !== null){
    //     const cell = document.getElementById(selecionado)

    //     if(cell){
    //         // cell.innerText = "menor"
    //     }else{
    //         document;getElementById(posRobo).innerText = '';
    //         document;getElementById(posCasa).innerText = '';
    //         posicionaImagens()

    //     }
    // }else{
    //     console.warn('Nenhuma célular selecionada')
    // }

    if(selecionado){
        // Movero robô visualmente
        document.getElementById(posRobo).innerHTML = "";
        posRobo = selecionado;
        document.getElementById(posRobo).appendChild(robo);

        // Chama Funçao selecionarvizinhos recursivamente;
        setTimeout( () =>{ 
            selecionarVizinhos() 
        },500)
    }else{
        console.warn("Não");
        
    }
}