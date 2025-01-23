// Game variables
let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

let snake = [{x: 10, y: 10}];
let direction = "RIGHT";
let food = {x: 0, y: 0};
let score = 0;
let highestScore = 0;
let gameInterval;
let gameStarted = false;
let eatingSoundPlaying = false;  // Flag to control sound play
let speed = 4;  // Initial speed (milliseconds)

let scoreElement = document.getElementById("score");
let highscoreElement = document.getElementById("highscore");

let eatSound = document.getElementById("eatSound");
let gameOverSound = document.getElementById("gameOverSound");

const gridSize = 20;
const canvasSize = 400;

let startBtn = document.getElementById("startBtn");
let restartBtn = document.getElementById("restartBtn");

// Start button function
function startGame() {
    snake = [{x: 10, y: 10}];
    direction = "RIGHT";
    score = 0;
    scoreElement.textContent = score;
    generateFood();
    gameStarted = true;
    eatingSoundPlaying = false;
    speed = 100;  // Reset speed to initial
    startBtn.style.display = "none";
    restartBtn.style.display = "none";
    gameInterval = setInterval(updateGame, speed);
}

// Game over handling
function gameOver() {
    gameStarted = false;
    clearInterval(gameInterval);
    gameOverSound.play();
    restartBtn.style.display = "inline-block";
    if (score > highestScore) {
        highestScore = score;
        highscoreElement.textContent = highestScore;
    }
}

// Restart game function
function restartGame() {
    restartBtn.style.display = "none";
    startGame();
}

// Update game state
function updateGame() {
    moveSnake();
    if (checkCollision()) {
        gameOver();
    } else {
        if (checkFoodCollision()) {
            if (!eatingSoundPlaying) {
                playEatSound(); // Play sound
            }
            score += 10;
            scoreElement.textContent = score;
            generateFood();
            growSnake();
            increaseSpeed();  // Increase speed as snake grows
        }
        drawGame();
    }
}

// Draw game elements
function drawGame() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    for (let i = 0; i < snake.length; i++) {
        if (i === 0) {
            drawHead(snake[i].x * gridSize, snake[i].y * gridSize);
        } else {
            ctx.fillStyle = "#00FF00"; 
            ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
        }
        if (i === 0) {
            drawEyes(snake[i].x * gridSize, snake[i].y * gridSize);
        }
    }
    
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

// Draw the head of the snake as an oval
function drawHead(x, y) {
    ctx.fillStyle = "#33FF33"; 
    ctx.beginPath();
    ctx.ellipse(x + gridSize / 2, y + gridSize / 2, gridSize / 2, gridSize / 1.2, 0, 0, 2 * Math.PI);
    ctx.fill();
}

// Draw eyes on snake's head
function drawEyes(x, y) {
    const eyeOffsetX = 4;
    const eyeOffsetY = -3;
    const eyeRadius = 2;

    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x + eyeOffsetX, y + eyeOffsetY, eyeRadius, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x + gridSize - eyeOffsetX, y + eyeOffsetY, eyeRadius, 0, 2 * Math.PI);
    ctx.fill();

    const pupilRadius = 1;
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(x + eyeOffsetX, y + eyeOffsetY, pupilRadius, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x + gridSize - eyeOffsetX, y + eyeOffsetY, pupilRadius, 0, 2 * Math.PI);
    ctx.fill();
}

// Snake movement
function moveSnake() {
    let head = {...snake[0]};

    if (direction === "UP") head.y -= 1;
    if (direction === "DOWN") head.y += 1;
    if (direction === "LEFT") head.x -= 1;
    if (direction === "RIGHT") head.x += 1;

    snake.unshift(head);
    snake.pop();
}

// Collision checks
function checkCollision() {
    let head = snake[0];
    if (head.x < 0 || head.x >= canvasSize / gridSize || head.y < 0 || head.y >= canvasSize / gridSize) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    return false;
}

function checkFoodCollision() {
    let head = snake[0];
    return head.x === food.x && head.y === food.y;
}

// Generate food
function generateFood() {
    food.x = Math.floor(Math.random() * (canvasSize / gridSize));
    food.y = Math.floor(Math.random() * (canvasSize / gridSize));
}

// Grow snake after eating food
function growSnake() {
    let tail = {...snake[snake.length - 1]};
    snake.push(tail);
}

// Increase game speed
function increaseSpeed() {
    if (snake.length % 5 === 0) {
        speed = Math.max(50, speed - 5);  // Minimum speed limit is 50 ms
        clearInterval(gameInterval);
        gameInterval = setInterval(updateGame, speed);
    }
}

// Handle keyboard input for snake direction
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Button event listeners
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);

// Play eating sound for 1 second
function playEatSound() {
    eatSound.play();
    eatingSoundPlaying = true;

    setTimeout(() => {
        eatSound.pause();
        eatSound.currentTime = 0;
        eatingSoundPlaying = false;
    }, 1000);
}

// Controls
let upBtn = document.getElementById("upBtn");
let downBtn = document.getElementById("downBtn");
let leftBtn = document.getElementById("leftBtn");
let rightBtn = document.getElementById("rightBtn");

upBtn.addEventListener("click", () => {
    if (direction !== "DOWN") direction = "UP";
});

downBtn.addEventListener("click", () => {
    if (direction !== "UP") direction = "DOWN";
});

leftBtn.addEventListener("click", () => {
    if (direction !== "RIGHT") direction = "LEFT";
});

rightBtn.addEventListener("click", () => {
    if (direction !== "LEFT") direction = "RIGHT";
});
