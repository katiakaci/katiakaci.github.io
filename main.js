// Creates a 2D array filled with zeros
var create2DArray = function (numColumns, numRows) {
    const array = [];
    for (let c = 0; c < numColumns; c++) {
        array.push(Array(numRows).fill(0));
    }
    return array;
}

const backgroundMusic = document.getElementById('backgroundMusic');
const collisionSound = document.getElementById('collisionSound');
document.getElementById('goButton').disabled = true;
const canvas = document.getElementById("myCanvas");
const C = canvas.getContext("2d");
const canvas_rectangle = canvas.getBoundingClientRect();
const cellSize = 5; // each cell in the grid is a square of this size, in pixels
const NUM_CELLS_HORIZONTAL = canvas.width / cellSize;
const NUM_CELLS_VERTICAL = canvas.height / cellSize;
const x0 = (canvas.width - NUM_CELLS_HORIZONTAL * cellSize) / 2;
const y0 = (canvas.height - NUM_CELLS_VERTICAL * cellSize) / 2;
let grid = create2DArray(NUM_CELLS_HORIZONTAL, NUM_CELLS_VERTICAL);
let grid1 = create2DArray(NUM_CELLS_HORIZONTAL, NUM_CELLS_VERTICAL);
let grid2 = create2DArray(NUM_CELLS_HORIZONTAL, NUM_CELLS_VERTICAL);
const CELL_EMPTY = 0;
const CELL_OCCUPIED = 1;

var timeDelay = 100; // milliseconds
let timer = setInterval(function () { advance(); }, timeDelay);
let increaseSpeedTimer = setInterval(function () { increaseSpeed(); }, 200);

// Current position and direction of light cycle 1
var lightCycle1_x = NUM_CELLS_HORIZONTAL / 2;
var lightCycle1_y = NUM_CELLS_VERTICAL - 2;
var lightCycle1_vx = 0; // positive for right
var lightCycle1_vy = -1; // positive for down
var lightCycle1_alive = true;
var lightCycle1_score = 0;
document.getElementById("score1").innerText = lightCycle1_score;

// Current position and direction of light cycle 2
var lightCycle2_x = NUM_CELLS_HORIZONTAL / 2;
var lightCycle2_y = 1;
var lightCycle2_vx = 0;
var lightCycle2_vy = 1;
var lightCycle2_alive = true;
var lightCycle2_score = 0;
document.getElementById("score2").innerText = lightCycle2_score;

// Mouse drag
var tempX;
var tempY;
var mousePlayer1 = true;

// to mark the initial grid cell as occupied
grid[lightCycle1_x][lightCycle1_y] = CELL_OCCUPIED;
grid[lightCycle2_x][lightCycle2_y] = CELL_OCCUPIED;
grid1[lightCycle1_x][lightCycle1_y] = CELL_OCCUPIED;
grid2[lightCycle2_x][lightCycle2_y] = CELL_OCCUPIED;

const keyDownHandler = (e) => {
    switch (e.keyCode) {
        // 1st player
        case 38: // up arrow
            e.preventDefault();
            lightCycle1_vx = 0;
            lightCycle1_vy = -1;
            break;
        case 40: // down arrow
            e.preventDefault();
            lightCycle1_vx = 0;
            lightCycle1_vy = 1;
            break;
        case 37: // left arrow
            lightCycle1_vy = 0;
            lightCycle1_vx = -1;
            break;
        case 39: // right arrow
            lightCycle1_vy = 0;
            lightCycle1_vx = 1;
            break;

        // 2nd player
        case 87: // up (w)
            lightCycle2_vx = 0;
            lightCycle2_vy = -1;
            break;
        case 83: // down (s)
            lightCycle2_vx = 0;
            lightCycle2_vy = 1;
            break;
        case 65: // left (a)
            lightCycle2_vy = 0;
            lightCycle2_vx = -1;
            break;
        case 68: // right (d)
            lightCycle2_vy = 0;
            lightCycle2_vx = 1;
            break;
    }
}

const mouseDownHandler = (e) => {
    // check if the mouse is on the canvas
    if (e.pageX <= canvas_rectangle.right
        && e.pageY <= canvas_rectangle.bottom
        && e.pageX >= canvas_rectangle.left
        && e.pageY >= canvas_rectangle.top
    ) {
        tempX = e.pageX
        tempY = e.pageY
    }
}

