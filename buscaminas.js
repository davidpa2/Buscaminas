var tableSize = 10;
var matriz = new Array(tableSize);
var firstClick = true;
var bombs = 35;
var board = document.getElementById('board');

generateMatriz();
// generateTable();
generateTable2();

/**
 * Generar una matriz de tamaño variable
 */
function generateMatriz() {
    for (let i = 0; i < tableSize; i++) {
        matriz[i] = new Array(tableSize);
        for (let j = 0; j < matriz[i].length; j++) {
            matriz[i][j] = 0;
        }
    }
    console.log(matriz);
}

/**
 * Generar la tabla HTML a partir de la matriz
 */
function generateTable() {
    document.write("<table border=1>");
    for (let i = 0; i < matriz.length; i++) {
        document.write("<tr>");
        for (let j = 0; j < matriz[i].length; j++) {
            document.write(
                `<td id="${i}${j}" class="cell">${matriz[i][j]}</td>`
            );
            document.getElementById(`${i}${j}`).addEventListener("click", function () {
                click(`${i}`, `${j}`);
            })
        }
        document.write("</tr>");
    }
}

/**
 * Generar la tabla HTML a partir de la matriz
 */
function generateTable2() {
    board.innerHTML = "";

    for (let i = 0; i < matriz.length; i++) {
        let row = document.createElement('tr');
        board.appendChild(row);
        for (let j = 0; j < matriz[i].length; j++) {
            let cell = document.createElement('td');
            cell.classList += 'cell';
            cell.id = `${i}${j}`;
            let value = document.createTextNode(matriz[i][j]);
            cell.appendChild(value);
            row.appendChild(cell);
            document.getElementById(`${i}${j}`).addEventListener("click", function () {
                click(`${i}`, `${j}`);
            })
        }
    }
}

/**
 * Detectar cuando se hace click en el tablero
 * @param {*} i 
 * @param {*} j 
 */
function click(i, j) {
    console.log(`${i} , ${j}`);
    if (firstClick) {
        generateBombs(i, j);
        firstClick = false;
    }

}

/**
 * Generar las bombas de forma aleatoria
 * @param {*} i Coordenada i para evitar que se genere una bomba en la posición en la que se ha hecho click
 * @param {*} j Coordenada j similar
 */
function generateBombs(i, j) {
    let x, y, generatedBombs = 0;

    while (generatedBombs < bombs) {
        x = Math.floor(Math.random() * (0 - 10) + 10);
        y = Math.floor(Math.random() * (0 - 10) + 10);

        if (matriz[x][y] != 'B' && (`${x}${y}` != `${i}${j}`)) {
            matriz[x][y] = 'B';
            generatedBombs++;
        }
    }
    console.log(generatedBombs);
    generateTable2();
}