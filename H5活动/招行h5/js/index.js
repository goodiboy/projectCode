window.global_data = {
    wageIncrease: '90%',
    sex:'男',
    sexClass:'man'
};

$(function () {
    if (window.global_data.sex == '女'){

        $('.gif_png').addClass('girl1');
        window.global_data.sexClass = 'girl';
        $('.item6-person').prop('src',"http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/item6-girl.png");
        $('.item1-card').addClass('item1-card2');
        $('.item1-person').addClass('item1-girl');
        $('.item7-man').prop('src','http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/item7-girl.gif');
    }else{
        $('.gif_png').addClass('man1');
        window.global_data.sexClass = 'man';
        $('.item6-person').prop('src',"http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/item6-man.png");
        $('.item1-card').addClass('item1-card1');
        $('.item1-person').addClass('item1-man');

    }



    // $('.item6-person').prop('src',"http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/item6-man.png");
    // $('.item1-card').addClass('item1-card1');
    // $('.item1-person').addClass('item1-man');

    var audio = document.getElementById('bgm');
    document.addEventListener("WeixinJSBridgeReady", function () {
        //音频播放
        audio.play();
    }, false);

    $(".audio-icon").click(function () {
        // console.log(audio);
        if (audio.paused) {
            audio.play(); // 播放
            $(this).addClass('rotate');
        } else {
            audio.pause();// 暂停
            $(this).removeClass('rotate');
        }
    });
    function Page1() {


        $('.page1').show().addClass('page-active');
        var $man = $('.p1-man-wrap').find('img');
        var $projection = $('.projection');
        var _timer = null;
        var _manIndex = 0;
        var _manLen = $man.length;
        var _autoMoveTimer = null;
        var autoMoveNum = 0;
        $man.eq(_manIndex).fadeIn(1000);
        _timer = setInterval(function () {
            $man.eq(_manIndex).fadeOut(1000);
            _manIndex >= _manLen - 1 ? _manIndex = 0 : _manIndex++;
            $man.eq(_manIndex).fadeIn(1000);
        }, 2000);
        setTimeout(function () {

            setTimeout(function () {
                $('.timg').hide();
                $('.projection').fadeIn(1000);
                $('.btn-start-wrap').fadeIn();
                setTimeout(function(){
                    autoMove();
                },1200);
            }, 1000);
            $('.timg').show();
            // wx.ready(function(){
            //
            //     var xuehua = document.querySelector('#xuehua');
            //     xuehua.play();
            //     if (xuehua.currentTime >= 1){
            //         xuehua.pause();
            //
            //     }
            // });

        }, 2000);

        function autoMove() {
            autoMoveNum -= 0.2;
            $('.projection').css('background-position', autoMoveNum + 'px 0');
            _autoMoveTimer = requestAnimationFrame(autoMove);
        }

        $('.btn-start-wrap').click(function () {
            cancelAnimationFrame(_autoMoveTimer);
            clearInterval(_timer);
            $('.page1').removeClass('page-active').fadeOut(1000);
            Page2();
        });
    }

// p2胶带
    function Page2() {
        var $rectWrap = $('.rect-wrap');
        var $tsWrap = $('.ts-wrap');
        var $adhesiveWrap = $('.adhesive-wrap');
        var $gifPng = $('.gif_png');
        var $textList = $('.p2-text-list li');
        var $btnLongTap = $('.btn-long-tap');
        var $house = $('.p2-bottom-house');
        var $adhesiveItem = $('.adhesive-item');
        var $thankText = $('.thank-text');
        var moveTimer = null;



        $('.page2').fadeIn(1000);
        setTimeout(function () {
            $('.page2').addClass('page-active');
        }, 1000);
        setTimeout(function () {
            $('.item1-gif').show();
        }, 1100);
        setTimeout(function () {
            $gifPng.fadeIn(1000);
        }, 3000);

        setTimeout(function () {
            $('.btn-long-tap').fadeIn();
        }, 4000);

        var i = 0;
        var ts = 0;


        setTimeout(function(){
            $textList.eq(0).addClass('active');
            $thankText.eq(0).show();
            setTimeout(function(){
                $textList.eq(0).find('strong').addClass('flash');
            },1000);

        },500);

        $btnLongTap.on('touchstart mousedown', function (e) {
            e.preventDefault();
            $gifPng.addClass('isMove');
            moveTimer = requestAnimationFrame(rectMove);
        }).on('touchmove mousemove', function (e) {
            e.preventDefault();
        });

        $btnLongTap.on('touchend touchcancel mouseup', function () {
            console.log('touchend');
            // 停止
            $gifPng.removeClass('isMove');
            cancelAnimationFrame(moveTimer);
        });

        //轮播
        (function () {
            var i = 0;
            var $itemIcon = $('.item7').find('.item-icon');
            var $showActive = $('.showActive').find('.show');
            setInterval(function () {

                i++;
                i > 2 ? i = 0 : i;
                $itemIcon.eq(i).addClass('active').siblings().removeClass('active');
                $showActive.eq(i).fadeIn().siblings().fadeOut();
            }, 3500);
        })();

        function rectMove() {
            // console.log(1)
            // i -= 0.035;
            // ts -= 0.05;
            i -= 0.1;
            ts -= 0.2;
            if (ts <= -21) {
                ts = 0;
            }
            if (i < -116.6) {
                i = -116.6;
                $('.adhesive-wrap').fadeOut(1000);
                $('.p2-text-list').fadeOut(1000);
                setTimeout(function(){
                    $('.keyword-wrap').show();
                    cancelAnimationFrame(moveTimer);
                    $gifPng.removeClass('isMove');
                    $btnLongTap.fadeOut();
                    $btnLongTap.off();
                    setTimeout(function(){
                        $('.last-btn-ling').show();
                    },1800);
                },1000);
                return;
            }
            var n = Math.abs(parseInt((i - 9) / 17));
            var a = Math.abs(parseInt(i / 16.375));
            if (!$textList.eq(n).hasClass('active')) {
                $textList.eq(n).addClass('active').siblings().removeClass('active');
                $thankText.hide();
                setTimeout(function(){
                    $textList.eq(n).find('strong').addClass('flash');
                },800);
            }
            if (!$adhesiveItem.eq(a).hasClass('active')) {
                $adhesiveItem.eq(a).addClass('active').siblings().removeClass('active');
                $thankText.hide().eq(a).show();
            }

            $('#wageIncrease').html(wageIncrease);
            if (a === 4) {
                if (!global_data.isDraw) {
                    func_circle(window.global_data.wageIncrease);
                }
            }


            $gifPng.addClass(window.global_data.sexClass + (n + 1)).removeClass(window.global_data.sexClass + n);

            $adhesiveWrap.css('transform', 'translateX(' + i + 'rem)');
            $tsWrap.css('background-position', ts + 'rem 0');
            $house.css('background-position', i + 'rem 0');
            $rectWrap.css('left', ts + 'rem');
            moveTimer = requestAnimationFrame(rectMove);
        }
    }


    function func_circle(wageIncrease) {
        global_data.isDraw = true;
        let wage = wageIncrease.substr(0, wageIncrease.length - 1) / 100;
        if (wage > 1) {
            wage = 1;
        }
        if (wage < 0) {
            wage = 0;
        }
        const d = 360 * wage;
        if (d >= 180) {
            const n = d - 180;
            setTimeout(function () {
                $('.rightcircle').css({
                    'transform': 'rotate(' + 225 + 'deg)',
                    'transition': 'transform 1000ms linear'
                });
                setTimeout(function () {
                    $('.leftcircle').css({
                        'transform': 'rotate(' + (45 + n) + 'deg)',
                        'transition': 'transform ' + 1000 * (n / 180) + 'ms linear'
                    });
                    setTimeout(function () {
                        $('#p4-pre').html(wageIncrease).fadeIn();
                    }, 680);
                }, 1000);
            }, 1000);
        } else {
            $('.rightcircle').css({
                'transform': 'rotate(' + (45 + d) + 'deg)',
                'transition': 'transform ' + 1000 * (n / 180) + 'ms linear'
            });
        }
        console.log(wage)
    }
    // 预加载
    (function () {
        function isArray(obj) {
            return Object.prototype.toString.call(obj) === '[object Array]';
        }

        var loader = function loader(imgList, callback, timeout) {
            timeout = timeout || 5000;
            imgList = isArray(imgList) && imgList || [];
            callback = typeof callback === 'function' && callback;

            var total = imgList.length,
                loaded = 0,
                imgages = [],
                _on = function _on() {
                    loaded < total && (++loaded, callback && callback(loaded / total));
                };

            if (!total) {
                return callback && callback(1);
            }

            // 循环全部图片，图片加载完之后执行百分比统计
            for (var i = 0; i < total; i++) {
                imgages[i] = new Image();
                imgages[i].src = imgList[i];
                imgages[i].onload = imgages[i].onerror = _on;
            }

            /**
             * 如果timeout * total时间范围内，仍有图片未加载出来（判断条件是loaded < total），通知外部环境所有图片均已加载
             * 目的是避免用户等待时间过长
             */
            setTimeout(function () {
                loaded < total && (loaded = total, callback && callback(loaded / total));
            }, timeout * total);
        };

        "function" === typeof define && define.cmd ? define(function () {
            return loader;
        }) : window.imgLoader = loader;
    })();

    var images = ['http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/p1-bg1.png', 'http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/p2-bg.png', 'http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/p1-main1.png', 'http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/p1-projection-img.png', 'http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/adhesive-wrap1.png', 'http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/item1-bg.png', 'http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/item1-card1.png','http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/item1-card2.png', 'http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/item1-bg.gif', 'http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/item1-man.png','http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/item1-girl.png', 'http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/item2-bg.png', 'http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/item2_2-bg.gif', 'http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/item3-bg.png', 'http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/item4-bg.png', 'http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/item5-bg.png', 'http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/item6-bg.png', 'http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/item6-money.png', 'http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/item7-bg.gif', 'http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/man1_gif.png', 'http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/man2_gif.png', 'http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/man3_gif.png', 'http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/man4_gif.png', 'http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/man5_gif.png', 'http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/man6_gif.png', 'http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/man7_gif.png', 'http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/man8_gif.png', 'http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/p2-bottom-house.png', 'http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/ts1.png','http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/girl1_gif.png','http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/girl2_gif.png','http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/girl3_gif.png','http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/girl4_gif.png','http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/girl5_gif.png','http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/girl6_gif.png','http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/girl7_gif.png','http://img.wx.xiao-bo.com/z/act/2019-040506/zh-znq/girl8_gif.png'];
    //获取页面中的所有img
    var imgs = document.images;
    for (var j = 0; j < imgs.length; j++) {
        images.push(imgs[j].src);
    }

    console.log(images.length);
    imgLoader(images, function (percentage) {
        setTimeout(function () {
            var percentT = percentage * 100;
            $('.bar').css('width', parseInt(percentT) + '%');
            // 加载完之后隐藏加载层，显示内容
            if (percentage == 1) {
                setTimeout(function () {
                    $('#loading').hide();
                    Page1();
                }, 500);
            }
        }, 200);
    });
});

window.requestAnimationFrame = function () {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (callback) {
        window.setTimeout(callback, 17);
    };
}();
window.cancelAnimationFrame = function () {
    return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || function (id) {
        window.clearTimeout(id);
    };
}();