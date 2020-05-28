'use strict'

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
        this.hex = r + g + b;
    },

    getNewRGB: function () {
        let color = +(parseInt(this.hex, 16));
        this.r = Math.floor(color / 0x10000);
        this.g = Math.floor(color % 0x10000 / 0x100);
        this.b = Math.floor(color % 0x100);
    },

    changeColorsByRGB: function (r, g, b) {
        if ((Math.random() < 0.5 && !(this.r > 255 - r)) || (this.r < r)) { this.r += r; }
        else { this.r -= r; }
        if ((Math.random() < 0.5 && !(this.g > 255 - g)) || (this.g < g)) { this.g += g; }
        else { this.g -= g; }
        if ((Math.random() < 0.5 && !(this.b > 255 - b)) || (this.b < b)) { this.b += b; }
        else { this.b -= b; }
        this.getNewHEX();
    }
};

let ProtoCell = {
    elem: 0,
    teamColor: Object.create(null),
    power: 0,
    dead: false,
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
        // this.teamColor.changeColorsByRGB(Math.floor(Math.random()*10), Math.floor(Math.random()*10), Math.floor(Math.random()*10));
        // this.recolor();
    },

    recolor: function () {
        this.elem.style.backgroundColor = '#' + this.teamColor.hex;
    },

    isInRadius: function (p) {
        let x = p.x - this.point.x, y = p.y - this.point.y;
        if (x * x + y * y <= this.rangeRadius * this.rangeRadius) { return true; }
        else { return false; }
    },

    doDeath: function () { this.elem.classList.add('dead_point'); this.dead = true; }
};

