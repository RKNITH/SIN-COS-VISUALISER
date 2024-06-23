const theta = document.getElementById("theta");
const infographic = document.getElementById("infographic");
const graphs = document.getElementById("graphs");
const circleCanvas = document.getElementById("circle");
const sinCanvas = document.getElementById("sine");
const cosCanvas = document.getElementById("cosine");

let lastTheta = 0;

const degreesToRadians = (degrees) => degrees * Math.PI / 180;
const radiansToDegrees = (radians) => radians * 180 / Math.PI;

const drawCircle = (canvas) => {
  const ctx = canvas.getContext("2d");
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = Math.min(centerX, centerY) - 10;
  const x = Math.cos(lastTheta) * radius;
  const y = Math.sin(lastTheta) * radius;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.beginPath();
  ctx.strokeStyle = "#666";
  ctx.lineWidth = 0.5;
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.moveTo(0, centerY);
  ctx.lineTo(canvas.width, centerY);
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, canvas.height);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX + x, centerY - y);
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = "#ff0044";
  ctx.lineWidth = 1;
  ctx.moveTo(centerX + x, centerY);
  ctx.lineTo(centerX + x, centerY - y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX + x, centerY);
  ctx.strokeStyle = "#00ff00";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1;
  ctx.arc(centerX, centerY, radius, 0, -lastTheta, true);
  ctx.stroke();
}

const drawGraph = (canvas, label, color, fn, min, max) => {
  const ctx = canvas.getContext("2d");
  const distance = max - min;
  const graphWidth = canvas.width - 120;
  const scale = graphWidth / distance;
  const originY = canvas.height / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.beginPath();
  ctx.strokeStyle = "#666";
  ctx.lineWidth = 0.5;
  ctx.moveTo(0, originY);
  ctx.lineTo(graphWidth, originY);
  for (let i = 0; i < 8; i++) {
    const x = i / 8;
    const offset = i % 2 ? canvas.height / 6 : 0;
    ctx.moveTo(graphWidth * x, offset);
    ctx.lineTo(graphWidth * x, canvas.height - offset);
  }
  ctx.moveTo(graphWidth, 0);
  ctx.lineTo(graphWidth, canvas.height);
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 1;
  ctx.moveTo(0, originY - fn(0) * originY);
  for (let step = 0; step < graphWidth; step++) {
    const i = step / scale;
    const x = step;
    const y = originY - fn(i) * originY;
    if (i >= lastTheta) {
      ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.moveTo(x, y);
      ctx.fillStyle = color;
      ctx.font = '16px sans-serif';
      ctx.fillText(`${label} = ${fn(i).toFixed(3)}`, x + 10, originY - (fn(i) * originY - 8) / 2);
      ctx.lineTo(x, originY);
      ctx.stroke();
      ctx.beginPath();
      ctx.strokeStyle = "#fff";
      ctx.moveTo(0, originY);
      ctx.lineTo(x, originY);
      ctx.stroke();
      return;
    }
    ctx.lineTo(x, y);
  }
}

const handleResize = () => {
  circleCanvas.width = Math.floor(infographic.offsetWidth / 5);
  circleCanvas.height = Math.floor(infographic.offsetWidth / 5);
  sinCanvas.width = (circleCanvas.width - 20) * Math.PI + 120;
  sinCanvas.height = circleCanvas.height - 20;
  cosCanvas.width = (circleCanvas.width - 20) * Math.PI + 120;
  cosCanvas.height = circleCanvas.height - 20;
  render();
}

const render = () => {
  drawCircle(circleCanvas, "#00ff00");
  drawGraph(sinCanvas, "height", "#ff0044", Math.sin, 0, 2 * Math.PI);
  drawGraph(cosCanvas, "width", "#00ff00", Math.cos, 0, 2 * Math.PI);
}

const updateTheta = (value) => {
  lastTheta = value < 0 ? value + 2 * Math.PI : value;
  theta.innerText = [
    `θ = ${(lastTheta / Math.PI).toFixed(2)} π`,
    `${radiansToDegrees(lastTheta).toFixed(2)}°`,
  ].join(" ≈ ");
  render();
}

const handleCircleMouse = (e) => {
  const rect = circleCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = -(e.clientY - rect.top - rect.height / 2);
  updateTheta(Math.atan2(y, x));
}

const handleGraphMouse = (e) => {
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  updateTheta((x / (rect.width - 120)) * (2 * Math.PI));
}

window.addEventListener('resize', handleResize);
circleCanvas.addEventListener("mousemove", handleCircleMouse);
sinCanvas.addEventListener("mousemove", handleGraphMouse);
cosCanvas.addEventListener("mousemove", handleGraphMouse);
handleResize(); 