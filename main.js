const pupil = document.getElementById('pupil');
const circles = document.getElementsByClassName("circle");
const w=innerWidth;
const h=innerHeight;
const scaleX=200;
const scaleY=100; 
const idleTime=2000;
const idleThreshold=0.2;
const angle = 2*Math.PI/circles.length;
const inRad=22;
const outRad=15;

const followDuration=400;
const resetDuration=1000;
const idleDuration=1000;

const followEase="ease";
const resetEase="cubic-bezier(0.5,0,0.5,1)"
const idleEase="cubic-bezier(0.3,0,0.5,1)"

var duration=resetDuration;
var ease=resetEase;
var radius=25;

var idle=false;
var moving=false;
var idleTimer = setTimeout(1);

var distance;
const maxDist=Math.sqrt(Math.pow((w/2),2)+Math.pow((h/2),2));

animate(w/2,h/2);
distributeCircles();

function animate(x,y){
    distance=Math.sqrt(Math.pow((x-w/2),2)+Math.pow((y-h/2),2));
    radius=inRad+(outRad-inRad)*(distance/maxDist);

    yMult=Math.cos((w/2-x)/960*Math.PI/2.5);
    x=(x-w/2)*scaleX/w+w/2;
    y=(y-h/2)*scaleY*yMult/h+h/2;


    console.log(distance+"     "+maxDist);
    pupil.animate({
        left: `${x}px`,
        top: `${y}px`
    },{duration: duration, fill: "forwards", easing: ease});
    distributeCircles();
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
    if(i>0){
        duration=idleDuration;
        ease=idleEase;
        animate((0.5+pm()*(random(.2,.5)))*w,(0.5+pm()*(random(.2,.5)))*h)
        idleTimer = setTimeout(()=>{idleRoam(i-1);},random(2000,3500))
    }   
    else startIdle();
}

function distributeCircles(){
        for(var i = 0 ; i<circles.length ; i++){
            circles[i].style.transform = `translate(${radius*Math.cos(i*angle)}px,${radius*Math.sin(i*angle)}px) `
        }
    requestAnimationFrame(distributeCircles);
}