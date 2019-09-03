'use strict';

var cjs = createjs;

window.global = window.global || {};
// 预加载图片
(function () {
    var preload = new cjs.LoadQueue(false, 'images/');

    var manifest = [
    // canvas
    {
        src: 'game-bg.png',
        id: 'game-bg'
    }, {
        src: 'bot-bg.png',
        id: 'bot-bg'
    }, {
        src: 'catchGlue.png',
        id: 'catchGlue'
    }, {
        src: 'glue1.png',
        id: 'glue1'
    }, {
        src: 'glue2.png',
        id: 'glue2'
    }, {
        src: 'glue3.png',
        id: 'glue3'
    }];

    preload.loadManifest(manifest);
    preload.on("complete", function (event) {
        global.imgLoadArr = event.currentTarget._loadedResults;
        console.log(window.global.imgLoadArr);
    });
})();

(function () {
    $('.tips-mask').click(function () {
        $(this).hide();
        global.initGame();
    });

    $('.btn-rule').click(function () {
        $('.rule-mask').show();
    });

    $('.ok_close').click(function () {
        $('.rule-cont').removeClass('bounceIn').addClass('bounceOutDown');
        setTimeout(function () {
            $('.rule-mask').hide();
            $('.rule-cont').removeClass('bounceOutDown').addClass('bounceIn');
        }, 780);
    });

    $('.btn-start').click(function () {
        hasCount--;
        $count.html(hasCount);
        global.initBg();
        $('.page-game').fadeIn();
        $('.page-index').fadeOut();
    });

    $('#btn-restart').click(function () {
        $('.result-cont').removeClass('bounceIn').addClass('bounceOutDown');
        setTimeout(function () {
            $('.result-mask').hide();
            $('.result-cont').removeClass('bounceOutDown').addClass('bounceIn');
            hasCount--;
            $count.html(hasCount);
            global.initGame();
        }, 790);
    });

    $(".btn_wyy").click(function () {
        $(".page_affirm").show();
    });

    $(".page_affirm").click(function () {
        $(".qr_code").addClass('dOut');
        setTimeout(function () {
            $(".page_affirm").hide();
            $(".qr_code").removeClass('dOut');
        }, 600);
    });
    $(".qr_code").click(function (e) {
        e.stopPropagation();
    });
})();

