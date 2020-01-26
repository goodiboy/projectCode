var prop_poster_bg = 3;
// var prop_tk_link = [
//     'http://m.cn5000.com.cn/mobile/buy.asp',
//     'http://m.klxiyou.com/scenic/index/show?id=577',
//     'http://appmall.87gogo.com/MxWorldWindow/app/wap/index/index.jsp',
//     'https://mp.weixin.qq.com/s/4jPg1A_ostsq_lmL239HaQ',
//     'http://wxgw.piaojingtong.net/weixin/disprodctsdetail.htm?pid=e422397f0f3e4062aa0b28e9c493edc6',
//     'http://www.osrzh.com',
//     'http://www.songshancn.com/wxoauth/shop/index.php',
//     'http://www.haiquanwan.com.cn/wap/index.php?moduleid=16&catid=16',
// ]
$(function() {
    $(".tools_select_item").click(function() {
        var _this = $(this);
        if(!_this.hasClass('active')) {
            $(".tools_select_item").removeClass('active');
            _this.addClass('active');

            var _index = _this.index();
            $('.tools_item_box').hide();
            $('.tools_item_box_' + (_index + 1)).show();

        }
    });

    $('.tools_item_box_1_r').click(function(){

    });

    //添加背景
    $(".thumb_bg").click(function(){
        var _index = $(this).attr('data-index');
        prop_poster_bg = _index;
        $(".poster_bg").attr('src','./images/poster_bg_'+_index+'.png?v=4')
    });
    //添加人物
    $(".thumb_people").click(function(){
        var _type = $(this).attr('data-type');
        myMonitor.func_drawEle( _type,true );
    });
    //添加道具
    $(".thumb_prop").click(function(){
        var _type = $(this).attr('data-type');
        myMonitor.func_drawEle( _type,true );
    });

    /*画*/
    $('.btn_draw').click(function(){
        console.log(prop_poster_bg)

        func_mask(true)

        myMonitor.stage.remove(myMonitor.graphics);
        myMonitor.stage.remove(myMonitor.close_bmp);
        myMonitor.stage.remove(myMonitor.resize_bmp);

        setTimeout(function(){
            console.log('元素ok')
            var ele_ = myMonitor.can.toDataURL('png');
            func_getResult( ele_ );
        },200)
    });

    $(".poster_tip").click(function(){
        window.location = prop_tk_link[prop_poster_bg-1];
    });

    /*33*/
    $(".poster_close").click(function(){
        $(".poster_tip,.poster_close").hide();
    });

    $(".btn_start").click(function(){
        $(".page_start").hide();
        $(".page_tip").show();
        $(".modal").addClass('bounceInDown');

    });

    $(".page_tip").click(function(){
        $(".modal").removeClass('bounceInDown').addClass('bounceOutDown');
        setTimeout(function(){
            $(".page_tip").hide();
            $(".tools_box").show().addClass('fadeInUp');
            setTimeout(function(){
                $(".btn_draw").show().addClass('fadeInRight');
            },500)
        },800)
    });

    $(".btn_save").click(function(){
        $('#toast').toast('长按海报即可保存|发给好友哦~',2000);
    });

    $(".tools_item_toggle").click(function(){

        if( !$(this).hasClass('active') ){
            $(".tools_box").css('bottom','-3.5rem');
            $(this).addClass('active');
        }else{
            $(".tools_box").css('bottom','0');
            $(this).removeClass('active');
        }

    })


    $('.rule').click(function(){
        $('.rule_mask').show();
        $('.rule_box').removeClass('out').addClass('in');
    })
    $('.rule_mask .rule_close').click(function(){
        $('.rule_box').removeClass('in').addClass('out');
        setTimeout(function(){
            $('.rule_mask').hide();
        },800)
    })


    document.getElementById('canvas').addEventListener('touchmove', function(e) {
        e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
    }, {
        passive: false
    }); //passive 参数不能省略，用来兼容ios和android

    myMonitor.func_init();

});

function func_getResult(ele_pic){
    console.log('func_getResult');
    var can_result = document.getElementById('canvas_result'),
        pen_result = can_result.getContext('2d');

    var p_bg = new Image();
    p_bg.crossOrigin = "Anonymous";
    p_bg.src = './images/poster_bg_'+prop_poster_bg+'.png?v=4';
    p_bg.onload = function(){
        pen_result.drawImage(p_bg,0,0,can_result.width,can_result.height);
        console.log('背景ok')

        var p_ele = new Image();
        p_ele.crossOrigin = "Anonymous";
        p_ele.src = ele_pic;
        p_ele.onload = function(){
            pen_result.drawImage(p_ele,0,0,can_result.width,can_result.height);

            var p_logo = new Image();
            p_logo.crossOrigin = "Anonymous";
            p_logo.src = './images/plogo_'+prop_poster_bg+'.png';
            p_logo.onload = function(){
                pen_result.drawImage(p_logo,0,0,can_result.width,can_result.height);

                $(".poster").attr('src',can_result.toDataURL('jpeg'));
                func_mask(false);

                $(".page_draw").hide();
                $(".page_result").show();
            }
        }

    }
}


