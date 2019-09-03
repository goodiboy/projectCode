(function(){

    // requestAnimationFrame兼容写法
    window.requestAnimationFrame= (function(){
        return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame ||
          function(callback){
              window.setTimeout(callback, 17);
          }
    })();
    window.cancelAnimationFrame = (function(){
        return window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        function(id){
            window.clearTimeout(id);
        }
    })();

    var easeIn = function(t, b, c, d) {
          return c * (t /= d) * t * t + b;
    }
    
    var easeOut = function(t, b, c, d){
        return c * ((t = t/d - 1) * t * t + 1) + b;
    }
    var req = null;
    
    
    


    // 画中画对象
    var DrawScale = function (data,can) {
        this.img1 = new Image();
        this.img1.src = data.imgUrl1;

        this.img2 = new Image();
        this.img2.src = data.imgUrl2;

        this.width = can.width;
        this.height = can.height;
        this.ctx = can.getContext('2d');


        // 保存图一原始的位置和宽高属性
        // this.originalX = data.sx;   
        // this.originalY = data.sy;
        // this.originalW = data.sw;
        // this.originalH = data.sh;

        // 缩放底图(图一)目标点的位置和宽高属性
        this.sx = data.sx;  // (图一)目标点左侧的距离
        this.sy = data.sy;  // (图一)目标点顶部的距离
        this.sw = data.sw;  // (图一)目标点的宽度
        this.sh = data.sh;  // (图一)目标点的高度

        // 保存图二原始的位置和宽高属性
        this.originalX2 = data.sx2; 
        this.originalY2 = data.sy2;
        this.originalW2 = data.sw2;
        this.originalH2 = data.sh2;


        // 缩放上面（图二）的位置和属性
        this.sx2 = data.sx2;    // (图二)目标点左侧的距离
        this.sy2 = data.sy2;    // (图二)目标点顶部的距离
        this.sw2 = data.sw2;    // (图二)目标点的宽度
        this.sh2 = data.sh2;    // (图二)目标点的高度

        var targetData = {};
        if (this.sw < this.sw2){
            this.originalX = this.sx;
            this.originalW = this.sw;
            targetData.x = this.sx;
            targetData.y = this.sy;
            targetData.h = this.sh;
            targetData.w = this.sw;
        }else{
            this.originalX = this.sx2;
            this.originalW = this.sw2;
            targetData.x = this.sx2;
            targetData.y = this.sy2;
            targetData.h = this.sh2;
            targetData.w = this.sw2;
        }

        if (this.sh < this.sh2){
            this.originalY = this.sy;
            this.originalH = this.sh;
        }else{
            this.originalY = this.sy2;
            this.originalH = this.sh2;
        }


        // 图一目标点距离底部的距离
        var disBottom = can.height - targetData.y - targetData.h;

        // 图一目标点距离右侧的距离
        var disRight = this.sw2 - targetData.x - targetData.w;

        // 图一目标点距离底部和距离顶部的比例
        this.scaleHeight = disBottom / targetData.y;

        // 图一目标点距离右边和距离左边的比例
        this.scaleWidth = disRight / targetData.x;


        // 计算图一目标点右侧占整宽度（减去目标点的宽度）的百分比
        this.scaleRigth = disRight / (this.sw2  - this.sw );

        // 计算图一目标点距离底部占整总高度（减去目标点的宽度）的百分比
        this.scaleBottom = disBottom / (this.sh2  - this.sh );


        /**
         * 前进
         * @vx  运动函数返回来的x方向位置值
         * @vy  运动函数返回来的y方向位置值
         */
        this.drawGo = function (vx,vy) {

            // 如果x轴没有到左上角0 0的位置就进行重绘
            if (this.sx <= 0){
                this.sx = 0;
                this.sw = this.width;
                this.sx2 = this.originalX;
                this.sw = this.originalW;
            }else{

                // 最新x轴的位置 = 用原始的x轴位置减去x轴的偏移值
                this.sx = this.originalX - vx;

                // 最新目标图宽度 = 原始大小 + x轴的偏移值 + 右侧长度（用右侧与左侧的比例 * x抽偏移量）
                this.sw = this.originalW + vx + this.scaleWidth*vx;

                // 求出最新的目标点宽度和原始的比例,用于同步缩放图二
                this.scaW = this.sw / this.originalW;

                // 图二的最新宽度 = 原始宽度 / 图一宽度放大的比例 
                this.sw2 = this.originalW2 / this.scaW;

                // 图二最新x轴偏移位置 = 原始的宽度 - 图二最新的宽度 - （原始-最新的剩余宽度）* 目标点右侧和左侧的比例
                this.sx2 = this.originalW2 - this.sw2 - (this.originalW2 - this.sw2)*this.scaleRigth ;
                // console.log( this.sw2,this.sw,this.scaW);
                // console.log(this.sx, this.sx2);
               
            }

            if (this.sy <= 0){
                this.sy = 0;
                this.sh = this.height;
                this.sy2 = this.originalY;
                this.sh2 = this.originalH;
            }else{
                // 最新y轴的位置 = 用原始的y轴位置减去x轴的偏移值
                this.sy = this.originalY - vy;

                // 最新目标图高度 = 原始大小 + y轴的偏移值 + 距离底部长度（用底部与顶部距离的比例 * y抽偏移量）
                this.sh = this.originalH + vy + this.scaleHeight * vy;

                // 求出最新的目标点高度和原始的比例,用于同步缩放图二
                this.scaH = this.sh / this.originalH;

                
                // 图二的最新高度 = 原始高度 / 图一高度放大的比例 
                this.sh2 = this.originalH2 / this.scaH;

                // 图二最新y轴偏移位置 = 原始的高度 - 图二最新的高度 - （原始-最新的剩余高度）* 目标点底部和顶部的比例
                this.sy2 = this.originalH2 - this.sh2 - (this.originalH2 - this.sh2) * this.scaleBottom;
            }



            // console.log('w: '+this.sw);
            // console.log('h: '+this.sh);
            // console.log('x: '+this.sx);
            // console.log('y: '+this.sy);

            // console.log('w2: '+this.sw2);
            // console.log('h2: '+this.sh2);
            // console.log('x2: '+this.sx2);
            // console.log('y2: '+this.sy2);
            this.draw();
        }

         /**
         * 后退
         * @vx  运动函数返回来的x方向位置值
         * @vy  运动函数返回来的y方向位置值
         */
        this.drawBack = function (vx,vy) {


            this.sx = vx;
            // 如果x轴没有到地图目标点的位置就进行重绘
            if (this.sx >= this.originalX){
                this.sx = this.originalX;
                this.sw = this.originalW;
                this.sx2 = 0;
                this.sw2 = this.width;
            }else{

            
              
                this.sw = (this.width - vx) - vx * this.scaleWidth;
                
                var scaW = this.sw / this.originalW;

                this.sw2 = this.width / scaW;
                this.sx2 = this.width - this.sw2 - (this.width - this.sw2) * this.scaleRigth;

               
            }

            this.sy =  vy;
            if (this.sy >= this.originalY){
                this.sy = this.originalY;
                this.sh = this.originalH;
                this.sy2 = 0;
                this.sh2 = this.height;
            }else{

                this.sh = this.height - vy  - vy * this.scaleHeight;

                var scaH = this.sh / this.originalH;

         

   
                this.sh2 = this.height / scaH;
                this.sy2 = this.height - this.sh2 - (this.height - this.sh2) * this.scaleBottom;
  
            }



            // console.log('w: '+this.sw);
            // console.log('h: '+this.sh);
            // console.log('x: '+this.sx);
            // console.log('y: '+this.sy);

            // console.log('w2: '+this.sw2);
            // console.log('h2: '+this.sh2);
            // console.log('x2: '+this.sx2);
            // console.log('y2: '+this.sy2);

            // console.log(this.sw/this.sw2);

            this.draw();

        }


        // 绘图
        this.draw = function (){
            // 绘制图一
           this.ctx.drawImage(this.img2,this.sx,this.sy,this.sw,this.sh,0,0,can.width,can.height); 
            // 绘制图二
           this.ctx.drawImage(this.img1,this.sx2,this.sy2,this.sw2,this.sh2); 
        }

    }

    

    

   // console.log(config)

    var PinP = function (config){
        this.can = document.querySelector(config.id);
        this.imgLength = config.imgArr.length;
        var indexImg = new Image();
        this.ctx =  this.can.getContext('2d');
        var arr = [];
        if (config.back){
            indexImg.src = config.imgArr[this.imgLength-1].imgUrl2;
            this.index = this.imgLength - 1;
        }else{
            indexImg.src = config.imgArr[0].imgUrl1;
            this.index = 0;
        }
        indexImg.onload = function () {
            this.ctx.drawImage(indexImg,0,0,this.can.width,this.can.height);
        }.bind(this);
        for (var i = 0; i < this.imgLength; i++){
            var obj = new DrawScale(config.imgArr[i],this.can);
            arr.push(obj);
        }
        // config.DrawScaleList = arr;
        for (var attr in config){
            this[attr] = config[attr];
        }
        this.start = 0;
        this.DrawScaleList = arr;
        this.firstPlay = true;
    }
    



    var render = function (callback) {
 


        var vx = 0;
        var vx = 0;
        var drawObj = this.DrawScaleList[this.index];
        var during = this.during;
  
        if (!this.back){
            vx = easeIn(this.start,0,drawObj.originalX,during);
            vy = easeIn(this.start,0,drawObj.originalY,during); 
        }else{
            vx = easeOut(this.start,0,drawObj.originalX,during);
            vy = easeOut(this.start,0,drawObj.originalY,during); 
        }
        this.start++;
        // console.log(start,vx,vy);
        if (vx <= drawObj.originalX){

            this.ctx.clearRect(0, 0, this.can.width, this.can.height);
            if (this.back){
                drawObj.drawBack(vx,vy);
            }else{
                drawObj.drawGo(vx,vy);
            }
            

            req = requestAnimationFrame(function(){
                render.call(this,callback)
            }.bind(this));
        }
        else{
            this.start = 0;
            // console.log(index);
            if (!this.back && this.index >= this.imgLength - 1){
                this.back = true;
                callback && callback();
                cancelAnimationFrame(req);
                return;
             
            }
            if (this.back){
              
                // console.log(index);
                this.index-- 
                // alert(1)
                if (this.index < 0){
                    this.back = false;
                    this.index = 0;
                    callback && callback();
                    cancelAnimationFrame(req);
                    return;
                }
            }else{
                this.index++
            }
            // console.log(index);
            render.call(this,callback);
            // console.log(1);
        }
    };
   
   

    var startPip = function (pip,callback){
        if (!pip.back && pip.index >= this.imgLength){
                pip.back = true;
            }
        render.call(pip,callback);
        
    }
    var endPip = function (){
        cancelAnimationFrame(req)
    }
    window.startPip = startPip;
    window.endPip = endPip;
    window.PinP = PinP;

})();