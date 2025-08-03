function initializeSnakeGame() {
    const canvas = document.getElementById('snakeGame');
    if (!canvas) return;
 
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('highScore');
 
    let snake = [{ x: 200, y: 200 }];
    let direction = { x: 0, y: 0 };
    let food = { x: Math.floor(Math.random() * 20) * 20, y: Math.floor(Math.random() * 20) * 20 };
    let score = 0;
    let highScore = localStorage.getItem('snakeHighScore') || 0;
    let gameLoop;
 
    highScoreElement.textContent = highScore;
    document.addEventListener('keydown', changeDirection);
 
    function changeDirection(event) {
        switch (event.key) {
            case 'ArrowUp': if (direction.y === 0) direction = { x: 0, y: -20 }; break;
            case 'ArrowDown': if (direction.y === 0) direction = { x: 0, y: 20 }; break;
            case 'ArrowLeft': if (direction.x === 0) direction = { x: -20, y: 0 }; break;
            case 'ArrowRight': if (direction.x === 0) direction = { x: 20, y: 0 }; break;
        }
    }
 
    function updateSnake() {
        const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            score++;
            updateScore();
            if (score > highScore) {
                highScore = score;
                localStorage.setItem('snakeHighScore', highScore);
                highScoreElement.textContent = highScore;
            }
            food = { x: Math.floor(Math.random() * 20) * 20, y: Math.floor(Math.random() * 20) * 20 };
        } else {
            snake.pop();
        }
        if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || checkCollision(head)) {
            clearInterval(gameLoop);
            alert(`Game Over! Sua pontuação foi: ${score}`);
            resetSnakeGame();
        }
    }
 
    function drawSnake() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x, food.y, 20, 20);
        ctx.fillStyle = 'green';
        snake.forEach(part => ctx.fillRect(part.x, part.y, 20, 20));
    }
 
    function checkCollision(head) {
        return snake.slice(1).some(part => part.x === head.x && part.y === head.y);
    }
 
    function gameSnake() {
        updateSnake();
        drawSnake();
    }
 
    function resetSnakeGame() {
        snake = [{ x: 200, y: 200 }];
        direction = { x: 0, y: 0 };
        food = { x: Math.floor(Math.random() * 20) * 20, y: Math.floor(Math.random() * 20) * 20 };
        score = 0;
        updateScore();
        clearInterval(gameLoop);
        gameLoop = setInterval(gameSnake, 100);
    }
 
    function updateScore() {
        scoreElement.textContent = score;
    }
 
    gameLoop = setInterval(gameSnake, 100);
}
 
// Jogo da Velha
function initializeTicTacToeGame() {
    const cells = document.querySelectorAll('.tic-tac-toe-cell'); // Atualizado para a nova classe
    if (cells.length === 0) return;
 
    let currentPlayer = 'X';
    let board = Array(9).fill(null);
    let scoreX = 0;
    let scoreO = 0;
 
    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            const index = cell.dataset.index;
            if (!board[index] && !checkWinner()) {
                board[index] = currentPlayer;
                cell.textContent = currentPlayer;
                if (checkWinner()) {
                    currentPlayer === 'X' ? scoreX++ : scoreO++;
                    alert(`${currentPlayer} venceu!`);
                    updateScoreboard();
                    resetTicTacToeGame();
                } else if (board.every(cell => cell)) {
                    alert('Empate!');
                    resetTicTacToeGame();
                } else {
                    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                }
            }
        });
    });
 
    function checkWinner() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        return winningCombinations.some(combination => {
            const [a, b, c] = combination;
            return board[a] && board[a] === board[b] && board[a] === board[c];
        });
    }
 
    function resetTicTacToeGame() {
        board.fill(null);
        cells.forEach(cell => cell.textContent = '');
        currentPlayer = 'X';
    }
 
    function updateScoreboard() {
        document.getElementById('scoreX').textContent = `X: ${scoreX}`;
        document.getElementById('scoreO').textContent = `O: ${scoreO}`;
    }
}// Jogo da Velha
function initializeTicTacToeGame() {
    const cells = document.querySelectorAll('.tic-tac-toe-cell'); // Atualizado para a nova classe
    if (cells.length === 0) return;
 
    let currentPlayer = 'X';
    let board = Array(9).fill(null);
    let scoreX = 0;
    let scoreO = 0;
 
    cells.forEach(cell => {
        cell.addEventListener('click', () => {
            const index = cell.dataset.index;
            if (!board[index] && !checkWinner()) {
                board[index] = currentPlayer;
                cell.textContent = currentPlayer;
                if (checkWinner()) {
                    currentPlayer === 'X' ? scoreX++ : scoreO++;
                    alert(`${currentPlayer} venceu!`);
                    updateScoreboard();
                    resetTicTacToeGame();
                } else if (board.every(cell => cell)) {
                    alert('Empate!');
                    resetTicTacToeGame();
                } else {
                    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                }
            }
        });
    });
 
    function checkWinner() {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        return winningCombinations.some(combination => {
            const [a, b, c] = combination;
            return board[a] && board[a] === board[b] && board[a] === board[c];
        });
    }
 
    function resetTicTacToeGame() {
        board.fill(null);
        cells.forEach(cell => cell.textContent = '');
        currentPlayer = 'X';
    }
 
    function updateScoreboard() {
        document.getElementById('scoreX').textContent = `X: ${scoreX}`;
        document.getElementById('scoreO').textContent = `O: ${scoreO}`;
    }
}
 
