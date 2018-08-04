const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

class Vec {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
}

class Rect {
    constructor(w, h) {
        this.pos = new Vec;
        this.size = new Vec(w, h);
    }
    get left() {
        return this.pos.x - this.size.x / 2;
    }
    get right() {
        return this.pos.x + this.size.x / 2;
    }
    get top() {
        return this.pos.y - this.size.y / 2;
    }
    get bottom() {
        return this.pos.y + this.size.y / 2;
    }
}

class Ball extends Rect {
    constructor() {
        super(10, 10);
        this.vel = new Vec;
    }
}

let lastTime;
function callback(ms) {
    if (lastTime) {
        update((ms - lastTime) / 1000);
    }
    lastTime = ms;
    requestAnimationFrame(callback);
}

function update(dt) {
    ball.pos.x += ball.vel.x * dt;
    ball.pos.y += ball.vel.y * dt;

    if (ball.left < 0 || ball.right > canvas.width) {
        ball.vel.x = -ball.vel.x;
    }
    if (ball.top < 0 || ball.bottom > canvas.height) {
        ball.vel.y = -ball.vel.y;
    }

    // background
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // ball
    ctx.fillStyle = '#fff'
    ctx.fillRect(ball.pos.x, ball.pos.y, ball.size.x, ball.size.y); 

}

// printing stuff
const ball = new Ball;
console.log(ball);
ball.pos.x = 100;
ball.pos.y = 50;
ball.vel.x = 150;
ball.vel.y = 150;

callback();