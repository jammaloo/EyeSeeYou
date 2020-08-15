import './main.css';

import Eye from './eye-pupil.png';

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d");

const img = new Image();
img.onload = setCanvasSize;
img.src = Eye;

function setCanvasSize() {
  canvas.width = (this.width>>1 * 1.5);
  canvas.height = (this.height>>1 * 1.5);
  render(0, 0, 0);
}

function render(hue, x, y) {
  let sat = 100;
  let l = 100;

  // https://stackoverflow.com/a/45201094
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "source-over";
  ctx.drawImage(img, x, y, canvas.width, canvas.height);

  // adjust "lightness"
  ctx.globalCompositeOperation = l < 100 ? "color-burn" : "color-dodge";
  // for common slider, to produce a valid value for both directions
  l = l >= 100 ? l - 100 : 100 - (100 - l);
  ctx.fillStyle = "hsl(0, 50%, " + l + "%)";
  ctx.fillRect(x, y, canvas.width, canvas.height);

  // adjust saturation
  ctx.globalCompositeOperation = "saturation";
  ctx.fillStyle = "hsl(0," + sat + "%, 50%)";
  ctx.fillRect(x, y, canvas.width, canvas.height);

  // adjust hue
  ctx.globalCompositeOperation = "hue";
  ctx.fillStyle = "hsl(" + hue + ",1%, 50%)";
  ctx.fillRect(x, y, canvas.width, canvas.height);

  // clip
  ctx.globalCompositeOperation = "destination-in";
  ctx.drawImage(img, x, y, canvas.width, canvas.height);

  // reset comp. mode to default
  ctx.globalCompositeOperation = "source-over";
}

document.onmousemove = document.ontouchmove = document.ontouchstart = function (e) {
  // https://stackoverflow.com/a/11744120
  const width  = window.innerWidth || document.documentElement.clientWidth ||
    document.body.clientWidth;
  const height = window.innerHeight|| document.documentElement.clientHeight||
    document.body.clientHeight;

  const x = e.clientX || e.pageX

  const ratio = (e.clientX + e.clientY) / (width + height)
  const max = 359;

  const play = 60;
  const playBase = (play / 2) * -1;

  const xPlay = (e.clientX / width) * play;
  const yPlay = (e.clientY / height) * play;


  render(max * ratio, playBase + xPlay, playBase + yPlay)
}