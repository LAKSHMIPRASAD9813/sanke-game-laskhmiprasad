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

// Get score elements
let scoreElement = document.getElementById("score");
let highscoreElement = document.getElementById("highscore");

// Get audio elements
let eatSound = document.getElementById("eatSound");
let gameOverSound = document.getElementById("gameOverSound");

// Game settings
const gridSize = 20;
const canvasSize = 400;

// Start button and restart button
let startBtn = document.getElementById("startBtn");
let restartBtn = document.getElementById("restartBtn");

// Game initialization
function startGame() {
    snake = [{x: 10, y: 10}];
    direction = "RIGHT";
    score = 0;
    scoreElement.textContent = score;
    generateFood();
    gameStarted = true;
    eatingSoundPlaying = false;
    startBtn.style.display = "none";
    restartBtn.style.display = "none";
    gameInterval = setInterval(updateGame, 100);
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

// Restart game
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
        }
        drawGame();
    }
}

// Draw game elements
function drawGame() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    // Draw the snake
    for (let i = 0; i < snake.length; i++) {
        if (i === 0) {
            drawHead(snake[i].x * gridSize, snake[i].y * gridSize); // Draw head with oval shape
        } else {
            ctx.fillStyle = "#00FF00"; // Body color
            ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
        }

        // Draw eyes for the head (snake[0])
        if (i === 0) {
            drawEyes(snake[i].x * gridSize, snake[i].y * gridSize);
        }
    }
    
    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

// Draw the head of the snake as an oval
function drawHead(x, y) {
    ctx.fillStyle = "#33FF33"; // Snake head color
    ctx.beginPath();
    ctx.ellipse(x + gridSize / 2, y + gridSize / 2, gridSize / 2, gridSize / 1.2, 0, 0, 2 * Math.PI); // Oval head
    ctx.fill();
}

// Draw eyes on snake's head
function drawEyes(x, y) {
    // Eye positions relative to the snake's head
    const eyeOffsetX = 4; // Distance from the center
    const eyeOffsetY = -3; // Slightly above the center
    const eyeRadius = 2;

    // Left eye (positioned slightly left and up)
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x + eyeOffsetX, y + eyeOffsetY, eyeRadius, 0, 2 * Math.PI);
    ctx.fill();

    // Right eye (positioned slightly right and up)
    ctx.beginPath();
    ctx.arc(x + gridSize - eyeOffsetX, y + eyeOffsetY, eyeRadius, 0, 2 * Math.PI);
    ctx.fill();

    // Draw pupils (smaller black circles)
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

// Check for snake collisions with walls or itself
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

// Check for food collision
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

// Handle keyboard input for snake direction
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Event listeners for buttons
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);

// Play eating sound for 1 second
function playEatSound() {
    eatSound.play();
    eatingSoundPlaying = true;

    // Stop sound after 1 second
    setTimeout(() => {
        eatSound.pause();
        eatSound.currentTime = 0; // Reset sound position to the beginning
        eatingSoundPlaying = false;
    }, 1000);
}

// controls

// Get the directional buttons
let upBtn = document.getElementById("upBtn");
let downBtn = document.getElementById("downBtn");
let leftBtn = document.getElementById("leftBtn");
let rightBtn = document.getElementById("rightBtn");

// Add event listeners to change the snake's direction
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

