const cjs = createjs;

window.global = window.global || {};
// 预加载图片
(function () {
    const preload = new cjs.LoadQueue(false, 'images/');

    const manifest = [
        // canvas
        {
            src: 'game-bg.png',
            id: 'game-bg'
        },
        {
            src: 'bot-bg.png',
            id: 'bot-bg'
        },
        {
            src: 'catchGlue.png',
            id: 'catchGlue'
        },
        {
            src: 'glue1.png',
            id: 'glue1'
        },
        {
            src: 'glue2.png',
            id: 'glue2'
        },
        {
            src: 'glue3.png',
            id: 'glue3'
        },
        // 首页

    ];

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


    $(".btn_wyy").click(function(){
        $(".page_affirm").show();
    });

    $(".page_affirm").click(function(){
        $(".qr_code").addClass('dOut');
        setTimeout(function(){
            $(".page_affirm").hide();
            $(".qr_code").removeClass('dOut');
        },600)

    });
    $(".qr_code").click(function(e){
        e.stopPropagation();
    });

})();

// 游戏
(function () {

    let stage = new cjs.Stage('game-view');
    // 背景容器
    let bgContainer = new cjs.Container();
    stage.addChild(bgContainer);
    // 汤圆容器
    const glueContainer = new cjs.Container();
    stage.addChild(glueContainer);

    //  时间倒计时
    let s, ms, timer, time, currentScore;
    currentScore = 0;
    const second = document.getElementById('second');
    const millisecond = document.getElementById('millisecond');
    const score = document.getElementById('score');
    $count = $('.count');
    hasCount = $count.html();

    function initBg() {
        // 背景图
        let bitBg = new cjs.Bitmap(global.imgLoadArr['game-bg']);
        bgContainer.addChild(bitBg);
        let botBg = new cjs.Bitmap(global.imgLoadArr['bot-bg']);
        botBg.y = 931;
        bgContainer.addChild(botBg);
        cjs.Touch.enable(stage);
        cjs.Ticker.setFPS(60);
        cjs.Ticker.addEventListener('tick', stage);
    }


    function Glue(glue) {
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

        this.autoMoveHander = () => {
            this.x -= this.speed;
            this.circle.x = this.x + 20;
            // console.log(this.regY)
            if (this.regY === 0) {
                cjs.Tween.get(this).to({regY: 30}, 200).to({regY: 0}, 200);
                cjs.Tween.get(this.circle).to({scale: .8}, 200).to({scale: 1}, 200);
            }
            if (this.x <= -126) {
                glueContainer.removeChild(this);
                this.removeAllEventListeners();
                if (s > 0) {
                    const n = parseInt(Math.random() * 3 + 1);
                    let g = new Glue(global.imgLoadArr['glue' + n]);
                    g.firstLoca = this.firstLoca;
                    g.y = this.firstLoca;
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

        this.downHander = (ev) => {
            this.removeEventListener('tick', this.autoMoveHander);
            this.downX = ev.rawX;
            this.downY = ev.rawY;
        };
        this.pressmoveHander = (ev) => {
            this.x = ev.rawX - this.downX + this.x;
            this.y = ev.rawY - this.downY + this.y;
            this.circle.x = this.x + 20;
            this.circle.y = this.y + 100;
            this.downX = ev.rawX;
            this.downY = ev.rawY;
            /** @namespace global.imgLoadArr.catchGlue */
            this.image = global.imgLoadArr.catchGlue;
        };

        this.addEventListener('tick', this.autoMoveHander);
        this.addEventListener('mousedown', this.downHander);
        this.addEventListener('pressmove', this.pressmoveHander);
        this.addEventListener('pressup', () => {
            console.log(this.y);
            this.image = glue;
            if (this.y > 950) {
                if (this.x > 70 && this.x < 600) {
                    //todo 加分
                    this.addScore = new cjs.Text('+10', '40px Arial', '#e9ffae');
                    this.addScore.y = this.y - 35;
                    this.addScore.x = this.x + 30;
                    cjs.Tween.get(this.addScore).to({regY: 20, alpha: 0}, 500);
                    glueContainer.addChild(this.addScore);
                    currentScore += 10;
                    score.innerHTML = currentScore;
                }
                this.removeAllEventListeners();
                glueContainer.removeChild(this.circle);
                const n = parseInt(Math.random() * 3 + 1);
                let g = new Glue(global.imgLoadArr['glue' + n]);
                g.y = this.firstLoca;
                g.firstLoca = this.firstLoca;
                g.circle.y = g.y + 100;
                glueContainer.addChild(g);
            } else {
                this.addEventListener('tick', this.autoMoveHander);
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

        for (let i = 0; i < 4; i++) {
            /** @namespace global.imgLoadArr.glue1 */
            const n = parseInt(Math.random() * 3 + 1);
            const g = new Glue(global.imgLoadArr['glue' + n]);
            g.y += i * 150;
            g.firstLoca = g.y;
            g.circle.y = g.y + 100;
        }
    }

    Glue.prototype = new cjs.Bitmap;
    window.global.initGame = initGame;
    window.global.initBg = initBg;

})();

