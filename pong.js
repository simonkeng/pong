class Vec {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    get len() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }
    set len(value) {
        const fact = value / this.len;
        this.x *= fact;
        this.y *= fact;
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

class Player extends Rect {
    constructor() {
        super(20, 100);
        this.score = 0;
    }
}

class ScoreCounter extends Rect {
    constructor() {
        super(5, 5);
    }
}

class Pong {
    constructor(canvas) {
        this._canvas = canvas;
        this._ctx = canvas.getContext('2d');
        // this.scores = new ScoreCounter;
        this.ball = new Ball;
        this.players = [
            new Player, 
            new Player
        ];
      
        // this.scores.pos.x = 20;
        // this.scores.pos.y = 20;

        this.players[0].pos.x = 40;
        this.players[1].pos.x = this._canvas.width - 40;
        this.players.forEach(player => {
            player.pos.y = this._canvas.height / 2;
        })

        let lastTime;
        const callback = (ms) => {
            if (lastTime) {
                this.update((ms - lastTime) / 1000);
            }
            lastTime = ms;
            requestAnimationFrame(callback);
        };
        callback();
        this.reset();
    }
    collide(player, ball) {
        if (player.left < ball.right && player.right > ball.left &&
            player.top < ball.bottom && player.bottom > ball.top) {
                const len = ball.vel.len;
                ball.vel.x = -ball.vel.x;
                ball.vel.y += 300 * (Math.random() - 0.5);
                ball.vel.len = len * 1.05;
            }
    }
    drawRect(rect) {
        this._ctx.fillStyle = '#fff'
        this._ctx.fillRect(rect.left, rect.top, 
                           rect.size.x, rect.size.y);
    }
    draw() {
        // background
        this._ctx.fillStyle = '#000'
        this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
        // ball
        this.drawRect(this.ball);
        // player
        this.players.forEach(player => this.drawRect(player));

        // if (this.players[1].score) {
        //     this.drawRect(this.scores)
        //     this.scores.pos.x++;
        // } 
    }
    reset() {
        this.ball.pos.x = this._canvas.width / 2;
        this.ball.pos.y = this._canvas.height / 2;
        this.ball.vel.x = 0;
        this.ball.vel.y = 0;
    }
    start() {
        if (this.ball.vel.x === 0 && this.ball.vel.y === 0) {
            this.ball.vel.x = 300 * (Math.random() > 0.5 ? 1 : -1);
            this.ball.vel.y = 300 * (Math.random() * 2 - 1);
            this.ball.vel.len = 200;
        }
    }
    update(dt) {
        this.ball.pos.x += this.ball.vel.x * dt;
        this.ball.pos.y += this.ball.vel.y * dt;
    
        if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
            const playerId = this.ball.vel.x < 0 | 0;
            this.players[playerId].score++;
            this.reset();
            this.ball.vel.x = -this.ball.vel.x;
        }
        if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
            this.ball.vel.y = -this.ball.vel.y;
        }

        // computer is player 2
        // impossible AI that just follows ball position
        this.players[1].pos.y = this.ball.pos.y;

        // collision detection
        this.players.forEach(player => this.collide(player, this.ball));
        
        this.draw();
    }
}

const canvas = document.getElementById('pong');
const pong = new Pong(canvas);

canvas.addEventListener('mousemove', event => {
    pong.players[0].pos.y = event.offsetY;
})
canvas.addEventListener('click', event => {
    pong.start();
})