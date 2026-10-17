export function mountBoardInterface(document) {
  if (document.body?.dataset.page === "admin") return null;
  const stage = document.querySelector("#game .board-stage");
  const aside = document.querySelector("#game .play-layout > aside");
  const toolbar = document.querySelector("#game > .board-toolbar");
  if (!stage || !aside || !toolbar) return null;
  function menu(id, label, content) {
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    details.id = id;
    details.className = "board-menu";
    summary.textContent = label;
    details.append(summary, content);
    stage.append(details);
    return details;
  }
  const builds = menu("build-menu", "⛺ Casetas", aside);
  const controls = menu("controls-menu", "⚙ Opciones", toolbar);
  const restart = document.getElementById("restart");
  if (restart) toolbar.append(restart);
  const caption = document.querySelector("#game .map-caption");
  if (caption) stage.append(caption);
  stage.classList.add("has-board-interface");
  builds.addEventListener("toggle", () => {
    if (builds.open) controls.open = false;
  });
  controls.addEventListener("toggle", () => {
    if (controls.open) builds.open = false;
  });
  return {
    close() {
      builds.open = controls.open = false;
    },
    selected() {
      builds.open = false;
    },
  };
}
