
const board = document.querySelector("#board");
const scoreElement = document.querySelector("#score");
const highScoreElement = document.querySelector("#high-score");
const timerElement = document.querySelector("#time");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");
const startButton = document.querySelector(".start-btn");
const restartBtn = document.querySelector(".restart-btn");

const BLOCK_SIZE = 40;
const cols = Math.floor(board.clientWidth / BLOCK_SIZE);
const rows = Math.floor(board.clientHeight / BLOCK_SIZE);
const blocksArr = [];

let snake = [];
let food = {};
let direction = "down";
let score = 0;
let highScore = localStorage.getItem("high-score") || 0;

let gameIntervalId = null;
let timerIntervalId = null;
let secondsElapsed = 0;


highScoreElement.innerText = highScore;

function initGrid() {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const block = document.createElement("div");
      block.classList.add("block");
      // block.textContent = `(${row},${col})`;
      blocksArr[`(${row},${col})`] = block;
      board.appendChild(block);
    }
  }
}

 
function generateFood() {
  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };
  blocksArr[`(${food.x},${food.y})`].classList.add("food");
}


function gameLoop() {
  let head = { ...snake[0] }; 


  if (direction === "left") head.y -= 1;
  else if (direction === "right") head.y += 1;
  else if (direction === "down") head.x += 1;
  else if (direction === "up") head.x -= 1;


  if (checkCollision(head)) {
    handleGameOver();
    return;
  }

  
  snake.forEach(segment => blocksArr[`(${segment.x},${segment.y})`].classList.remove("fill"));


  if (head.x === food.x && head.y === food.y) {
    blocksArr[`(${food.x},${food.y})`].classList.remove("food");
    snake.unshift(head); 
    generateFood();     
    updateScore();
  } else {
    snake.unshift(head);
    snake.pop();
  }


  snake.forEach(segment => blocksArr[`(${segment.x},${segment.y})`].classList.add("fill"));
}


function checkCollision(head) {
  return head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols;
}


function updateScore() {
  score = snake.length - 1;
  scoreElement.innerText = score;
}


function startTimer() {
  secondsElapsed = 0;
  timerElement.innerText = "00 : 00";
  
  timerIntervalId = setInterval(() => {
    secondsElapsed++;
    let mins = String(Math.floor(secondsElapsed / 60)).padStart(2, '0');
    let secs = String(secondsElapsed % 60).padStart(2, '0');
    timerElement.innerText = `${mins} : ${secs}`;
  }, 1000);
}

function stopTimers() {
  clearInterval(gameIntervalId);
  clearInterval(timerIntervalId);
}

function handleGameOver() {
  stopTimers();
  
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("high-score", highScore);
    highScoreElement.innerText = highScore;
  }

  // Modals handle karna
  modal.style.display = "flex";
  startGameModal.style.display = "none";
  gameOverModal.style.display = "flex";
}


function resetGame() {
  
  if (food.x !== undefined) {
    blocksArr[`(${food.x},${food.y})`].classList.remove("food");
  }
  snake.forEach(segment => blocksArr[`(${segment.x},${segment.y})`].classList.remove("fill"));


  snake = [{ x: 1, y: 4 }];
  direction = "down";
  score = 0;
  scoreElement.innerText = score;
  modal.style.display = "none";


  generateFood();
  startTimer();
  gameIntervalId = setInterval(gameLoop, 400);
}


function handleKeyPress(event) {
  if (event.key === "ArrowDown" && direction !== "up") direction = "down";
  else if (event.key === "ArrowUp" && direction !== "down") direction = "up";
  else if (event.key === "ArrowRight" && direction !== "left") direction = "right";
  else if (event.key === "ArrowLeft" && direction !== "right") direction = "left";
}


initGrid();

startButton.addEventListener("click", () => {
  snake = [{ x: 1, y: 4 }];
  generateFood();
  modal.style.display = "none";
  startTimer();
  gameIntervalId = setInterval(gameLoop, 400);
});

restartBtn.addEventListener("click", resetGame);
window.addEventListener("keydown", handleKeyPress);