// 游戏
(function () {

    var stage = new cjs.Stage('game-view');
    // 背景容器
    var bgContainer = new cjs.Container();
    stage.addChild(bgContainer);
    // 汤圆容器
    var glueContainer = new cjs.Container();
    stage.addChild(glueContainer);

    //  时间倒计时
    var s = void 0,
        ms = void 0,
        timer = void 0,
        time = void 0,
        currentScore = void 0;
    currentScore = 0;
    var second = document.getElementById('second');
    var millisecond = document.getElementById('millisecond');
    var score = document.getElementById('score');
    $count = $('.count');
    hasCount = $count.html();

    function initBg() {
        // 背景图
        var bitBg = new cjs.Bitmap(global.imgLoadArr['game-bg']);
        bgContainer.addChild(bitBg);
        var botBg = new cjs.Bitmap(global.imgLoadArr['bot-bg']);
        botBg.y = 931;
        bgContainer.addChild(botBg);
        cjs.Touch.enable(stage);
        cjs.Ticker.setFPS(60);
        cjs.Ticker.addEventListener('tick', stage);
    }

    function Glue(glue) {
        var _this = this;

        cjs.Bitmap.call(this, glue);
        // 330 - 725之间
        this.y = 330;
        this.x = 750;
        this.circle = new cjs.Shape();
        this.circle.graphics.beginFill('#000').drawEllipse(0, 0, 108, 45);
        this.circle.x = this.x + 20;
        this.circle.y = this.y + 100;
        this.circle.alpha = .1;

        this.firstLoca;

        // 控制速度
        this.speed = 3 + Math.random() * 2;
        if (s < 20) {
            this.speed = 6 + Math.random() * 2;
        } else if (s < 10) {
            this.speed = 9 + Math.random() * 2;
        }

        this.autoMoveHander = function () {
            _this.x -= _this.speed;
            _this.circle.x = _this.x + 20;
            // console.log(this.regY)
            if (_this.regY === 0) {
                cjs.Tween.get(_this).to({ regY: 30 }, 200).to({ regY: 0 }, 200);
                cjs.Tween.get(_this.circle).to({ scale: .8 }, 200).to({ scale: 1 }, 200);
            }
            if (_this.x <= -126) {
                glueContainer.removeChild(_this);
                _this.removeAllEventListeners();
                if (s > 0) {
                    var n = parseInt(Math.random() * 3 + 1);
                    var g = new Glue(global.imgLoadArr['glue' + n]);
                    g.firstLoca = _this.firstLoca;
                    g.y = _this.firstLoca;
                    g.circle.y = g.y + 100;
                    glueContainer.addChild(g);
                } else {
                    // 游戏结束
                    $('#result-score').html(currentScore);
                    $count.html(hasCount);
                    $('.result-mask').show();
                }
            }
        };

        this.downHander = function (ev) {
            _this.removeEventListener('tick', _this.autoMoveHander);
            _this.downX = ev.rawX;
            _this.downY = ev.rawY;
        };
        this.pressmoveHander = function (ev) {
            _this.x = ev.rawX - _this.downX + _this.x;
            _this.y = ev.rawY - _this.downY + _this.y;
            _this.circle.x = _this.x + 20;
            _this.circle.y = _this.y + 100;
            _this.downX = ev.rawX;
            _this.downY = ev.rawY;
            /** @namespace global.imgLoadArr.catchGlue */
            _this.image = global.imgLoadArr.catchGlue;
        };

        this.addEventListener('tick', this.autoMoveHander);
        this.addEventListener('mousedown', this.downHander);
        this.addEventListener('pressmove', this.pressmoveHander);
        this.addEventListener('pressup', function () {
            console.log(_this.y);
            _this.image = glue;
            if (_this.y > 950) {
                if (_this.x > 70 && _this.x < 600) {
                    //todo 加分
                    _this.addScore = new cjs.Text('+10', '40px Arial', '#e9ffae');
                    _this.addScore.y = _this.y - 35;
                    _this.addScore.x = _this.x + 30;
                    cjs.Tween.get(_this.addScore).to({ regY: 20, alpha: 0 }, 500);
                    glueContainer.addChild(_this.addScore);
                    currentScore += 10;
                    score.innerHTML = currentScore;
                }
                _this.removeAllEventListeners();
                glueContainer.removeChild(_this.circle);
                var n = parseInt(Math.random() * 3 + 1);
                var g = new Glue(global.imgLoadArr['glue' + n]);
                g.y = _this.firstLoca;
                g.firstLoca = _this.firstLoca;
                g.circle.y = g.y + 100;
                glueContainer.addChild(g);
            } else {
                _this.addEventListener('tick', _this.autoMoveHander);
            }
        });

        glueContainer.addChild(this.circle);
        glueContainer.addChild(this);
    }

    function initGame() {
        glueContainer.removeAllChildren();
        currentScore = 0;
        score.innerHTML = currentScore;
        time = 10000;
        s = 30;
        timer = setInterval(function () {
            time -= 150;
            s = parseInt(time / 1000);
            ms = (time % 1000).toString().substr(0, 2);
            ms = ms > 0 ? ms : '0';
            ms.length < 2 ? ms = 0 + ms : ms;
            s = s <= 9 ? '0' + s : s;
            second.innerHTML = s;
            millisecond.innerHTML = ms;
            // 游戏结束
            if (time <= 0) {
                clearInterval(timer);
            }
        }, 113);

        for (var i = 0; i < 4; i++) {
            /** @namespace global.imgLoadArr.glue1 */
            var n = parseInt(Math.random() * 3 + 1);
            var g = new Glue(global.imgLoadArr['glue' + n]);
            g.y += i * 150;
            g.firstLoca = g.y;
            g.circle.y = g.y + 100;
        }
    }

    Glue.prototype = new cjs.Bitmap();
    window.global.initGame = initGame;
    window.global.initBg = initBg;
})();

//# sourceMappingURL=game1-compile.js.map