// Campo Minado
function initializeMinesweeperGame() {
    const gameBoard = document.getElementById('gameBoard');
    const restartBtn = document.getElementById('restartBtn');
    if (!gameBoard || !restartBtn) return;
 
    const rows = 10;
    const cols = 10;
    const totalMines = 15;
    let board = [];
    let gameOver = false;
 
    function startGame() {
        gameOver = false;
        board = [];
        gameBoard.innerHTML = '';
        for (let row = 0; row < rows; row++) {
            board[row] = [];
            for (let col = 0; col < cols; col++) {
                board[row][col] = { mine: false, revealed: false, neighborMines: 0, flagged: false };
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.addEventListener('click', () => handleClick(row, col));
                cell.addEventListener('contextmenu', (event) => handleRightClick(event, row, col));
                gameBoard.appendChild(cell);
            }
        }
        placeMines();
        calculateNeighborMines();
    }
 
    function placeMines() {
        let minesPlaced = 0;
        while (minesPlaced < totalMines) {
            const row = Math.floor(Math.random() * rows);
            const col = Math.floor(Math.random() * cols);
            if (!board[row][col].mine) {
                board[row][col].mine = true;
                minesPlaced++;
            }
        }
    }
 
    function calculateNeighborMines() {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (board[row][col].mine) continue;
                let count = 0;
                for (const [dx, dy] of directions) {
                    const newRow = row + dx;
                    const newCol = col + dy;
                    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && board[newRow][newCol].mine) {
                        count++;
                    }
                }
                board[row][col].neighborMines = count;
            }
        }
    }
 
    function handleClick(row, col) {
        if (gameOver || board[row][col].revealed || board[row][col].flagged) return;
        const cell = gameBoard.children[row * cols + col];
        board[row][col].revealed = true;
        cell.classList.add('revealed');
        if (board[row][col].mine) {
            cell.classList.add('mine-exploded');
            cell.textContent = '💣';
            gameOver = true;
            alert('Você perdeu! A mina explodiu!');
            revealAllMines();
        } else {
            if (board[row][col].neighborMines === 0) {
                cell.classList.add('zero');
                revealNeighbors(row, col);
            } else {
                cell.textContent = board[row][col].neighborMines;
            }
        }
    }
 
    function revealNeighbors(row, col) {
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];
        for (const [dx, dy] of directions) {
            const newRow = row + dx;
            const newCol = col + dy;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && !board[newRow][newCol].revealed) {
                handleClick(newRow, newCol);
            }
        }
    }
 
    function handleRightClick(event, row, col) {
        event.preventDefault();
        if (gameOver || board[row][col].revealed) return;
        const cell = gameBoard.children[row * cols + col];
        board[row][col].flagged = !board[row][col].flagged;
        cell.textContent = board[row][col].flagged ? '🚩' : '';
    }
 
    function revealAllMines() {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (board[row][col].mine) {
                    const cell = gameBoard.children[row * cols + col];
                    cell.classList.add('mine');
                    cell.textContent = '💣';
                }
            }
        }
    }
 
    restartBtn.addEventListener('click', startGame);
    startGame();
}
 
// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initializeSnakeGame();
    initializeTicTacToeGame();
    initializeMinesweeperGame();
});
 