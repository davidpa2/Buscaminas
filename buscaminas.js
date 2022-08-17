var tableSize = 10;
var matriz = new Array(tableSize);
var solvedMatriz = new Array(tableSize);
var firstClick = true;
var bombs = 16;
var board = document.getElementById('board');
let bounces = 0;
var cellsShowed = [];

generateMatriz();
// generateTable();
generateTable2();

/**
 * Generar una matriz de tamaño variable
 */
function generateMatriz() {
    for (let i = 0; i < tableSize; i++) {
        matriz[i] = new Array(tableSize);
        solvedMatriz[i] = new Array(tableSize);
        for (let j = 0; j < matriz[i].length; j++) {
            matriz[i][j] = '';
            solvedMatriz[i][j] = '';
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

            cell.addEventListener("click", function () {
                click(`${i}`, `${j}`);
            })
            cell.addEventListener("contextmenu", function () {
                placeFlag(cell);
            })
            /*             cell.addEventListener("mouseover", function () {
                            console.log('buuuu');
                            for (let x = i - 1; x <= i + 1; x++) {
                                for (let y = j - 1; y <= j + 1; y++) {
                                    let cellHover = document.getElementById(`${x}${y}`);
                                    cellHover.classList += 'hover';
                                    console.log(cellHover.classList);
                                }
                            }
                        })
                        cell.addEventListener("mouseleave", function () {
                            console.log('buuuuaaaaa');
                            for (let x = i - 1; x <= i + 1; x++) {
                                for (let y = j - 1; y <= j + 1; y++) {
                                    let cellHover = document.getElementById(`${x}${y}`);
                                    cellHover.classList -= 'hover';
                                }
                            }
                        }) */
        }
    }
}

/**
 * Detectar cuando se hace click en el tablero
 * @param {*} i 
 * @param {*} j 
 */
function click(i, j) {
    if (matriz[i][j] == '' || matriz[i][j] == 'B') {
        console.log(`Click: ${i} , ${j}`);
        if (firstClick) {
            generateBombs(i, j);
            firstClick = false;
        }

        if (matriz[i][j] == 'B') {
            lose();
        } else {
            showCell(i, j);
        }
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
    solveGame();
}

function showCell(i, j) {
    let mines = 0;

    for (let x = parseInt(i) - 1; x <= parseInt(i) + 1; x++) {
        for (let y = parseInt(j) - 1; y <= parseInt(j) + 1; y++) {
            if ((x < tableSize && y < tableSize) && (x >= 0 && y >= 0)) {
                if (matriz[x][y] == 'B') {
                    mines++;
                }
                if (!cellsShowed.includes(`${x}${y}`)) {
                    if (solvedMatriz[x][y] <= 1) {
                        cellsShowed.push(`${x}${y}`);
                        showCell(`${x}`, `${y}`);
                    }
                }
            }
        }
    }
    paintCell(i, j, mines);
}

function paintCell(i, j, mines) {
    let clickedCell = document.getElementById(i + j);
    clickedCell.innerHTML = '';
    let number = document.createTextNode(mines);
    clickedCell.appendChild(number);
    matriz[i][j] = number;
    clickedCell.style.background = 'white';

    switch (mines) {
        case 1:
            clickedCell.style.color = 'blue';
            break;
        case 2:
            clickedCell.style.color = 'yellow';
            break;
        case 3:
            clickedCell.style.color = 'orange';
            break;
        case 4:
            clickedCell.style.color = 'red';
            break;
        default:
            clickedCell.style.color = 'purple';
            break;
    }
}

function placeFlag(cell) {
    if (cell.innerHTML == '' || cell.innerHTML == 'F') {
        (cell.innerHTML == 'F') ? cell.innerHTML = '' : cell.innerHTML = 'F';
        (cell.style.color != 'red') ? cell.style.color == 'white' : cell.style.color == 'red';
    }
}

function lose() {
    alert('Has perdido');
    delete matriz;
    delete solvedMatriz;
    cellsShowed = [];
    firstClick = true;
    board.innerHTML = '';
    generateMatriz();
    generateTable2();
}

function solveGame() {
    for (let i = 0; i < tableSize; i++) {
        for (let j = 0; j < tableSize; j++) {
            let mines = 0;
            if (matriz[i][j] != 'B') {
                for (let x = i - 1; x <= i + 1; x++) {
                    for (let y = j - 1; y <= j + 1; y++) {
                        if ((x < tableSize && y < tableSize) && (x >= 0 && y >= 0)) {
                            if (matriz[x][y] == 'B') {
                                mines++;
                            }
                        }
                        solvedMatriz[i][j] = mines;
                    }
                }
            } else {
                solvedMatriz[i][j] = 'B';
            }
        }
    }
    console.log(solvedMatriz);
}