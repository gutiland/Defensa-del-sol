import { ROUTES, PATH_WIDTH } from "../data/routes.js";
export function drawPaths(ctx) {
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const [color, width] of [
    ["#677456", PATH_WIDTH + 5],
    ["#c7bb87", PATH_WIDTH],
    ["#e5d9a9", PATH_WIDTH - 5],
  ]) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    for (const points of ROUTES) {
      ctx.beginPath();
      ctx.moveTo(...points[0]);
      for (const point of points.slice(1)) ctx.lineTo(...point);
      ctx.stroke();
    }
  }
  ctx.restore();
}
