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
    },

    changeColorsByRGB: function(r,g,b) {
        if ((Math.random() < 0.5 && !(this.teamColor.r > 255-r)) || (this.teamColor.r < r)) {this.teamColor.r += r;}
        else {this.teamColor.r -= r;}
        if ((Math.random() < 0.5 && !(this.teamColor.g > 255-g)) || (this.teamColor.g < g)) {this.teamColor.g += g;}
        else {this.teamColor.g -= g;}
        if ((Math.random() < 0.5 && !(this.teamColor.b > 255-b)) || (this.teamColor.b < b)) {this.teamColor.b += b;}
        else {this.teamColor.b -= b;}
        this.teamColor.getNewHEX();
    }
};

let ProtoCell = {
    elem: 0,
    teamColor: Object.create(null),
    sz: 0,
    rangeRadius: 0,
    parentRect: 0,
    point: Object.create(null),
    cPoint: Object.create(null),
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
        this.cPoint.y = this.point.y + 5;
        this.cPoint.x = this.point.x + 5;
    },

    recolor: function() { 
        this.elem.style.backgroundColor = '#' + this.teamColor.hex; 
    },

    isInRadius: function(p) {
        let x = p.x - this.point.x, y = p.y - this.point.y;
        if (x*x + y*y <= this.rangeRadius*this.rangeRadius) { return true; }
        else { return false; }
    }
};

