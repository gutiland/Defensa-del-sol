import { ROUTES } from "../data/routes.js";
import { odorStats } from "../stereotypes.js";
import { BUILDINGS } from "../data/catalog.js";
import { rangeFor } from "../data/weapons.js";
import { STREETS, projectY } from "../data/map.js";
export function drawTactical(ctx, game, preview, view) {
  ctx.save();
  if (view.paths) {
    STREETS.forEach((street, i) => {
      const selected = view.selectedEntries?.includes(i);
      ctx.strokeStyle = selected ? "#edc866dd" : "#4b6e7490";
      ctx.lineWidth = selected ? 4 : 2;
      ctx.setLineDash([8, 5]);
      ctx.beginPath();
      ctx.moveTo(...ROUTES[i][0]);
      for (const point of ROUTES[i].slice(1)) ctx.lineTo(...point);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = selected ? "#f3d78c" : "#a1bbc0";
      ctx.beginPath();
      ctx.arc(...street.to, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  const selected = [game.base, ...game.buildings].find(
    (b) => b.id === view.selected,
  );
  const subject = selected || preview;
  const definition = subject && BUILDINGS[selected ? selected.type : view.kind];
  if (subject && definition) {
    ctx.strokeStyle = selected ? "#e8ce79" : "#c8d5ad88";
    ctx.lineWidth = 1.5;
    ctx.fillStyle = "#d5c67512";
    if (definition.range) {
      ctx.beginPath();
      ctx.ellipse(
        subject.x,
        projectY(subject.y),
        selected?.type === "odor"
          ? odorStats(selected).radius
          : rangeFor(subject, definition),
        (selected?.type === "odor"
          ? odorStats(selected).radius
          : rangeFor(subject, definition)) * 0.66,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      ctx.stroke();
    }
    if (selected) {
      ctx.strokeStyle = "#f5db88";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(selected.x, projectY(selected.y), 46, 33, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
  ctx.restore();
}
