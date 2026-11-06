# Cibernetica 2189

Cyberpunk open world RPG — prova de conceito da Fase 0, construída com
JavaScript, Three.js e Vite.

## Requisitos

- Node.js 22.12 ou superior
- Navegador com WebGL2 e aceleração de hardware

## Comandos

```bash
npm install
npm run dev      # servidor de desenvolvimento
npm test         # testes unitários de colisão e movimento
npm run build    # build de produção em dist/
npm run preview  # serve o build de produção
```

## Controles

| Ação | Tecla |
| --- | --- |
| Mover | W A S D |
| Olhar | Mouse (após clicar na tela) |
| Correr | Shift |
| Pular | Espaço |
| Liberar o mouse | ESC |

## Escopo da Fase 0

- Cena 3D com terreno, iluminação e névoa.
- Rua com dez construções geométricas e faixas neon.
- Câmera em primeira pessoa com pointer lock.
- Movimento com corrida, pulo e gravidade.
- Colisão AABB com deslizamento em paredes.
- Overlay de desenvolvimento com FPS, draw calls e triângulos.

Fora do escopo desta fase: NPCs, interação, combate, inventário, missões,
economia, salvamento, HUD de jogo, menu de pausa, terceira pessoa, Rapier,
áudio e assets externos.

## Estrutura

```text
src/
├── core/       Game, InputManager, TimeManager
├── world/      World, Environment, Building
├── player/     Player, Movement, CameraController
├── physics/    Collision (AABB)
├── ui/         DebugOverlay
├── config.js   ajustes de render, jogador, controles e mundo
└── main.js     bootstrap e fallback de WebGL2
```

## Desempenho de referência

Hardware de desenvolvimento: Intel i7-3615QM, Intel HD Graphics 4000,
15 GiB de RAM, tela 1920×1080, Mesa 26.0.8, Chrome 155.

Meta da Fase 0: pelo menos 30 FPS médios com resolução interna de 1280×720,
sem sombras dinâmicas e sem pós-processamento. O overlay (`src/ui/DebugOverlay.js`)
exibe FPS, draw calls e triângulos durante o desenvolvimento.

### Resultados medidos

Renderizador: `ANGLE (Intel, Mesa Intel(R) HD Graphics 4000 (IVB GT2), OpenGL ES 3.0)`,
com aceleração de hardware. Valores após aquecimento, sem sombras, bloom ou
antialias.

| Resolução interna | FPS médio | Draw calls | Triângulos |
| --- | --- | --- | --- |
| 1280×720 | 60 (limitado pelo vsync) | 35 | 602 |
| 1920×1080 | 60 (limitado pelo vsync) | 35 | 602 |

Validação de colisão em execução: o jogador parou na face de um prédio
(x = 7,8), na face sul de outro (z = 9,7) e no limite do mundo (z = 57,7),
sem atravessar geometria. Testes unitários: 23/23.

