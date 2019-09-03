


let $img = $('.img_cover');
const $space = $('#space');
let images = [
    'img/8.png',
    'img/11.png',
    'img/14.png',
    'img/18.png',
    'img/6.png',
    'img/7.png',
    'img/8.png',
    'img/9.png',
    'img/9_1.png',
    'img/10.png',
    'img/11.png',
    'img/11_1.png',
    'img/12.png',
    'img/13.png',
    'img/14.png',
    'img/14_1.png',
    'img/16.png',
    'img/17.png',
    'img/17_1.png',
    'img/18.png',
    'img/19.png',
    'img/20.png',
    'img/21.png',
    'img/22.png',
    'img/23.png',
    'img/24.png',
    'img/25.png',
    'img/26.png',
    'img/27.png',
    'img/28.png',
    'img/28_1.png',
    'img/29.png',
    'img/30.png',
    'img/31.png',
    'img/32.png',
    'img/33.png',
    'img/34.png',
];
for (let i = 0; i < images.length-1; i++){
    let html = `
                <div class="img_cover frame_01"></div>
                <div class="img_cover frame_02"></div>
                <div class="img_cover frame_01"></div>
                <div class="img_cover frame_02"></div>
                <div class="img_cover rot_img_${i+1}"></div>
                <div class="img_cover frame_01"></div>
                <div class="img_cover frame_02"></div>
                <div class="img_cover frame_01"></div>
        `;
    $space.append(html)

}
$img = $('.img_cover');
$.each($img, function (i, item) {
    $(item).css({
        transform: `rotateY(${-i * 15}deg)`,
    });
});

rotate();
function rotate() {
    let startX = 0,moveX = 0, endX = 0;
    let moveDis = 0,translateX = 0,endDis = 0;
    let sTime = 0,eTime = 0,expendTime;
    let speed = 0;
    $space.on('touchstart', function (e) {
        startX = e.changedTouches[0].pageX;
        translateX = moveDis;
        sTime = new Date().getTime();
        console.log(startX)
    });

    $space.on('touchmove', function (e) {
        moveX = e.changedTouches[0].pageX;
        moveDis = (moveX - startX)*.15 + translateX;

        if (moveDis < 0 ){
            moveDis = 0;
        }
        if (moveDis >= ($img.length-4) * 15){
            moveDis = ($img.length-4) * 15;
        }

        everyImg(moveDis);
    });
    $space.on('touchend', function (e) {

        endX = e.changedTouches[0].pageX;
        endDis = (endX - startX)*.15;
        eTime = new Date().getTime();
        expendTime = eTime - sTime;
        speed = endDis / expendTime * 200;

        moveDis = moveDis + speed;
        if (moveDis < 0 ){
            moveDis = 0;
        }
        if (moveDis >= ($img.length-4) * 15){
            moveDis = ($img.length-4) * 15;
        }

        let time = Math.abs(speed * 70);
        everyImg(moveDis,1000);

        console.log('speed:'+speed,time);
        console.log(moveDis-translateX,endDis);
    })
}

function everyImg(dis,time){
    let imgArr = [];
    $.each($img, function (i, item) {
        $(item).css({
            transition:time + 'ms linear'
        });
        imgArr[i] = dis - i * 15;

        if (imgArr[i] > 59 || imgArr[i] < -120){
            $(this).hide();
        }
        if(imgArr[i] >= -120 && imgArr[i] < 60){
            $(this).show();



            $(item).css({
                transform: `rotateY(${dis - i * 15}deg)`,
            });
        }
        if (dis >= ($img.length-1) * 15 && imgArr[i] < 60 ){
            console.log(this)
        }
    });
}




document.body.addEventListener('touchmove', function (e) {
    e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
}, {passive: false}); //passive 参数不能省略，用来兼容ios和android