var mic;
var fft;
var amplitude;

const RATE = 0.3;
var h_val = 0;
const MAX_FREQ = 256 * 255;
const MAX_AMP_FREQ = 255 * 256 * 257 / 2;
const SMOOTH = 0.7;

function setup() {
  createCanvas(windowWidth, windowHeight);
	colorMode(HSB, 360, 100, 100);
	mic = new p5.AudioIn();
  mic.start();
	fft = new p5.FFT(SMOOTH,256);
	fft.setInput(mic);
  amplitude = new p5.Amplitude();
  amplitude.setInput(mic);
}

function normalize(x, n) {
  return x;
}

function draw() {
	var spectrum = fft.analyze();
  var sum = spectrum.reduce((a,b)=>a+b);
  var avg = sum / 256;
  const cuttoff_index = spectrum.map((val,index) => (val>=avg?index:0))
	const h = normalize(((h_val+=0.5)%360),1);
	const s = normalize(map(sum, 0, MAX_FREQ, 0, 100), 1);
	const v = normalize(map(amplitude.getLevel(), 0, 1, 0, 100), 1);
	console.log(h, s, v);
  background(h, s, v);
}