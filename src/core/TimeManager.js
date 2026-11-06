import { TIME } from '../config.js';

export class TimeManager {
  constructor() {
    this.maxDelta = TIME.maxDelta;
    this.last = 0;
    this.elapsed = 0;
    this.fps = 0;
    this._smoothedFps = 0;
  }

  reset() {
    this.last = 0;
    this._smoothedFps = 0;
  }

  /**
   * Returns the simulation delta in seconds. The delta is clamped so that a
   * slow frame cannot move the player through a wall. A long pause (tab
   * switch, breakpoint) returns 0 and restarts the clock instead of
   * fast-forwarding the simulation.
   */
  tick(nowMs) {
    if (this.last === 0) {
      this.last = nowMs;
      return 0;
    }

    const rawDelta = (nowMs - this.last) / 1000;
    this.last = nowMs;

    if (!Number.isFinite(rawDelta) || rawDelta <= 0) return 0;

    if (rawDelta > 0.5) {
      this._smoothedFps = 0;
      this.fps = 0;
      return 0;
    }

    const dt = Math.min(rawDelta, this.maxDelta);
    this.elapsed += dt;

    const instantFps = 1 / rawDelta;
    this._smoothedFps = this._smoothedFps
      ? this._smoothedFps * 0.9 + instantFps * 0.1
      : instantFps;
    this.fps = this._smoothedFps;

    return dt;
  }
}
