var mic;
var fft;
var amplitude;

var screenW, screenH, sclH, sclW, sclZ;

var fft_history;

const RATE = 0.3;
var h_val = 0;
const BIN_SIZE = 64;
const MAX_FREQ = BIN_SIZE * 255;
const MAX_AMP_FREQ = 255 * BIN_SIZE * (BIN_SIZE+1) / 2;
const SMOOTH = 0.6;
const FRAME_RATE = 20;
const WIDTH_SPREAD = 250;
function init() {
  sclH = 20;
  sclZ = 3;
  sclW = (windowWidth + WIDTH_SPREAD) / (BIN_SIZE * 2);
  screenW = BIN_SIZE * 2;
  screenH = int(windowHeight / sclH);
  fft_history = new Array(screenH);
  for (var j=0; j<screenH; j++) {
    fft_history[j] = new Array(screenW);
    for (var i=0; i<screenW; i++) {
      fft_history[j][i] = 0;
    }
  }
}

function setup() {
  init();
  frameRate(FRAME_RATE);
  createCanvas(windowWidth, windowHeight, WEBGL);
	colorMode(HSB, 360, 100, 100);
	mic = new p5.AudioIn();
  mic.start();
	fft = new p5.FFT(SMOOTH,BIN_SIZE);
	fft.setInput(mic);
  amplitude = new p5.Amplitude();
  amplitude.setInput(mic);
}

function draw() {
  background(0);
  rotateX(PI/3 + PI);
  translate(-1 * (windowWidth + WIDTH_SPREAD)/2, -windowHeight/2, 55);
  fft_history[0] = fft.analyze().reverse().concat(fft.analyze());
  for (var j=screenH-2; j>=0; j--) {
    for (var i=0; i<screenW-1; i++) {
      stroke(fft_history[j][i],50,50);
      line(i * sclW,j * sclH, -fft_history[j][i] / sclZ, (i+1) * sclW,(j + 1) * sclH, -fft_history[j+1][i+1] / sclZ);
      fft_history[j+1][i]  = fft_history[j][i] * 0.9;
    }
  }
}