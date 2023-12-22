const pupil = document.getElementById('pupil');
const circles = document.getElementsByClassName("circle");
const style = window.getComputedStyle(document.body);
const scaling = style.getPropertyValue('--scaling');
const w=innerWidth;
const h=innerHeight;
const scaleX=200*scaling;
const scaleY=80*scaling; 
const idleTime=2000;
const idleThreshold=0.2;
const angle = 2*Math.PI/circles.length;
const followRad=19*scaling;
const idleRad=15*scaling;
const minScale=0.91;

const followDuration=400;
const resetDuration=1000;
const idleDuration=1000;
const dilateDurationScale=0.6;

const followEase="ease";
const resetEase="cubic-bezier(0.5,0,0.5,1)"
const idleEase="cubic-bezier(0.3,0,0.5,1)"

const dilateTimeScale=10;

var duration=resetDuration;
var ease=resetEase;
var radius=idleRad;

var idle=false;
var moving=false;
var idleTimer = setTimeout(1);

var counter=15;

var distance;
const maxDist=Math.sqrt(Math.pow((w/2),2)+Math.pow((h/2),2));

pupil.style.left = `${w/2}px`;
pupil.style.top = `${h/2}px`;
startIdle();

function animate(x,y){
    distance=Math.sqrt(Math.pow((x-w/2),2)+Math.pow((y-h/2),2));

    yMult=Math.cos((w/2-x)/960*Math.PI/2.5);
    x=(x-w/2)*scaleX/w+w/2;
    y=(y-h/2)*scaleY*yMult/h+h/2;
    


    pupil.animate({
        left: `${x}px`,
        top: `${y}px`,
        scale: `${.99-(1-minScale)*distance/maxDist}`            //.99 to make it so the pupil is never at full scale, solving an issue where the graphic looked slightly different in each state
    },{duration: duration, fill: "forwards", easing: ease});
    distributeCircles();
}

document.addEventListener("mousemove", function(e){
    if(idle) dilate(radius,followRad,followDuration*dilateDurationScale);
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
    counter--;
    if(counter<1) setTimeout(()=>{location.reload();},1005);
    idle=true;
    duration=resetDuration;
    ease=resetEase;
    animate(w/2,h/2);
    dilate(radius,idleRad,resetDuration*dilateDurationScale);

    let i=Math.floor(random(2,3.5))
    idleTimer = setTimeout(()=>{idleRoam(i);},random(10000,18000))
}

function idleRoam(i){
    if(i>0){
        duration=idleDuration;
        ease=idleEase;
        dilate(radius,followRad,idleDuration*dilateDurationScale);
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

function dilate(start, end, time){
    var change=(end-start)/time*dilateTimeScale;
    dilateChange(time, change);
}

function dilateChange(time, change){
    if(time>0){
        time-=dilateTimeScale;
        radius+=change;
        setTimeout(()=>{dilateChange(time,change)},dilateTimeScale);
    }
}