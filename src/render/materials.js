// Fixed procedural texture: never changes between frames or matches.
export function stone(ctx, x, y, width, height) {
  ctx.fillStyle = "#c9c690";
  ctx.fillRect(x, y, width, height);
  for (let row = 0; row < height; row += 27)
    for (let col = 0; col < width; col += 47) {
      const offset = (Math.floor(row / 27) % 2) * 23;
      ctx.fillStyle =
        (Math.floor(col / 47) + Math.floor(row / 27)) % 2
          ? "#d8d29e"
          : "#cec893";
      ctx.fillRect(x + col - offset + 1, y + row + 1, 45, 25);
      ctx.strokeStyle = "#9ba16d55";
      ctx.lineWidth = 0.8;
      ctx.strokeRect(x + col - offset + 1, y + row + 1, 45, 25);
      ctx.strokeStyle = "#f2eac055";
      ctx.beginPath();
      ctx.moveTo(x + col - offset + 5, y + row + 4);
      ctx.lineTo(x + col - offset + 38, y + row + 4);
      ctx.stroke();
    }
}
export function clipStreetCorridors(ctx, streets) {
  // Buildings must never conceal an approach lane, including branches.
  for (const s of streets) {
    const points = [s.from, ...(s.via || []), s.to];
    for (let i = 1; i < points.length; i++) {
      const [x, y] = points[i - 1],
        [tx, ty] = points[i],
        length = Math.hypot(tx - x, ty - y);
      const nx = (-(ty - y) / length) * (s.width / 2 + 3),
        ny = ((tx - x) / length) * (s.width / 2 + 3);
      ctx.beginPath();
      ctx.rect(-100, -100, 1200, 900);
      ctx.moveTo(x + nx, y + ny);
      ctx.lineTo(tx + nx, ty + ny);
      ctx.lineTo(tx - nx, ty - ny);
      ctx.lineTo(x - nx, y - ny);
      ctx.closePath();
      ctx.clip("evenodd");
    }
  }
}
