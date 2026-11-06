import * as THREE from 'three';
import { CONTROLS, RENDER } from '../config.js';
import { InputManager } from './InputManager.js';
import { TimeManager } from './TimeManager.js';
import { Player } from '../player/Player.js';
import { CameraController } from '../player/CameraController.js';
import { World } from '../world/World.js';
import { DebugOverlay } from '../ui/DebugOverlay.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      stencil: false,
      powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(RENDER.backgroundColor, 1);
    this.renderer.setPixelRatio(this._pixelRatio());
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      RENDER.fov,
      window.innerWidth / window.innerHeight,
      RENDER.near,
      RENDER.far,
    );

    this.world = new World(this.scene);
    this.player = new Player(this.world);
    this.time = new TimeManager();
    this.overlay = new DebugOverlay({ enabled: import.meta.env.DEV });

    this.input = new InputManager({
      canvas,
      bindings: CONTROLS,
      onLockChange: (locked) => {
        this.overlay.setLocked(locked);
        this.time.reset();
      },
    });

    this.cameraController = new CameraController(this.camera, this.input);
    this.cameraController.syncTo(this.player.position);

    this.webgl = this._describeWebGL();
    console.info(`[WebGL] ${this.webgl.version} · ${this.webgl.renderer}`);

    this._tick = this._tick.bind(this);
    this._resize = this._resize.bind(this);
    this.running = false;
  }

  start() {
    if (this.running) return;

    this.running = true;
    this.overlay.setLocked(this.input.locked);
    window.addEventListener('resize', this._resize);
    this.time.reset();
    this.renderer.setAnimationLoop(this._tick);
  }

  stop() {
    if (!this.running) return;

    this.running = false;
    this.renderer.setAnimationLoop(null);
    window.removeEventListener('resize', this._resize);
  }

  dispose() {
    this.stop();
    this.input.dispose();

    this.scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];
        for (const material of materials) material.dispose();
      }
    });

    this.renderer.dispose();
  }

  _tick(now) {
    const dt = this.time.tick(now);

    this.cameraController.updateLook();

    if (this.input.locked && dt > 0) {
      this.player.update(dt, this.input, this.cameraController.yaw);
    }

    this.cameraController.syncTo(this.player.position);
    this.input.endFrame();

    this.renderer.render(this.scene, this.camera);
    this.overlay.update({
      fps: this.time.fps,
      renderer: this.renderer,
      player: this.player,
      webgl: this.webgl,
    });
  }

  _resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.renderer.setPixelRatio(this._pixelRatio());
    this.renderer.setSize(width, height, false);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  _pixelRatio() {
    const deviceRatio = Math.min(
      window.devicePixelRatio || 1,
      RENDER.maxPixelRatio,
    );
    return deviceRatio * RENDER.renderScale;
  }

  _describeWebGL() {
    const gl = this.renderer.getContext();
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');

    return {
      version: gl.getParameter(gl.VERSION),
      vendor: gl.getParameter(gl.VENDOR),
      renderer: debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        : gl.getParameter(gl.RENDERER),
    };
  }
}
