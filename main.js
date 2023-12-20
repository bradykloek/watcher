const pupil = document.getElementById('pupil');
const w=innerWidth;
const h=innerHeight;
const scaleX=200;
const scaleY=100; 
const idleTime=2000;
const idleThreshold=0.2;

const followDuration=400;
const resetDuration=1000;
const idleDuration=1000;

const followEase="ease";
const resetEase="cubic-bezier(0.5,0,0.5,1)"
const idleEase="cubic-bezier(0.3,0,0.5,1)"

animate(w/2,h/2);

var duration=resetDuration;
var ease=resetEase;

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
    },{duration: duration, fill: "forwards", easing: ease});
}

function calcDuration(x,y){
    var distance = Math.sqrt(Math.pow((x-currentX),2)+Math.pow((y-currentY),2));
    
    return distance/speed;
}

document.addEventListener("mousemove", function(e){
    idle=false;
    setTimeout(()=>{duration=followDuration; ease=followEase;},500);
    animate(e.clientX, e.clientY);
    resetTimer();
});


function resetTimer() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(startIdle,idleTime);
}

function random(min,max){
    return Math.random()*(max-min)+min;
}

function pm(){
    if(Math.random()>0.5) return 1;
    else return -1;
}

function startIdle() {
    idle=true;
    duration=resetDuration;
    ease=resetEase;
    animate(w/2,h/2);

    let i=Math.floor(random(2,3.5))
    idleTimer = setTimeout(()=>{idleRoam(i);},random(8000,16000))
}

function idleRoam(i){
    console.log(i);
    if(i>0){
        duration=idleDuration;
        ease=idleEase;
        animate((0.5+pm()*(random(.2,.5)))*w,(0.5+pm()*(random(.2,.5)))*h)
        idleTimer = setTimeout(()=>{idleRoam(i-1);},random(2000,3500))
    }   
    else startIdle();
}