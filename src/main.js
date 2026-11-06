import './style.css';
import { Game } from './core/Game.js';

const canvas = document.getElementById('game');
const fatalPanel = document.getElementById('fatal');
const fatalMessage = document.getElementById('fatal-message');

function showFatal(error) {
  console.error(error);
  if (fatalMessage) {
    fatalMessage.textContent =
      error?.message ||
      'O navegador não conseguiu criar um contexto WebGL2 acelerado. ' +
        'Verifique a aceleração de hardware em chrome://gpu.';
  }
  if (fatalPanel) fatalPanel.hidden = false;
}

if (!window.WebGL2RenderingContext) {
  showFatal(new Error('Este navegador não suporta WebGL2.'));
} else {
  try {
    const game = new Game(canvas);
    game.start();

    if (import.meta.hot) {
      import.meta.hot.dispose(() => game.dispose());
    }
  } catch (error) {
    showFatal(error);
  }
}
