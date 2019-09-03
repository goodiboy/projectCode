window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 17);
        }
})();
window.cancelAnimationFrame = (function () {
    return window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        function (id) {
            window.clearTimeout(id);
        }
})();


$(function () {


    /* 百度统计 */
    $("[data-track]").on("click", function () {
        var label = $(this).data("track");
        window._hmt && window._hmt.push(['_trackEvent', label, 'click']);
    });

    let mySwiper = new Swiper('.swiper-container', {
        direction: 'vertical', // 垂直切换选项
        slidesPerView: 3,
        spaceBetween: '15%',
        centeredSlides: true,
        initialSlide: 1,
        init: false
    });

    /* 游戏 */
    (() => {
        $('.btn-reset').click(function () {
            $('.posterMask').fadeOut();
            $('.save-tips').hide();
            clearTimeout(saveTimer);
            $('.btn-open').css('bottom','17.5%');
            $('.more-gift').show();
            $('.chou-tips').hide();
        });

        $('.btn-open').click(function () {
            // 已经关注
            if (true) {
                func_mask(true);
                let index = Math.ceil(Math.random() * 9);
                $('#poster').prop('src', 'http://img.wx.xiao-bo.com/z/act/2018-101112/zh-cj/poster1/poster' + index + '.png?v2');
                $('#poster').on('load', function () {
                    func_mask(false);
                    $('.posterMask').show();
                });
            } else {
                $(".subMask").show();
            }

        });


        /* 关闭关注二维码 */
        $(".page_affirm").click(function () {
            let $this = $(this);
            let $qrCode = $(this).find(".qr_code").addClass('dOut');
            setTimeout(function () {
                $this.hide();
                $qrCode.removeClass('dOut');
            }, 600)
        });

        $(".qr_code").click(function (e) {
            e.stopPropagation();
        });

        $('.close-downMask').click(function () {
            $('.immediately').hide();
            let $downAppWrap = $('.downApp-wrap').addClass('zoomOut');
            setTimeout(function () {
                $('.downMask').hide();
                $downAppWrap.removeClass('zoomOut');
            }, 600)
        });

        let saveTimer = null;
        $('.circle-chou').click(function () {
            clearTimeout(saveTimer);
            $('.save-tips').fadeIn();
            saveTimer = setTimeout(function () {
                $('.save-tips,.circle-chou').hide();
                // $('.downMask').show();
                // setTimeout(function(){
                $('.immediately').fadeIn();
                // },600);

            }, 3000)
        });

    })();


    /*全局变量*/
    const $space = $('#space');
    let $img;
    let deg = 15;
    let timer = null;
    /*初始化跑马灯图片*/
    (() => {
        let html = '';
        let rot_img = '';
        let arrBtn = ['点击了挥春', '点击了花鸟字', '点击了中国结', '点击了剪纸', '点击了糖画'];
        for (let i = 2; i < 14; i++) {
            if (i == 3 || i == 6 || i == 9 || i == 12 || i == 15) {
                rot_img = `<div class="img_cover" style="background: url('http://img.wx.xiao-bo.com/z/act/2018-101112/zh-cj/${i}.png?v9') no-repeat 0 0 / 100% 100%;pointer-events: auto" >
                            <img src="http://img.wx.xiao-bo.com/z/act/2018-101112/zh-cj/btn-more.png?v9" class="btn-more" data-track="${arrBtn[(i / 3) - 1]}" alt="">
                            <img src="http://img.wx.xiao-bo.com/z/act/2018-101112/zh-cj/hand.png?v9" class="hand" alt="">
                        </div>`
            } else {
                rot_img = `<div class="img_cover" style="background: url('http://img.wx.xiao-bo.com/z/act/2018-101112/zh-cj/${i}.png?v9') no-repeat 0 0 / 100% 100%;pointer-events: auto" ></div>`;
            }
            html += '            <div class="img_cover frame_01"></div>\n' +
                '            <div class="img_cover frame_02"></div>\n' +
                '            <div class="img_cover frame_04"></div>\n' +
                '            <div class="img_cover frame_02"></div>\n' +
                rot_img +
                '            <div class="img_cover frame_01"></div>\n' +
                '            <div class="img_cover frame_02"></div>\n' +
                '            <div class="img_cover frame_05"></div>'
        }
        $space.append(html);
        $img = $('.img_cover');
        $.each($img, function (i, item) {
            $(item).css({
                transform: `rotateY(${-i * deg}deg)`,
            });
            if (i > 8) {
                $(item).hide();
            }
        });
    })();

    /* 进入游戏前的事件集合 */
    (() => {
        let index = 0;
        $('.btn-more').click(function () {
            index = $(this).index('.btn-more');
            console.log(index);
            $('.introMask').show();
            $('.intor').eq(index).show().removeClass('bounceOutDown').addClass('bounceIn');
            setTimeout(function () {
                $('.introMask .btn').fadeIn();
            }, 100);
        });


        $('.btn-back').click(function(){
            $('.rotate-wrap').show();
            $('.game-wrap').fadeOut();


        });

        $('.introBtnContinue').click(function () {
            $('.introMask .btn').fadeOut();
            $('.intor').eq(index).removeClass('bounceIn').addClass('bounceOutDown');

            setTimeout(function () {
                $('.introMask').hide();
                $('.intor').eq(index).hide();
            }, 800);
            // $(this).parent()
        });

        $('.fu-btn-wrap').click(function () {
            $('.fu').removeClass('rotateFu').addClass('rotateFu2');
            $(".m_ele").click();
            setTimeout(function () {
                $('.index-cover').fadeOut(1000);
                $('.m_ele').show();
            }, 800);
        });

        // 音乐
        let audio = document.getElementById('audio');
        $(".m_ele").click(function () {
            if ($(".music").hasClass("m_active")) {
                $(".music").removeClass("m_active");
                audio.pause();
                $(".music_bg").hide();
            } else {
                $(".music").addClass("m_active");
                audio.play();
                $(".music_bg").show();
            }
        });

        // 进入游戏
        $('.go-game,.introBtnGame').click(function () {
            cancelAnimationFrame(timer);
            // $('.introMask').hide();
            // $('.game-wrap').show();
            // $('.rotate-wrap').fadeOut();
            // audio.pause();
            // // $(".m_ele").click();
            // $('.m_ele').hide();
            // mySwiper.forEach((item, index) => item.init())
            window.location.href = 'https://t.cmbchina.com/2ieEJf?act=spring';
        });

        $('.btn-rule').click(function () {
            $('.rule-mask').show();
        });
        /* 关闭规则 */
        $('.close-rule').click(function () {
            let $ruleBox = $('.rule-box').addClass('zoomOut');
            setTimeout(function () {
                $('.rule-mask').hide();
                $ruleBox.removeClass('zoomOut');

            }, 600)
        });
    })();

    /* 跑马灯效果 */
    (() => {
        let btnShow = false;
        (function rotate() {
            let startX = 0, moveX = 0, endX = 0, moveDis = 0, translateX = 0, sTime = 0, first = true;
            let isLeft = false, isRight = false, isStop = true;
            $space[0].addEventListener('touchstart', startEvt);
            $space[0].addEventListener('mousedown', startEvt);
            $space[0].addEventListener('touchmove', moveEvt);
            $space[0].addEventListener('touchend', endEvt);

            function startEvt(e) {

                if (e.changedTouches) {
                    startX = e.changedTouches[0].pageX;
                } else {
                    startX = e.pageX;

                    $space[0].addEventListener('mousemove', moveEvt);
                    document.addEventListener('mouseup', endEvt);
                }

                translateX = moveDis;
                sTime = new Date().getTime();

            }

            function moveEvt(e) {
                isRight = false;
                isStop = true;
                isLeft = false;
                if (e.changedTouches) {
                    moveX = e.changedTouches[0].pageX;
                } else {
                    moveX = e.pageX;
                }
                moveDis = (moveX - startX) * .15 + translateX;

                if (moveDis < 0) {
                    moveDis = 0;
                }
                if (moveDis >= ($img.length - 4) * deg) {
                    moveDis = ($img.length - 4) * deg;
                }

                if (first) {
                    first = false;
                    $('.guidance').fadeOut();
                }

                everyImg(moveDis);
            }

            function endEvt(e) {
                if (e.changedTouches) {
                    endX = e.changedTouches[0].pageX;
                } else {
                    $space[0].removeEventListener('mousemove', moveEvt);
                    document.removeEventListener('mouseup', endEvt);
                    endX = e.pageX;
                }
                cancelAnimationFrame(timer);

                if (endX - startX > 5) {
                    isRight = true;
                    isStop = false;
                    isLeft = false;
                    aotuplay();
                } else if (endX - startX < -5) {
                    isRight = false;
                    isStop = false;
                    isLeft = true;
                    aotuplay();
                } else {
                    isRight = false;
                    isStop = true;
                    isLeft = false;

                }
            }


            function aotuplay() {
                if (isRight) {
                    moveDis += 0.45;
                } else if (isLeft) {
                    moveDis -= 0.45;
                }

                if (moveDis < 0) {
                    moveDis = 0;
                }

                if (moveDis >= ($img.length - 4) * deg) {
                    moveDis = ($img.length - 4) * deg;
                }
                everyImg(moveDis);
                timer = requestAnimationFrame(aotuplay);
            }
        })()


        function everyImg(dis) {
            // console.log(dis)
            if (dis >= 200 && !btnShow) {
                btnShow = true;
                $('.go-game').fadeIn();
            }
            let imgArr = [];
            $.each($img, function (i, item) {
                imgArr[i] = dis - i * deg;
                if (imgArr[i] > 89 || imgArr[i] < -120) {
                    $(this).hide();
                }

                if (imgArr[i] >= -120 && imgArr[i] < 90) {
                    $(this).show();
                    $(item).css({
                        transform: `rotateY(${dis - i * deg}deg)`,
                    });
                }
                if (dis >= ($img.length - 1) * 60 && imgArr[i] < 60) {

                }
            });
        }
    })()

});

