var cnv,img;
var resdiv;
    var options = [' ','`','.',',-',"':",';_~','"','*|','!l',
'+=','>','<L','\\i','/^','1?','Jv','r','()cx','7}','sz',
'3u','2Ckty{','jn','4FVY','5P[]af','qw','Sde','Eo',
'NOZ','9HXgh','GTU','$AIm','QW','KM','%8','#06@','bp',
'D','&','R','B'];
var reversedOptions = options.slice().reverse();
var len = options.length - 1;
var gui,btn,livebtn;
var live = false;
var grayScale = false;
var sharpen = false;
var ascii = false;
var filter = false;
var reverse = false;
var filterOptions = 0;
var capture;
var pg;
var matAscii = [];

function setup() {
  //paragraph for display of ascii result
  resdiv = createP('');
  resdiv.style('font-family', '"Courier new", Courier, monospace');
  resdiv.style('font-size', '10');
  //video capture elements
  pg = createGraphics(240,120);
  capture = createCapture(VIDEO);
  capture.size(240, 120);
  capture.hide();
 
  //gui elements
  gui = createDiv('');
  livebtn = createButton('LIVE');
  livebtn.mousePressed(function(){live=!live;});
  livebtn.parent(gui);
  filterbtn = createButton('CHANGE FILTER');
  filterbtn.parent(gui);
  filterbtn.style('display', 'none');
  filterbtn.mousePressed(function(){changeFilter(1);});
  cnv = createCanvas(240,120);
  background(255);
}

function calculoHist(img){
  let hist = [];
  for(let i = 0; i < 256; i++){
     hist[i] = 0;
  }
 
  if(ascii){
    for (let i = 0; i < matAscii.length; i++) {
     
      for (let j = 0; j < matAscii[0].length; j++) {
        let bright = int(brightness(img.get(i, j)));
      }
  }
  }
 
  // Calculate the histogram
  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      let bright = int(brightness(img.get(i, j)));
      hist[bright] = hist[bright] +1;
    }
  }
 
  return hist;
}

function histograma(){
 
  let img = pg.get();
 
  let hist = calculoHist(img);
   
    let histMax = max(hist);
 
  stroke(255);
  // Draw half of the histogram (skip every second value)
  for (let i = 0; i < img.width; i += 2) {
    // Map i (from 0..img.width) to a location in the histogram (0..255)
    let which = int(map(i, 0, img.width, 0, 255));
    // Convert the histogram value to a location between
    // the bottom and the top of the picture
    let y = int(map(hist[which], 0, histMax, img.height, 0));
    line(i, img.height, i, y);
  }
}

function draw() {
  changeFilter(0);
  if (live) {
  document.getElementById("frameRate").innerHTML = frameRate();
    image(capture, 0, 0, width, height);
    cnv.style('position', 'fixed');
    cnv.style('top', '0');
    filterbtn.style('display', 'block');
   if (ascii) {
       calcCapture(getOptions());
   }
   if (grayScale) {
     toBlackAndWhite();
     //toBlur();
     image(pg, 0, 0, width, height);
   }
   if (sharpen) {
     toSharpen();
     image(pg, 0, 0, width, height);
   }
  }else{
    histograma();
  }
 
}

function calcCapture(options) {
  matAscii = [];
  pg.image(capture,0,0,240,120);
  var res = '<pre>';
  for (var i=0; i<60; i++) {
    var line = '';
    for (var j=0; j<200; j++) {
      var x = pg.get(round(j*1.143),i*2);
      var f = (1-x[0]/255.0);
      f = f*f; //square factor to lighten up, because less bright characters
      var v = round(f*len);
      var index = floor(random(options[v].length));
      var chr = options[v][index];
      if (chr==' ') chr='&nbsp;';
      if (chr=='<') chr='&lt;';
      if (chr=='>') chr='&gt;';
      if (chr=='"') chr='&quot;';
      line += chr;
    }
 
    matAscii.push(line);
    res += line+'<br>';
  }
  res += '</pre>';
  resdiv.html(res);
}

function changeFilter(pase) {
  let selection = (filterOptions + pase) % 4;
  switch(selection) {
    case 0:
        grayScale = false;
        reverse = false;
        sharpen = false;
        ascii = true;
        break;
    case 1:
        reverse = true;
        break;
    case 2:
        ascii = false;
        reverse = false;
        sharpen = false;
        grayScale = true;
        break;
    case 3:
        ascii = false;
        reverse = false;
        grayScale = false;
        sharpen = true;
        break;
  }
  filterOptions += pase;
}

 function toBlackAndWhite() {
  pg.image(capture,0,0,240,120);
  pg.loadPixels();
  for (let i = 0; i < pg.width; i++) {
    for (let j = 0; j < pg.height; j++) {
      let pixel = pg.get(i,j);
      let average = calculateAverageFromPixel(pixel);
        pg.set(i, j, color(average, average, average));
    }
  }
  pg.updatePixels();
}

function calculateAverageFromPixel(pixel) {
   return (pixel[0] + pixel[1] + pixel[2]) / 3;
}

function getSubMatrix(pg, i, j) {
  let matrix = pg.get(i-1, j-1, 3, 3);
  let array = [
  calculateAverageFromPixel(matrix.get(0, 0)), calculateAverageFromPixel(matrix.get(1, 0)), calculateAverageFromPixel(matrix.get(2, 0)),
  calculateAverageFromPixel(matrix.get(0, 1)), calculateAverageFromPixel(matrix.get(1, 1)), calculateAverageFromPixel(matrix.get(2, 1)),
  calculateAverageFromPixel(matrix.get(0, 2)), calculateAverageFromPixel(matrix.get(1, 2)), calculateAverageFromPixel(matrix.get(2, 2))
  ];
  return array;
}

function toSharpen() {
  image(pg, 0, 0, width, height);
  pg.loadPixels();
  for (let i = 1; i < pg.width - 1; i++){
   for (let j = 1; j < pg.height - 1; j++) {
      let matrixPixel = getSubMatrix(pg, i, j);
      let filter = calculateBlurFromPixelMatrix(matrixPixel);
      pg.set(i, j, color(filter, filter, filter));
   }
  }
  pg.updatePixels();
}

function calculateBlurFromPixelMatrix(matrix) {                  
let sharpenMatrix = [0, -1, 0,
                    -1, 5, -1,
                     0, -1, 0];

 let sum = 0;
 for (let i = 0; i < 9; i++) {
   sum += matrix[i] * sharpenMatrix[i];
 }
   return sum;
}

function getOptions() {
 if (reverse) {
    return reversedOptions;
 }
 return options;
}