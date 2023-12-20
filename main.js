const pupil = document.getElementById('pupil');
const w=innerWidth;
const h=innerHeight;
const scaleX=200;
const scaleY=100; 
const idleTime=3000;
const idleRepeat=3000;
const idleThreshold=0.2;
const speed=500;

var currentX,currentY;


animate(w/2,h/2);

var idle=false;
var idleTimer = setTimeout(1);

function animate(x,y){
    yMult=Math.cos((w/2-x)/960*Math.PI/2.5);
    x=(x-w/2)*scaleX/w+w/2;
    y=(y-h/2)*scaleY*yMult/h+h/2;

    currentX=x;
    currentY=y;
    
    pupil.animate({
        left: `${x}px`,
        top: `${y}px`
    },{duration: speed, fill: "forwards"});
}

document.addEventListener("mousemove", function(e){
    idle=false;
    animate(e.clientX, e.clientY);
    resetTimer();
});


function resetTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(idleAnim,idleTime);
}

function idleAnim() {
    idle=true;
    var xMult=Math.random();
    var yMult=Math.random();
    var x,y;

    console.log(xMult+"     "+yMult+"\n"+(xMult+yMult))

    if((Math.abs(.5-xMult)<idleThreshold)&&(Math.abs(.5-yMult)<idleThreshold)){
        x=w/2;
        y=h/2;
    }
    else{
        x=xMult*w;
        y=yMult*h;
    }
    animate(x,y);
    var idleRepeatTimer = setTimeout(()=>{if(idle)idleAnim();},idleRepeat)
}