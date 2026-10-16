import { totalRounds } from "../data/progression.js";
export function resultSummary(game) {
  return `Acampada Sol · Ronda ${game.round}/${totalRounds(game)} · ${game.kills} bajas · Racha ${game.bestChain || 0} · Base ${Math.max(0, Math.ceil(game.base.hp))}/${game.base.maxHp}${game.awards?.length ? ` · ${game.awards.join(" / ")}` : ""}`;
}
export function mountResultSharing(document, game) {
  const root = document.getElementById("result");
  let actions = document.getElementById("result-sharing");
  if (!actions) {
    actions = document.createElement("div");
    actions.id = "result-sharing";
    root.append(actions);
  }
  actions.replaceChildren();
  const info = document.createElement("p"),
    status = document.createElement("p"),
    share = document.createElement("button"),
    download = document.createElement("button");
  info.textContent = resultSummary(game);
  share.textContent = "Compartir resultado";
  download.textContent = "Guardar tarjeta";
  status.setAttribute("role", "status");
  share.onclick = async () => {
    const text = resultSummary(game);
    try {
      if (globalThis.navigator?.share)
        await navigator.share({ title: "Acampada Sol", text });
      else if (globalThis.navigator?.clipboard) {
        await navigator.clipboard.writeText(text);
        status.textContent = "Resultado copiado.";
      } else status.textContent = text;
    } catch (error) {
      if (error.name !== "AbortError")
        status.textContent =
          game.result === "loss"
            ? "No se ha podido compartir. Puedes copiar el resumen del resultado."
            : "No se ha podido compartir. Puedes guardar la tarjeta.";
    }
  };
  download.onclick = () => {
    const image = document.createElement("canvas");
    image.width = 1000;
    image.height = 680;
    const ctx = image.getContext("2d"),
      board = document.getElementById("board");
    ctx.drawImage(board, 0, 0);
    ctx.fillStyle = "#102e27ed";
    ctx.fillRect(0, 425, 1000, 255);
    ctx.fillStyle = "#ffdf70";
    ctx.font = "900 38px sans-serif";
    ctx.fillText(
      game.result === "loss" ? "LA PLAZA VOLVERÁ" : "LA PLAZA RESISTE",
      45,
      485,
    );
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 23px sans-serif";
    ctx.fillText(
      `Ronda ${game.round} · ${game.kills} bajas · Racha ${game.bestChain || 0}`,
      45,
      535,
    );
    ctx.font = "18px sans-serif";
    ctx.fillText((game.awards || []).join(" · "), 45, 580, 910);
    ctx.fillText("ACAMPADA SOL", 45, 640);
    const link = document.createElement("a");
    link.download = "acampada-sol.png";
    link.href = image.toDataURL("image/png");
    link.click();
  };
  actions.append(info, share);
  if (game.result !== "loss") actions.append(download);
  actions.append(status);
}
