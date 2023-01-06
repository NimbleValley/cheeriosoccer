const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

console.log(ctx);

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    render();
});

var keys = {
    left1: false,
    right1: false,
    up: false,
    down1: false,
    left2: false,
    right2: false,
    up2: false,
    down2: false
}

document.addEventListener('keydown', function (event) {
    switch (event.key) {
        case "a":
            keys.left1 = true;
            break;
        case "d":
            keys.right1 = true;
            break;
        case "w":
            keys.up1 = true;
            break;
        case "ArrowLeft":
            keys.left2 = true;
            break;
        case "ArrowRight":
            keys.right2 = true;
            break;
        default:
            break;
    }
});

document.addEventListener('keyup', function (event) {
    switch (event.key) {
        case "a":
            keys.left1 = false;
            break;
        case "d":
            keys.right1 = false;
            break;
        case "w":
            keys.up1 = false;
            break;
        case "ArrowLeft":
            keys.left2 = false;
            break;
        case "ArrowRight":
            keys.right2 = false;
            break;
        default:
            break;
    }
});

const mouse = {
    x: undefined,
    y: undefined
}

function drawCirce(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
}

var playerSize = canvas.width / 50;
var ballSize = canvas.width / 75;

var p1 = {
    x: canvas.width * (1 / 10),
    y: canvas.height * (9 / 10) - playerSize,
    vx: 0,
    vy: 0,
    jumping: false
}

var p2 = {
    x: canvas.width * (9 / 10),
    y: canvas.height * (9 / 10) - playerSize,
    vx: 0,
    vy: 0,
    jumping: false
}

var ball = {
    x: canvas.width * (5 / 10),
    y: canvas.height * (0 / 10),
    vx: 0,
    vy: 0,
}

var friction = 0.85;
var ballFriction = 0.99;
var maxBallVertical = canvas.height / 50;
var horizontalAcceleration = 1.5;
var verticalAcceleration = canvas.height / 75;
var gravity = canvas.height / 2500;

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updatePhysics();
    render();

    requestAnimationFrame(animate);
}

animate();

function render() {
    ctx.shadowBlur = 0;
    var grd = ctx.createLinearGradient(0, canvas.height * (9 / 10), 0, canvas.height);
    grd.addColorStop(1, "#446042");
    grd.addColorStop(0, "#50735c");

    // Fill with gradient
    ctx.fillStyle = grd;
    ctx.fillRect(0, canvas.height * (9 / 10), canvas.width, canvas.height);

    ctx.fillStyle = "#e37368";
    ctx.shadowBlur = 50;
    ctx.shadowColor = "#a14a42";
    drawCirce(p1.x, p1.y, playerSize);

    ctx.fillStyle = "#51a6d6";
    ctx.shadowBlur = 50;
    ctx.shadowColor = "#4096ff";
    drawCirce(p2.x, p2.y, playerSize);

    ctx.fillStyle = "#e8e6e1";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#e8e6e1";
    drawCirce(ball.x, ball.y, ballSize);
}

function updatePhysics() {
    var contactpoints = 0;

    if (keys.left1) {
        p1.vx -= horizontalAcceleration;
    }
    if (keys.right1) {
        p1.vx += horizontalAcceleration;
    }
    if (keys.up1 && !p1.jumping) {
        p1.vy -= verticalAcceleration;
        p1.jumping = true;
    }

    if (keys.left2) {
        p2.vx -= horizontalAcceleration;
    }
    if (keys.right2) {
        p2.vx += horizontalAcceleration;
    }

    p1.x += p1.vx;
    p1.vx *= friction;
    p1.y += p1.vy;
    p1.vy += gravity;

    p2.x += p2.vx;
    p2.vx *= friction;
    p2.y += p2.vy;
    p2.vy += gravity;

    ball.x += ball.vx;
    ball.vx *= ballFriction;
    ball.y += ball.vy;
    ball.vy += gravity;

    if (p1.y > canvas.height * (9 / 10) - playerSize) {
        p1.y = canvas.height * (9 / 10) - playerSize;
        p1.vy = 0;
        p1.jumping = false;
    }

    if (p2.y > canvas.height * (9 / 10) - playerSize) {
        p2.y = canvas.height * (9 / 10) - playerSize;
        p2.vy = 0;
        p2.jumping = false;
    }

    if (ball.y > canvas.height * (9 / 10) - ballSize) {
        ball.y = canvas.height * (9 / 10) - ballSize;
        ball.vy *= -0.5;
    }

    if (Math.sqrt(Math.pow(ball.x - p1.x, 2) + Math.pow(ball.y - p1.y, 2)) < playerSize + ballSize) {
        ball.vx = (Math.abs(p1.vx) + 0.5) * (ball.x - p1.x) / 25;
        ball.vy +=  (ball.y - p1.y) /2;
        contactpoints ++;
    }

    if (Math.sqrt(Math.pow(ball.x - p2.x, 2) + Math.pow(ball.y - p2.y, 2)) < playerSize + ballSize) {
        ball.vx = (Math.abs(p2.vx) + 0.5) * (ball.x - p2.x) / 25;
        ball.vy +=  (ball.y - p2.y) /2;
        contactpoints ++;
    }

    if(ball.vy < maxBallVertical * -1) {
        ball.vy = maxBallVertical;
    }

    if(contactpoints > 1) {
        ball.vx = 0;
    }
}