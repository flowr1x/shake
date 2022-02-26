const canvas = document.querySelector(".canvas"),
      scoreElement = document.querySelector(".score"), 
      context = canvas.getContext("2d"),
      
      config = {
        step: 0,
        maxStep: 6,
        sizeCell: 16,
        sizeBerry: 4,
      },

      shake = {
        x: 16,
        y: 16,
        dx: config.sizeCell,
        dy: 0,
        tails: [],
        maxTails: 3,
      },

      speed = {
        "20": 5,
        "40": 4,
        "60": 3,
        "80": 2
      };    

let berry = {
    x: 0,
    y: 0
};

let score = 0;
showScore();
randomPositionBerry();
function gameLoop() {
    requestAnimationFrame(gameLoop);
        
    if (++config.step < config.maxStep) {
        return;
    }
    config.step = 0;
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    if (speed[score]) config.maxStep = speed[score]; // Увеличение скорости 

    drawShake();
    drawBerry();
}

requestAnimationFrame(gameLoop);

function drawShake() {
    shake.x += shake.dx;
    shake.y += shake.dy;

    collisionBorder();

    shake.tails.unshift( { x: shake.x, y: shake.y } );

    if (shake.tails.length > shake.maxTails) shake.tails.pop();

    shake.tails.forEach((item, index) => {
        context.fillStyle = "#86d86a";
        context.fillRect(item.x, item.y, config.sizeCell, config.sizeCell);
    
        const equalPosition = (berry.x == item.x) && (berry.y == item.y);
        if (equalPosition) {
            shake.maxTails += 1;    
            addScore();
            randomPositionBerry();
        }

        for (let i = index + 1; i < shake.tails.length; i++) {
            const hitSelf = item.x == shake.tails[i].x 
                && item.y == shake.tails[i].y;

            if (hitSelf) gameOver();

        }
    });
}

// Collision
function collisionBorder() {
    if (canvas.width <= shake.x) shake.x = 0;
    if (canvas.height <= shake.y) shake.y = 0;
    if (shake.x < 0) shake.x = canvas.width;
    if (shake.y < 0) shake.y = canvas.height;
}

function addScore() {
    score += 1;
    showScore();
}

function showScore() {
    scoreElement.innerHTML = score;
}

// Draw berry function
function drawBerry() {
    context.fillStyle = "#86d86a";
    context.fillRect(berry.x + (config.sizeCell / 2 - 1), berry.y + (config.sizeCell / 2 - 1), config.sizeBerry, config.sizeBerry);
}

// Create position berry 
function randomPositionBerry() {
    berry.x = getRandom(0, canvas.width / config.sizeCell) * config.sizeCell;
    berry.y = getRandom(0, canvas.height / config.sizeCell) * config.sizeCell;
}

// Null function 
function gameOver() {
    shake.tails = [];
    shake.maxTails = 3;
    shake.x = 16;
    shake.y = 16;

    config.maxStep = 6;
    score = 0;
    showScore();
}

// Random number function
function getRandom(min, max) {
     return Math.floor(min + Math.random() * (max-min));
}


// Move shake
window.addEventListener("keydown", moveShake);

let isMove = true;
function moveShake(event) {
    if (!isMove) return;
    switch(event.code) {
        case "ArrowLeft":      
            if (shake.dx > 0 && shake.dy == 0) return;
            shake.dx = -config.sizeCell;
            shake.dy = 0;
            break;
        case "ArrowRight":
            if (shake.dx < 0 && shake.dy == 0) return;
            shake.dx = config.sizeCell;
            shake.dy = 0;
            break;
        case "ArrowDown":
            if (shake.dx == 0 && shake.dy < 0) return;
            shake.dx = 0;
            shake.dy = config.sizeCell;
            break;
        case "ArrowUp":
            if (shake.dx == 0 && shake.dy > 0) return;
            shake.dx = 0;
            shake.dy = -config.sizeCell;
            break;        
    }
    
    isMove = false;
    setTimeout(() => isMove = true, 80);
}