    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const gridSize = 20;
    let tileCount;

    function resizeCanvas() {
        const size = window.innerWidth < 600 ? canvas.width : 400;
        canvas.width = size;
        canvas.height = size;
        tileCount = canvas.width / gridSize;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let snake = [{x: 10, y: 10}];
    let food = {x: 15, y: 15};
    let dx = 0;
    let dy = 0;
    let score = 0;
    let gameOver = false;
    let interval = 100;
    let intervalId;

    function drawSnake() {
        snake.forEach(segment => {
            ctx.fillStyle = 'green'; // Change snake color to green
            ctx.beginPath();
            ctx.arc((segment.x * gridSize) + gridSize / 2, (segment.y * gridSize) + gridSize / 2, gridSize / 2, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function drawFood() {
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    }

    function moveSnake() {
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            generateFood();
            score++;
            document.getElementById('score').textContent = 'Score: ' + score;
            increaseSpeed();
        } else {
            snake.pop();
        }
        if (checkCollision()) {
            endGame();
        }
    }

    function generateFood() {
        food.x = Math.floor(Math.random() * tileCount);
        food.y = Math.floor(Math.random() * tileCount);
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function main() {
        if (!gameOver) {
            clearCanvas();
            moveSnake();
            drawFood();
            drawSnake();
        }
    }

    function checkCollision() {
        const head = snake[0];
        return (
            head.x < 0 ||
            head.x >= tileCount ||
            head.y < 0 ||
            head.y >= tileCount ||
            snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
        );
    }

    function endGame() {
        gameOver = true;
        clearInterval(intervalId);
        document.getElementById('gameOver').style.display = 'block';
    }

    function resetGame() {
        snake = [{x: 10, y: 10}];
        food = {x: 15, y: 15};
        dx = 0;
        dy = 0;
        score = 0;
        gameOver = false;
        interval = 100;
        clearInterval(intervalId);
        intervalId = setInterval(main, interval);
        document.getElementById('score').textContent = 'Score: ' + score;
        document.getElementById('gameOver').style.display = 'none';
    }

    function increaseSpeed() {
        clearInterval(intervalId);
        interval -= 5;
        intervalId = setInterval(main, interval);
    }

    document.addEventListener('keydown', function(event) {
        const key = event.key;
        switch (key) {
            case 'ArrowUp':
                if (dy !== 1) {
                    dx = 0;
                    dy = -1;
                }
                break;
            case 'ArrowDown':
                if (dy !== -1) {
                    dx = 0;
                    dy = 1;
                }
                break;
            case 'ArrowLeft':
                if (dx !== 1) {
                    dx = -1;
                    dy = 0;
                }
                break;
            case 'ArrowRight':
                if (dx !== -1) {
                    dx = 1;
                    dy = 0;
                }
                break;
        }
    });

    document.getElementById('resetButton').addEventListener('click', resetGame);

    intervalId = setInterval(main, interval);

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }