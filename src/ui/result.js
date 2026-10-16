import { COPY } from "../data/copy.js";
import { mountResultSharing } from "./share-result.js";
import { mountSupport } from "./support.js";
const $ = (id) => document.getElementById(id);
export function showResult(game) {
  const loss = game.result === "loss",
    attacking = game.mode === "attack",
    attackWin = game.result === "attack";
  $("resultTitle").textContent =
    COPY.result[
      loss
        ? attacking
          ? "attackLossTitle"
          : "defenseLossTitle"
        : attackWin
          ? "attackTitle"
          : "defenseTitle"
    ];
  $("resultText").textContent = loss
    ? COPY.result[attacking ? "attackLoss" : "defenseLoss"]
    : COPY.result[attackWin ? "attack" : "defense"](game.round);
  if (game.mode === "defense" && game.result === "defense") {
    $("resultTitle").textContent = "La plaza resiste · Historia completada";
    $("resultText").textContent =
      "Tres niveles, Dani, Santi y Pedro después, el campamento sigue en pie. Mañana tocará decidir quién recoge las pancartas.";
  }
  mountSupport(document);
  mountResultSharing(document, game);
  $("result").showModal();
}
