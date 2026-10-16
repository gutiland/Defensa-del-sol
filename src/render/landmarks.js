import { label } from "./architecture.js";
export function drawLandmarks(ctx) {
  // The oval fountain and equestrian monument, drawn in a storybook style.
  ctx.fillStyle = "#796e61";
  ctx.beginPath();
  ctx.ellipse(585, 420, 59, 25, 0, 0, 7);
  ctx.fill();
  ctx.fillStyle = "#9cc7c7";
  ctx.beginPath();
  ctx.ellipse(585, 416, 53, 20, 0, 0, 7);
  ctx.fill();
  ctx.strokeStyle = "#e8f5df";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(585, 416, 44, 14, 0, 0, 7);
  ctx.stroke();
  ctx.fillStyle = "#a9967e";
  ctx.fillRect(575, 395, 21, 22);
  ctx.fillStyle = "#dfceb0";
  ctx.fillRect(571, 409, 29, 6);
  ctx.fillRect(573, 393, 25, 5);
  ctx.fillStyle = "#66694f";
  ctx.fillRect(579, 400, 13, 6);
  ctx.strokeStyle = "#4d655b";
  ctx.fillStyle = "#536d60";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.ellipse(586, 386, 16, 7, 0, 0, 7);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(575, 388);
  ctx.lineTo(573, 401);
  ctx.moveTo(597, 388);
  ctx.lineTo(599, 400);
  ctx.moveTo(595, 384);
  ctx.lineTo(601, 373);
  ctx.lineTo(608, 377);
  ctx.moveTo(584, 384);
  ctx.lineTo(584, 371);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(584, 367, 4, 0, 7);
  ctx.fill();
  // Horse muzzle, mane, tail and the rider's raised arm clarify the silhouette.
  ctx.strokeStyle = "#354e45";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(577, 383);
  ctx.quadraticCurveTo(567, 379, 566, 394);
  ctx.moveTo(596, 384);
  ctx.lineTo(603, 371);
  ctx.lineTo(612, 375);
  ctx.lineTo(609, 380);
  ctx.moveTo(584, 375);
  ctx.lineTo(591, 370);
  ctx.lineTo(594, 359);
  ctx.stroke();
  ctx.strokeStyle = "#91a18a";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(578, 383);
  ctx.lineTo(592, 381);
  ctx.stroke();
  label(ctx, "CARLOS III", 585, 455, 8);
  // Oso y Madroño, near the Alcalá end of the northern bank line.
  ctx.fillStyle = "#b9a68c";
  ctx.fillRect(831, 326, 28, 9);
  ctx.fillStyle = "#665742";
  ctx.fillRect(850, 294, 5, 33);
  ctx.fillStyle = "#71866b";
  for (const [x, y, r] of [
    [850, 289, 13],
    [840, 294, 10],
    [861, 294, 10],
  ]) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 7);
    ctx.fill();
  }
  ctx.fillStyle = "#5d5145";
  ctx.beginPath();
  ctx.ellipse(838, 316, 6, 12, -0.4, 0, 7);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(843, 305, 5, 0, 7);
  ctx.fill();
  ctx.strokeStyle = "#493e31";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(839, 314);
  ctx.lineTo(851, 304);
  ctx.moveTo(836, 320);
  ctx.lineTo(832, 328);
  ctx.moveTo(841, 321);
  ctx.lineTo(844, 328);
  ctx.stroke();
  ctx.fillStyle = "#443c31";
  ctx.beginPath();
  ctx.arc(841, 300, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#be6850";
  for (const [x, y] of [
    [841, 289],
    [851, 282],
    [859, 290],
    [845, 297],
    [855, 296],
  ]) {
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "#b4c58a";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(850, 289, 9, Math.PI, Math.PI * 1.7);
  ctx.stroke();
  label(ctx, "OSO Y MADROÑO", 845, 349, 8);
  ctx.fillStyle = "#bbaa91";
  ctx.fillRect(140, 326, 18, 10);
  ctx.fillStyle = "#eee2c6";
  ctx.fillRect(145, 302, 8, 24);
  ctx.beginPath();
  ctx.arc(149, 297, 5, 0, 7);
  ctx.fill();
  ctx.fillStyle = "#cbb994";
  ctx.fillRect(137, 333, 24, 4);
  ctx.fillRect(142, 324, 14, 4);
  ctx.strokeStyle = "#b7a887";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(149, 305);
  ctx.lineTo(147, 323);
  ctx.moveTo(145, 306);
  ctx.lineTo(141, 314);
  ctx.moveTo(152, 306);
  ctx.lineTo(157, 310);
  ctx.stroke();
  label(ctx, "MARIBLANCA", 149, 349, 8);
  // Retain the recognisable glazed Cercanías pavilion rather than a planned replacement.
  ctx.fillStyle = "#617c7d";
  ctx.beginPath();
  ctx.ellipse(713, 473, 48, 17, -0.12, Math.PI, Math.PI * 2);
  ctx.lineTo(761, 478);
  ctx.lineTo(665, 488);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#d5ede4";
  ctx.lineWidth = 2;
  ctx.stroke();
  for (let x = 677; x < 755; x += 12) {
    ctx.beginPath();
    ctx.moveTo(x, 460);
    ctx.lineTo(x + 3, 482);
    ctx.stroke();
  }
  ctx.fillStyle = "#132f35";
  ctx.beginPath();
  ctx.ellipse(714, 481, 35, 6, -0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#a7d7d7";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(674, 469);
  ctx.quadraticCurveTo(706, 446, 751, 466);
  ctx.stroke();
  ctx.strokeStyle = "#eef5df";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(686, 466);
  ctx.lineTo(705, 458);
  ctx.stroke();
  label(ctx, "SOL · CERCANÍAS", 713, 502, 8);
  ctx.fillStyle = "#cf694f";
  ctx.beginPath();
  ctx.moveTo(405, 255);
  ctx.lineTo(417, 264);
  ctx.lineTo(405, 273);
  ctx.lineTo(393, 264);
  ctx.closePath();
  ctx.fill();
  label(ctx, "M", 405, 268, 9, "#fff5de");
}