window.addEventListener('DOMContentLoaded', function () {
    let box = document.getElementsByClassName('main')[0];
    let boxRect = box.getBoundingClientRect();
    let btns = {
        switch: document.getElementById('switch'),
        add: {
            btn: document.getElementById('add'),
            context: document.getElementsByClassName('context_window')[0],
            bg: document.getElementById('background'),
            submit: document.getElementById('submit_add'),
            close: document.getElementById('close_add'),
        },
        settings: {
            btn: document.getElementById('settings'),
            context: document.getElementsByClassName('context_window')[1],
            bg: document.getElementById('background'),
            submit: document.getElementById('submit_set'),
            close: document.getElementById('close_set'),
            updTimeInput: document.getElementById('upd_timer'),
        },
    };


    let CellsObject = {
        cells: [],
        positionsField: [],
        colorsSet: new Set(),
        mode: 'S',
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
            this.colorsSet.add(this.cells[n].teamColor.hex);
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
            this.cells[n].power = Math.round(Math.random());
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
            this.colorsSet.add(this.cells[n].teamColor.hex);
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
            this.cells[n].power = Math.round(Math.random());
            this.cells[n].elem.style.left = this.cells[n].point.x + 'px';
            this.cells[n].elem.style.top = this.cells[n].point.y + 'px';
            this.cells[n].elem.style.backgroundColor = '#' + this.cells[n].teamColor.hex;
            this.update();
        },

        checkContactsByField: function (num) {
            let r = this.cells[num].rangeRadius;
            for (let x = -r; x <= r; ++x) {
                for (let y = -r; y <= r; ++y) {
                    if (x * x + y * y <= r * r) {
                        let fx = this.cells[num].cPoint.x + x,
                            fy = this.cells[num].cPoint.y + y;
                        if (fx < 0 || fx >= 800 || fy < 0 || fy >= 800) { continue; }
                        if (this.positionsField[fx][fy] != -1 && this.positionsField[fx][fy] != num) {
                            let contactIndex = this.positionsField[fx][fy];
                            if (!this.cells[contactIndex].dead) {
                                ++this.contacts;
                                switch (this.mode) {
                                    case 'TB': this.teamBattle(num, contactIndex); break;
                                    case 'RB': this.rageBattle(num, contactIndex); break;
                                    case 'CB': this.colorBattle(num, contactIndex); break;    
                                }
                            }
                        }
                    }
                }
            }
        },

        moving: function () {
            for (let i = 0; i < this.cells.length; ++i) {
                if (this.cells[i].dead) { continue; }
                this.positionsField[this.cells[i].cPoint.x][this.cells[i].cPoint.y] = -1;
                this.cells[i].move();
                this.positionsField[this.cells[i].cPoint.x][this.cells[i].cPoint.y] = i;
                this.checkContactsByField(i);
            }
        },

        update: function () {
            let Gcount = 0;
            let container = document.getElementById('speed_container');
            container.innerHTML = '';
            let sum = 0;
            for (let item of this.cells) {
                if (item.dead) { continue; }
                sum += Math.sqrt(item.speed.x * item.speed.x + item.speed.y * item.speed.y);
                ++Gcount;
            }
            let avgSpeed = document.createElement('p');
            avgSpeed.classList.add('info_text');
            avgSpeed.innerText = (sum / Gcount).toFixed(6);
            container.appendChild(avgSpeed);

            container = document.getElementById('power_container');
            container.innerHTML = '';
            sum = 0;
            for (let item of this.cells) {
                if (item.dead) { continue; }
                sum += item.power;
            }
            let avgPower = document.createElement('p');
            avgPower.classList.add('info_text');
            avgPower.innerText = (sum / Gcount).toFixed(6);
            container.appendChild(avgPower);
            
            container = document.getElementById('counts_container');
            container.innerHTML = '';
            for (let color of this.colorsSet) {
                let count = 0;
                for (let item of this.cells) {
                    if (item.dead) { continue; }
                    if (color === item.teamColor.hex) { ++count; }
                }
                let countHTML = document.createElement('p');
                countHTML.innerHTML = '<span style="color:#' + color + '">#' + color + '</span>: ' + count;
                countHTML.classList.add('info_text');
                container.appendChild(countHTML);
            }
            let countHTML = document.createElement('p');
            countHTML.innerText = 'ALL: ' + Gcount;
            countHTML.classList.add('info_text');
            container.appendChild(countHTML);
        },

        teamBattle: function (a, b) {
            if (this.cells[a].teamColor.hex != this.cells[b].teamColor.hex) {
                if (this.cells[a].power > this.cells[b].power) {
                    this.positionsField[this.cells[b].cPoint.x][this.cells[b].cPoint.y] = -1;
                    this.cells[b].doDeath();
                    this.cells[a].power++;
                }
                else if (this.cells[b].power > this.cells[a].power) {
                    this.positionsField[this.cells[a].cPoint.x][this.cells[a].cPoint.y] = -1;
                    this.cells[a].doDeath();
                    this.cells[b].power++;
                }
            }
        },

        rageBattle: function (a, b) {
            if (this.cells[a].power > this.cells[b].power) {
                this.positionsField[this.cells[b].cPoint.x][this.cells[b].cPoint.y] = -1;
                this.cells[b].doDeath();
                this.cells[a].power++;
            }
            else if (this.cells[b].power > this.cells[a].power) {
                this.positionsField[this.cells[a].cPoint.x][this.cells[a].cPoint.y] = -1;
                this.cells[a].doDeath();
                this.cells[b].power++;
            }
        },

        colorBattle: function (a, b) {
            if (this.cells[a].power > this.cells[b].power) {
                let newColor = Object.create(ProtoColor);
                newColor.r = Math.ceil((this.cells[a].teamColor.r*2 + this.cells[b].teamColor.r)/3);
                newColor.g = Math.ceil((this.cells[a].teamColor.g*2 + this.cells[b].teamColor.g)/3);
                newColor.b = Math.ceil((this.cells[a].teamColor.b*2 + this.cells[b].teamColor.b)/3);
                this.cells[a].teamColor = newColor;
                this.cells[a].teamColor.getNewHEX();
                this.cells[a].recolor();
                this.cells[b].teamColor = newColor;
                this.cells[b].teamColor.getNewHEX();
                this.cells[b].recolor();
                this.cells[a].power++;
            }
            else if (this.cells[b].power > this.cells[a].power) {
                let newColor = Object.create(ProtoColor);
                newColor.r = Math.ceil((this.cells[b].teamColor.r*2 + this.cells[a].teamColor.r)/3);
                newColor.g = Math.ceil((this.cells[b].teamColor.g*2 + this.cells[a].teamColor.g)/3);
                newColor.b = Math.ceil((this.cells[b].teamColor.b*2 + this.cells[a].teamColor.b)/3);
                this.cells[a].teamColor = newColor;
                this.cells[a].teamColor.getNewHEX();
                this.cells[a].recolor();
                this.cells[b].teamColor = newColor;
                this.cells[b].teamColor.getNewHEX();
                this.cells[b].recolor();
                this.cells[b].power++;
            }
        },
    };

    let mainTimer, tact = 32, updTimer, updTact = 0;
    for (let i = 0; i < 810; ++i) {
        CellsObject.positionsField[i] = new Array(810);
        for (let j = 0; j < 810; ++j) {
            CellsObject.positionsField[i][j] = -1;
        }
    }

    btns.switch.addEventListener('click', (e) => {
        if (e.target.classList.contains('green_btn')) {
            e.target.textContent = 'Стоп';
            e.target.classList.remove('green_btn');
            e.target.classList.add('red_btn');
            mainTimer = setInterval(() => { CellsObject.moving(); }, tact);
            if (!isNaN(updTact) && updTact != 0) { updTimer = setInterval(() => { CellsObject.update(); }, updTact); }
        } else {
            e.target.textContent = 'Пуск';
            e.target.classList.remove('red_btn');
            e.target.classList.add('green_btn');
            clearInterval(mainTimer);
            clearInterval(updTimer);
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
        CellsObject.update();
    });

    btns.settings.btn.addEventListener('click', () => {
        btns.settings.context.classList.add('show');
        btns.settings.bg.style.zIndex = 0;
        btns.settings.bg.style.backgroundColor = 'rgba(0,0,0,0.5)';
    });
    btns.settings.bg.addEventListener('click', () => {
        btns.settings.context.classList.remove('show');
        btns.settings.bg.style.zIndex = -1;
        btns.settings.bg.style.backgroundColor = 'rgba(0,0,0,0)';
    });
    btns.settings.close.addEventListener('click', () => {
        btns.settings.context.classList.remove('show');
        btns.settings.bg.style.zIndex = -1;
        btns.settings.bg.style.backgroundColor = 'rgba(0,0,0,0)';
    });
    btns.settings.submit.addEventListener('click', () => {
        updTact = btns.settings.updTimeInput.value;
        let radioBtns = document.getElementsByName('mode');
        for (let item of radioBtns) {
            if (item.checked) {
                CellsObject.mode = item.value;
            }
        }
        btns.settings.context.classList.remove('show');
        btns.settings.bg.style.zIndex = -1;
        btns.settings.bg.style.backgroundColor = 'rgba(0,0,0,0)';
    });
});