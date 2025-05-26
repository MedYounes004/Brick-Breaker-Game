$(document).ready(function() {
    const gameArea = $('#game-area');
    const paddle = $('#paddle');
    const ball = $('#ball');
    const bricksContainer = $('#bricks');
    const scoreDisplay = $('#score');
    const livesDisplay = $('#lives');

    let gameWidth = gameArea.width();
    let gameHeight = gameArea.height();
    let paddleWidth = 100;
    let ballSize = 15;
    let ballX = gameWidth / 2 - ballSize / 2;
    let ballY = gameHeight - 50;
    let ballSpeedX = 0;
    let ballSpeedY = -5;
    let lives = 3;
    let score = 0;
    let isGameStarted = false;


    function initGame() {
        paddle.css({
            left: (gameWidth - paddleWidth) / 2,
            width: paddleWidth
        });

        ball.css({
            left: ballX,
            top: ballY
        });

        createBricks();
    }

   
    function createBricks() {
        const rows = 5;
        const cols = 10;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const brick = $('<div>').addClass('brick').css({
                    left: col * 60,
                    top: row * 25
                });
                bricksContainer.append(brick);
            }
        }
    }

    
    $(document).mousemove(function(e) {
        let gameAreaOffset = gameArea.offset();
        let mouseX = e.pageX - gameAreaOffset.left - paddleWidth / 2;
        
        mouseX = Math.max(0, Math.min(mouseX, gameWidth - paddleWidth));
        paddle.css('left', mouseX);
    });

    
    $(document).click(function() {
        if (!isGameStarted) {
            isGameStarted = true;
            gameLoop();
        }
    });

    
    function gameLoop() {
        if (!isGameStarted) return;

        moveBall();
        checkCollisions();
        requestAnimationFrame(gameLoop);
    }

    
    function moveBall() {
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        ball.css({
            left: ballX,
            top: ballY
        });
    }

    
    function checkCollisions() {
        
        if (ballX <= 0 || ballX >= gameWidth - ballSize) {
            ballSpeedX = -ballSpeedX;
        }

        
        if (ballY <= 0) {
            ballSpeedY = -ballSpeedY;
        }

        
        let paddlePos = paddle.position();
        if (ballY + ballSize >= paddlePos.top && 
            ballX + ballSize > paddlePos.left && 
            ballX < paddlePos.left + paddleWidth) {
            
            
            let hitPosition = (ballX - paddlePos.left) / paddleWidth;
            ballSpeedX = (hitPosition - 0.5) * 10;
            ballSpeedY = -Math.abs(ballSpeedY);
        }

        
        if (ballY >= gameHeight - ballSize) {
            lives--;
            livesDisplay.text(`Lives: ${lives}`);

            if (lives <= 0) {
                alert('Game Over!');
                resetGame();
            } else {
                resetBall();
            }
        }

        
        $('.brick').each(function() {
            let brickPos = $(this).position();
            if (isColliding(ballX, ballY, brickPos.left, brickPos.top)) {
                $(this).remove();
                ballSpeedY = -ballSpeedY;
                score += 10;
                scoreDisplay.text(`Score: ${score}`);
                spawnBonus(brickPos);
            }
        });
    }

    
    function isColliding(ballX, ballY, brickX, brickY) {
        return ballX < brickX + 60 &&
               ballX + ballSize > brickX &&
               ballY < brickY + 20 &&
               ballY + ballSize > brickY;
    }

    
    function spawnBonus(position) {
        
        if (Math.random() < 0.3) {
            const bonus = $('<div>').addClass('bonus').css({
                left: position.left,
                top: position.top
            });
            gameArea.append(bonus);

            bonus.animate({top: gameHeight}, 3000, function() {
                $(this).remove();
            });
        }
    }

    
    function resetBall() {
        ballX = gameWidth / 2 - ballSize / 2;
        ballY = gameHeight - 50;
        ballSpeedX = 0;
        ballSpeedY = -5;
        isGameStarted = false;

        ball.css({
            left: ballX,
            top: ballY
        });
    }

    
    function resetGame() {
        lives = 3;
        score = 0;
        livesDisplay.text(`Lives: ${lives}`);
        scoreDisplay.text(`Score: ${score}`);
        bricksContainer.empty();
        $('.bonus').remove();
        createBricks();
        resetBall();
    }

    initGame();
});