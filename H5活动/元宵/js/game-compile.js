'use strict';

var cjs = createjs;

var stage = new cjs.Stage('game-view');

var rect = new cjs.Shape();
rect.graphics.beginFill('#f5f5f5').drawRect(0, 0, 750, 1206);
stage.addChild(rect);
cjs.Touch.enable(stage);
cjs.Ticker.setFPS(60);
cjs.Ticker.addEventListener('tick', stage);

// 时间

var sound = void 0,
    ms = void 0,
    timer = void 0,
    time = void 0;
var timedown = document.getElementById('timedown');

function Dumplings() {
    var _this = this;

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

    this.autoMoveHander = function () {
        _this.x -= _this.speed;
        if (_this.x <= -30) {
            stage.removeChild(_this);
            _this.removeAllEventListeners();
            if (sound > 0) {
                var c = new Dumplings();
                c.y = _this.y;
                stage.addChild(c);
            }
        }
    };

    this.downHander = function (ev) {
        _this.removeEventListener('tick', _this.autoMoveHander);
        _this.downX = ev.rawX;
        _this.downY = ev.rawY;
    };
    this.pressmoveHander = function (ev) {
        _this.color.style = 'green';
        _this.x = ev.rawX - _this.downX + _this.x;
        _this.y = ev.rawY - _this.downY + _this.y;
        _this.downX = ev.rawX;
        _this.downY = ev.rawY;
    };

    this.addEventListener('tick', this.autoMoveHander);
    this.addEventListener('mousedown', this.downHander);
    this.addEventListener('pressmove', this.pressmoveHander);
    this.addEventListener('pressup', function () {
        if (_this.y > 1000) {
            _this.color.style = 'yellow';
            _this.removeAllEventListeners();
            var c = new Dumplings();
            c.y = Math.random() * 300 + 300;
            stage.addChild(c);
        } else {
            _this.color.style = 'red';
            _this.addEventListener('tick', _this.autoMoveHander);
        }
    });
}

Dumplings.prototype = new cjs.Shape();

initGame();

function initGame() {
    var DumpArr = [];
    for (var i = 0; i < 4; i++) {
        var c = new Dumplings();
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

//# sourceMappingURL=game-compile.js.map