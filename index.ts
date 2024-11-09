// import { shapes } from "./shapes.js";
 
interface Shape {
    shape: number[][];
    color: string;
}

interface Position {
    row: number;
    col: number;
}

function drawTetrisPlayground(x: number, y: number, target: HTMLElement): void {
    if (x <= 0 || y <= 0) throw new Error('x and y cannot be negative');

    if (target.children.length) throw new Error('Aborted: target element should be empty');

    for (let rowsCount = 0; rowsCount < y; rowsCount++) {
        const row: HTMLDivElement = document.createElement('div');
        row.className = 'row';
        row.dataset['row'] = rowsCount.toString();

        for (let cellsCount = 0; cellsCount < x; cellsCount++) {
            const cell: HTMLDivElement = document.createElement('div');
            cell.className = 'cell';
            cell.dataset['cell'] = cellsCount.toString();
            row.append(cell);
        }

        target.append(row);
    }
}

const tetrisPlaygroundTarget: HTMLElement | null = document.querySelector('.tetris-playground');

if (tetrisPlaygroundTarget) {
    try {
        drawTetrisPlayground(10, 20, tetrisPlaygroundTarget);
    } catch (e) {
        if (e instanceof Error) {
            console.log(e.message);
        }
    }
}

const shapes: Record<string, Shape> = {
    S: { shape: [[0, 1, 1], [1, 1, 0]], color: 'yellowgreen' },
    Z: { shape: [[1, 1, 0], [0, 1, 1]], color: 'red' },
    T: { shape: [[1, 1, 1], [0, 1, 0]], color: 'purple' },
    O: { shape: [[1, 1], [1, 1]], color: 'yellow' },
    J: { shape: [[0, 1], [0, 1], [1, 1]], color: 'blue' },
    L: { shape: [[1, 0], [1, 0], [1, 1]], color: 'orange' },
    I: { shape: [[1], [1], [1], [1]], color: 'aqua' }
};

const shapeKeys: string[] = Object.keys(shapes);
const shapeKeyIndex: number = Math.floor(Math.random() * shapeKeys.length);
const shapeKey: string = shapeKeys[shapeKeyIndex];
const currentShape: Shape = shapes[shapeKey];
let currentPosition: Position = { row: 0, col: 0 };
let previousPosition: Position = { row: 0, col: 0 };

function renderShape(position: Position = { row: 0, col: 0 }): void {
    previousPosition = { ...position };
    const rowsToColor: number = currentShape.shape.length;
    const cellsToColor: number = currentShape.shape[0].length;

    for (let rowIndex = 0; rowIndex < rowsToColor; rowIndex++) {
        const row = tetrisPlaygroundTarget?.children[position.row + rowIndex] as HTMLElement;
        if (!row) continue;

        for (let cellIndex = 0; cellIndex < cellsToColor; cellIndex++) {
            const cell = row.children[position.col + cellIndex] as HTMLElement;
            if (cell && currentShape.shape[rowIndex][cellIndex]) {
                cell.style.backgroundColor = currentShape.color;
            }
        }
    }
}

function removePreviousShape(): void {
    const rowsToClear: number = currentShape.shape.length;
    const cellsToClear: number = currentShape.shape[0].length;

    for (let rowIndex = 0; rowIndex < rowsToClear; rowIndex++) {
        const row = tetrisPlaygroundTarget?.children[previousPosition.row + rowIndex] as HTMLElement;
        if (!row) continue;

        for (let cellIndex = 0; cellIndex < cellsToClear; cellIndex++) {
            const cell = row.children[previousPosition.col + cellIndex] as HTMLElement;
            if (cell && currentShape.shape[rowIndex][cellIndex]) {
                cell.style.backgroundColor = ''; // Очищаем цвет
            }
        }
    }
}

function rotateShape(shape: number[][]): number[][] {
    if (shape.length === 2 && shape[0].length === 2) return shape; // Пропускаем поворот для квадратной фигуры

    const rotatedShape: number[][] = [];
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

if (tetrisPlaygroundTarget) {
    renderShape(currentPosition);
}

document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.code === 'Space') {
        removePreviousShape();
        currentShape.shape = rotateShape(currentShape.shape);
        renderShape(currentPosition);
    }
});