const mouseUpHandler = (e) => {
    // check if the mouse is on the canvas
    if (e.pageX <= canvas_rectangle.right &&
        e.pageY <= canvas_rectangle.bottom &&
        e.pageX >= canvas_rectangle.left &&
        e.pageY >= canvas_rectangle.top
    ) {
        delta_x = e.pageX - tempX
        delta_y = e.pageY - tempY

        if (Math.abs(delta_x) > Math.abs(delta_y)) {
            if (delta_x > 0) { // geste vers la droite
                mousePlayer1 ? (lightCycle1_vx = 1, lightCycle1_vy = 0) : (lightCycle2_vx = 1, lightCycle2_vy = 0);
            }
            else { // geste vers la gauche
                mousePlayer1 ? (lightCycle1_vx = -1, lightCycle1_vy = 0) : (lightCycle2_vx = -1, lightCycle2_vy = 0);
            }
        }
        else if (delta_y > 0) { // geste vers le bas
            mousePlayer1 ? (lightCycle1_vx = 0, lightCycle1_vy = 1) : (lightCycle2_vx = 0, lightCycle2_vy = 1);
        }
        else { // geste vers le haut 
            mousePlayer1 ? (lightCycle1_vx = 0, lightCycle1_vy = -1) : (lightCycle2_vx = 0, lightCycle2_vy = -1);
        }
    }
}

document.onkeydown = keyDownHandler;
document.onmousedown = mouseDownHandler;
document.onmouseup = mouseUpHandler;

function clearGame() {
    lightCycle1_x = NUM_CELLS_HORIZONTAL / 2;
    lightCycle1_y = NUM_CELLS_VERTICAL - 2;
    lightCycle1_vx = 0;
    lightCycle1_vy = -1;
    lightCycle2_x = NUM_CELLS_HORIZONTAL / 2;
    lightCycle2_y = 1;
    lightCycle2_vx = 0;
    lightCycle2_vy = 1;

    for (var i = 0; i < NUM_CELLS_HORIZONTAL; ++i) {
        for (var j = 0; j < NUM_CELLS_VERTICAL; ++j) {
            grid[i][j] = CELL_EMPTY;
            grid1[i][j] = CELL_EMPTY;
            grid2[i][j] = CELL_EMPTY;
        }
    }

    // to mark the initial grid cell as occupied
    grid[lightCycle1_x][lightCycle1_y] = CELL_OCCUPIED;
    grid[lightCycle2_x][lightCycle2_y] = CELL_OCCUPIED;
    grid1[lightCycle1_x][lightCycle1_y] = CELL_OCCUPIED;
    grid2[lightCycle2_x][lightCycle2_y] = CELL_OCCUPIED;
    // revive players
    lightCycle1_alive = true;
    lightCycle2_alive = true;

    // reset time delay for motorcycle speed
    timeDelay = 100;
}

const redraw = () => {
    C.fillStyle = "#000000";
    C.fillRect(0, 0, canvas.width, canvas.height);

    C.fillStyle = document.getElementById("moto1color").value;
    for (let i = 0; i < NUM_CELLS_HORIZONTAL; ++i) {
        for (let j = 0; j < NUM_CELLS_VERTICAL; ++j) {
            if (grid1[i][j] === CELL_OCCUPIED) C.fillRect(x0 + i * cellSize + 1, y0 + j * cellSize + 1, cellSize - 2, cellSize - 2);
        }
    }

    C.fillStyle = document.getElementById("moto2color").value;
    for (var i = 0; i < NUM_CELLS_HORIZONTAL; ++i) {
        for (var j = 0; j < NUM_CELLS_VERTICAL; ++j) {
            if (grid2[i][j] === CELL_OCCUPIED) C.fillRect(x0 + i * cellSize + 1, y0 + j * cellSize + 1, cellSize - 2, cellSize - 2);
        }
    }

    C.fillStyle = lightCycle1_alive ? "#ff0000" : "#ffffff";
    C.fillRect(x0 + lightCycle1_x * cellSize, y0 + lightCycle1_y * cellSize, cellSize, cellSize);

    C.fillStyle = lightCycle2_alive ? "#ff0000" : "#ffffff";
    C.fillRect(x0 + lightCycle2_x * cellSize, y0 + lightCycle2_y * cellSize, cellSize, cellSize);
}

