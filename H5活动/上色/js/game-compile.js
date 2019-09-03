"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$(function () {
    var cjs = createjs;
    var itemObjectSize = 10;
    var game = 2;
    //配置颜色
    var eastColor = [{
        display: "朱\n砂",
        color: "#e9473b",
        audio: "e9473b"
    }, {
        display: "靛\n青\n蓝",
        color: "#094b85",
        audio: "094b85"
    }, {
        display: "灰\n茶",
        color: "#905a3d",
        audio: "905a3d"
    }, {
        display: "淡\n珊\n瑚",
        color: "#e58887",
        audio: "e58887"
    }, {
        display: "藤\n黄",
        color: "#eb992f",
        audio: "eb992f"
    }, {
        display: "竹\n青",
        color: "#789262",
        audio: "789262"
    }];
    var westColor = [{
        display: "薄\n荷\n绿",
        color: "#12aa9c",
        audio: "12aa9c"
    }, {
        display: "天\n蓝",
        color: "#4c8fb9",
        audio: "4c8fb9"
    }, {
        display: "柠\n檬\n黄",
        color: "#f6ea21",
        audio: "f6ea21"
    }, {
        display: "葡\n萄\n紫",
        color: "#9d2f95",
        audio: "9d2f95"
    }, {
        display: "橙\n红\n色",
        color: "#d6623a",
        audio: "d6623a"
    }, {
        display: "玫\n瑰\n红",
        color: "#bd365e",
        audio: "bd365e"
    }];

    initSwiper();

    function initSwiper() {
        var mySwiper = new Swiper('.swiper-container', {
            direction: 'horizontal', // 垂直切换选项
            loop: true, // 循环模式选项
            effect: 'coverflow',
            slidesPerView: 1,
            centeredSlides: true,
            coverflowEffect: {
                rotate: 0,
                stretch: 30,
                depth: 150,
                modifier: 2,
                slideShadows: false
            },
            // 如果需要分页器
            pagination: {
                el: '.swiper-pagination'
            }
        });

        $('.choose_submit').on('click', function () {
            // new initGame(mySwiper.activeIndex);
            $('.load_page').fadeIn();
            preloadImg(mySwiper.realIndex + 1);
        });
    }

    // preloadImg(1);

    //预加载
    function preloadImg(chooseIdex) {
        var queue = new cjs.LoadQueue(false, 'http://img.wx.xiao-bo.com/z/_common/H5temp/tuya/', true);
        var $progress = $('#progress');
        //配置图片
        var manifest = [{
            src: "canvas_" + chooseIdex + "_1.png",
            id: "canvas_1"
        }, {
            src: "canvas_" + chooseIdex + "_2.png",
            id: "canvas_2"
        }, {
            src: "canvas_" + chooseIdex + "_3_1.png",
            id: "canvas_3_1"
        }, {
            src: "canvas_" + chooseIdex + "_3_2.png",
            id: "canvas_3_2"
        }, {
            src: "canvas_" + chooseIdex + "_3_3.png",
            id: "canvas_3_3"
        }, {
            src: "canvas_" + chooseIdex + "_3_4.png",
            id: "canvas_3_4"
        }, {
            src: "canvas_" + chooseIdex + "_3_5.png",
            id: "canvas_3_5"
        }, {
            src: "canvas_" + chooseIdex + "_3_6.png",
            id: "canvas_3_6"
        }, {
            src: "canvas_" + chooseIdex + "_3_7.png",
            id: "canvas_3_7"
        }, {
            src: "canvas_" + chooseIdex + "_3_8.png",
            id: "canvas_3_8"
        }, {
            src: "canvas_" + chooseIdex + "_3_9.png",
            id: "canvas_3_9"
        }, {
            src: "canvas_" + chooseIdex + "_3_10.png",
            id: "canvas_3_10"
        }, {
            src: "fill_top_bg.png",
            id: "fill_top_bg"
        }, {
            src: "fill_bottom_bg_bottom.png",
            id: "fill_bottom_bg_bottom"
        }, {
            src: "fill_bottom_text.png",
            id: "fill_bottom_text"
        }, {
            src: "fill_top_create_button.png",
            id: "fill_top_create_button"
        }, {
            src: "fill_top_finish_button.png",
            id: "fill_top_finish_button"
        }, {
            src: "east_button.png",
            id: "east_button"
        }, {
            src: "west_button.png",
            id: "west_button"
        }];
        queue.loadManifest(manifest);
        queue.on("progress", function (event) {
            var p = parseInt(event.progress * 100);
            $progress.css('height', p + '%');
        }, this);
        queue.on("complete", function (event) {
            game = new InitGame(this, chooseIdex, eastColor, westColor);

            $('.result_again').on('click', function () {
                $('.poster_wrap').fadeOut();
                game.resetGame();
            });
        });
    }

    function func_guide() {
        var $guide = $('.guide');
        var $page_guide = $('.page_guide');
        var guide_len = $guide.length;
        var guideIndex = 0;
        $('.game_page').show();
        $('.load_page').fadeOut();
        $('.select_page').hide();
        $page_guide.show().click(function () {
            $guide.eq(guideIndex).hide().next().show();
            guideIndex++;
            if (guideIndex >= guide_len) {
                $(this).hide();
            }
        });
        $('.guide_close').click(function () {
            $page_guide.hide();
        });
    }

    var InitGame = function () {
        function InitGame(queue, chooseIdex, eastColor, westColor) {
            _classCallCheck(this, InitGame);

            //颜色1
            this._eastColor = eastColor;
            this._westColor = westColor;
            //舞台
            this._stage = new cjs.Stage('game');
            //queue加载对象
            this._queue = queue;

            this.resetGame();
            //初始化游戏
            InitGame.guideGame();
            //刷新舞台
            cjs.Ticker.addEventListener('tick', this._stage);
        }

        //初始化静态背景


        InitGame.prototype.initBg = function initBg() {
            //背景1
            var bgBmp1 = new cjs.Bitmap(this._queue.getResult('canvas_1'));
            //背景2
            var bgBmp2 = new cjs.Bitmap(this._queue.getResult('canvas_2'));
            this._bgContainer.addChild(bgBmp1, bgBmp2);

            //头部背景
            var fillTop = new cjs.Bitmap(this._queue.getResult('fill_top_bg'));
            //底部背景
            var fillBottom = new cjs.Bitmap(this._queue.getResult('fill_bottom_bg_bottom')).set({ y: 790 });
            //选择提示字
            var fill_bottom_text = new cjs.Bitmap(this._queue.getResult('fill_bottom_text')).set({ y: 810 });
            this._fillBgContainer.addChild(fillTop, fillBottom, fill_bottom_text);
        };

        //初始化可改变颜色背景


        InitGame.prototype.initChangeBg = function initChangeBg() {
            var _this = this;

            var _loop = function _loop(i) {
                var itemObject = new cjs.Bitmap(_this._queue.getResult("canvas_3_" + i));
                //获取图片的大小

                var _itemObject$getBounds = itemObject.getBounds(),
                    width = _itemObject$getBounds.width,
                    height = _itemObject$getBounds.height;
                //缓存图片


                itemObject.cache(0, 0, width, height);
                //点击的时候替换颜色
                itemObject.addEventListener('pressup', function () {
                    //如果当前颜色和要填充的颜色一致，则恢复没有填充状态，否则填充颜色
                    if (itemObject._currentColor === _this._fillColor) {
                        itemObject._currentColor = {
                            r: 255,
                            g: 255,
                            b: 255
                        };
                    } else {
                        itemObject._currentColor = _this._fillColor;
                    }
                    //通过滤镜修改颜色
                    itemObject.filters = [new cjs.ColorFilter(0, 0, 0, 1, itemObject._currentColor.r, itemObject._currentColor.g, itemObject._currentColor.b, 0)];
                    //更新缓存
                    itemObject.updateCache();
                });
                _this._itemObjectContainer.addChild(itemObject);
            };

            for (var i = itemObjectSize; i >= 1; i--) {
                _loop(i);
            }
        };

        //创建颜色按钮


        InitGame.prototype.createColorButton = function createColorButton(colors) {
            var _this2 = this;

            this._colorButtonContainer.removeAllChildren();

            var _loop2 = function _loop2(i) {
                var buttons = new cjs.Container().set({ x: i * (70 + 50) + 80 });
                var shape = new createjs.Shape();
                shape.graphics.beginFill(colors[i].color).drawCircle(0, 0, 32);
                shape.addEventListener('pressup', function () {
                    _this2._fillColor = InitGame.getRBGFromHex(shape.graphics._fill.style);
                });
                var text = new cjs.Text(colors[i].display, "14px Arial", "#fff");
                text.y = -text.getMeasuredHeight() / 2;
                text.textAlign = 'center';
                text.lineHeight = 16;
                buttons.addChild(shape, text);
                _this2._colorButtonContainer.addChild(buttons);
            };

            for (var i = 0; i < colors.length; i++) {
                _loop2(i);
            }
        };

        //功能按钮
        InitGame.prototype.initToolButton = function initToolButton() {
            var _this3 = this;

            var finishBtn = this.createToolButton(this._queue.getResult('fill_top_finish_button'), 432);
            var createBtn = this.createToolButton(this._queue.getResult('fill_top_create_button'), 0);
            var east_button = this.createToolButton(this._queue.getResult('east_button'), 10, 930);
            var west_button = this.createToolButton(this._queue.getResult('west_button'), 320, 930);

            //完成按钮
            finishBtn.addEventListener('pressup', function () {
                //生成海报之前隐藏按钮
                _this3._stage.getChildByName('toolMaxContainer').visible = false;
                $('#game').attr('height', 809);
                setTimeout(function () {
                    $('#poster').prop('src', _this3._stage.toDataURL());
                    //海报生成完毕之后显示按钮
                    _this3._stage.getChildByName('toolMaxContainer').visible = true;
                    //恢复高度
                    $('#game').attr('height', 1128);
                    $('.poster_wrap').css('display', 'flex');
                }, 200);
            });

            createBtn.addEventListener('pressup', function () {
                var children = _this3._itemObjectContainer.children;
                for (var _iterator = children, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
                    var _ref;

                    if (_isArray) {
                        if (_i >= _iterator.length) break;
                        _ref = _iterator[_i++];
                    } else {
                        _i = _iterator.next();
                        if (_i.done) break;
                        _ref = _i.value;
                    }

                    var item = _ref;

                    //随机颜色分组
                    var group = Math.round(Math.random());
                    var fillColor = void 0;
                    if (group) {
                        //获取颜色分组的随机颜色
                        var r = Math.floor(Math.random() * _this3._westColor.length);
                        fillColor = InitGame.getRBGFromHex(_this3._westColor[r].color);
                    } else {
                        var _r = Math.floor(Math.random() * _this3._eastColor.length);
                        fillColor = InitGame.getRBGFromHex(_this3._eastColor[_r].color);
                    }
                    //填充颜色
                    item.filters = [new cjs.ColorFilter(0, 0, 0, 1, fillColor.r, fillColor.g, fillColor.b, 0)];
                    //更新缓存
                    item.updateCache();
                }
            });

            //选择中式颜色
            west_button.addEventListener('pressup', function () {
                _this3.createColorButton(_this3._westColor);
                east_button.alpha = 0.7;
            });

            //选择西式颜色
            east_button.addEventListener('pressup', function () {
                _this3.createColorButton(_this3._eastColor);
                west_button.alpha = 0.7;
            });
        };

        //封装功能按钮函数


        InitGame.prototype.createToolButton = function createToolButton(id, x) {
            var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            var toolBtn = new cjs.Bitmap(id).set({ x: x, y: y });

            var _toolBtn$getBounds = toolBtn.getBounds(),
                width = _toolBtn$getBounds.width,
                height = _toolBtn$getBounds.height;

            var rectArea = new cjs.Shape();
            //添加点击区域
            rectArea.graphics.beginFill('#fff').drawRect(0, 0, width, height);
            toolBtn.hitArea = rectArea;
            this._toolButtonContainer.addChild(toolBtn);
            return toolBtn;
        };

        //格式化颜色


        InitGame.getRBGFromHex = function getRBGFromHex(f) {
            var e = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
            var d = f.toLowerCase();
            var b = {
                r: 0,
                g: 0,
                b: 0
            };
            if (d && e.test(d)) {
                if (d.length === 4) {
                    var g = "#";
                    for (var c = 1; c < 4; c += 1) {
                        g += d.slice(c, c + 1).concat(d.slice(c, c + 1));
                    }
                    d = g;
                }
                var a = [];
                for (var _c = 1; _c < 7; _c += 2) {
                    a.push(parseInt("0x" + d.slice(_c, _c + 2)));
                }
                b.r = a[0];
                b.g = a[1];
                b.b = a[2];
                return b;
            } else {
                return d;
            }
        };

        //重新游戏


        InitGame.prototype.resetGame = function resetGame() {
            //删除全部子元素
            this._stage.removeAllChildren();
            //涂鸦背景容器
            this._itemObjectContainer = new cjs.Container(); //set({y:20})
            //背景容器
            this._bgContainer = new cjs.Container();

            // 工具容器的最外包裹层，便于生成海报是隐藏所以按钮
            this._toolMaxContainer = new cjs.Container();
            this._toolMaxContainer.name = 'toolMaxContainer';
            //填充容器
            this._fillBgContainer = new cjs.Container();
            //工具按钮容器
            this._toolButtonContainer = new cjs.Container();
            //按钮容器
            this._colorButtonContainer = new cjs.Container().set({ y: 885 });
            //将填充层，按钮层，全部添加到工具包裹层
            this._toolMaxContainer.addChild(this._fillBgContainer, this._toolButtonContainer, this._colorButtonContainer);
            //把容器添加到舞台
            this._stage.addChild(this._itemObjectContainer, this._bgContainer, this._toolMaxContainer);

            //默认颜色
            this._fillColor = {
                r: 255,
                g: 255,
                b: 255
            };
            //初始化静态背景
            this.initBg();
            //初始化工具按钮
            this.initToolButton();
            //初始化可改变颜色背景
            this.initChangeBg();
            // 初始化按钮
            this.createColorButton(this._eastColor);
        };

        // 引导游戏


        InitGame.guideGame = function guideGame() {
            var $guide = $('.guide');
            var $page_guide = $('.page_guide');
            var guide_len = $guide.length;
            var guideIndex = 0;
            $('.game_page').fadeIn();
            $('.load_page').hide();
            $('.select_page').hide();
            $page_guide.show().click(function () {
                $guide.eq(guideIndex).hide().next().show();
                guideIndex++;
                if (guideIndex >= guide_len) {
                    $(this).hide();
                }
            });
            $('.guide_close').click(function () {
                $page_guide.hide();
            });
        };

        return InitGame;
    }();
});

//# sourceMappingURL=game-compile.js.map