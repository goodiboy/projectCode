$(function(){
    const game = gameLoad();
    game.canPreload(preload_finish);
    function preload_finish(){
       $('.btn_start').click(function(){
          $('.pageIndex').fadeOut();
          $('.pageGame').fadeIn()
       });
       $('.btn_know').click(function () {
          $('.guide_mask').fadeOut();
          game.initGame(game_over)
       });

       /*游戏结束*/
       function game_over(){
           $('.success_mask').show()
       }
    }
});




function gameLoad() {
    class Game {
        canPreload(callback) {
            this.loadQueue = new createjs.LoadQueue(true, 'http://img.cl.z.xiao-bo.com/z/act/2019-070809/xmjd_zqhd/', true);
            const manifest = [
                {
                    src: 'game_bg.png',
                    id: 'game_bg'
                },
                {
                    src: 'logo.png',
                    id: 'logo'
                },
                {
                    src: 'avaWrap.png',
                    id: 'avaWrap'
                },
                {
                    src: 'ava.png',
                    id: 'ava'
                },
                {
                    src: 'jifen.png',
                    id: 'jifen'
                },
                {
                    src: 'timeDown.png',
                    id: 'timeDown'
                },
                {
                    src: 'music.png',
                    id: 'music'
                },
                {
                    src: 'game_bottom.png',
                    id: 'game_bottom'
                },
                {
                    src: '1.png',
                    id: 'ele1'
                },
                {
                    src: '2.png',
                    id: 'ele2'
                },
                {
                    src: '3.png',
                    id: 'ele3'
                },
                {
                    src: '4.png',
                    id: 'ele4'
                },
                {
                    src: '5.png',
                    id: 'ele5'
                },
                {
                    src: 'down3.png',
                    id: 'down3'
                },
                {
                    src: 'down4.png',
                    id: 'down4'
                },
                {
                    src: 'down5.png',
                    id: 'down5'
                },
                {
                    src: 'panda1.png',
                    id: 'panda1'
                },
                {
                    src: 'panda2.png',
                    id: 'panda2'
                },
                {
                    src: 'panda3.png',
                    id: 'panda3'
                }
            ];
            this.loadQueue.loadManifest(manifest);
            this.loadQueue.on("complete", event => {
                console.log(event);
                // this.initGame();
                callback();
            });
        }

        initGame(endCallback) {
            let interval = 0;
            /*添加的频率*/
            this.createFrequency = 70;
            /*下落的速度*/
            this.downSpeed = 2;
            /*倒计时*/
            this.time = 30;
            /*是否开始游戏*/
            this.underway = true;


            this.stage = new createjs.Stage('game');
            /*底部容器*/
            this.bottomContainer = new createjs.Container();
            /*背景容器*/
            this.container = new createjs.Container();
            /*掉落元素容器*/
            this.downContainer = new createjs.Container();
            /*将容器添加到舞台*/
            this.stage.addChild(this.downContainer, this.container, this.bottomContainer);
            this.grade = 0;
            /*添加底部的云背景*/
            this.bottomContainer.y = document.documentElement.clientHeight * 2 - 372;
            const bgBit = new createjs.Bitmap(this.loadQueue.getResult('game_bottom'));
            this.bottomContainer.addChild(bgBit);

            /*绘制logo*/
            const logo = new createjs.Bitmap(this.loadQueue.getResult('logo'));
            logo.x = 34;
            logo.y = 48;
            this.container.addChild(logo);

            /*绘制积分图标*/
            const jifen = new createjs.Bitmap(this.loadQueue.getResult('jifen'));
            jifen.x = 323;
            jifen.y = 90;
            this.container.addChild(jifen);

            /*绘制头像*/
            this.drawAva(this.container, this.loadQueue.getResult('ava'));

            /*绘制分数和用户名*/
            this.drawGrade(this.container, 'aaaaaaaaaaaaa');

            /*绘制倒计时*/
            this.drawTimeDown(this.container);

            /*绘制背景音乐开关*/
            this.switchMusic(this.container);

            /*创建点击的元素*/
            this.createClickElement(this.bottomContainer);

            /*绘制掉落的元素*/
            this.drawDownElement(this.downContainer);


            this.timer = setInterval(e => {
                if (this.time<=0){
                    clearInterval(this.timer);
                    this.gameEnd(endCallback);
                }else{
                    this.time--;
                    this.timeText.text = this.time + ' 秒';
                }
            }, 1000);

            createjs.Ticker.setFPS(80);
            createjs.Ticker.addEventListener('tick', () => {
                interval++;
                if (interval % this.createFrequency === 0 && this.underway) {
                    this.drawDownElement(this.downContainer);
                }
                this.stage.update();
            });
        }

        gameEnd(endCallback) {
            this.downContainer.removeAllChildren();
            this.underway = false;
            createjs.Ticker.removeEventListener('tick');
            endCallback&&endCallback();
        }


        /**
         * 绘制掉落的元素
         * @param container 父容器
         */
        drawDownElement(container) {
            /*表情随机数*/
            const rmd1 = Math.ceil(Math.random() * 5);
            /*位置随机数*/
            const rmd2 = Math.floor(Math.random() * 5);
            /*元素的包裹层*/
            const downElementWrap = new createjs.Container();
            downElementWrap.y = -140;
            // downElementWrap.y = 1100;
            downElementWrap.x = 40 + rmd2 * 140;
            downElementWrap.name = rmd1;
            /*创建表情*/
            const downElement = new createjs.Bitmap(this.loadQueue.getResult('ele' + rmd1));
            downElement.scale = 1.22;
            /*随机熊猫*/
            const rm3 = Math.ceil(Math.random() * 3);
            const panda1 = new createjs.Bitmap(this.loadQueue.getResult('panda' + rm3));
            panda1.y = -130;

            /*自动下落*/
            downElementWrap.addEventListener('tick', e => {
                downElementWrap.y += this.downSpeed;
                if (downElementWrap.y >= 1100) {
                    this.downContainer.removeChild(downElementWrap);
                    this.grade >= 10 ? this.grade -= 10 : this.grade;
                    this.text.text = this.grade + ' 分';
                }
            });
            downElementWrap.addChild(downElement, panda1);
            container.addChild(downElementWrap)
        }

        /*创建点击的元素*/
        createClickElement(container) {
            /*生成5个可点击元素*/
            for (let i = 0; i < 5; i++) {
                const clickElement = new createjs.Bitmap(this.loadQueue.getResult('ele' + (i + 1)));
                clickElement.name = i + 1;
                clickElement.y = 215;
                clickElement.x = 40 + i * 140;
                clickElement.addEventListener('click', e => {
                    console.log(clickElement.name);
                    for (let i = 0; i < this.downContainer.children.length; i++) {
                        if (this.downContainer.children[i].name === clickElement.name) {
                            this.downContainer.removeChild(this.downContainer.children[i]);
                            this.grade += 20;
                            this.text.text = this.grade + ' 分';
                            /*如果页面少于2个下落元素，则添加一个*/
                            if (this.downContainer.children.length < 2) {
                                this.drawDownElement(this.downContainer)
                            }
                            break;
                        }
                    }

                    this.grade >= 10 ? this.grade -= 10 : this.grade;
                    this.text.text = this.grade + ' 分';


                    /*不能使用forEach，forEach无法消灭一个之后停止循环*/
                    /* this.downContainer.children.forEach(item => {
                         console.log(item);
                         if (item.name === clickElement.name) {
                             this.downContainer.removeChild(item);
                         }
                     });*/
                });
                container.addChild(clickElement)
            }
        }

        /**
         * 背景音乐开关
         * @param container
         */
        switchMusic(container) {
            this.music = new createjs.Bitmap(this.loadQueue.getResult('music'));
            this.offMuisc = true;
            /*x,y要增加图片的偏移量的一半，设计稿x=639，y=54*/
            this.music.x = 675;
            this.music.y = 90;
            /*设置x，y的注册点（圆心）偏移量*/
            this.music.regY = 36;
            this.music.regX = 36;
            this.myMusicTween = createjs.Tween.get(this.music, {loop: true}).to({rotation: 360}, 3000);
            this.music.addEventListener('click', e => {


                createjs.Tween.removeTweens(this.music)


            });


            container.addChild(this.music)
        }

        /**
         * 绘制倒计时
         * @param container 容器
         */
        drawTimeDown(container) {
            /*闹钟*/
            const timeDown = new createjs.Bitmap(this.loadQueue.getResult('timeDown'));
            timeDown.x = 480;
            timeDown.y = 36;
            container.addChild(timeDown);
            /*倒计时数字*/
            this.timeText = new createjs.Text(this.time + ' 秒', "bold 22px Arial", "#ec2f25");
            this.timeText.x = 502;
            this.timeText.y = 76;
            container.addChild(this.timeText);
        }

        /**
         * 绘制分数和用户名
         * @param container 容器
         * @param name 用户名
         */
        drawGrade(container, name) {
            /*分数*/
            this.text = new createjs.Text(this.grade + ' 分', "24px Arial", "#fff");
            this.text.x = 361;
            this.text.y = 95;
            container.addChild(this.text);
            /*绘制用户名*/
            if (name) {
                const len = Game.getStrLen(name);
                /*如果用户名过长就截取前面3位*/
                if (len.countLen > 8) {
                    name = name.substr(0, 3) + '...';
                }
                const username = new createjs.Text(name, "bold 27px Arial", "#fff");
                username.x = 322;
                username.y = 49;
                container.addChild(username);
            }
        }

        /**
         * 获取字符的长度
         * @param str
         * @returns {{originalLen: number, chLen: number, countLen: number}}
         */
        static getStrLen(str) {
            let string = String(str);
            const reg = /[^\x00-\xff]/g;
            const chLen = string.match(reg) ? string.match(reg).length : 0;
            const originalLen = string.length;
            const countLen = string.replace(reg, 'aa').length;
            return {
                chLen,
                originalLen,
                countLen
            }
        }


        /**
         * 绘制头像
         * @param container 父容器
         * @param url 头像地址
         */
        drawAva(container, url) {
            const avaContainer = new createjs.Container();
            /*头像框*/
            const avaWrap = new createjs.Bitmap(this.loadQueue.getResult('avaWrap'));
            avaWrap.x = 204;
            avaWrap.y = 32;
            avaContainer.addChild(avaWrap);
            /*头像*/
            const ava = new createjs.Bitmap(url);
            ava.x = 209;
            ava.y = 39;
            avaContainer.addChild(ava);
            /*头像遮罩层*/
            const mask = new createjs.Shape();
            mask.graphics.beginFill('#fff').drawCircle(0, 0, 40).endFill();
            mask.alpha = 0.01;
            mask.x = 255;
            mask.y = 83;
            ava.mask = mask;
            avaContainer.addChild(mask);
            /*添加到容器*/
            container.addChild(avaContainer);
        }
    }


    // game.canPreload();
    return new Game();
}

