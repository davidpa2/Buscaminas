var tableSize = 10;
var matriz = new Array(tableSize);
var solvedMatriz = new Array(tableSize);
var firstClick = true;
var bombs = 16;
var flags = 0; // Número de banderas colocadas
var board = document.getElementById('board');
var buscaminas = document.getElementById('buscaminas');
let resultDiv = document.getElementById('resultSpan');
var restartButton = document.getElementById('restartButton');
restartButton.addEventListener('click', restart)
var placedFlags = document.getElementById('placedFlags');
var cellsShowed = []; // Array en el que se guardarán las posiciones de las celdas que hayan sido mostradas en la tabla

// Sonidos
const soundExplosion = new Audio('/sound/explosion.mp3');
const soundDock = new Audio('/sound/dock.mp3');
const soundVictory = new Audio('/sound/victory.mp3');
const soundKiwi = new Audio('/sound/kiwi.mp3');

// Inicializar matriz y tabla HTML
generateMatriz();
generateTable();

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
}

/**
 * Generar la tabla HTML a partir de la matriz
 */
function generateTable() {
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
            // Detectar eventos del ratón en cada celda
            cell.addEventListener("click", function () {
                click(`${i}`, `${j}`);
            })
            cell.addEventListener("contextmenu", function () {
                placeFlag(cell, i, j);
            })
            // Detectar una pulsación larga para colocar una bandera desde el móvil
            cell.onmousedown = function () {
                seconds = 0;
                window.setInterval(function () {
                    seconds++;
                }, 1000);
                if (seconds >= 1) {
                    placeFlag(cell, i, j);
                }
            }
            // cell.addEventListener("auxclick", function () {
            //     cell.addEventListener('mouseenter', function () {
            //         for (let x = i - 1; x <= i + 1; x++) {
            //             for (let y = j - 1; y <= j + 1; y++) {
            //                 if ((x < tableSize && y < tableSize) && (x >= 0 && y >= 0)) {
            //                     let cellHover = document.getElementById(`${x}${y}`);
            //                     cellHover.classList.add('hover')
            //                     console.log(cellHover.classList);
            //                 }
            //             }
            //         }

            //     })
            // })
            // cell.addEventListener("wheel", function () {
            //     console.log('buuuu');
            //     for (let x = i - 1; x <= i + 1; x++) {
            //         for (let y = j - 1; y <= j + 1; y++) {
            //             if ((x < tableSize && y < tableSize) && (x >= 0 && y >= 0)) {
            //                 let cellHover = document.getElementById(`${x}${y}`);
            //                 cellHover.classList.add('hover')
            //                 console.log(cellHover.classList);
            //             }
            //         }
            //     }
            // })
            // cell.addEventListener("mouseleave", function () {
            //     console.log('buuuuaaaaa');
            //     for (let x = i - 1; x <= i + 1; x++) {
            //         for (let y = j - 1; y <= j + 1; y++) {
            //             if ((x < tableSize && y < tableSize) && (x >= 0 && y >= 0)) {
            //                 let cellHover = document.getElementById(`${x}${y}`);
            //                 cellHover.classList.remove('hover');
            //             }
            //         }
            //     }
            // })
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
        // Si se pulsa en una celda con una B, perder
        if (matriz[i][j] == 'B') {
            lose();
        } else {
            showCell(i, j);
        }
    }
    // Para evitar comprobar si se ha ganado en cada momento, sólo hacerlo cuando queden 6 banderas por colocar
    if (flags < 6) {
        checkWin();
        console.log('Comprobando victoria');
    }
}

/**
 * Generar las bombas de forma aleatoria
 * @param {*} i Coordenada i para evitar que se genere una bomba en la posición en la que se ha hecho click
 * @param {*} j Coordenada j similar
 */
function generateBombs(i, j) {
    let x, y, generatedBombs = 0;
    // Ir generando números aleatorios del 0 al 9 para ir colocando minas en esas posiciones hasta que estén todas
    while (generatedBombs < bombs) {
        x = Math.floor(Math.random() * (0 - 10) + 10);
        y = Math.floor(Math.random() * (0 - 10) + 10);

        if (matriz[x][y] != 'B' && (`${x}${y}` != `${i}${j}`)) {
            matriz[x][y] = 'B';
            generatedBombs++;
        }
    }
    flags = generatedBombs;
    placedFlags.innerText = generatedBombs;
    solveGame();
}

/**
 * Mostrar una celda con la cantidad de minas que tenga alrededor
 * @param {*} i 
 * @param {*} j 
 */
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
                        cellsShowed.push(`${x}${y}`); // Anotar la celda mostrada
                        // Por recursividad llamar otra vez a esta función para abrir varias casillas con un click
                        showCell(`${x}`, `${y}`);
                    }
                }
            }
        }
    }
    soundKiwi.play();
    paintCell(i, j, mines);
}

/**
 * Pintar el número que toque en la celda y del color que se le diga
 * @param {*} i 
 * @param {*} j 
 * @param {*} mines 
 */
function paintCell(i, j, mines) {
    let clickedCell = document.getElementById(i + j);
    clickedCell.innerHTML = '';
    let number = document.createTextNode(mines);
    clickedCell.appendChild(number);
    matriz[i][j] = mines;
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

/**
 * Colocar uan bandera
 * @param {*} cell 
 * @param {*} i 
 * @param {*} j 
 */
function placeFlag(cell, i, j) {
    //Prevenir que una bandera sea puesta donde haya un número
    if (typeof matriz[i][j] !== 'number') {
        soundDock.play();
        if (cell.classList.contains('flag')) {
            cell.classList.remove('flag');
            flags++;
        } else {
            if (flags > 0) {
                cell.classList.add('flag');
                flags--;
            }
        }
        placedFlags.innerText = flags;
    }
    if (flags < 6) {
        checkWin();
    }
}

/**
 * Comprobar victoria
 */
function checkWin() {
    let victory = true;
    for (let i = 0; i < tableSize; i++) {
        for (let j = 0; j < tableSize; j++) {
            if (matriz[i][j] != solvedMatriz[i][j]) {
                victory = false;
                break;
            }
        }
    }
    if (victory && !firstClick) {
        win();
    }
}

/**
 * Resolver el juego y guardar el resultado en una matriz para poder consultar y comparar
 */
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
}

/**
 * Al perder, mostrar todas las minas
 */
function minesExplosion() {
    soundExplosion.play();
    for (let i = 0; i < tableSize; i++) {
        for (let j = 0; j < tableSize; j++) {
            if (matriz[i][j] == 'B') {
                document.getElementById(`${i}${j}`).classList.add('bomb');
            }
        }
    }
}

/**
 * Restablecer todos los valores para poder comenzar una nueva partida
 */
function restart() {
    resultDiv.classList.add('hide');
    resultDiv.classList.remove('show');
    delete matriz;
    delete solvedMatriz;
    flags = 0;
    placedFlags.innerText = bombs;
    cellsShowed = [];
    firstClick = true;
    board.innerHTML = '';
    generateMatriz();
    generateTable();
}

/**
 * Mostrar el div de los resultados
 * @param {*} message 
 */
function showResultDiv(message) {
    let pResult = document.getElementById('pResult');
    if (resultDiv.classList.contains('hide')) {
        resultDiv.classList.add('show');
        resultDiv.classList.remove('hide');
    }
    pResult.innerText = message;
}

function lose() {
    minesExplosion();
    showResultDiv('¡Has perdido!');
}

function win() {
    soundVictory.play();
    showResultDiv('¡Has ganado!');

}