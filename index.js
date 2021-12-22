
let bgs, bg1, bg2, bg3, bg4;
function preload(){
    bg1 = loadImage("images/1.jpeg");
    bg2 = loadImage("images/2.jpeg");
    bg3 = loadImage("images/3.jpeg");
    bg4 = loadImage("images/4.jpeg");
    bg5 = loadImage("images/5.jpg");
}



function setup(){
    bgs = [bg1, bg2, bg3, bg4, bg5];
    pixelDensity(1);
    const c = createCanvas(100,100);
    c.parent("canvas-holder");
    const canvasHolder = document.getElementById("canvas-holder");
    resizeCanvas(canvasHolder.offsetWidth, canvasHolder.offsetHeight);

    document.getElementById("backgroundImage-range").value = 1;
    document.getElementById("iterations-range").value = 1;
    document.getElementById("sizeMult-range").value = 0.35;
    document.getElementById("alphaMult-range").value = 0.90;
    document.getElementById("blurSize-range").value = 2;
    document.getElementById("darkenStr-range").value = 0;

    render();

}

function render(){
    background(255,0,255);

   


    const iterations = int(document.getElementById("iterations-range").value);
    const sizeMult = float(document.getElementById("sizeMult-range").value);
    const alphaMult = float(document.getElementById("alphaMult-range").value);
    const blurSize = float(document.getElementById("blurSize-range").value);
    const darkenStr = float(document.getElementById("darkenStr-range").value);


    drawStuff();
    document.getElementById("original-image").src = document.querySelector("canvas").toDataURL();
    bloom(iterations, sizeMult, alphaMult, blurSize, darkenStr);
}

function drawStuff(){
    
    background(0,0,0);

    const backgroundImage = int(document.getElementById("backgroundImage-range").value);
    image(bgs[backgroundImage-1], 0, 0, width, height);
    noStroke();
    blendMode(ADD);
    fill(255);
    ellipse(width/2, height/2, height/3);
    fill(255,0,0);
    ellipse(random()*width, random()*height, height/6);
    fill(0,255,0);
    ellipse(random()*width, random()*height, height/6);
    fill(0,0,255);
    ellipse(random()*width, random()*height, height/6);
    blendMode(BLEND);


}

function bloom(iterations, sizeMult, alphaMult, blurSize, darkenStr){
    const canvas = document.querySelector("canvas");
    const canvasImg = createImg(canvas.toDataURL(), (canvasImg)=>{
        
        for (let iteration = 1; iteration < iterations+1; iteration++) {
            //create process canvas
            const tempCanvas = createGraphics(  max(1,floor(width*pow(sizeMult,iteration))),
                                                max(1,floor(height*pow(sizeMult,iteration))));
            console.log(tempCanvas.width, tempCanvas.height);
            console.log("s");
            //copy original picture to process canvas
            tempCanvas.image(canvasImg, 0, 0, tempCanvas.width, tempCanvas.height);
            
            //darkening part
            tint(255,255,255,255*pow(darkenStr,iteration));
            blendMode(MULTIPLY);
            image(tempCanvas,0,0,width,height);

            
            
            //do some processing
            tint(255,255,255,255*pow(alphaMult,iteration));
            tempCanvas.filter(BLUR, blurSize);
            blendMode(ADD);
            //apply the processed image to canvas
            image(tempCanvas,0,0,width,height);


            saveToHistory(tempCanvas.canvas.toDataURL());//save the process only image to history
            blendMode(BLEND);
            saveToHistory(canvas.toDataURL());//save the current canvas to history
            
            tempCanvas.remove();
            noTint();
        }
        
        
    });
    canvasImg.remove();

    function saveToHistory(processedImageSrc){
        const tempImg = document.createElement("img");
        tempImg.src = processedImageSrc;
        const historyContainer = document.getElementById("history-container");
        historyContainer.append(tempImg);
            
    }
}





const backgroundImage = document.getElementById("backgroundImage-range");
backgroundImage.addEventListener("change",()=>{
    document.getElementById("backgroundImage-range-label").textContent = backgroundImage.value;
    resetHistory();
    render();
});

const iterations = document.getElementById("iterations-range");
iterations.addEventListener("change",()=>{
    document.getElementById("iterations-range-label").textContent = iterations.value;
    resetHistory();
    render();
});

const sizeMult = document.getElementById("sizeMult-range");
sizeMult.addEventListener("change",()=>{
    document.getElementById("sizeMult-range-label").textContent = sizeMult.value;
    resetHistory();
    render();
});

const alphaMult = document.getElementById("alphaMult-range");
alphaMult.addEventListener("change",()=>{
    document.getElementById("alphaMult-range-label").textContent = alphaMult.value;
    resetHistory();
    render();
});

const blurSize = document.getElementById("blurSize-range");
blurSize.addEventListener("change",()=>{
    document.getElementById("blurSize-range-label").textContent = blurSize.value;
    resetHistory();
    render();
});

const darkenStr = document.getElementById("darkenStr-range");
darkenStr.addEventListener("change",()=>{
    document.getElementById("darkenStr-range-label").textContent = darkenStr.value;
    resetHistory();
    render();
});



function resetHistory(){
    const historyPictures = document.getElementById("history-container").querySelectorAll("img");
    for (const picture of historyPictures) {
        picture.remove();
    }
    
}





