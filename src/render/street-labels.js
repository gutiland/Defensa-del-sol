import { STREETS } from "../data/map.js";
import { ROUTES, distanceToSegment } from "../data/routes.js";
export function streetLabelLayout(measure) {
  const boxes = [];
  for (const street of STREETS) {
    const lines =
      street.name.length > 18 ? ["CARRERA DE", "SAN JERÓNIMO"] : [street.name];
    const width = Math.max(48, ...lines.map((line) => measure(line) + 16)),
      height = lines.length > 1 ? 32 : 20;
    const candidates = [];
    for (let dy = -110; dy <= 110; dy += 10)
      for (let dx = -110; dx <= 110; dx += 10)
        candidates.push({
          x: street.label[0] + dx,
          y: street.label[1] + dy,
          d: dx * dx + dy * dy,
        });
    const box = candidates
      .sort((a, b) => a.d - b.d)
      .find((p) => {
        if (
          p.x - width / 2 < 8 ||
          p.x + width / 2 > 992 ||
          p.y < 88 ||
          p.y > 657
        )
          return false;
        if (
          boxes.some(
            (b) =>
              Math.abs(p.x - b.x) < (width + b.width) / 2 + 5 &&
              Math.abs(p.y - b.y) < (height + b.height) / 2 + 5,
          )
        )
          return false;
        for (let x = p.x - width / 2; x <= p.x + width / 2; x += 5)
          for (const y of [p.y - height / 2, p.y, p.y + height / 2]) {
            if (
              ROUTES.some((points) =>
                points
                  .slice(1)
                  .some((b, i) => distanceToSegment(x, y, points[i], b) < 19),
              )
            )
              return false;
            if (
              STREETS.some((s) => {
                const pts = [s.from, ...(s.via || []), s.to];
                return pts
                  .slice(1)
                  .some(
                    (b, i) =>
                      distanceToSegment(x, y, pts[i], b) < s.width / 2 + 4,
                  );
              })
            )
              return false;
          }
        return true;
      });
    if (box) boxes.push({ ...box, width, height, lines, name: street.name });
  }
  return boxes;
}
export function drawStreetLabels(ctx) {
  ctx.save();
  ctx.font = "700 11px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const boxes = streetLabelLayout((text) => {
    const w = ctx.measureText(text).width;
    return Number.isFinite(w) ? w : text.length * 7;
  });
  for (const b of boxes) {
    ctx.fillStyle = "#fff4d9";
    ctx.strokeStyle = "#354b39";
    ctx.lineWidth = 1.5;
    ctx.fillRect(b.x - b.width / 2, b.y - b.height / 2, b.width, b.height);
    ctx.strokeRect(b.x - b.width / 2, b.y - b.height / 2, b.width, b.height);
    ctx.fillStyle = "#20372d";
    b.lines.forEach((line, i) =>
      ctx.fillText(line, b.x, b.y + (i - (b.lines.length - 1) / 2) * 12),
    );
  }
  ctx.restore();
}
