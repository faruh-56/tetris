// import { shapes } from "./shapes.js";
 
function drawTetrisPlayground(x, y, target) {
    if (x <= 0 || y <= 0) throw new Error('x and y cannot be negative');

    if (target.children.length) throw new Error('Aborted: target element should be empty');

    for (let rowsCount = 0; rowsCount < y; rowsCount++) {
        const row = document.createElement('div');
        row.className = 'row';
        row.dataset['row'] = rowsCount;

        for (let cellsCount = 0; cellsCount < x; cellsCount++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset['cell'] = cellsCount;
            row.append(cell);
        }

        target.append(row);
    }
}

const tetrisPlaygroundTarget = document.querySelector('.tetris-playground');

try {
    drawTetrisPlayground(10, 20, tetrisPlaygroundTarget);
} catch (e) {
    console.log(e.message);
}

const shapes = {
    S: { shape: [[0, 1, 1], [1, 1, 0]], color: 'yellowgreen' },
    Z: { shape: [[1, 1, 0], [0, 1, 1]], color: 'red' },
    T: { shape: [[1, 1, 1], [0, 1, 0]], color: 'purple' },
    O: { shape: [[1, 1], [1, 1]], color: 'yellow' },
    J: { shape: [[0, 1], [0, 1], [1, 1]], color: 'blue' },
    L: { shape: [[1, 0], [1, 0], [1, 1]], color: 'orange' },
    I: { shape: [[1], [1], [1], [1]], color: 'aqua' }
};

const shapeKeys = Object.keys(shapes);
const shapeKeyIndex = Math.floor(Math.random() * shapeKeys.length);
const shapeKey = shapeKeys[shapeKeyIndex];
const currentShape = shapes[shapeKey];
let currentPosition = { row: 0, col: 0 };
let previousPosition = { row: 0, col: 0 };

function renderShape(position = { row: 0, col: 0 }) {
    previousPosition = { ...position };
    const rowsToColor = currentShape.shape.length;
    const cellsToColor = currentShape.shape[0].length;

    for (let rowIndex = 0; rowIndex < rowsToColor; rowIndex++) {
        const row = tetrisPlaygroundTarget.children[position.row + rowIndex];
        if (!row) continue;

        for (let cellIndex = 0; cellIndex < cellsToColor; cellIndex++) {
            const cell = row.children[position.col + cellIndex];
            if (cell && currentShape.shape[rowIndex][cellIndex]) {
                cell.style.backgroundColor = currentShape.color;
            }
        }
    }
}

function removePreviousShape() {
    const rowsToClear = currentShape.shape.length;
    const cellsToClear = currentShape.shape[0].length;

    for (let rowIndex = 0; rowIndex < rowsToClear; rowIndex++) {
        const row = tetrisPlaygroundTarget.children[previousPosition.row + rowIndex];
        if (!row) continue;

        for (let cellIndex = 0; cellIndex < cellsToClear; cellIndex++) {
            const cell = row.children[previousPosition.col + cellIndex];
            if (cell && currentShape.shape[rowIndex][cellIndex]) {
                cell.style.backgroundColor = ''; // Очищаем цвет
            }
        }
    }
}

function rotateShape(shape) {
    if (shape.length === 2 && shape[0].length === 2) return shape; // Пропускаем поворот для квадратной фигуры

    const rotatedShape = [];
    for (let rowsCount = 0; rowsCount < shape[0].length; rowsCount++) {
        rotatedShape.push([]);
    }

    for (let i = shape.length - 1, k = 0; i >= 0; i--, k++) {
        for (let j = 0; j < shape[0].length; j++) {
            rotatedShape[j][k] = shape[i][j];
        }
    }

    return rotatedShape;
}

// Инициализация отрисовки начальной позиции
renderShape(currentPosition);

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        removePreviousShape();
        currentShape.shape = rotateShape(currentShape.shape);
        renderShape(currentPosition);
    }
});