gameLoad();

function gameLoad() {

    class Game {
        canPreload() {
            this.loadQueue = new createjs.LoadQueue(true, './images/', true);
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
                }
            ];
            this.loadQueue.loadManifest(manifest);
            this.loadQueue.on("complete", event => {
                console.log(event);
                this.initGame();
            });
        }

        initGame() {
            this.stage = new createjs.Stage('game');
            this.bgContainer = new createjs.Container();
            this.topContainer = new createjs.Container();
            this.stage.addChild(this.bgContainer, this.topContainer);
            this.grade = 0;
            this.offMuisc = true;
            /*添加背景*/
            const bgBit = new createjs.Bitmap(this.loadQueue.getResult('game_bg'));
            // this.bgContainer.addChild(bgBit);

            /*绘制logo*/
            const logo = new createjs.Bitmap(this.loadQueue.getResult('logo'));
            logo.x = 34;
            logo.y = 48;
            this.topContainer.addChild(logo);

            /*绘制积分图标*/
            const jifen = new createjs.Bitmap(this.loadQueue.getResult('jifen'));
            jifen.x = 323;
            jifen.y = 90;
            this.topContainer.addChild(jifen);

            /*绘制头像*/
            this.drawAva(this.topContainer, this.loadQueue.getResult('ava'));

            /*绘制分数和用户名*/
            this.drawGrade(this.topContainer, 'aaaaaaaaaaaaa');

            /*绘制倒计时*/
            this.drawTimeDown(this.topContainer);

            /*绘制背景音乐开关*/
            this.switchMusic(this.topContainer);

            createjs.Ticker.addEventListener('tick', () => {
                this.stage.update();
            });
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

                /*if (this.offMuisc){
                    this.offMuisc = false;
                    this.myMusicTween.pause();
                    console.log(1);
                }else{
                    this.offMuisc = true;
                    this.myMusicTween.play();
                    console.log(2);
                }*/

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
            this.time = new createjs.Text('30 秒', "bold 22px Arial", "#ec2f25");
            this.time.x = 502;
            this.time.y = 76;
            container.addChild(this.time);
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

    window.game = new Game();
    game.canPreload();
}

