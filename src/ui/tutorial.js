import { tutorialStep } from "../data/tutorial.js";

export function createTutorial(document) {
  const host = document.getElementById("game");
  if (!host) return { render() {}, record() {} };
  const root = document.createElement("section"),
    title = document.createElement("strong"),
    text = document.createElement("p"),
    skip = document.createElement("button");
  root.className = "tutorial-guide";
  root.setAttribute("aria-label", "Tutorial del primer nivel");
  root.setAttribute("aria-live", "polite");
  skip.textContent = "Omitir tutorial";
  skip.type = "button";
  root.append(title, text, skip);
  host.append(root);
  let currentGame,
    hidden = false,
    usedAbility = false,
    highlighted = null,
    previous = "";
  function clearHighlight() {
    highlighted?.removeAttribute("data-tutorial-target");
    highlighted = null;
  }
  skip.onclick = () => {
    hidden = true;
    root.hidden = true;
    clearHighlight();
  };
  return {
    record(command) {
      if (command.type === "ability") usedAbility = true;
    },
    render(game, state = {}) {
      if (game !== currentGame) {
        currentGame = game;
        hidden = false;
        usedAbility = false;
        previous = "";
      }
      const step = hidden
        ? null
        : tutorialStep(game, { ...state, usedAbility });
      root.hidden = !step;
      clearHighlight();
      if (!step) return;
      const key = JSON.stringify(step);
      if (key !== previous) {
        title.textContent = `${step.icon} Tutorial · ${step.round}/5 · ${step.title}`;
        text.textContent = step.text;
        previous = key;
      }
      highlighted = document.querySelector(step.target);
      highlighted?.setAttribute("data-tutorial-target", "true");
    },
  };
}
