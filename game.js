const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

console.log(ctx);

var multiplayer = false;
var aiCool = {
    jump: 0,
    down: 0
};
const coolTime = 5;

if (localStorage.getItem("multiplayer") === "true") {
    multiplayer = true;
}

if (multiplayer == undefined) {
    alert("Error found, returning to game settings");
    open("index.html", "_self");
}

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
        case "s":
            keys.down1 = true;
            break;
        case "ArrowLeft":
            keys.left2 = true;
            break;
        case "ArrowRight":
            keys.right2 = true;
            break;
        case "ArrowUp":
            keys.up2 = true;
            break;
        case "ArrowDown":
            keys.down2 = true;
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
        case "s":
            keys.down1 = false;
            break;
        case "ArrowLeft":
            keys.left2 = false;
            break;
        case "ArrowRight":
            keys.right2 = false;
            break;
        case "ArrowUp":
            keys.up2 = false;
            break;
        case "ArrowDown":
            keys.down2 = false;
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

var score = {
    p1: 0,
    p2: 0
}

document.getElementById("firework-canvas").style.opacity = 0;

var playable = false;
var fireworksOn = false;
var playerSize = canvas.width / 50;
var ballSize = canvas.width / 75;

var p1 = {
    x: canvas.width * (1 / 10),
    y: canvas.height * (9 / 10) - playerSize,
    vx: 0,
    vy: 0,
    jumping: false,
    mass: playerSize * 200,
    color: localStorage.getItem("color-one")
}

var p2 = {
    x: canvas.width * (9 / 10),
    y: canvas.height * (9 / 10) - playerSize,
    vx: 0,
    vy: 0,
    jumping: false,
    mass: playerSize / 2,
    color: localStorage.getItem("color-two")
}

var ball = {
    x: canvas.width * (5 / 10),
    y: canvas.height * (0 / 10),
    vx: 0,
    vy: 0,
    mass: ballSize / 10
}

var friction = 0.85;
var ballFriction = 0.99;
var horizontalAcceleration = canvas.width / 1066;
var maxHorizontal = canvas.width / 75;
var maxVertical = canvas.height / 50;
var verticalAcceleration = canvas.height / 75;
var dampening = 0.6;
var gravity = canvas.height / 3500;

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (playable) {
        updatePhysics();
    }

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

    ctx.fillStyle = p1.color;
    ctx.shadowBlur = 50;
    ctx.shadowColor = p1.color;
    drawCirce(p1.x, p1.y, playerSize);

    ctx.fillStyle = p2.color;
    ctx.shadowBlur = 50;
    ctx.shadowColor = p2.color;
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
    if (keys.down1) {
        p1.vy = verticalAcceleration * 1.5;
    }

    if (multiplayer) {
        if (keys.left2) {
            p2.vx -= horizontalAcceleration;
        }
        if (keys.right2) {
            p2.vx += horizontalAcceleration;
        }
        if (keys.up2 && !p2.jumping) {
            p2.vy -= verticalAcceleration;
            p2.jumping = true;
        }
        if (keys.down2) {
            p2.vy = verticalAcceleration * 1.5;
        }
    } else {
        aiCool.jump--;
        aiCool.down--;
        p2.vx += aiHorizontal(ball, p1, p2, horizontalAcceleration);
        if (!p2.jumping && aiCool.jump <= 0) {
            p2.jumping = aiRequestJump(ball, p1, p2);
            if (p2.jumping) {
                p2.vy -= verticalAcceleration;
                aiCool.jump = coolTime;
            }
        }
        if (aiRequestDown(ball, p1, p2) && aiCool.down <= 0) {
            p2.vy = verticalAcceleration * 1.5;
            aiCool.down = coolTime;
        }
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
        ball.vy *= dampening * -1;
    }

    if (Math.sqrt(Math.pow(ball.x - p1.x, 2) + Math.pow(ball.y - p1.y, 2)) < playerSize + ballSize) {
        let dx = p1.x - ball.x;
        let dy = p1.y - ball.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let collisionNormal = {
            x: dx / distance,
            y: dy / distance
        }
        let relativeVelocity = {
            x: ball.vx - p1.vx,
            y: ball.vy - p1.vy
        }
        let speed = relativeVelocity.x * collisionNormal.x + relativeVelocity.y * collisionNormal.y;
        if (speed < 0) {
            return;
        }
        let impulse = 2 * speed / (ball.mass + p1.mass);
        ball.vx -= (impulse * p1.mass * collisionNormal.x);
        ball.vy -= (impulse * p1.mass * collisionNormal.y);

        contactpoints++;
    }

    if (Math.sqrt(Math.pow(ball.x - p2.x, 2) + Math.pow(ball.y - p2.y, 2)) < playerSize + ballSize) {
        let dx = p2.x - ball.x;
        let dy = p2.y - ball.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let collisionNormal = {
            x: dx / distance,
            y: dy / distance
        }
        let relativeVelocity = {
            x: ball.vx - p2.vx,
            y: ball.vy - p2.vy
        }
        let speed = relativeVelocity.x * collisionNormal.x + relativeVelocity.y * collisionNormal.y;
        if (speed < 0) {
            return;
        }
        let impulse = 2 * speed / (ball.mass + p2.mass);
        ball.vx -= (impulse * p2.mass * collisionNormal.x);
        ball.vy -= (impulse * p2.mass * collisionNormal.y);

        contactpoints++;
    }

    if (contactpoints > 1) {
        ball.vx = 0;
    }

    if (ball.x + (ballSize) > canvas.width) {
        ball.vx = Math.abs(ball.vx) * -1;
    }
    if (ball.x - (ballSize) < 0) {
        ball.vx = Math.abs(ball.vx);
    }
    if (ball.y - (ballSize) < 0) {
        ball.vy = Math.abs(ball.vy);
    }

    if (p1.x - (playerSize) < 0) {
        p1.vx = 0;
        p1.x = 0 + playerSize;
    }
    if (p1.x + (playerSize) > canvas.width) {
        p1.vx = 0;
        p1.x = canvas.width - playerSize;
    }

    if (p2.x - (playerSize) < 0) {
        p2.vx = 0;
        p2.x = 0 + playerSize;
    }
    if (p2.x + (playerSize) > canvas.width) {
        p2.vx = 0;
        p2.x = canvas.width - playerSize;
    }

    if (ball.x < canvas.height * (12 / 100) && ball.y > canvas.height * (53 / 100)) {
        score.p2++;
        updateScore(score.p1, score.p2);
        resetField();
    }
    if (ball.x > canvas.width - canvas.height * (12 / 100) && ball.y > canvas.height * (53 / 100)) {
        score.p1++;
        updateScore(score.p1, score.p2);
        resetField();
    }

    if (ball.x < canvas.height * (12 / 100) && ball.y > canvas.height * (53 / 100) - ballSize) {
        ball.vy = Math.abs(ball.vy) * -1;
    }

    if (ball.x > canvas.width - canvas.height * (12 / 100) && ball.y > canvas.height * (53 / 100) - ballSize) {
        ball.vy = Math.abs(ball.vy) * -1;
    }

    if (ball.vx > maxHorizontal) {
        ball.vx = maxHorizontal;
    }
    if (ball.vx < maxHorizontal * -1) {
        ball.vx = maxHorizontal * -1;
    }
    if (ball.vy > maxVertical) {
        ball.vy = maxVertical;
    }
    if (ball.vy < maxVertical * -1) {
        ball.vy = maxVertical * -1;
    }
}