var myMonitor = {
        Stage: AlloyPaper.Stage,
        Bitmap: AlloyPaper.Bitmap,
        Graphics: AlloyPaper.Graphics,
        Loader: AlloyPaper.Loader,
        can : null,
        pen: null,
        drawBmpBg :null,
        drawBmpEle :null,
        stage :null,
        _loaditem :[],
        ld : null,
        close_bmp : null,//删除按钮
        graphics : null,//边框
        resize_bmp: null,
        scaLen:1,
        /*初始化*/
        func_init: function(){
            myMonitor.stage = new myMonitor.Stage("#canvas");
            myMonitor.stage.autoUpdate = true;

            myMonitor.can = document.getElementById('canvas');
            myMonitor.pen = myMonitor.can.getContext('2d');
            myMonitor.pen.setLineDash([20,10]);
            myMonitor.pen.lineWidth = 2;
            myMonitor.pen.strokeStyle = '#b3b3b3';

            myMonitor._loaditem = [
                {id: "banner",src: "./images/banner.png"},
                {id: "bg",src: "./images/bg.jpg"},
                {id: "bottom_bg",src: "./images/bottom_bg.png"},
                {id: "poster_close_02",src: "./images/poster_close_02.jpg"},
                {id: "poster_qr_txt",src: "./images/poster_qr_txt.png"},
                {id: "poster_tt",src: "./images/poster_tt.png"},
                {id: "rule",src: "./images/rule.png"},
                {id: "thumb_bg_1",src: "./images/thumb_bg_1.png"},
                {id: "thumb_bg_2",src: "./images/thumb_bg_2.png"},
                {id: "thumb_bg_3",src: "./images/thumb_bg_3.png"},
                {id: "thumb_bg_4",src: "./images/thumb_bg_4.png?v=1"},
                {id: "thumb_bg_5",src: "./images/thumb_bg_5.png"},
                {id: "thumb_bg_6",src: "./images/thumb_bg_6.png"},
                {id: "thumb_bg_7",src: "./images/thumb_bg_7.png"},
                {id: "thumb_bg_8",src: "./images/thumb_bg_8.png"},
                {id: "thumb_boy",src: "./images/thumb_boy.png"},
                {id: "thumb_carmare",src: "./images/thumb_carmare.png"},
                {id: "thumb_cat",src: "./images/thumb_cat.png"},
                {id: "thumb_dog",src: "./images/thumb_dog.png"},
                {id: "thumb_girl",src: "./images/thumb_girl.png"},
                {id: "thumb_het",src: "./images/thumb_het.png"},
                {id: "thumb_man",src: "./images/thumb_man.png"},
                {id: "thumb_oldman",src: "./images/thumb_oldman.png"},
                {id: "thumb_oldwoman",src: "./images/thumb_oldwoman.png"},
                {id: "thumb_sunglasses",src: "./images/thumb_sunglasses.png"},
                {id: "thumb_telescope",src: "./images/thumb_telescope.png"},
                {id: "thumb_woman",src: "./images/thumb_woman.png"},
                {id: "tree",src: "./images/tree.png"},
                {id: "btn_draw",src: "./images/btn_draw.png"},
                {id: "btn_save",src: "./images/btn_save.png?v=1"},
                {id: "btn_start",src: "./images/btn_start.png"},
                {id: "modal",src: "./images/modal.png"},
                {id: "icon_l",src: "./images/icon_l.png"},
                {id: "icon_r",src: "./images/icon_r.png"},
                {id: "item1",src: "./images/item1.png?v=1"},
                {id: "item2",src: "./images/item2.png?v=1"},
                {id: "item3",src: "./images/item3.png?v=1"},

                {id: "poster_bg_visable",src: "./images/poster_bg_visable.png"},
                {id: "camera",src: "./images/camera.png"},
                {id: "boy",src: "./images/boy.png"},
                {id: "man",src: "./images/man.png"},
                {id: "oldman",src: "./images/oldman.png"},
                {id: "oldwoman",src: "./images/oldwoman.png"},
                {id: "cat",src: "./images/cat.png"},
                {id: "close",src: "./images/close.png"},
                {id: "dog",src: "./images/dog.png"},
                {id: "girl",src: "./images/girl.png"},
                {id: "hat",src: "./images/hat.png"},
                {id: "sunglasses",src: "./images/sunglasses.png"},
                {id: "telescope",src: "./images/telescope.png"},
                {id: "poster_bg_1",src: "./images/poster_bg_1.png?v=4"},
                {id: "poster_bg_2",src: "./images/poster_bg_2.png?v=4"},
                {id: "poster_bg_3",src: "./images/poster_bg_3.png?v=4"},
                {id: "poster_bg_4",src: "./images/poster_bg_4.png?v=4"},
                {id: "poster_bg_5",src: "./images/poster_bg_5.png?v=4"},
                {id: "poster_bg_6",src: "./images/poster_bg_6.png?v=4"},
                {id: "poster_bg_7",src: "./images/poster_bg_7.png?v=4"},
                {id: "poster_bg_8",src: "./images/poster_bg_8.png?v=4"},
                {id: "p_logo_1",src: "./images/plogo_1.png?v=1"},
                {id: "p_logo_2",src: "./images/plogo_2.png?v=1"},
                {id: "p_logo_3",src: "./images/plogo_3.png?v=1"},
                {id: "p_logo_4",src: "./images/plogo_4.png?v=1"},
                {id: "p_logo_5",src: "./images/plogo_5.png?v=1"},
                {id: "p_logo_6",src: "./images/plogo_6.png?v=1"},
                {id: "p_logo_7",src: "./images/plogo_7.png?v=1"},
                {id: "p_logo_8",src: "./images/plogo_8.png?v=1"},
                {id: "people",src: "./images/people.png"},
                {id: "woman",src: "./images/woman.png"},
                {id: "resize",src: "./images/resize.png"},
//			{id: "music",src:"./images/gq.mp3"}
            ];
            myMonitor.ld = new myMonitor.Loader();

            myMonitor.func_setloader(myMonitor._loaditem)
        },
        /*加载素材*/
        func_setloader : function(l_item){
            var Load_res = l_item;
            console.log(Load_res);
            myMonitor.ld.loadRes(Load_res);
            myMonitor.ld.progress(function(progress){
                $('.progress').html(Math.floor(progress/myMonitor._loaditem.length*100)+'%');
            });

            myMonitor.ld.complete(function(e) {

                console.log('资源加载完成')
                setTimeout(function(){
                    $(".page_act_loading").hide();
                    $(".page_start").show();
                    setTimeout(function(){
                        myMonitor.func_drawEle( 'poster_bg_visable',false );
                    },200)
                },500)


                var music = document.getElementById('bg_music');
                document.addEventListener("WeixinJSBridgeReady", function () {
                    WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                        music.play();
                    });
                }, false);


            });
        },
        /*添加元素*/
        func_drawEle: function(_ele,setfinger){

            myMonitor.drawBmpEle = new myMonitor.Bitmap(myMonitor.ld.get( _ele ));
            myMonitor.drawBmpEle.originX = 0.5;
            myMonitor.drawBmpEle.originY = 0.5;
            myMonitor.drawBmpEle.x = myMonitor.stage.width / 2;
            myMonitor.drawBmpEle.y = myMonitor.stage.height / 2;
            myMonitor.stage.add(myMonitor.drawBmpEle);

            if ( setfinger ) {
                myMonitor.func_setFinger(myMonitor.drawBmpEle);
            }else{//在画背景图
                /*点击背景图清除边框及删除按钮*/
                new AlloyFinger(myMonitor.drawBmpEle, {
                    touchStart:function(evt){
                        myMonitor.stage.remove(myMonitor.graphics);
                        myMonitor.stage.remove(myMonitor.close_bmp);
                        myMonitor.stage.remove(myMonitor.resize_bmp);
                    },
                });
            }

        },
        /*添加手势操作*/
        func_setFinger:function(bmp){
            //myMonitor.scaLen=1;
            var initScale = 1;
            new AlloyFinger(bmp, {
                multipointStart: function() {
                    initScale = bmp.scaleX;
                },
                touchStart:function(evt){
                    myMonitor.func_setClose(bmp,bmp.scaleX,initScale);
                },
                pinch: function(evt) {
                    console.log(evt);
                    evt.preventDefault();
                    bmp.scaleX = bmp.scaleY = initScale * evt.zoom;

                    console.log(initScale * evt.zoom)
                    myMonitor.scaLen = initScale * evt.zoom;

                    myMonitor.func_setClose(bmp,bmp.scaleX,initScale * evt.zoom);
                },
                pressMove: function(evt) {
                    evt.preventDefault();
                    bmp.x += evt.deltaX*2;
                    bmp.y += evt.deltaY*2;

                    myMonitor.func_setClose(bmp,bmp.scaleX,initScale);
                },
            });

        },
        /*添加删除按钮及边框*/
        func_setClose: function(_bmp,_sca,_initScale){

            myMonitor.stage.remove(myMonitor.close_bmp);
            myMonitor.stage.remove(myMonitor.graphics);
            myMonitor.stage.remove(myMonitor.resize_bmp);

            myMonitor.graphics= new myMonitor.Graphics();
            myMonitor.graphics.beginPath();
            myMonitor.graphics.moveTo(_bmp.x-_bmp.width/2*_sca-20,_bmp.y-_bmp.height/2*_sca-20);
            myMonitor.graphics.lineTo(_bmp.x+_bmp.width/2*_sca+20,_bmp.y-_bmp.height/2*_sca-20);
            myMonitor.graphics.lineTo(_bmp.x+_bmp.width/2*_sca+20,_bmp.y+_bmp.height/2*_sca+20);
            myMonitor.graphics.lineTo(_bmp.x-_bmp.width/2*_sca-20,_bmp.y+_bmp.height/2*_sca+20);
            myMonitor.graphics.closePath();
            myMonitor.graphics.stroke();
            myMonitor.stage.add(myMonitor.graphics);

            myMonitor.close_bmp = new myMonitor.Bitmap(myMonitor.ld.get( 'close' ));
            myMonitor.close_bmp.originX = 0.5;
            myMonitor.close_bmp.originY = 0.5;
            myMonitor.close_bmp.x = _bmp.x+_bmp.width/2*_sca+20;
            myMonitor.close_bmp.y = _bmp.y-_bmp.height/2*_sca-20;
            myMonitor.stage.add(myMonitor.close_bmp);

            myMonitor.resize_bmp = new myMonitor.Bitmap(myMonitor.ld.get( 'resize' ));
            myMonitor.resize_bmp.originX = 0.5;
            myMonitor.resize_bmp.originY = 0.5;
            myMonitor.resize_bmp.x = _bmp.x-_bmp.width/2*_sca-20;
            myMonitor.resize_bmp.y = _bmp.y+_bmp.height/2*_sca+20;
            myMonitor.stage.add(myMonitor.resize_bmp);

            /*点击删除按钮，删除按钮连同按钮所附属的元素都删除*/
            new AlloyFinger(myMonitor.close_bmp, {
                touchStart:function(evt){
                    myMonitor.stage.remove(_bmp);
                    myMonitor.stage.remove(myMonitor.graphics);
                    myMonitor.stage.remove(myMonitor.close_bmp);
                    myMonitor.stage.remove(myMonitor.resize_bmp);
                },
            });

            /*缩放按钮*/
            new AlloyFinger(myMonitor.resize_bmp, {
                multipointStart: function() {
                    console.log('ss'+myMonitor.scaLen)
                },
                pressMove: function(evt) {
                    evt.preventDefault();

                    var preV = { x: null, y: null };
                    preV.x = evt.deltaX;
                    preV.y = evt.deltaY;

                    if ( preV.x<0&&preV.y>0 ) {
                        myMonitor.scaLen = myMonitor.scaLen+0.05>5?5:myMonitor.scaLen+0.05;
                    }else if ( preV.x>0&&preV.y<0 ) {
                        myMonitor.scaLen = myMonitor.scaLen-0.05<0.1?0.1:myMonitor.scaLen-0.05;
                    }
                    console.log(myMonitor.scaLen)

                    _bmp.scaleX = _bmp.scaleY = Math.sqrt(_initScale*myMonitor.scaLen);

                    myMonitor.func_setClose(_bmp,_bmp.scaleX,_bmp.scaleX);

                },
            });
        },
    }


;(function($) {
    var style="<style>#toast{position: fixed;top: 0;left: 0;right: 0;bottom: 0;display: flex;display: -webkit-flex;justify-content:center;align-items: center;z-index:9999;}.toast_cont{padding:.8rem 1rem;border-radius: 5px;max-width:11rem;color: white;text-align: center;font-size: 0.75rem;background: rgba(0,0,0,0.9);}</style>";
    var html = '<div id="toast" style="display:none;"><div class="toast_cont"></div></div>';
    $('body').append(html);
    $('head').append(style);
    $.fn.toast = function(content,time) {
        var t = $(this);
        t.find(".toast_cont").html(content);
        t.fadeIn();

        setTimeout(function(){
            t.fadeOut();
        },time)
    }
})($);

function func_mask(do_show, msg)
{
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