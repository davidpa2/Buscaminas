var tableSize = 10;
var matriz = new Array(tableSize);
var firstClick = false;
var bombs = 25;

generateMatriz();
generateTable();

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
            document.getElementById(`${i}${j}`).addEventListener("click", function() {
                click(`${i}`,`${j}`);
            })
        }
        document.write("</tr>");
    }
}

function click(i, j) {
    console.log(`${i} , ${j}`);
    if (!firstClick) {
        // let firstNumber = Math.floor(Math.random() * (1 - 4) + 4);
        // firstClick = true;
        generateBombs(i, j);
    }

}

function generateBombs(i, j) {
    var generatedBombs = 0;

    while (generatedBombs <= bombs) {
        for (let i = 0; i < matriz.length; i++) {
            for (let j = 0; j < matriz[i].length; j++) {
                number = Math.floor(Math.random() * (0 - 2) + 2);
                if (number) {
                    matriz[i][j] = 1;
                    generatedBombs++;
                } else {

                }
            }
        }
    }
    console.log(generatedBombs);
    generateTable();
}