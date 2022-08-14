var tableSize = 10;
var matriz = new Array(tableSize);
var firstClick = false;

generateMatriz();
generateTable();

/**
 * Método utilizado para generar una matriz de tamaño variable
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
 * Método usado para generar la tabla HTML a partir de la matriz
 */
function generateTable() {
    document.write("<table border=1>");
    for (let i = 0; i < matriz.length; i++) {
        document.write("<tr>");
        for (let j = 0; j < matriz[i].length; j++) {
            document.write(
                `<td class="cell">${matriz[i][j]}</td>`
            );
        }
        document.write("</tr>");
    }
}

