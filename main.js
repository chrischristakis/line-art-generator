const canvas = document.getElementById("drawing-pane");
const cw = canvas.width = window.innerWidth;
const ch = canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');

function rint(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }  

class Node {
    constructor(x,y,vx,vy) {
        this.x = x; this.y = y;
        this.vx = vx; this.vy = vy;
    }

    update() {

        if(this.y >= ch) {
            this.y = ch;
            this.vy *= -1;
        }
        if(this.y <= 0) {
            this.y = 0;
            this.vy *= -1;
        }
        if(this.x >= cw) {
            this.x = cw;
            this.vx *= -1;
        }
        if(this.x <= 0) {
            this.x = 0;
            this.vx *= -1;
        }

        this.x+=this.vx;
        this.y+=this.vy;
    }
}

class Pair {
    constructor(n1,n2,hue) {
        this.n1 = n1;
        this.n2 = n2;
        this.hue = hue;
    }

    update() {
        this.n1.update();
        this.n2.update();
    }

    draw() {
        ctx.beginPath(); 
        ctx.moveTo(this.n1.x, this.n1.y);
        ctx.lineTo(this.n2.x, this.n2.y);
        ctx.lineWidth = 5;
        ctx.strokeStyle = `hsla(${this.hue}, 85%, 40%, 0.03)`;
        ctx.stroke();
    }
}

let pairs = [];

function initPairs() {
    pairs = [];
    let base = rint(0, 360)
    let num = rint(5, 15)
    for(let i = 0; i < num; i++) {
        const n1 = new Node(rint(0, cw),rint(0, ch),rint(-4, 4), rint(-4, 4));
        const n2 = new Node(rint(0, cw),rint(0, ch),rint(-4, 4), rint(-4, 4));
        pairs.push(new Pair(n1, n2, (rint(-48, 48) + base) % 360));
    }
}

function loop() {
    // Could use a game loop (preferably time step) buy no immediate need.
    requestAnimationFrame(loop);
    draw();
}

let start = Date.now();
function draw() {
    pairs.forEach((pair) => {
        if(Date.now() - start < 5000) {
            pair.update();  //Updates shouldnt be tied to framerate, but its a small program so it's ok.
            pair.draw();
        }
    })
}

canvas.onmousedown = () => {
    initPairs();
    ctx.clearRect(0, 0, cw, ch);
    start = Date.now();
}

initPairs();
loop();