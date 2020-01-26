//分数

//游戏
$(function () {
    (function () {
        const canvas = document.getElementById('game');
        canvas.addEventListener('touchstart', function (e) {
            e.preventDefault();
        });
        const cjs = createjs;
        const $loaded = $('#loaded');


        class Game {
            constructor() {
                //轨道数量
                this.musicNum = 4;
                //下滑速度
                this.speed = 10;
                this._ticks = 0;
                this.tickNum = 0;
                this.score = 0;
                this.time = 0;
                this.bgm = null;
                this.timeDownTimer = null;
                this.firstGame = true;
                this.audition = false;
                /**
                 * 每个轨道顶部的大小
                 * 388 赛道顶部的大小
                 * @type {number}
                 */
                this.trackWidthMin = 388 / this.musicNum;

                //每个轨道底部的大小
                this.trackWidthBig = canvas.width / 4;

                // 长线和短线的概率
                this.lineArr = [0, 1, 1];
            }

            preload() {
                this.queue = new cjs.LoadQueue(true, './assets/', true);
                // this.queue.installPlugin(createjs.Sound);
                const manifest = [
                    {
                        src: 'btn_color0.png',
                        id: 'btn_color0'
                    },
                    {
                        src: 'btn_color1.png',
                        id: 'btn_color1'
                    },
                    {
                        src: 'btn_color2.png',
                        id: 'btn_color2'
                    },
                    {
                        src: 'btn_color3.png',
                        id: 'btn_color3'
                    },
                    {
                        src: 'btn_click0.png',
                        id: 'btn_click0'
                    },
                    {
                        src: 'btn_click1.png',
                        id: 'btn_click1'
                    },
                    {
                        src: 'btn_click2.png',
                        id: 'btn_click2'
                    },
                    {
                        src: 'btn_click3.png',
                        id: 'btn_click3'
                    },
                    {
                        src: 'bar0_0.png?v1',
                        id: 'bar0_0'
                    },
                    {
                        src: 'bar0_1.png?v1',
                        id: 'bar0_1'
                    },
                    {
                        src: 'bar1_0.png?v1',
                        id: 'bar1_0'
                    },
                    {
                        src: 'bar1_1.png?v1',
                        id: 'bar1_1'
                    },
                    {
                        src: 'bar2_0.png?v1',
                        id: 'bar2_0'
                    },
                    {
                        src: 'bar2_1.png?v1',
                        id: 'bar2_1'
                    },
                    {
                        src: 'bar3_0.png?v1',
                        id: 'bar3_0'
                    },
                    {
                        src: 'bar3_1.png?v1',
                        id: 'bar3_1'
                    },
                    {
                        src: 'click_light0.png',
                        id: 'click_light0'
                    },
                    {
                        src: 'click_light1.png',
                        id: 'click_light1'
                    },
                    {
                        src: 'click_light2.png',
                        id: 'click_light2'
                    },
                    {
                        src: 'click_light3.png',
                        id: 'click_light3'
                    },
                    {
                        src: 'debris.png',
                        id: 'debris'
                    },
                    {
                        src: 'miss.png',
                        id: 'miss'
                    },
                    {
                        src: 'great.png',
                        id: 'great'
                    },
                    {
                        src: 'perfect.png',
                        id: 'perfect'
                    },
                    {
                        src: 'button-light.png',
                        id: 'button-light'
                    },
                    {
                        src: 'b_button_light.png',
                        id: 'b_button_light'
                    }

                ];
                this.queue.loadManifest(manifest);
                this.queue.on('progress', function (event) {
                    $loaded.html(parseInt(event.loaded * 100));
                });
                this.queue.on('complete', e => {
                    // this.init();
                    // this.init();
                    $('#preload').hide();
                    initSwiper()
                    console.log(this.queue);
                });
            }

            init(musicInfo) {

                cjs.Ticker.removeAllEventListeners();
                cjs.Sound.removeAllEventListeners();
                cjs.Sound.removeAllSounds();

                this.speed = musicInfo.speed;
                this.createTick = musicInfo.createTick;
                this.stage = new cjs.Stage('game');
                cjs.Touch.enable(this.stage);
                cjs.Ticker.timingMode = cjs.Ticker.RAF;
                //注册音乐
                createjs.Sound.alternateExtensions = ["mp3"];
                createjs.Sound.registerSounds([
                    {
                        src: "./assets/music" + musicInfo.index + ".mp3?v2",
                        id: "bgMusic"
                    }
                ]);
                cjs.Sound.on("fileload", this.registerBgm, this);
                //绘制得分状态
                this.status = new cjs.Bitmap(this.queue.getResult('perfect'));
                this.status.x = 130;
                this.status.y = -80;
                this.status.alpha = 0;
                this.stage.addChild(this.status);
                this.drawGameBtn();
                this.drawContainer();
                this.firstGame = false;


            }


            //重置游戏，重新开始
            reset(musicInfo) {
                console.log('reset');
                console.log(musicInfo);

                cjs.Ticker.removeAllEventListeners();
                cjs.Sound.removeAllEventListeners();
                cjs.Sound.removeAllSounds();
                // const musicInfo = musicArr[realIndex];
                this.speed = musicInfo.speed;
                this.createTick = musicInfo.createTick;
                this._ticks = 0;
                this.tickNum = 0;
                this.score = 0;
                this.time = 0;
                this.bgm = null;
                this.timeDownTimer = null;
                $('.score span').html(this.score);
                cjs.Sound.removeSound('bgMusic');
                cjs.Sound.registerSound("./assets//music" + musicInfo.index + ".mp3?v2", "bgMusic");
                cjs.Sound.on("fileload", this.registerBgm, this);
                console.log(this.score)
            }


            // 舞台主要的tick更新事件
            stageTickHandle() {
                //更速度创建元素
                // this.createTick = 100 - this.speed * 5 < 30 ? 30 : 100 - this.speed * 5;
                cjs.Ticker.addEventListener('tick', () => {
                    this.stage.update();
                    this.tickNum++;

                    if (cjs.Ticker._ticks - this._ticks >= 20)
                        this.status.alpha -= 0.1;
                    if (this.tickNum % this.createTick === 0) {
                        this.autoCreate()
                    }
                });
            }

            //注册音乐事件
            registerBgm(e) {
                console.log(e);
                if (e.id === 'bgMusic') {

                    if (!this.audition) {
                        cjs.Ticker.removeAllEventListeners();
                        $('.select_music_mask').hide();
                        $('.timeDown_wrap_mask').show();
                        const $b_down = $('.b_down');
                        $b_down.eq(0).show();
                        let time_down = 0;
                        const startDownTimer = setInterval(() => {
                            time_down++;
                            $b_down.eq(time_down).show().siblings().hide();
                            console.log(time_down)
                            if (time_down > 3) {
                                clearInterval(startDownTimer);
                                $('.timeDown_wrap_mask').hide();
                                $b_down.eq(3).hide();
                                this.bgm = cjs.Sound.play("bgMusic");
                                this.stageTickHandle();
                                console.log(Math.ceil(this.bgm.duration / 1000));
                                this.time = Math.ceil(this.bgm.duration / 1000);
                                // this.time = 10;
                                this.timeDownTimer = setInterval(() => {
                                    --this.time;
                                    if (this.time <= 0) {
                                        this.time = 0;
                                        clearInterval(this.timeDownTimer);
                                        this.over()
                                    }
                                    $('.time_down span').html(this.time);
                                }, 1000);
                            }
                        }, 1000);
                    } else {
                        this.bgm = cjs.Sound.play("bgMusic");
                    }
                    func_mask(false);
                }
            }


            //绘制底部点击的按钮
            drawGameBtn() {
                //按钮容器
                this.gameBtnContainer = new cjs.Container();
                //光容器
                this.lightContainer = new cjs.Container();
                this.stage.addChild(this.lightContainer, this.gameBtnContainer);
                // 获取一个按钮，用来调整位置
                const game_btn_img = this.queue.getResult('btn_click0');
                // 13 ：底部横线
                this.gameBtnContainer.y = canvas.height - game_btn_img.height - 13;

                //创建按钮，添加点击时间
                for (let i = 0; i < this.musicNum; i++) {

                    const btn_click = this.queue.getResult('btn_click' + i);
                    const click_light_img = this.queue.getResult('click_light' + i);
                    //每个按钮的x轴位置
                    const left = (this.trackWidthBig - btn_click.width) / 2 + (this.trackWidthBig * i);

                    //光
                    const click_light = new cjs.Bitmap(click_light_img);
                    click_light.x = left;
                    //调整最后一个轨道光的位置
                    if (i === 3) {
                        click_light.x -= 86;
                    }
                    //默认隐藏，点击才显示
                    click_light.visible = false;
                    this.lightContainer.addChild(click_light);
                    //底部点击按钮
                    const musicEle = new cjs.Bitmap(btn_click);
                    musicEle.y = 10;
                    musicEle.x = left;
                    //微调每个元素的位置
                    switch (i) {
                        case 0:
                            musicEle.x += 4;
                            break;
                        case 3:
                            musicEle.x -= 4;
                            break;
                    }
                    //碎片
                    const debris = new cjs.Bitmap(this.queue.getResult('debris'));
                    debris.x = left;
                    debris.y -= 50;
                    debris.scale = 0.8;
                    debris.visible = false;


                    // 按钮光
                    const button_light = new cjs.Bitmap(this.queue.getResult('b_button_light'));
                    button_light.x = left;
                    button_light.y -= 50;

                    button_light.visible = false;


                    switch (i) {
                        case 0:
                            button_light.x -= 40;
                            break;
                        case 1:
                            button_light.x -= 50;
                            break;
                        case 2:
                            button_light.x -= 60;
                            break;
                        case 3:
                            button_light.x -= 70;
                            break;
                    }

                    musicEle.addEventListener('mousedown', () => {
                        click_light.visible = true;
                        // cjs.Sound.play("sound");
                        for (let item of this.downContainer.children[i].children) {
                            if (item.y > this.gameBtnContainer.y - 60 && item.y < canvas.height - 13 + btn_click.height) {
                                debris.visible = true;
                                button_light.visible = true;
                                //记录点击时间
                                debris.showTime = cjs.Ticker._ticks;
                                item.children[0].addEventListener('tick', () => {
                                    if (!item.isMove) {
                                        //如果需要长按的进行消除线条，否则直接隐藏
                                        if (item.type === 1) {
                                            item.children[0].sourceRect.height -= this.speed * 3;
                                            item.children[0].y += this.speed * 3;
                                            switch (i) {
                                                case 0:
                                                    item.children[0].x -= this.speed / 2;
                                                    break;
                                                case 1:
                                                    item.children[0].x -= this.speed / 5;
                                                    break;
                                                case 2:
                                                    item.children[0].x += this.speed / 6;
                                                    break;
                                                case 3:
                                                    item.children[0].x += this.speed / 2;
                                                    break;
                                            }
                                            if (item.children[0].sourceRect.height < 0) {
                                                try {
                                                    item.parent.removeChild(item);
                                                    debris.visible = false;
                                                    button_light.visible = false;
                                                    this.judgeStatus(item, btn_click);
                                                } catch (e) {
                                                }
                                            }
                                        } else {
                                            item.visible = false;
                                            if (cjs.Ticker._ticks - debris.showTime >= 10) {
                                                debris.visible = false;
                                                button_light.visible = false;
                                            }
                                            // perfect
                                            this.judgeStatus(item, btn_click);
                                        }
                                    }
                                });
                                item.isMove = false;
                                break;
                            }
                        }
                    });


                    musicEle.addEventListener('pressup', () => {
                        //播放音乐
                        click_light.visible = false;
                        debris.visible = false;
                        button_light.visible = false;
                        //如果是隐藏状态的就将其隐藏
                        for (let item of this.downContainer.children[i].children) {
                            if (!item.isMove) {
                                if (!item.isVisible()) {
                                    try {
                                        item.parent.removeChild(item);
                                    } catch (e) {
                                    }
                                } else {
                                    item.isMove = true;
                                }
                            }
                        }
                    });
                    this.gameBtnContainer.addChild(button_light, musicEle, debris);
                }
            }


            //判断得分方法
            judgeStatus(item, btn_click) {
                if (item.y > this.gameBtnContainer.y + 30 && item.y < this.gameBtnContainer.y + btn_click.height) {
                    this.status.image = this.queue.getResult('perfect');
                    if (!item.addScore) {
                        item.addScore = true;
                        this.score += 20;
                    }
                } else {
                    this.status.image = this.queue.getResult('great');
                    if (!item.addScore) {
                        item.addScore = true;
                        this.score += 10;
                    }
                }
                $('.score span').html(this.score);
                this.status.alpha = 1;
                if (this.status.alpha === 1)
                    this._ticks = cjs.Ticker._ticks;
            }

            // 绘制4条轨道
            drawContainer() {
                this.downContainer = new cjs.Container();
                for (let i = 0; i < this.musicNum; i++) {
                    const container = new cjs.Container();
                    // 182 顶部距离左变的大小
                    container.x = this.trackWidthMin * i + 182;
                    this.downContainer.addChild(container);
                }
                this.stage.addChild(this.downContainer);
            }

            // 自由下落
            autoCreate() {
                //随机一个轨道
                let rmd = Game.random(this.musicNum);
                //变量该轨道是否有元素距离顶部的距离小于 200的，有的话则重新随机轨道
                const wrap = this.downContainer.children[rmd].children;
                if (wrap.length) {
                    let allow = wrap.some(item => {
                        let itemY = Game.getWrapDir(item);
                        return itemY <= 200;
                    });
                    if (allow) {
                        this.autoCreate();
                        return;
                    }
                }
                this.drawNote(rmd);
            }


            //绘制音符
            drawNote(i) {
                const eleWrap = new cjs.Container();
                //音符类型
                // eleWrap.type = 0;
                // eleWrap.type = 1;
                eleWrap.type = Game.random(2);
                const musicImg = this.queue.getResult('btn_color' + i);
                const musicEle = new cjs.Bitmap(musicImg);
                musicEle.name = 'musicEle';

                let barImg, bar;
                if (eleWrap.type === 1) {

                    const rmd = Game.random(3);

                    barImg = this.queue.getResult(`bar${i}_${this.lineArr[rmd]}`);
                    bar = new cjs.Bitmap(barImg);
                    bar.name = 'bar';
                    //设置可是区域是该图片的大小，后继长按的时候进行减短
                    bar.sourceRect = new createjs.Rectangle(0, 0, barImg.width, barImg.height);
                    bar.y = -barImg.height + musicImg.height / 2;
                    eleWrap.addChild(bar);
                }


                eleWrap.x = this.trackWidthMin / 2;
                eleWrap.isMove = true;
                eleWrap.addChild(musicEle);
                //计算比例
                const scale = this.trackWidthMin / this.trackWidthBig / 2;
                //设置缩放中心
                eleWrap.regY = musicImg.height / 2;
                eleWrap.regX = musicImg.width / 2;
                eleWrap.scale = scale;
                //  需要多少帧才能到达底部
                const s_tick = (canvas.height - musicImg.height / 2) / this.speed;
                //计算每一只缩放多少
                const s_val = (1 - scale) / s_tick;

                //0: 142  1:51

                /**
                 *  //顶部中间线的距离 减去 底部中间线
                 *  182 顶部距离左变的大小
                 *  计算每一帧移动多少位置
                 * @type {number}
                 */
                const m_tick = ((this.trackWidthMin * i + this.trackWidthMin / 2) - (this.trackWidthBig * i + this.trackWidthBig / 2) + 182) / s_tick;
                eleWrap.addEventListener('tick', () => {
                    if (eleWrap.isMove) {
                        if (eleWrap.scale < 1) {
                            eleWrap.scale += s_val;
                        } else {
                            eleWrap.scale = 1;
                        }
                        eleWrap.x -= m_tick;
                        eleWrap.y += this.speed;
                        let eleWrapY = Game.getWrapDir(eleWrap);
                        if (eleWrapY > canvas.height) {
                            this.status.image = this.queue.getResult('miss');
                            this.score >= 10 ? this.score -= 10 : this.score = 0;
                            $('.score span').html(this.score);
                            this.status.alpha = 1;
                            if (this.status.alpha === 1)
                                this._ticks = cjs.Ticker._ticks;
                            try {
                                eleWrap.parent.removeChild(eleWrap);
                            } catch (e) {
                            }
                        }
                    }
                });
                this.downContainer.children[i].addChild(eleWrap);

            }

            //计算音符的高度
            static getWrapDir(eleWrap) {
                let eleWrapY = eleWrap.y;
                if (eleWrap.type === 1) {
                    eleWrapY -= eleWrap.getChildByName('bar').sourceRect.height;
                } else {
                    eleWrapY -= eleWrap.getChildByName('musicEle').image.naturalHeight;
                }
                return eleWrapY;
            }

            over() {
                cjs.Sound.removeAllSounds();
                cjs.Ticker.removeAllEventListeners();
                cjs.Sound.removeAllEventListeners();
                clearInterval(this.timeDownTimer);
                this.status.alpha = 0;
                for (let item of this.downContainer.children) {

                    item.removeAllChildren();
                }
                this.stage.update();
            }

            //获得一个随机值
            static random(n) {
                return Math.floor(Math.random() * n);
            }
        }

        window.Game = Game;
        window.game = new Game();
        game.preload();
    })();


    //swiper选择歌曲
    function initSwiper() {
        musicArr = [
            {
                index:6,
                pic: './assets/music_img6.png',
                name: '长隆2016主题曲',
                difficulty: 2,
                speed: 14,
                createTick: 30
            },
            {
                index:5,
                pic: './assets/music_img5.png',
                name: '卡卡之歌',
                difficulty: 2,
                speed: 12,
                createTick: 40
            },

            {
                index:4,
                pic: './assets/music_img4.png',
                name: '长隆之约',
                difficulty: 2,
                speed: 16,
                createTick: 25
            },
            {
                index:1,
                pic: './assets/music_img1.png',
                name: '考拉之歌',
                difficulty: 1,
                speed: 8,
                createTick: 75
            },
            {
                index:2,
                pic: './assets/music_img2.png',
                name: '熊猫三宝',
                difficulty: 1,
                speed: 9,
                createTick: 45
            },
            {
                index:3,
                pic: './assets/music_img3.png',
                name: '友好大熊猫',
                difficulty: 1,
                speed: 7,
                createTick: 60
            },
        ];


        let html = '';
        for (let item of musicArr) {
            let difficulty = '';
            for (let j = 0; j < item.difficulty; j++) {
                difficulty += ' <img src="./assets/difficulty_star.png" class="difficulty_star" alt="">';
            }
            html += `
              <div class="swiper-slide">
                  <img src="${item.pic}" class="music_img" alt="">
                  <div class="music_name">歌曲 <span>${item.name}</span></div>
                  <div class="difficulty_wrap">
                      <span>难度</span>
                      ${difficulty}
                  </div>
              </div>`
        }
        $('.swiper-wrapper').html(html);
        const mySwiper = new Swiper('.swiper-container', {
            direction: 'horizontal', // 垂直切换选项
            // 如果需要前进后退按钮
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            init: false
        });
        $('.btn_selected').click(function () {
            func_mask(true);
            game.audition = false;
            if (game.firstGame) {
                game.init(musicArr[mySwiper.realIndex]);
            } else {
                game.reset(musicArr[mySwiper.realIndex]);
            }
        });
        $('.btn_try').click(function () {
            func_mask(true);
            game.audition = true;
            if (game.firstGame) {
                game.init(musicArr[mySwiper.realIndex]);
            } else {
                game.reset(musicArr[mySwiper.realIndex]);
            }
        });
    };

    function func_mask(do_show, msg) {
        $(".page_weui_loading_toast").remove();
        $(".ex-dimmer").remove();

        if (!$("body").hasClass('style'))
        {
            var _sty = '<style>.page_loading{position:fixed;top:0;left:0;right:0;bottom:0;z-index:5000;font-size:15px}.page_loading,.page_weui-toast.loading{display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;-webkit-justify-content:center;justify-content:center}.page_weui-loading_box{-webkit-flex-direction:column;flex-direction:column}.page_weui-toast.loading{width:120px;min-height:120px;text-align:center;border-radius:5px;color:#fff;background:rgba(17,17,17,0.7)}.page_weui-loading{width:38px;height:38px;display:inline-block;vertical-align:middle;-webkit-animation:weuiLoading 1s steps(12,end) infinite;animation:weuiLoading 1s steps(12,end) infinite;background:transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=) no-repeat;background-size:100%;vertical-align:baseline}.page_weui_loading_toast.page_loading .page_weui_toast__content{margin:0;margin-top:5px;}.page_weui_loading_toast.page_loading .page_weui-loading{margin:0}@-webkit-keyframes weuiLoading{0%{-webkit-transform:rotate3d(0,0,1,0deg);transform:rotate3d(0,0,1,0deg)}100%{-webkit-transform:rotate3d(0,0,1,360deg);transform:rotate3d(0,0,1,360deg)}}@keyframes weuiLoading{0%{-webkit-transform:rotate3d(0,0,1,0deg);transform:rotate3d(0,0,1,0deg)}100%{-webkit-transform:rotate3d(0,0,1,360deg);transform:rotate3d(0,0,1,360deg)}}</style>';
            $("body").append(_sty).addClass('style');
        }


        if ($('body').css('animation-name') == 'seui')
        {
            func_mask__sui(do_show, msg);
            return;
        }


        if (do_show)
        {
            var msg_html = '<p class="page_weui_toast__content">加载中</p>';
            var msg_loading_style = '';
            if (msg)
            {
                msg_html = '<p class="page_weui_toast__content">' + msg + '</p>';
            }

            var _html = '<div class="page_weui_loading_toast page_loading">' +
                '<div class="page_weui-toast loading">' +
                '<div class="page_weui-loading_box">' +
                '<i class="page_weui-loading"></i>' +
                msg_html +
                '</div>' +
                '</div>' +
                '</div>';
            $("body").append(_html);

        }
    }
});