/* 加载 */
function func_mask(do_show, msg) {
    $(".page_weui_loading_toast").remove();
    $(".ex-dimmer").remove();

    if (!$("body").hasClass('style')) {
        let _sty = '<style>.page_loading{position:fixed;top:0;left:0;right:0;bottom:0;z-index:5000;font-size:15px}.page_loading,.page_weui-toast.loading{display:-webkit-flex;display:flex;-webkit-align-items:center;align-items:center;-webkit-justify-content:center;justify-content:center}.page_weui-loading_box{-webkit-flex-direction:column;flex-direction:column}.page_weui-toast.loading{width:120px;min-height:120px;text-align:center;border-radius:5px;color:#fff;background:rgba(17,17,17,0.7)}.page_weui-loading{width:38px;height:38px;display:inline-block;vertical-align:middle;-webkit-animation:weuiLoading 1s steps(12,end) infinite;animation:weuiLoading 1s steps(12,end) infinite;background:transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=) no-repeat;background-size:100%;vertical-align:baseline}.page_weui_loading_toast.page_loading .page_weui_toast__content{margin:0;margin-top:5px;}.page_weui_loading_toast.page_loading .page_weui-loading{margin:0}@-webkit-keyframes weuiLoading{0%{-webkit-transform:rotate3d(0,0,1,0deg);transform:rotate3d(0,0,1,0deg)}100%{-webkit-transform:rotate3d(0,0,1,360deg);transform:rotate3d(0,0,1,360deg)}}@keyframes weuiLoading{0%{-webkit-transform:rotate3d(0,0,1,0deg);transform:rotate3d(0,0,1,0deg)}100%{-webkit-transform:rotate3d(0,0,1,360deg);transform:rotate3d(0,0,1,360deg)}}</style>';
        $("body").append(_sty).addClass('style');
    }


    if ($('body').css('animation-name') == 'seui') {
        func_mask__sui(do_show, msg);
        return;
    }


    if (do_show) {
        let msg_html = '<p class="page_weui_toast__content">加载中</p>';
        let msg_loading_style = '';
        if (msg) {
            msg_html = '<p class="page_weui_toast__content">' + msg + '</p>';
        }

        let _html = '<div class="page_weui_loading_toast page_loading">' +
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

document.body.addEventListener('touchmove', function (e) {
    e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
}, {passive: false}); //passive 参数不能省略，用来兼容ios和android

