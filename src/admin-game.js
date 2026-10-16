import { Game, UNITS, ENTRIES } from "./engine.js";
import { BOSSES } from "./data/bosses.js";
import { startCombat } from "./combat-lifecycle.js";
import { spaceSpawns } from "./spawn-schedule.js";
import { labBudget } from "./lab-budget.js";

// Explicitly instantiated by admin.html only; ordinary matches keep their rules.
export class AdminGame extends Game {
  constructor() {
    super("defense");
    this.sandbox = true;
    this.base.invulnerable = true;
    this.trainingBudget = false;
    this.testMoney = 140;
    this.campaignTest = false;
  }
  get money() {
    return this.trainingBudget ? this.testMoney : Infinity;
  }
  set money(value) {
    if (this.trainingBudget) this.testMoney = value;
  }

  command(c) {
    if (!c || typeof c !== "object" || typeof c.type !== "string") return false;
    if (c.type === "admin-prepare") {
      if (!Number.isInteger(c.round) || c.round < 1 || c.round > 20)
        return false;
      const budget = labBudget(c.round);
      const revision = this.visualRevision + 1;
      Object.assign(this, new AdminGame());
      this.visualRevision = revision;
      this.round = c.round;
      this.defendedWaves = c.round - 1;
      this.trainingBudget = true;
      this.campaignTest = true;
      this.money = budget;
      this.base.invulnerable = false;
      return true;
    }
    if (c.type === "admin-reset") {
      const revision = this.visualRevision + 1;
      Object.assign(this, new AdminGame());
      this.visualRevision = revision;
      return true;
    }
    if (c.type === "admin-heal") {
      this.result = null;
      for (const b of [this.base, ...this.buildings]) b.hp = b.maxHp;
      return true;
    }
    if (c.type === "admin-invulnerable") {
      if (typeof c.value !== "boolean") return false;
      this.base.invulnerable = c.value;
      return true;
    }
    if (c.type === "admin-recharge") {
      this.abilityReadyAt = 0;
      return true;
    }
    if (c.type === "admin-round") {
      if (
        this.phase !== "build" ||
        !Number.isInteger(c.round) ||
        c.round < 1 ||
        c.round > 20
      )
        return false;
      this.round = c.round;
      return true;
    }
    if (c.type === "admin-wave") {
      // Validate before clearing a live test. Loading a wave is one transaction.
      if (!Number.isInteger(c.round) || c.round < 1 || c.round > 20)
        return false;
      this.command({ type: "admin-stop" });
      this.command({ type: "admin-heal" });
      this.round = c.round;
      return super.command({ type: "ready" });
    }
    if (c.type === "admin-clear") {
      this.visualRevision++;
      this.units = [];
      this.pending = [];
      this.deaths = [];
      this.projectiles = [];
      this.fires = [];
      this.effects = [];
      this.speeches = [];
      this.freezeUntil = 0;
      this.waveIsBoss = false;
      return true;
    }
    if (c.type === "admin-stop") {
      this.command({ type: "admin-clear" });
      this.phase = "build";
      // Keep a defeated base visibly defeated until explicitly repaired.
      return true;
    }
    if (c.type === "admin-spawn") {
      if (
        !Object.hasOwn(UNITS, c.kind) ||
        !Number.isInteger(c.entry) ||
        !ENTRIES[c.entry] ||
        !Number.isInteger(c.count) ||
        c.count < 1 ||
        c.count > 100 ||
        this.result
      )
        return false;
      if (this.phase !== "combat") {
        startCombat(this);
      }
      this.pending.push(
        ...Array.from({ length: c.count }, (_, i) => ({
          kind: c.kind,
          entry: c.entry,
          at: this.time + i * 0.95,
        })),
      );
      this.pending = spaceSpawns(this.pending);
      this.waveIsBoss = this.waveIsBoss || Object.hasOwn(BOSSES, c.kind);
      return true;
    }
    if (c.type === "admin-branch-reset") {
      const b =
        c.id === "base" ? this.base : this.buildings.find((b) => b.id === c.id);
      if (!b?.branch || this.result) return false;
      if (b.type === "barrier" && b.branch === "rapid") {
        b.maxHp -= 240;
        b.hp = Math.min(b.hp, b.maxHp);
      }
      delete b.branch;
      return true;
    }
    return super.command(c);
  }
}