function resetField() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 5;
    ball.vx = 0;
    ball.vy = 0;

    p1 = {
        x: canvas.width * (1 / 10),
        y: canvas.height * (9 / 10) - playerSize,
        vx: 0,
        vy: 0,
        jumping: false,
        mass: playerSize * 200,
        color: localStorage.getItem("color-one")
    }

    p2 = {
        x: canvas.width * (9 / 10),
        y: canvas.height * (9 / 10) - playerSize,
        vx: 0,
        vy: 0,
        jumping: false,
        mass: playerSize / 2,
        color: localStorage.getItem("color-two")
    }

    celebrate();
}

async function celebrate() {
    const ticker = document.getElementById("ticker");

    ticker.innerText = "GOAL! - GOAL! - GOAL! - GOAL! - GOAL! - GOAL! - GOAL! - GOAL! - GOAL! - GOAL! - GOAL! - GOAL! - GOAL! - GOAL! - GOAL! - GOAL! - GOAL! - GOAL! - GOAL! - GOAL! - GOAL! - GOAL! - GOAL! - GOAL! - GOAL! - GOAL! - GOAL! - GOAL! - GOAL! - GOAL! - GOAL! - GOAL! - GOAL! - GOAL! - GOAL! - "

    const goalText = document.getElementById("goal-text");
    goalText.style.opacity = 1;
    goalText.style.scale = 1;

    const fireworkCanvas = document.getElementById("firework-canvas");
    fireworkCanvas.style.bottom = "10vh";
    fireworkCanvas.style.opacity = 1;

    playable = false;
    fireworksOn = true;

    await sleep(3500);

    playable = true;
    fireworksOn = false;
    fireworkCanvas.style.opacity = 0;

    goalText.style.opacity = 0;
    goalText.style.scale = 0;

    ticker.innerText = "Cheerio Soccer - Nimble Games - Check Out More Games - Cheerio Soccer - Nimble Games - Check Out More Games - Cheerio Soccer - Nimble Games - Check Out More Games - Cheerio Soccer - Nimble Games - Check Out More Games - Cheerio Soccer - Nimble Games - Check Out More Games - ";
}
