import {
  BRANCHES,
  canDefend,
  bountyFor,
  totalRounds,
  ROUND_PROVISIONS,
} from "./data/progression.js";
import { WAVES, normalWave } from "./data/waves.js";
import { bossState, dealDamage } from "./boss-mechanics.js";
import { BASE_POSITION } from "./data/routes.js";
import { stereotypeState } from "./stereotypes.js";
import { BOSS_ROUNDS, bossWave, BOSSES } from "./data/bosses.js";
import { weaponFor, maxLevel, rangeFor } from "./data/weapons.js";
import { resolveProjectiles, burnGround, strikeTarget } from "./combat.js";
// Deterministic simulation: commands are separate from rendering for future room transport.
import { BUILDINGS, UNITS, ENTRIES, SLOTS } from "./data/catalog.js";
import { followRoute } from "./movement.js";
import { placementError } from "./placement.js";
import {
  attackerCharacter,
  defenderCharacter,
  buildingDefender,
} from "./data/characters.js";
import { tryDialogue, constructionDialogue } from "./dialogue.js";
import { removeConstruction } from "./construction.js";
import { startCombat } from "./combat-lifecycle.js";
import { auraSources } from "./aura-sources.js";
import {
  advanceAttackerAbility,
  attackerSpeedMultiplier,
} from "./attacker-abilities.js";
import { hasDefender } from "./data/building-look.js";
import { reinforceCamp } from "./attack-reinforcements.js";
import { spaceSpawns } from "./spawn-schedule.js";
import { campaignLevel, campaignPressure } from "./data/campaign.js";
import { remainingPathDistance, priorityTarget } from "./targeting.js";
import { advanceRainSlip } from "./rain.js";
import { raidNearbyCaseta } from "./caseta-raider.js";
import { recordDefeat, finishRoundReport } from "./experience.js";
import {
  chooseStoryEvent,
  beginStoryEvent,
  eventBlocksBuilding,
  eventShotInterval,
} from "./story-events.js";
export { BUILDINGS, UNITS, ENTRIES, SLOTS } from "./data/catalog.js";
export function building(type, x, y, id) {
  const d = BUILDINGS[type];
  return { id, type, x, y, level: 1, hp: d.hp, maxHp: d.hp, cooldown: 0 };
}
export class Game {
  constructor(mode = "defense") {
    this.mode = mode;
    this.phase = mode === "attack" ? "attack" : "build";
    this.round = 1;
    this.waveIsBoss = false;
    this.defendedWaves = 0;
    this.abilityReadyAt = 0;
    this.freezeUntil = 0;
    this.kills = 0;
    this.earned = 0;
    this.reports = [];
    this.awards = [];
    this.bestChain = 0;
    this.bossesDefeated = 0;
    this.defeatedBossKinds = [];
    this.money = mode === "attack" ? 150 : 140;
    this.base = {
      id: "base",
      type: "tent",
      level: 1,
      ...BASE_POSITION,
      hp: 660,
      maxHp: 660,
      cooldown: 0,
    };
    this.buildings = [];
    this.units = [];
    this.deaths = [];
    this.effects = [];
    this.projectiles = [];
    this.fires = [];
    this.nextUnitId = 1;
    this.queue = [];
    this.pending = [];
    this.time = 0;
    this.nextId = 1;
    this.nextVisualId = 0;
    this.visualRevision = 0;
    this.result = null;
    this.storyChoices = {};
    this.discoveredEnemies = [];
    this.storyEvent = null;
    this.speeches = [];
    this.nextSpeechAt = 0;
    this.dialogueCount = 0;
    this.lastSpeechSide = null;
    if (mode === "attack") {
      for (const [type, slot] of [
        ["tent", 3],
        ["speaker", 5],
        ["barrier", 7],
      ]) {
        this.buildings.push(
          building(type, SLOTS[slot].x, SLOTS[slot].y, this.nextId++),
        );
      }
    }
  }
  command(c) {
    if (!c || typeof c !== "object" || typeof c.type !== "string") return false;
    if (this.result) return false;
    if (c.type === "story-choice") return chooseStoryEvent(this, c.option);
    if (c.type === "remove") return removeConstruction(this, c.id);
    if (c.type === "ability") {
      if (
        this.mode !== "defense" ||
        this.phase !== "combat" ||
        this.time < this.abilityReadyAt ||
        this.freezeUntil > this.time
      )
        return false;
      this.freezeUntil = this.time + 3;
      this.abilityReadyAt = this.time + 25;
      this.effects.push({
        type: "assembly",
        x: this.base.x,
        y: this.base.y,
        tx: this.base.x,
        ty: this.base.y,
        life: 1,
        duration: 1,
      });
      return true;
    }
    if (c.type === "specialize" && canDefend(this)) {
      if (c.branch !== "rapid" && c.branch !== "power") return false;
      const b =
        c.id === "base" ? this.base : this.buildings.find((b) => b.id === c.id);
      const choice = b && BRANCHES[b.type]?.[c.branch];
      if (!choice || b.branch || this.money < choice[2]) return false;
      this.money -= choice[2];
      b.branch = c.branch;
      if (b.type === "barrier" && c.branch === "rapid") {
        b.maxHp += 240;
        b.hp += 240;
      }
      return true;
    }
    if (c.type === "build" && canDefend(this)) {
      if (!Object.hasOwn(BUILDINGS, c.kind)) return false;
      const d = BUILDINGS[c.kind];
      if (!d || this.money < d.cost || placementError(this, c.x, c.y, c.kind))
        return false;
      this.money -= d.cost;
      const placed = building(c.kind, c.x, c.y, this.nextId++);
      placed.refundable = this.phase === "build";
      this.buildings.push(placed);
      constructionDialogue(this, placed);
      return true;
    }
    if (c.type === "upgrade" && canDefend(this)) {
      const b =
        c.id === "base" ? this.base : this.buildings.find((b) => b.id === c.id);
      if (!b || b.level >= maxLevel(b.type)) return false;
      const cost = 30 * b.level;
      if (this.money < cost) return false;
      this.money -= cost;
      b.level++;
      b.maxHp += 60;
      b.hp = b.maxHp;
      return true;
    }
    if (c.type === "recruit" && this.phase === "attack") {
      if (!Object.hasOwn(UNITS, c.kind) || !Number.isInteger(c.entry))
        return false;
      const u = UNITS[c.kind];
      if (!u || this.money < u.cost || !ENTRIES[c.entry]) return false;
      this.money -= u.cost;
      this.queue.push({ kind: c.kind, entry: c.entry });
      return true;
    }
    if (c.type === "undo" && this.phase === "attack" && this.queue.length) {
      this.money += UNITS[this.queue.pop().kind].cost;
      return true;
    }
    if (
      (c.type === "ready" || c.type === "test-boss") &&
      this.phase !== "combat"
    ) {
      const testBoss = c.type === "test-boss";
      if (testBoss && (this.mode !== "defense" || this.phase !== "build"))
        return false;
      if (this.phase === "build" && this.mode === "local") {
        this.defenseMoney = this.money;
        this.money = 100 + this.round * 22;
        this.phase = "attack";
        return true;
      }
      if (this.phase === "attack" && !this.queue.length) return false;
      this.waveIsBoss =
        testBoss ||
        (this.phase === "build" &&
          (BOSS_ROUNDS.includes(this.round) ||
            (this.mode === "defense" && WAVES[this.round - 1]?.boss))) ||
        this.queue.some((unit) => BOSSES[unit.kind]);
      this.pending =
        this.phase === "attack"
          ? this.queue.map((u, i) => ({ ...u, at: i * 0.95 }))
          : [
              ...(this.waveIsBoss
                ? bossWave(testBoss ? 0 : this.round, ENTRIES.length)
                : []),
              ...(!testBoss ? normalWave(this.round, ENTRIES.length) : []),
            ].sort((a, b) => a.at - b.at);
      if (!testBoss) beginStoryEvent(this);
      else this.storyEvent = null;
      this.pending = spaceSpawns(this.pending);
      this.queue = [];
      startCombat(this);
      return true;
    }
    return false;
  }
  tick(dt) {
    if (this.phase !== "combat" || this.result) return;
    this.time += dt;
    this.speeches = this.speeches.filter((speech) => speech.until > this.time);
    while (this.pending.length && this.pending[0].at <= this.time) {
      const p = this.pending.shift(),
        d = UNITS[p.kind],
        e = ENTRIES[p.entry];
      const pressure =
        this.mode === "defense" && (!this.sandbox || this.campaignTest)
          ? campaignPressure(this.round)
          : { health: 1, speed: 1, damage: 1 };
      const boss = !!BOSSES[p.kind];
      const health = Math.round(
        d.hp *
          (this.mode === "defense" &&
          (!this.sandbox || this.campaignTest) &&
          BOSSES[p.kind]
            ? campaignLevel(this.round).bossHealth
            : pressure.health),
      );
      this.units.push({
        ...d,
        speed: d.speed * (boss ? 1 : pressure.speed),
        damage: Math.round(d.damage * (boss ? 1 : pressure.damage)),
        id: this.nextUnitId++,
        kind: p.kind,
        character:
          BOSSES[p.kind]?.character ||
          attackerCharacter(p.kind, this.nextVisualId++),
        x: e.x,
        y: e.y,
        hp: health,
        maxHp: health,
        cooldown: 0,
        slow: 0,
        route: e.route,
        routeIndex: 0,
      });
    }
    this.effects = this.effects.filter((e) => (e.life -= dt) > 0);
    burnGround(this, dt);
    resolveProjectiles(this, dt);
    const targetDistances = new Map(
      this.units
        .filter((u) => u.hp > 0)
        .map((u) => [u, remainingPathDistance(u, this.base)]),
    );
    for (const b of [...this.buildings, this.base]) {
      const d = BUILDINGS[b.type];
      if (
        b.type === "barrier" &&
        b.branch === "power" &&
        this.time - (b.lastHit ?? -100) > 2
      )
        b.hp = Math.min(b.maxHp, b.hp + 12 * dt);
      if (b.type === "kitchen" && b.branch === "power") {
        b.production = (b.production || 0) + dt;
        while (b.production >= 5) {
          if (this.mode === "defense") this.money += 2;
          else if (this.mode === "local") this.defenseMoney += 2;
          b.production -= 5;
        }
      }
      const weapon = { ...weaponFor(b, d), sourceId: b.id, fromX: b.x };
      b.cooldown -= dt;
      if (!d.damage || b.cooldown > 0 || eventBlocksBuilding(this, b)) continue;
      const target = priorityTarget(
        b,
        this.units,
        rangeFor(b, d),
        targetDistances,
      );
      if (target) {
        if (hasDefender(b)) tryDialogue(this, buildingDefender(b), b);
        b.lastShot = this.time;
        const shotX = b.x + (hasDefender(b) ? 36 : 8),
          shotY = b.y - (hasDefender(b) ? 30 : 10);
        if (b.type === "speaker") {
          const targets = this.units.filter(
            (u) =>
              u.hp > 0 && Math.hypot(u.x - b.x, u.y - b.y) < rangeFor(b, d),
          );
          for (const u of targets) {
            dealDamage(this, u, weapon.damage, weapon);
            u.slow = Math.max(u.slow || 0, b.branch === "rapid" ? 3 : 1.5);
          }
        } else
          this.projectiles.push({
            x: shotX,
            y: shotY,
            tx: target.x,
            ty: target.y,
            targetId: target.id,
            weapon,
            life: 0.4,
          });
        b.cooldown = weapon.rate * eventShotInterval(this);
        this.effects.push({
          x: b.type === "speaker" ? b.x : shotX,
          y: b.type === "speaker" ? b.y : shotY,
          radius: b.type === "speaker" ? rangeFor(b, d) : undefined,
          tx: target.x,
          ty: target.y,
          life: 0.4,
          duration: 0.4,
          type: weapon.type,
          level: b.level,
          color: b.type === "speaker" ? "#87c9c0" : "#f5ce68",
        });
      }
    }
    const sources = auraSources(this);
    const barriers = this.buildings.filter(
      (b) => b.type === "barrier" && b.hp > 0,
    );
    const barriersById = new Map(barriers.map((b) => [b.id, b]));
    for (const u of this.units) {
      if (u.hp <= 0) continue;
      u.slow = Math.max(0, u.slow - dt);
      const stereotype = stereotypeState(this, u, sources);
      u.stinky = stereotype.stinky;
      if (stereotype.dps > 0) {
        dealDamage(this, u, stereotype.dps * dt, {
          type: "odor",
          fire: true,
          sourceId: stereotype.sourceId,
        });
        if (u.hp <= 0) continue;
      }
      u.hyped = stereotype.hyped;
      u.cooldown -= dt;
      if (this.time < this.freezeUntil) continue;
      if (advanceRainSlip(this, u, dt)) continue;
      advanceAttackerAbility(u, dt);
      const bossSpeed =
        bossState(this, u, sources).speed * attackerSpeedMultiplier(u);
      if (u.routeIndex < u.route.length) {
        if (u.kind === "saboteur") {
          followRoute(u, 0, barriers);
          if (!u.blockedBy && raidNearbyCaseta(this, u, dt)) continue;
          u.raidingId = null;
        }
        followRoute(
          u,
          u.speed *
            bossSpeed *
            (u.slow > 0
              ? Math.min(0.45, stereotype.multiplier)
              : stereotype.multiplier) *
            dt,
          barriers,
        );
        const barrier = barriersById.get(u.blockedBy);
        if (barrier) {
          if (!u.taunted) u.taunted = tryDialogue(this, u.character, u);
          strikeTarget(this, u, barrier);
        }
        continue;
      }
      const target = this.base;
      const dx = target.x - u.x,
        dy = target.y - u.y,
        dist = Math.hypot(dx, dy);
      if (dist > 32) {
        const step = Math.min(
          dist - 32,
          u.speed * bossSpeed * (u.slow > 0 ? 0.45 : 1) * dt,
        );
        u.x += (dx / dist) * step;
        u.y += (dy / dist) * step;
      } else if (u.cooldown <= 0) {
        if (!u.taunted) u.taunted = tryDialogue(this, u.character, u);
        strikeTarget(this, u, target);
      }
    }
    let rewardTotal = 0,
      rewardX = 0,
      rewardY = 0,
      rewardCount = 0;
    for (const u of this.units) {
      if (u.hp <= 0) {
        const bounty = bountyFor(u);
        this.kills++;
        this.earned += bounty;
        recordDefeat(this, u, bounty);
        if (this.mode === "defense") this.money += bounty;
        else if (this.mode === "local") this.defenseMoney += bounty;
        rewardTotal += bounty;
        rewardX += u.x;
        rewardY += u.y;
        rewardCount++;
        this.deaths.push({
          id: u.id,
          character: u.character,
          kind: u.kind,
          scale: u.scale,
          role: u.role,
          x: u.x,
          y: u.y,
          weapon: u.hitWeapon,
          direction: u.hitDirection,
        });
      }
    }
    if (rewardCount)
      this.effects.push({
        type: "reward",
        text: `+${rewardTotal}`,
        amount: rewardTotal,
        x: rewardX / rewardCount,
        y: rewardY / rewardCount,
        tx: rewardX / rewardCount,
        ty: rewardY / rewardCount,
        life: 0.9,
        duration: 0.9,
      });
    if (this.deaths.length > 64) {
      const bosses = this.deaths
        .filter((death) => death.kind.startsWith("boss"))
        .slice(-3);
      this.deaths = [
        ...this.deaths
          .filter((death) => !death.kind.startsWith("boss"))
          .slice(-(64 - bosses.length)),
        ...bosses,
      ];
    }
    this.units = this.units.filter((u) => u.hp > 0);
    for (const b of this.buildings) {
      if (b.hp <= 0)
        this.effects.push({
          type: "rubble",
          x: b.x,
          y: b.y,
          tx: b.x,
          ty: b.y,
          life: 1.2,
          duration: 1.2,
        });
    }
    this.buildings = this.buildings.filter((b) => b.hp > 0);
    if (this.base.hp <= 0) {
      finishRoundReport(this);
      this.storyEvent = null;
      this.speeches = [];
      this.base.hp = 0;
      this.result = this.mode === "defense" ? "loss" : "attack";
      return;
    }
    if (
      !this.sandbox &&
      this.autoAdvance !== false &&
      !this.pending.length &&
      !this.units.length
    ) {
      this.speeches = [];
      finishRoundReport(this);
      this.defendedWaves++;
      this.storyEvent = null;
      if (this.round >= totalRounds(this)) {
        this.result = this.mode === "attack" ? "loss" : "defense";
        return;
      }
      this.round++;
      this.fires = [];
      this.projectiles = [];
      this.effects = [];
      const income =
        ROUND_PROVISIONS +
        this.buildings
          .filter((b) => b.type === "kitchen")
          .reduce(
            (n, b) => n + 15 * b.level + (b.branch === "rapid" ? 15 : 0),
            0,
          );
      if (this.mode === "attack") {
        this.money += 80 + this.round * 25;
        this.phase = "attack";
      } else {
        this.money =
          (this.mode === "local" ? this.defenseMoney : this.money) + income;
        this.phase = "build";
        const source =
          this.buildings.find((b) => b.type === "kitchen") || this.base;
        this.effects.push({
          type: "round-income",
          amount: income,
          kitchenAmount: income - ROUND_PROVISIONS,
          round: this.round - 1,
          buildingId: source.id,
          x: source.x,
          y: source.y,
          life: 4,
          duration: 4,
        });
      }
      for (const b of this.buildings) b.hp = Math.min(b.maxHp, b.hp + 25);
      reinforceCamp(this, building);
    }
  }
}
