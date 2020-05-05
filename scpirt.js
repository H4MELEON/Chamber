let ProtoPoint = {
    x: 0,
    y: 0
};

let ProtoColor = {
    hex: "",
    r: 0,
    g: 0,
    b: 0,

    getNewHEX: function () {
        let r = this.r.toString(16).padStart(2, '0'),
            g = this.g.toString(16).padStart(2, '0'),
            b = this.b.toString(16).padStart(2, '0');
        this.hex = r+g+b;
    },

    getNewRGB: function() {
        let color = +(parseInt(this.hex, 16));
        this.r = Math.floor(color / 0x10000);
        this.g = Math.floor(color % 0x10000 / 0x100);
        this.b = Math.floor(color % 0x100);
    }
};

let ProtoCell = {
    elem: 0,
    teamColor: Object.create(null),
    sz: 0,
    parentRect: 0,
    point: Object.create(null),
    speed: Object.create(null),

    move: function () {
        this.point.x += this.speed.x;
        this.point.y += this.speed.y;
        if (this.point.x <= 0 || this.point.x >= this.parentRect.width - this.sz) {
            this.speed.x = -this.speed.x;
            this.point.x += this.speed.x;
        }
        if (this.point.y <= 0 || this.point.y >= this.parentRect.height - this.sz) {
            this.speed.y = -this.speed.y;
            this.point.y += this.speed.y;
        }
        this.elem.style.left = this.point.x + 'px';
        this.elem.style.top = this.point.y + 'px';

        // Just for fun
        if ((Math.random() < 0.5 && !(this.teamColor.r > 250)) || (this.teamColor.r < 5)) {this.teamColor.r += 20;}
        else {this.teamColor.r -= 20;}
        if ((Math.random() < 0.5 && !(this.teamColor.g > 250)) || (this.teamColor.g < 5)) {this.teamColor.g += 20;}
        else {this.teamColor.g -= 20;}
        if ((Math.random() < 0.5 && !(this.teamColor.b > 250)) || (this.teamColor.b < 5)) {this.teamColor.b += 20;}
        else {this.teamColor.b -= 20;}
        this.teamColor.getNewHEX();
        this.teamColor.getNewRGB();
        this.elem.style.backgroundColor = '#' + this.teamColor.hex;
        console.log(this.teamColor.hex);
    }
};

window.addEventListener('DOMContentLoaded', () => {
    let box = document.getElementsByClassName('main')[0];
    let boxRect = box.getBoundingClientRect();
    let btns = {
        play: document.getElementById('play'),
        pause: document.getElementById('pause'),
        switch: document.getElementById('switch'),
        add: document.getElementById('add'),
    };


    let CellsObject = {
        cells: [],
        sz: 0,

        addPoint: function (color = "#FF0000") {
            let n = this.sz++;
            this.cells.push(Object.create(ProtoCell));
            this.cells[n].elem = document.createElement('div');
            this.cells[n].elem.classList.add('point');
            box.appendChild(this.cells[n].elem);
            this.cells[n].teamColor = Object.create(ProtoColor);
            this.cells[n].teamColor.hex = color;
            this.cells[n].teamColor.getNewRGB();
            this.cells[n].sz = this.cells[n].elem.getBoundingClientRect().width;
            this.cells[n].parentRect = boxRect;
            this.cells[n].point = Object.create(ProtoPoint);
            this.cells[n].point.x = +(Math.random() * (boxRect.width - this.cells[0].sz)).toFixed(0);
            this.cells[n].point.y = +(Math.random() * (boxRect.height - this.cells[0].sz)).toFixed(0);
            this.cells[n].speed = Object.create(ProtoPoint);
            this.cells[n].speed.x = +((Math.random() * 10) % 5 + 5).toFixed(0);
            this.cells[n].speed.y = +((Math.random() * 10) % 5 + 5).toFixed(0);
            if (Math.random() < 0.5) { this.cells[n].speed.x = -this.cells[n].speed.x; }
            if (Math.random() < 0.5) { this.cells[n].speed.y = -this.cells[n].speed.y; }
            this.cells[n].elem.style.left = this.cells[n].point.x + 'px';
            this.cells[n].elem.style.top = this.cells[n].point.y + 'px';
            this.cells[n].elem.style.backgroundColor = '#' + this.cells[n].teamColor.hex;
        },

        addFixedPoint: function (x, y, sx, sy) {
            let n = this.sz++;
            this.cells.push(Object.create(ProtoCell));
            this.cells[n].elem = document.createElement('div');
            this.cells[n].elem.classList.add('point');
            box.appendChild(this.cells[n].elem);
            this.cells[n].teamColor = "#FF0000";
            this.cells[n].sz = this.cells[n].elem.getBoundingClientRect().width;
            this.cells[n].parentRect = boxRect;
            this.cells[n].point = Object.create(ProtoPoint);
            this.cells[n].point.x = x;
            this.cells[n].point.y = y;
            this.cells[n].speed = Object.create(ProtoPoint);
            this.cells[n].speed.x = sx;
            this.cells[n].speed.y = sy;
            this.cells[n].elem.style.left = this.cells[n].point.x + 'px';
            this.cells[n].elem.style.top = this.cells[n].point.y + 'px';
            this.cells[n].elem.style.backgroundColor = this.cells[n].teamColor;
        },

        moving: function () {
            for (let c of this.cells) {
                c.move();
            }
        }
    };

    let mainTimer, tact = 40;
    btns.play.addEventListener('click', () => {
        mainTimer = setInterval(() => { CellsObject.moving(); }, tact);
    });
    btns.pause.addEventListener('click', () => {
        clearInterval(mainTimer);
    });
    btns.switch.addEventListener('click', (e) => {
        if (e.target.classList.contains('green_btn')) {
            e.target.classList.remove('green_btn');
            e.target.classList.add('red_btn');
            clearInterval(mainTimer);
        } else {
            e.target.classList.remove('red_btn');
            e.target.classList.add('green_btn');
            mainTimer = setInterval(() => { CellsObject.moving(); }, tact);
        }
    });
    btns.add.addEventListener('click', () => {
        let context = document.getElementsByClassName('context_window')[0],
            bg = document.getElementById('background'),
            submit = document.getElementById('submit'),
            close = document.getElementById('close');
        context.classList.add('show');
        bg.style.zIndex = 0;
        bg.style.backgroundColor = 'rgba(0,0,0,0.5)';
        bg.addEventListener('click', () => {
            context.classList.remove('show');
            bg.style.zIndex = -1;
            bg.style.backgroundColor = 'rgba(0,0,0,0)';
        });
        close.addEventListener('click', () => {
            context.classList.remove('show');
            bg.style.zIndex = -1;
            bg.style.backgroundColor = 'rgba(0,0,0,0)';
        });
        submit.addEventListener('click', () => {
            let count = +document.getElementById('count').value,
                color = document.getElementById('color').value;
            for (let i = 0; i < count; ++i) { CellsObject.addPoint(color); }
        });
    });
});