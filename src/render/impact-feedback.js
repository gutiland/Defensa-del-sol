export const impactColor = (weapon) =>
  ({
    bottle: "#a8f4ff",
    molotov: "#ffad43",
    paintbomb: "#d0a0ff",
    paintcan: "#74e3ef",
    firecracker: "#ffb352",
    grenade: "#ffe694",
    odor: "#b4e369",
    sound: "#86dfff",
  })[weapon] || "#ffe6a0";

export function drawImpactFeedback(ctx, unit, game, enabled) {
  const age = game.time - (unit.lastHit ?? -100);
  if (!enabled || unit.hitContinuous || age < 0 || age > 0.09) return;
  ctx.save();
  ctx.globalAlpha = (1 - age / 0.09) * 0.8;
  ctx.strokeStyle = impactColor(unit.hitWeapon);
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2 + 0.4;
    ctx.moveTo(Math.cos(a) * 13, -14 + Math.sin(a) * 13);
    ctx.lineTo(Math.cos(a) * 21, -14 + Math.sin(a) * 21);
  }
  ctx.stroke();
  ctx.restore();
}

export function drawChain(ctx, game) {
  const chain = game.chain;
  if (
    game.phase !== "combat" ||
    !chain ||
    chain.count < 3 ||
    game.time - chain.at > 2 ||
    game.result === "loss"
  )
    return;
  ctx.save();
  ctx.fillStyle = "#15382fee";
  ctx.beginPath();
  ctx.roundRect(365, 600, 270, 52, 12);
  ctx.fill();
  ctx.fillStyle = "#ffdb6d";
  ctx.textAlign = "center";
  ctx.font = "900 20px sans-serif";
  ctx.fillText(`¡CORO DE ${chain.count}!`, 500, 622);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 12px sans-serif";
  ctx.fillText(`+${chain.reward} provisiones · buena combinación`, 500, 642);
  ctx.restore();
}