window.addEventListener('DOMContentLoaded', function() {
    let box = document.getElementsByClassName('main')[0];
    let boxRect = box.getBoundingClientRect();
    let btns = {
        play: document.getElementById('play'),
        pause: document.getElementById('pause'),
        switch: document.getElementById('switch'),
        add: {
            btn: document.getElementById('add'),
            context: document.getElementsByClassName('context_window')[0],
            bg: document.getElementById('background'),
            submit: document.getElementById('submit'),
            close: document.getElementById('close')
        },
    };


    let CellsObject = {
        cells: [],
        positionsField: [],
        contacts: 0,
        sz: 0,

        addPoint: function (color = "FF0000") {
            let n = this.sz++;
            this.cells.push(Object.create(ProtoCell));
            this.cells[n].elem = document.createElement('div');
            this.cells[n].elem.classList.add('point');
            box.appendChild(this.cells[n].elem);
            this.cells[n].teamColor = Object.create(ProtoColor);
            this.cells[n].teamColor.hex = color;
            this.cells[n].teamColor.getNewRGB();
            this.cells[n].sz = this.cells[n].elem.getBoundingClientRect().width;
            this.cells[n].rangeRadius = 15;
            this.cells[n].parentRect = boxRect;
            this.cells[n].point = Object.create(ProtoPoint);
            this.cells[n].point.x = +(Math.random() * (boxRect.width - this.cells[0].sz)).toFixed(0);
            this.cells[n].point.y = +(Math.random() * (boxRect.height - this.cells[0].sz)).toFixed(0);
            this.cells[n].cPoint = Object.create(ProtoPoint);
            this.cells[n].cPoint.x = this.cells[n].point.x + 5;
            this.cells[n].cPoint.y = this.cells[n].point.y + 5;
            this.positionsField[this.cells[n].cPoint.x][this.cells[n].cPoint.y] = n;
            this.cells[n].speed = Object.create(ProtoPoint);
            this.cells[n].speed.x = +((Math.random() * 10) % 5 + 5).toFixed(0);
            this.cells[n].speed.y = +((Math.random() * 10) % 5 + 5).toFixed(0);
            if (Math.random() < 0.5) { this.cells[n].speed.x = -this.cells[n].speed.x; }
            if (Math.random() < 0.5) { this.cells[n].speed.y = -this.cells[n].speed.y; }
            this.cells[n].elem.style.left = this.cells[n].point.x + 'px';
            this.cells[n].elem.style.top = this.cells[n].point.y + 'px';
            this.cells[n].elem.style.backgroundColor = '#' + this.cells[n].teamColor.hex;
        },

        addFixedPoint: function (x, y, sx, sy, color = "FF0000") {
            let n = this.sz++;
            this.cells.push(Object.create(ProtoCell));
            this.cells[n].elem = document.createElement('div');
            this.cells[n].elem.classList.add('point');
            box.appendChild(this.cells[n].elem);
            this.cells[n].teamColor = Object.create(ProtoColor);
            this.cells[n].teamColor.hex = color;
            this.cells[n].teamColor.getNewRGB();
            this.cells[n].sz = this.cells[n].elem.getBoundingClientRect().width;
            this.cells[n].rangeRadius = 15;
            this.cells[n].parentRect = boxRect;
            this.cells[n].point = Object.create(ProtoPoint);
            this.cells[n].point.x = x;
            this.cells[n].point.y = y;
            this.cells[n].cPoint = Object.create(ProtoPoint);
            this.cells[n].cPoint.x = x + 5;
            this.cells[n].cPoint.y = y + 5;
            this.positionsField[this.cells[n].cPoint.x][this.cells[n].cPoint.y] = n;
            this.cells[n].speed = Object.create(ProtoPoint);
            this.cells[n].speed.x = sx;
            this.cells[n].speed.y = sy;
            this.cells[n].elem.style.left = this.cells[n].point.x + 'px';
            this.cells[n].elem.style.top = this.cells[n].point.y + 'px';
            this.cells[n].elem.style.backgroundColor = '#' + this.cells[n].teamColor.hex;
        },

        checkContactsByOjbects: function(num) {
            for (let i = 0; i < this.cells.length; ++i) {
                if (num == i) { continue; }
                if (this.cells[num].isInRadius(this.cells[i].point)) {   
                    ++this.contacts;
                    // console.log(num+" contact with "+i);
                    // console.log("BIP");
                }
            }
        },

        checkContactsByField: function(num) {
            let r = this.cells[num].rangeRadius;
            for (let x = -r; x <= r; ++x) {                
                for (let y = -r; y <= r; ++y) {
                    if (x*x + y*y <= r*r) {
                        let fx = this.cells[num].cPoint.x + x,
                            fy = this.cells[num].cPoint.y + y;
                        if (fx < 0 || fx >= 800 || fy < 0 || fy >= 800) { continue; }
                        if (this.positionsField[fx][fy] != -1 && this.positionsField[fx][fy] != num) {
                            let contactIndex = this.positionsField[fx][fy];
                            ++this.contacts;
                            // console.log(num+" contact with "+contactIndex);
                            // console.log("BIP");
                        }
                    }
                }
            }
        },

        moving: function () {
            for (let i = 0; i < this.cells.length; ++i) {
                this.positionsField[this.cells[i].cPoint.x][this.cells[i].cPoint.y] = -1;
                this.cells[i].move();
                this.positionsField[this.cells[i].cPoint.x][this.cells[i].cPoint.y] = i;
                this.checkContactsByField(i);
                // this.checkContactsByOjbects(i);
            }
        }
    };

    let mainTimer, tact = 50;
    for (let i = 0; i < 800; ++i) {
        CellsObject.positionsField[i] = new Array(800);
        for (let j = 0; j < 800; ++j) {
            CellsObject.positionsField[i][j] = -1;
        }
    }

    btns.switch.addEventListener('click', (e) => {
        if (e.target.classList.contains('green_btn')) {
            e.target.textContent = 'Стоп';
            e.target.classList.remove('green_btn');
            e.target.classList.add('red_btn');
            mainTimer = setInterval(() => { CellsObject.moving(); }, tact);
        } else {
            e.target.textContent = 'Пуск';
            e.target.classList.remove('red_btn');
            e.target.classList.add('green_btn');
            clearInterval(mainTimer);
        }
    });

    btns.add.btn.addEventListener('click', () => {
        btns.add.context.classList.add('show');
        btns.add.bg.style.zIndex = 0;
        btns.add.bg.style.backgroundColor = 'rgba(0,0,0,0.5)';
    });
    btns.add.bg.addEventListener('click', () => {
        btns.add.context.classList.remove('show');
        btns.add.bg.style.zIndex = -1;
        btns.add.bg.style.backgroundColor = 'rgba(0,0,0,0)';
    });
    btns.add.close.addEventListener('click', () => {
        btns.add.context.classList.remove('show');
        btns.add.bg.style.zIndex = -1;
        btns.add.bg.style.backgroundColor = 'rgba(0,0,0,0)';
    });
    btns.add.submit.addEventListener('click', () => {
        let count = +document.getElementById('count').value,
            color = document.getElementById('color').value;
        for (let i = 0; i < count; ++i) { CellsObject.addPoint(color); }
    });

});