
let theShader;
let cam;
var gui,btn,livebtn;
let live = false;
let filter = 0;
let filterSelection = 0;
function preload(){
  grayFilter = loadShader('webcam.vert', 'webcam.frag');
  sharpenFilter = loadShader('webcam.vert', 'sharpen.frag');
  drawingFilter = loadShader('webcam.vert', 'drawing.frag');
}

function initVideo() {
  createCanvas(500, 500, WEBGL);
  noStroke();
  cam = createCapture(VIDEO);
  cam.size(500, 500);
  cam.hide();
}

function setup() {
  initVideo();
  gui = createDiv('');
  livebtn = createButton('LIVE');
  livebtn.mousePressed(function(){live=!live;});
  livebtn.parent(gui);
  filterbtn = createButton('CHANGE FILTER');
  filterbtn.parent(gui);
  filterbtn.style('display', 'none');
  filterbtn.mousePressed(function(){changeFilter(1);});
}

function changeFilter(pase) {
  filter += pase;
  filterSelection = filter % 3;
}
function draw() {
  if (live) {
  document.getElementById("frameRate").innerHTML = frameRate();
  filterbtn.style('display', 'block');
  switch (filterSelection) {
    case 0:
    default:
      shader(grayFilter);
      grayFilter.setUniform('tex0', cam);   
      break;
    case 1:
      shader(sharpenFilter);
      sharpenFilter.setUniform('tex0', cam);   
      break;
    case 2:
      shader(drawingFilter);
      drawingFilter.setUniform('tex0', cam);
      break;
      
  }
  rect(0,0,width,height);
  }
}

