import { drawStreetLabels } from "./street-labels.js";
import { drawChain } from "./impact-feedback.js";
import { createSpeechLifetime } from "./speech-lifetime.js";
import { createBattleCamera } from "./battle-camera.js";
import { createAttackerSprites } from "./attacker-sprites.js";
import { drawLandmarks } from "./landmarks.js";
import { drawUnit, drawUnitBars } from "./unit.js";
import { drawRain } from "./rain.js";
import { drawStationClosure } from "./station-closure.js";
import { auraSources } from "../aura-sources.js";
import { drawPlacementPreview } from "./placement-preview.js";
import { createConstructionAnimation } from "./construction-animation.js";
import { hasDefender } from "../data/building-look.js";
import { createCelebration } from "./celebration.js";
import { createBattleAtmosphere, roundIntensity } from "./battle-atmosphere.js";
import { drawPaths } from "./paths.js";
import { drawStereotypes, drawOdorLines } from "./stereotypes.js";
import { createDeathAnimations } from "./deaths.js";
import { defenderPose } from "./poses.js";
import { drawBuildingAmbient } from "./ambient.js";
import { drawFirePools } from "./effects.js";
import { drawCharacter, drawSpeech } from "./characters.js";
import { CHARACTERS, buildingDefender } from "../data/characters.js";
import { createSprites } from "./sprites.js";
import { projectY } from "../data/map.js";
import { createIncomeState, drawRoundIncome } from "./round-income.js";
import { measureSpeechViewport } from "./speech-layout.js";
import { drawPlaza } from "../plaza.js";
import { drawTactical } from "./tactical.js";
import { drawCombatEffects, gradeEnvironment } from "./effects.js";
export function createBoardRenderer(canvas) {
  const ctx = canvas.getContext("2d");
  const speechLayer = canvas.parentElement
    ? document.createElement("canvas")
    : null;
  if (speechLayer) {
    speechLayer.width = 1000;
    speechLayer.height = 680;
    speechLayer.className = "board-speech-layer";
    speechLayer.setAttribute("aria-hidden", "true");
    canvas.parentElement.append(speechLayer);
  }
  const speechCtx = speechLayer?.getContext("2d");
  let speechViewport = { width: 1000, height: 680, scaleX: 1, scaleY: 1 };
  let speechDensity = 1;
  function resizeSpeechLayer() {
    if (!speechLayer) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    speechViewport = measureSpeechViewport(
      rect.width,
      rect.height,
      globalThis.devicePixelRatio || 1,
    );
    speechDensity = speechViewport.density;
    if (speechLayer.width !== speechViewport.pixelWidth)
      speechLayer.width = speechViewport.pixelWidth;
    if (speechLayer.height !== speechViewport.pixelHeight)
      speechLayer.height = speechViewport.pixelHeight;
  }
  if (speechLayer) {
    resizeSpeechLayer();
    if (globalThis.ResizeObserver) {
      const observer = new globalThis.ResizeObserver(resizeSpeechLayer);
      observer.observe(canvas);
    }
    globalThis.addEventListener?.("resize", resizeSpeechLayer);
  }
  const background = document.createElement("canvas");
  background.width = 1000;
  background.height = 680;
  drawPlaza(background.getContext("2d"));
  drawPaths(background.getContext("2d"));
  drawLandmarks(background.getContext("2d"));
  gradeEnvironment(background.getContext("2d"));
  drawStreetLabels(background.getContext("2d"));
  const { tent } = createSprites(ctx);
  const drawDeaths = createDeathAnimations();
  const constructionAnimation = createConstructionAnimation();
  const celebration = createCelebration();
  const atmosphere = createBattleAtmosphere();
  const attackerSprites = createAttackerSprites();
  const camera = createBattleCamera();
  const visibleSpeeches = createSpeechLifetime();
  const incomeState = createIncomeState();
  let visualGame = null,
    visualTime = 0;
  function draw(game, preview, view = {}) {
    if (visualGame !== game) {
      visualGame = game;
      visualTime = 0;
    }
    visualTime += Math.max(0, view.animationDelta || 0);
    const speeches = visibleSpeeches(game, visualTime);
    const income = incomeState(
      game,
      view.paused ? 0 : view.animationDelta || 0,
    );
    const cheering = celebration(game, view.animationDelta || 0);
    const animationDt = view.reducedMotion ? 0 : view.animationDelta || 0;
    atmosphere.advance(game, view.quality === "low" ? 0 : animationDt);
    constructionAnimation.advance(game, view.animationDelta || 0);
    ctx.save();
    const cameraShift = camera.advance(
      game,
      view.animationDelta || 0,
      view.reducedMotion,
    );
    ctx.translate(cameraShift, cameraShift * 0.4);
    if (speechCtx) {
      speechCtx.setTransform(speechDensity, 0, 0, speechDensity, 0, 0);
      speechCtx.clearRect(0, 0, speechViewport.width, speechViewport.height);
      speechCtx.save();
      speechCtx.translate(
        cameraShift * speechViewport.scaleX,
        cameraShift * 0.4 * speechViewport.scaleY,
      );
    }
    ctx.drawImage(background, 0, 0);
    drawRain(ctx, game, visualTime);
    if (!view.reducedMotion && view.quality !== "low") atmosphere.draw(ctx);
    drawTactical(ctx, game, preview, view);
    drawFirePools(ctx, game.fires, visualTime);
    drawStereotypes(ctx, game, view.reducedMotion ? 0 : visualTime, view);
    drawDeaths(ctx, game, view.animationDelta || 0, view);
    if (preview) drawPlacementPreview(ctx, preview, view.kind);
    function paintBuilding(b) {
      const base = b.id === "base";
      constructionAnimation.draw(ctx, b, () => {
        ctx.save();
        const shotAge = game.time - (b.lastShot ?? -100);
        const hitAge = game.time - (b.lastHit ?? -100);
        const recoil =
          shotAge >= 0 && shotAge < 0.32
            ? Math.sin((shotAge / 0.32) * Math.PI)
            : 0;
        const stagger =
          hitAge >= 0 && hitAge < 0.28
            ? Math.sin(hitAge * 65) * (1 - hitAge / 0.28)
            : 0;
        if (!view.reducedMotion && (recoil || stagger)) {
          const y = projectY(b.y);
          ctx.translate(b.x, y);
          ctx.rotate(recoil * -0.035 + stagger * 0.055);
          ctx.scale(1 + recoil * 0.035, 1 - recoil * 0.045);
          ctx.translate(-b.x, -y);
        }
        if (cheering && !view.reducedMotion) {
          const y = projectY(b.y);
          ctx.translate(b.x, y);
          ctx.rotate(Math.sin(visualTime * 10 + b.x) * 0.025 * cheering);
          ctx.translate(-b.x, -y);
        }
        tent(b, base);
        if (
          game.storyEvent?.buildingId === b.id &&
          (game.storyEvent.wholeRound || game.time < game.storyEvent.until)
        ) {
          ctx.save();
          ctx.strokeStyle = "#e2b35e";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(b.x, projectY(b.y), 25, 18, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = "#ffefba";
          ctx.fillRect(b.x - 28, projectY(b.y) - 39, 56, 13);
          ctx.fillStyle = "#503c23";
          ctx.font = "bold 8px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("EN DEBATE", b.x, projectY(b.y) - 29);
          ctx.restore();
        }
        drawOdorLines(ctx, b, view.reducedMotion ? 0 : visualTime);
        drawBuildingAmbient(
          ctx,
          b,
          view.reducedMotion ? 0 : visualTime,
          game.time,
          view.reducedMotion,
        );
        if (hasDefender(b))
          drawCharacter(
            ctx,
            buildingDefender(b),
            b.x + (base ? 22 : 18),
            projectY(b.y) - (base ? 10 : 13),
            base ? 0.8 : 0.65,
            view.reducedMotion ? 0 : visualTime,
            base ? "base" : b.type,
            {
              ...defenderPose(b, game.time),
              seed: base ? 0 : b.id,
              celebrate: view.reducedMotion ? 0 : cheering,
              talking:
                (income?.event.buildingId === b.id && b.type === "kitchen") ||
                (game.phase === "combat" && !game.result) ||
                speeches.some(
                  (speech) => speech.construction && speech.buildingId === b.id,
                ),
            },
          );
        ctx.restore();
      });
    }
    const sources = auraSources(game);
    attackerSprites.beginFrame();
    const entities = [...game.buildings, game.base, ...game.units].sort(
      (a, b) => a.y - b.y,
    );
    for (const entity of entities) {
      if (entity.kind)
        drawUnit(
          ctx,
          entity,
          game,
          visualTime,
          sources,
          game.units.length >= 30 ? attackerSprites : null,
          view,
        );
      else paintBuilding(entity);
    }
    drawUnitBars(ctx, game.units);
    drawCombatEffects(ctx, game.effects, roundIntensity(game.round));
    if (!view.reducedMotion && view.quality !== "low")
      atmosphere.draw(ctx, true);
    drawRain(ctx, game, visualTime, true);
    drawStationClosure(ctx, game, view.reducedMotion);
    drawChain(ctx, game);
    for (const speech of speeches)
      if (CHARACTERS[speech.character]?.side !== "attack")
        drawSpeech(
          speechCtx || ctx,
          speech,
          speechCtx ? speechViewport : undefined,
        );
    drawRoundIncome(
      ctx,
      game,
      income,
      view.reducedMotion,
      speechCtx || ctx,
      speechCtx ? speechViewport : undefined,
    );
    if (view.paused && game.phase === "combat") {
      ctx.save();
      ctx.fillStyle = "#182522d9";
      ctx.fillRect(340, 19, 320, 45);
      ctx.fillStyle = "#f6dfa0";
      ctx.textAlign = "center";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("RECESO · Espacio para reanudar", 500, 47);
      ctx.restore();
    }
    ctx.restore();
    speechCtx?.restore();
  }

  return { draw };
}
