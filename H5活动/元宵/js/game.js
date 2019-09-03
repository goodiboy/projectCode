let cjs = createjs;

let stage = new cjs.Stage('game-view');

let rect = new cjs.Shape();
rect.graphics.beginFill('#f5f5f5').drawRect(0, 0, 750, 1206);
stage.addChild(rect);
cjs.Touch.enable(stage);
cjs.Ticker.setFPS(60);
cjs.Ticker.addEventListener('tick', stage);


// 时间

let sound, ms, timer, time;
const timedown = document.getElementById('timedown');


function Dumplings() {
    cjs.Shape.call(this);

    this.color = this.graphics.beginFill('red').command;
    this.graphics.drawCircle(0, 0, 60);
    this.x = 780;
    this.y = 300;
    console.log(sound);
    if (sound === undefined || sound >= 20) {
        this.speed = 1 + Math.random() * 2;
    } else if (sound >= 15 && sound >= 8) {
        this.speed = 4 + Math.random() * 2;
    } else {
        this.speed = 6 + Math.random() * 2;
    }

    this.autoMoveHander = () => {
        this.x -= this.speed;
        if (this.x <= -30) {
            stage.removeChild(this);
            this.removeAllEventListeners();
            if (sound > 0) {
                let c = new Dumplings();
                c.y = this.y;
                stage.addChild(c);
            }
        }
    };

    this.downHander = (ev) => {
        this.removeEventListener('tick', this.autoMoveHander);
        this.downX = ev.rawX;
        this.downY = ev.rawY;
    };
    this.pressmoveHander = (ev) => {
        this.color.style = 'green';
        this.x = ev.rawX - this.downX + this.x;
        this.y = ev.rawY - this.downY + this.y;
        this.downX = ev.rawX;
        this.downY = ev.rawY;
    };

    this.addEventListener('tick', this.autoMoveHander);
    this.addEventListener('mousedown', this.downHander);
    this.addEventListener('pressmove', this.pressmoveHander);
    this.addEventListener('pressup', () => {
        if (this.y > 1000) {
            this.color.style = 'yellow';
            this.removeAllEventListeners();
            let c = new Dumplings();
            c.y = Math.random() * 300 + 300;
            stage.addChild(c);
        } else {
            this.color.style = 'red';
            this.addEventListener('tick', this.autoMoveHander);
        }
    });
}

Dumplings.prototype = new cjs.Shape();


initGame();

function initGame() {
    let DumpArr = [];
    for (let i = 0; i < 4; i++) {
        let c = new Dumplings();
        c.y += i * 150;
        stage.addChild(c);
        DumpArr.push(c);
    }

    time = 10000;
    timer = setInterval(function () {
        time -= 150;
        sound = parseInt(time / 1000);
        ms = (time % 1000).toString().substr(0, 2);
        ms = ms > 0 ? ms : '0';
        ms.length < 2 ? ms = 0 + ms : ms;
        timedown.innerHTML = sound + ':' + ms;
        if (time <= 0) {
            clearInterval(timer);
        }
    }, 113);
}


// stage.update();


