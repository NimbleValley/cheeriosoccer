function aiHorizontal(ball, p1, p2, horizontalAcceleration) {
    if(p2.x - (window.innerWidth * 1/50) < ball.x) {
        return horizontalAcceleration;
    }

    if(Math.abs(p1.x - ball.x) + 1 > Math.abs(p2.x - ball.x)) {
        return horizontalAcceleration * -1;
    }

    if (p2.x >= window.innerWidth * (18 / 20)) {
        return 0;
    }

    if (ball.x <= window.innerWidth / 2) {
        if (Math.abs(p1.x - ball.x) >= Math.abs(p2.x - ball.x)) {
            return horizontalAcceleration * -1;
        } else {
            return 0;
        }
    }

    if (ball.x > window.innerWidth / 2) {
        return horizontalAcceleration;
    }

    return 0;
}

function aiRequestJump(ball, p1, p2) {
    if(ball.y < p2.y - (window.innerHeight * (1/20)) && Math.abs(ball.x - p2.x) < window.innerWidth * (1/4)) {
        return true;
    }
    return false;
}

function aiRequestDown(ball, p1, p2) {
    if(ball.y > p2.y && Math.abs(ball.x - p2.x) < window.innerWidth * (1/4)) {
        return true;
    }
    return false;
}