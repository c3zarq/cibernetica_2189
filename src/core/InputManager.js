/**
 * Keyboard, mouse and pointer-lock handling.
 *
 * Input is expressed as named actions (forward, jump, ...) instead of raw key
 * codes, so controls can be remapped later without touching gameplay code.
 */
export class InputManager {
  constructor({ canvas, bindings, onLockChange = null }) {
    this.canvas = canvas;
    this.bindings = bindings;
    this.onLockChange = onLockChange;

    this.downCodes = new Set();
    this.pressedActions = new Set();
    this.mouseDX = 0;
    this.mouseDY = 0;
    this.locked = false;

    this.codeToActions = new Map();
    for (const [action, codes] of Object.entries(bindings)) {
      for (const code of codes) {
        if (!this.codeToActions.has(code)) {
          this.codeToActions.set(code, []);
        }
        this.codeToActions.get(code).push(action);
      }
    }

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onCanvasClick = this._onCanvasClick.bind(this);
    this._onPointerLockChange = this._onPointerLockChange.bind(this);
    this._onPointerLockError = this._onPointerLockError.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this._onVisibilityChange = this._onVisibilityChange.bind(this);

    window.addEventListener('keydown', this._onKeyDown, { passive: false });
    window.addEventListener('keyup', this._onKeyUp);
    window.addEventListener('blur', this._onBlur);
    document.addEventListener('mousemove', this._onMouseMove);
    document.addEventListener('pointerlockchange', this._onPointerLockChange);
    document.addEventListener('pointerlockerror', this._onPointerLockError);
    document.addEventListener('visibilitychange', this._onVisibilityChange);
    canvas.addEventListener('click', this._onCanvasClick);
  }

  isActive(action) {
    const codes = this.bindings[action];
    if (!codes) return false;

    for (const code of codes) {
      if (this.downCodes.has(code)) return true;
    }
    return false;
  }

  wasPressed(action) {
    return this.pressedActions.has(action);
  }

  consumeMouseDelta() {
    const delta = { dx: this.mouseDX, dy: this.mouseDY };
    this.mouseDX = 0;
    this.mouseDY = 0;
    return delta;
  }

  /**
   * Called once per rendered frame, after gameplay has read the input.
   */
  endFrame() {
    this.pressedActions.clear();
    this.mouseDX = 0;
    this.mouseDY = 0;
  }

  clear() {
    this.downCodes.clear();
    this.pressedActions.clear();
    this.mouseDX = 0;
    this.mouseDY = 0;
  }

  _onKeyDown(event) {
    if (event.code === 'Space') event.preventDefault();
    if (event.repeat) return;

    const actions = this.codeToActions.get(event.code);
    const newlyPressed = [];

    if (actions) {
      for (const action of actions) {
        if (!this.isActive(action)) newlyPressed.push(action);
      }
    }

    this.downCodes.add(event.code);
    for (const action of newlyPressed) {
      this.pressedActions.add(action);
    }
  }

  _onKeyUp(event) {
    this.downCodes.delete(event.code);
  }

  _onMouseMove(event) {
    if (!this.locked) return;
    this.mouseDX += event.movementX || 0;
    this.mouseDY += event.movementY || 0;
  }

  _onCanvasClick() {
    if (this.locked) return;

    try {
      const request = this.canvas.requestPointerLock();
      if (request && typeof request.catch === 'function') {
        request.catch(() => {});
      }
    } catch {
      // pointerlockerror handles unsupported browsers.
    }
  }

  _onPointerLockChange() {
    this.locked = document.pointerLockElement === this.canvas;
    if (!this.locked) this.clear();
    this.onLockChange?.(this.locked);
  }

  _onPointerLockError() {
    console.warn('[Input] Pointer lock indisponível neste navegador.');
  }

  _onBlur() {
    this.clear();
  }

  _onVisibilityChange() {
    if (document.hidden) this.clear();
  }

  dispose() {
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
    window.removeEventListener('blur', this._onBlur);
    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('pointerlockchange', this._onPointerLockChange);
    document.removeEventListener('pointerlockerror', this._onPointerLockError);
    document.removeEventListener('visibilitychange', this._onVisibilityChange);
    this.canvas.removeEventListener('click', this._onCanvasClick);
    this.clear();
  }
}
