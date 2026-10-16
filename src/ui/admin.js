import { UNITS, ENTRIES } from "../data/catalog.js";
import { labBudget } from "../lab-budget.js";

export function mountAdmin(document, command, reset) {
  const panel = document.getElementById("admin-panel");
  panel.hidden = false;
  panel.innerHTML = `
    <h2>Laboratorio de pruebas</h2>
    <p>Construye y mejora en el tablero mientras envías atacantes desde cualquier calle. Las pruebas no avanzan de ronda automáticamente.</p>
    <div class="admin-fields">
      <label>Atacante <select id="admin-kind"></select></label>
      <label>Calle <select id="admin-entry"></select></label>
      <label>Cantidad <input id="admin-count" type="number" min="1" max="100" value="1"></label>
      <button id="admin-spawn" type="button">Enviar atacantes</button>
      <label>Ronda <select id="admin-round"></select></label>
      <button id="admin-prepare" type="button">Preparar ronda con presupuesto</button>
      <button id="admin-wave" type="button">Cargar oleada</button>
    </div>
    <div class="admin-actions">
      <button id="admin-clear" type="button">Limpiar atacantes y efectos</button>
      <button id="admin-stop" type="button">Volver a preparación</button>
      <button id="admin-heal" type="button">Reparar todo y revivir base</button>
      <button id="admin-recharge" type="button">Recargar habilidad</button>
      <button id="admin-reset" type="button">Reiniciar con dinero ilimitado</button>
      <label><input id="admin-invulnerable" type="checkbox" checked> Base invulnerable</label>
    </div>
    <p id="admin-feedback" role="status">Preparado. Puedes usar pausa y velocidad para inspeccionar el combate.</p>`;
  const $ = (id) => document.getElementById(id);
  const options = (id, entries) => {
    for (const [value, text] of entries) {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = text;
      $(id).append(option);
    }
  };
  options(
    "admin-kind",
    Object.entries(UNITS).map(([key, u]) => [key, u.name]),
  );
  options(
    "admin-entry",
    ENTRIES.map((entry, i) => [i, entry.name]),
  );
  options(
    "admin-round",
    Array.from({ length: 20 }, (_, i) => [i + 1, `Ronda ${i + 1}`]),
  );
  function send(c) {
    const ok = command(c);
    $("admin-feedback").textContent = ok
      ? "Prueba actualizada."
      : "No se pudo aplicar: revisa la cantidad o repara la base.";
    return ok;
  }
  $("admin-spawn").onclick = () =>
    send({
      type: "admin-spawn",
      kind: $("admin-kind").value,
      entry: Number($("admin-entry").value),
      count: Number($("admin-count").value),
    });
  $("admin-wave").onclick = () =>
    send({ type: "admin-wave", round: Number($("admin-round").value) });
  $("admin-prepare").onclick = () => {
    const round = Number($("admin-round").value);
    if (send({ type: "admin-prepare", round })) {
      $("admin-invulnerable").checked = false;
      $("admin-feedback").textContent =
        `Ronda ${round}: ${labBudget(round)} provisiones acumuladas antes de empezar, suponiendo todas las bajas anteriores. Sin gastos previos ni ingresos de cocina. Coloca y mejora tus casetas y pulsa Iniciar oleada. La base puede recibir daño y se aplican las reglas de campaña. Preparar otra ronda vacía el tablero.`;
    }
  };
  for (const action of ["clear", "stop", "heal", "recharge"])
    $("admin-" + action).onclick = () => send({ type: "admin-" + action });
  $("admin-reset").onclick = () => {
    reset();
    $("admin-invulnerable").checked = true;
  };
  $("admin-invulnerable").onchange = () =>
    send({
      type: "admin-invulnerable",
      value: $("admin-invulnerable").checked,
    });
}
