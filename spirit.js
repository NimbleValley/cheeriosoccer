class Spirit {
    constructor(x, y, w, h, vx, vy, ctx) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.vx = vx;
        this.vy = vy;
        this.ctx = ctx;
        this.image = new Image();
        this.image.src = "img/Ghostface1.png";
        this.alpha = 1;
        this.holding = false;
        this.initialx = vx;
        this.initialy = vy;
        this.timer = 0;
    }

    update(ball, ballWidth) {
        let holdTime = 100;

        this.x += this.vx;
        this.y += this.vy;

        if (ball.x - ballWidth > this.x && ball.x + ballWidth < this.x + this.width && ball.y - ballWidth > this.y && ball.y + ballWidth < this.y + this.height) {
            this.holding = true;
        } else {
            this.holding = false;
        }

        if (this.holding && this.timer < holdTime) {
            ball.x = this.x + this.width / 2;
            ball.y = this.y + this.height / 2;
            this.x += this.vx * (Math.random() - 0.5) * 20;
            this.y += this.vy * (Math.random() - 0.5) * 20;
            this.vx = this.initialx * (Math.random() - 0.5) * 2;
            this.vy = this.initialy * (Math.random() - 0.5) * 2;

            this.timer ++;
        }

        if(this.timer > holdTime) {
            this.holding = false;
            ball.vx = (Math.random() - 0.5) * 20;
            ball.vy = (Math.random() - 0.5) * 20;
        }
    }

    render() {
        this.ctx.fillStyle = "white";
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    getDelete() {
        if (this.alpha < 0) {
            return true;
        }
        if (this.x + this.width < 0) {
            return true;
        }
        if (this.x - this.width > window.innerWidth) {
            return true;
        }
        if (this.y + this.height < 0) {
            return true;
        }
        if (this.y - this.height > window.innerHeight) {
            return true;
        }
        return false;
    }
}