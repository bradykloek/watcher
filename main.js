const pupil = document.getElementById('pupil');
const circles = document.getElementsByClassName("circle");

const width=window.innerWidth;
const height=window.innerHeight;
const scaling = window.getComputedStyle(document.body).getPropertyValue('--scaling');
const scaleX=200*scaling;
const scaleY=80*scaling; 
const maxCenterDistance = Math.sqrt(Math.pow((width/2),2)+Math.pow((height/2),2));  // The furthest distance from the center



const movingRadius=19*scaling;
const movingDuration = 1500;
const movingEase="cubic-bezier(0.3,0,0.5,1)";

const idleRadius=15*scaling;
const idleDuration = 1500;
const idleEase="cubic-bezier(0.5,0,0.5,1)";

const minScale=0.9;


const dilateStepSize=10;
var currentRadius = idleRadius;

const idleTime=2000;
let idle = true;
let idleTimeout = setTimeout(1);

// Initial Setup: pupil is centered and idling is started
pupil.style.left = `${width/2}px`;
pupil.style.top = `${height/2}px`;
startIdle();

function animatePupil(x,y,duration,easing){
    // x and y are transformed to coordinates that are within the eye and follow the eye's curvature
    newX=(x-width/2)*scaleX/width+width/2;
    newY=(y-height/2)*scaleY*(Math.cos((width/2-x)/960*Math.PI/2.5))/height+height/2;
    centerDistance = distance(width/2, height/2, x, y);
    pupil.animate({
        left: `${newX}px`,
        top: `${newY}px`,
        // Pupil is scaled down the further it gets from the center
        scale: `${.99-(1-minScale)*centerDistance/maxCenterDistance}`    
        /* The max scale is set to .99 to avoid a graphical bug where the max size
         * appears slightly different from any other scale due to pixel alignment. */
        
    },{duration: duration, fill: "forwards", easing: easing});
    distributeCircles();
}

function distance(x0,y0,x1,y1){
    return Math.sqrt(Math.pow((x1-x0),2)+Math.pow((y1-y0),2));
}

document.addEventListener("mousemove", function(e){
    resetTimer();
    if(idle){
        idle=false;
        dilate(movingRadius,200);
    }
    animatePupil(e.clientX, e.clientY, movingDuration, movingEase);
});

function resetTimer() {
    clearTimeout(idleTimeout);
    idleTimeout = setTimeout(startIdle,idleTime);
}

function random(min,max){
    return Math.random()*(max-min)+min;
}



function startIdle() {
    idle=true;
    animatePupil(width/2,height/2, idleDuration, idleEase);   // Animate back to center
    dilate(idleRadius,800);

    let numLocations=Math.floor(random(2,3.5)) // Either 2 or 3 locations will be picked, with a greater weighting toward 2
    idleTimeout = setTimeout(()=>{pupilRoam(numLocations, width/2, height/2);},randomRange(5000, 10000))    // Wait between 5 and 10 seconds before starting to idle 
}

function plusOrMinus(){
    if(Math.random()>0.5) return 1;
    else return -1;
}

function randomRange(min,max){
    return Math.random()*(max-min)+min;
}

function pupilRoam(numLocations, startX, startY){
    if(numLocations>0){
        dilate(movingRadius,500);

        newX = randomRange(0,width);
        newY = randomRange(0,height);
        centerDistance = distance(startX, startY, newX, newY); 
        while(centerDistance < maxCenterDistance * 0.2){
            newX = randomRange(0,width);
            newY = randomRange(0,height);
        }
        console.log(centerDistance);
        animatePupil(newX,newY, movingDuration, movingEase)
        idleTimeout = setTimeout(()=>{pupilRoam(numLocations-1,newX, newY);},random(2000,3500))
    }   
    else startIdle();
}

function distributeCircles(){
        angle = 2*Math.PI/circles.length;
        for(var i = 0 ; i<circles.length ; i++){
            circles[i].style.transform = `translate(${currentRadius*Math.cos(i*angle)}px,${currentRadius*Math.sin(i*angle)}px) `
        }
    requestAnimationFrame(distributeCircles);
}

function dilate(newRadius, time){
    var change = dilateStepSize * (newRadius-currentRadius) / time;
    dilateChange(time, change);
}

function dilateChange(time, change){
    if(time>0){
        time -= dilateStepSize;
        currentRadius += change;
        setTimeout(()=>{dilateChange(time,change)},dilateStepSize);
    }
}