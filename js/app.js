const canvas = document.querySelector(".canvas"),
      scoreElement = document.querySelector(".score__number"), 
      context = canvas.getContext("2d"),
      
      config = {
        step: 0,
        maxStep: 8,
        sizeCell: 16,
        sizeBerry: this.sizeCell / 4,
      },

      shake = {
        x: 16,
        y: 16,
        dx: config.sizeCell,
        dy: 0,
        tails: [],
        maxTails: 3,
      };

let berry = {
    x: 0,
    y: 0
};

let score = 0;
showScore();
function gameLoop() {
    requestAnimationFrame(gameLoop);
        
    if (++config.step < config.maxStep) {
        return;
    }
    config.step = 0;
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    drawShake();
    drawBerry();
}

requestAnimationFrame(gameLoop);

function drawShake() {
    shake.x += shake.dx;
    shake.y += shake.dy;

    collisionBorder();

    shake.tails.unshift({ x: shake.x, y: shake.y });

    if (shake.tails.length > shake.maxTails) shake.tails.pop();

    shake.tails.forEach((item, index) => {
        context.fillStyle = index == 0 ? "red" : "blue";
        context.fillRect(item.x, item.y, config.sizeCell, config.sizeCell);
    
        const equalPosition = (berry.x == item.x) && (berry.y == item.y);
        if (equalPosition) {
            shake.maxStep += 1;    
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

function drawBerry() {

}

function randomPositionBerry() {
    berry.x = random()
}

function gameOver() {
    // todo
}
const random = (min, max) => Math.floor(min + Math.random() * (max-min+1));


window.addEventListener("keydown", (event) => {
    switch(event.code) {
        case "ArrowLeft":
            console.log("left");
            
            if (shake.dx > 0 && shake.dy == 0) return;
            shake.dx = -config.sizeCell;
            shake.dy = 0;
            break;
        case "ArrowRight":
            console.log("right");
            if (shake.dx < 0 && shake.dy == 0) return;
            shake.dx = config.sizeCell;
            shake.dy = 0;
            break;
        case "ArrowDown":
            console.log("down");
            if (shake.dx == 0 && shake.dy < 0) return;
            shake.dx = 0;
            shake.dy = config.sizeCell;
            break;
        case "ArrowUp":
            console.log("up");
            if (shake.dx == 0 && shake.dy > 0) return;
            shake.dx = 0;
            shake.dy = -config.sizeCell;
            break;        
    }
});