const advance = () => {
    if (!lightCycle1_alive || !lightCycle2_alive) clearGame();
    else {
        if (lightCycle1_alive && lightCycle2_alive) {
            var new1_x = lightCycle1_x + lightCycle1_vx;
            var new1_y = lightCycle1_y + lightCycle1_vy;
            var new2_x = lightCycle2_x + lightCycle2_vx;
            var new2_y = lightCycle2_y + lightCycle2_vy;
            // Check for collision with head of other motorcycle
            if ((new1_x < 0 || new1_x >= NUM_CELLS_HORIZONTAL
                || new1_y < 0 || new1_y >= NUM_CELLS_VERTICAL
                || grid[new1_x][new1_y] === CELL_OCCUPIED)
                && (new2_x < 0 || new2_x >= NUM_CELLS_HORIZONTAL
                    || new2_y < 0 || new2_y >= NUM_CELLS_VERTICAL
                    || grid[new2_x][new2_y] === CELL_OCCUPIED)) {
                lightCycle2_alive = false;
                lightCycle1_alive = false;
                collisionSound.play();
                redraw();
                return;
            }
        }
        if (lightCycle1_alive) {
            var new1_x = lightCycle1_x + lightCycle1_vx;
            var new1_y = lightCycle1_y + lightCycle1_vy;

            // Check for collision with grid boundaries and with trail
            if (new1_x < 0 || new1_x >= NUM_CELLS_HORIZONTAL
                || new1_y < 0 || new1_y >= NUM_CELLS_VERTICAL
                || grid[new1_x][new1_y] === CELL_OCCUPIED) {
                lightCycle1_alive = false;
                collisionSound.play();
                document.getElementById("score2").innerText = ++lightCycle2_score; // player 2 wins
            }
            else {
                grid[new1_x][new1_y] = CELL_OCCUPIED;
                grid1[lightCycle1_x][lightCycle1_y] = CELL_OCCUPIED;
                lightCycle1_x = new1_x;
                lightCycle1_y = new1_y;
            }
            redraw();
        }
        if (lightCycle2_alive) {
            var new2_x = lightCycle2_x + lightCycle2_vx;
            var new2_y = lightCycle2_y + lightCycle2_vy;
            if (
                new2_x < 0 || new2_x >= NUM_CELLS_HORIZONTAL
                || new2_y < 0 || new2_y >= NUM_CELLS_VERTICAL
                || grid[new2_x][new2_y] === CELL_OCCUPIED
            ) {
                lightCycle2_alive = false;
                collisionSound.play();
                document.getElementById("score1").innerText = ++lightCycle1_score; // player 1 wins
            } else {
                grid[new2_x][new2_y] = CELL_OCCUPIED;
                grid2[lightCycle2_x][lightCycle2_y] = CELL_OCCUPIED;
                lightCycle2_x = new2_x;
                lightCycle2_y = new2_y;
            }
            redraw();
        }
    }
}

var increaseSpeed = function () {
    clearInterval(timer);
    timer = setInterval(advance, timeDelay);
    timeDelay /= 1.03; // 3% decrease every 200 ms
}

function pause() {
    clearInterval(timer);
    clearInterval(increaseSpeedTimer);
    document.getElementById('pauseButton').disabled = true;
    document.getElementById('goButton').disabled = false;
}

function restart() {
    lightCycle1_alive = false;
    lightCycle2_alive = false;
    lightCycle1_score = 0
    lightCycle2_score = 0;
    document.getElementById("score1").innerText = lightCycle1_score;
    document.getElementById("score2").innerText = lightCycle2_score;
    clearInterval(timer);
    clearInterval(increaseSpeedTimer);
    go();
}

function go() {
    timer = setInterval(advance, 100);
    increaseSpeedTimer = setInterval(increaseSpeed, 150);
    document.getElementById('pauseButton').disabled = false;
    document.getElementById('goButton').disabled = true;
}

function changeMousePlayer() {
    if (mousePlayer1) { // player 2 takes control
        mousePlayer1 = false;
        document.getElementById('player1Button').disabled = false;
        document.getElementById('player2Button').disabled = true;
    }
    else { // player 1 takes control
        mousePlayer1 = true
        document.getElementById('player2Button').disabled = false;
        document.getElementById('player1Button').disabled = true;
    }
}

function muteMusic() {
    const isMuted = !backgroundMusic.muted;
    backgroundMusic.muted = isMuted;
    collisionSound.muted = isMuted;
}

// TODO : Find a way to play the music automatically without requiring the user to click on the page first
window.onclick = function () {
    backgroundMusic.play();
};
