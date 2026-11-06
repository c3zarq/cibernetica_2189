export class DebugOverlay {
  constructor({ enabled }) {
    this.enabled = enabled;
    this.root = document.getElementById('debug');
    this.hint = document.getElementById('lock-hint');
    this.lastUpdate = 0;

    if (this.root) this.root.hidden = !enabled;
  }

  setLocked(locked) {
    this.hint?.classList.toggle('is-hidden', locked);
  }

  update({ fps, renderer, player, webgl }) {
    if (!this.enabled || !this.root) return;

    const now = performance.now();
    if (now - this.lastUpdate < 250) return;
    this.lastUpdate = now;

    const info = renderer.info.render;
    const { x, z } = player.position;

    this.root.textContent =
      `FPS ${fps.toFixed(0)}  calls ${info.calls}  ` +
      `tris ${info.triangles.toLocaleString('en-US')}  ` +
      `pos ${x.toFixed(1)}, ${z.toFixed(1)}`;

    if (webgl) {
      this.root.title = `${webgl.version} · ${webgl.renderer}`;
    }
  }
}
