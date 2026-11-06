# TECHNICAL SPECIFICATION
## Cyberpunk Open World RPG

Versão: 0.1

## 1. Objetivo técnico

Desenvolver um jogo tridimensional de mundo aberto para navegadores, utilizando JavaScript e Three.js.

O projeto deverá priorizar:
- Desempenho em hardware limitado.
- Arquitetura modular.
- Facilidade de manutenção.
- Desenvolvimento incremental.
- Baixo acoplamento entre sistemas.
- Possibilidade de expansão.

## 2. Stack tecnológica

### Frontend e renderização
- JavaScript ES Modules.
- Three.js.
- HTML5.
- CSS3.
- Vite.

### Física
Inicialmente, utilizar soluções simples de colisão.
Avaliar Rapier quando a complexidade das interações justificar sua utilização.

### Persistência
Utilizar LocalStorage para salvar configurações e progresso inicial.

Não implementar banco de dados ou servidor nesta etapa.

### Ferramentas
- Git.
- npm.
- OpenCode.
- Navegador com suporte a WebGL.

## 3. Arquitetura

Organizar o código em módulos independentes.

Estrutura proposta:

```text
cyberpunk-game/
│
├── public/
│   ├── assets/
│   │   ├── models/
│   │   ├── textures/
│   │   ├── audio/
│   │   └── fonts/
│   │
│   └── favicon.ico
│
├── src/
│   ├── core/
│   │   ├── Game.js
│   │   ├── SceneManager.js
│   │   ├── InputManager.js
│   │   └── TimeManager.js
│   │
│   ├── world/
│   │   ├── World.js
│   │   ├── Environment.js
│   │   └── Building.js
│   │
│   ├── player/
│   │   ├── Player.js
│   │   ├── Movement.js
│   │   └── CameraController.js
│   │
│   ├── systems/
│   │   ├── InteractionSystem.js
│   │   ├── CombatSystem.js
│   │   ├── InventorySystem.js
│   │   ├── MissionSystem.js
│   │   └── EconomySystem.js
│   │
│   ├── entities/
│   │   ├── NPC.js
│   │   └── Enemy.js
│   │
│   ├── ui/
│   │   ├── HUD.js
│   │   ├── Menu.js
│   │   └── InventoryUI.js
│   │
│   ├── storage/
│   │   └── SaveManager.js
│   │
│   └── main.js
│
├── index.html
├── package.json
├── vite.config.js
├── GAME_DESIGN.md
├── TECHNICAL_SPEC.md
└── ROADMAP.md
```

A estrutura poderá ser simplificada ou ajustada conforme a necessidade real do projeto.

Não criar arquivos ou módulos sem finalidade concreta.

## 4. Requisitos de desempenho

O jogo deverá funcionar em computadores com recursos gráficos limitados.

Diretrizes:
- Utilizar modelos 3D low-poly quando apropriado.
- Evitar excesso de polígonos.
- Limitar a resolução de renderização.
- Evitar sombras dinâmicas desnecessárias.
- Utilizar iluminação eficiente.
- Reaproveitar geometrias e materiais.
- Evitar carregar todo o mundo simultaneamente.
- Utilizar carregamento progressivo de recursos quando necessário.

A implementação deverá ser testada no hardware real do desenvolvedor.

## 5. Controles iniciais

Teclado e mouse:

- W: movimentar para frente.
- S: movimentar para trás.
- A: movimentar para esquerda.
- D: movimentar para direita.
- Mouse: controlar a câmera.
- Espaço: pular.
- Shift: correr.
- E: interagir.
- Botão esquerdo do mouse: atacar ou disparar.
- ESC: pausar.

Os controles deverão ser organizados de maneira que possam ser modificados posteriormente.

## 6. Sistemas de jogo

Os sistemas deverão possuir responsabilidades independentes.

### Player
Responsável pela representação e estado do personagem.

### Movement
Responsável pela movimentação e interação física com o ambiente.

### InteractionSystem
Responsável por identificar objetos e personagens interativos.

### CombatSystem
Responsável por ataques, danos, saúde e combate.

### InventorySystem
Responsável pelos itens adquiridos pelo jogador.

### MissionSystem
Responsável por objetivos, etapas e conclusão de missões.

### EconomySystem
Responsável por dinheiro, compras e pagamentos.

### SaveManager
Responsável por persistir e recuperar o progresso.

## 7. Interface

A interface deverá possuir identidade visual cyberpunk.

Elementos:
- Indicador de saúde.
- Indicador de energia.
- Quantidade de dinheiro.
- Informações de missão.
- Inventário.
- Mensagens de interação.
- Menu de pausa.

A interface deverá ser discreta e não comprometer a visualização do ambiente.

## 8. Persistência

O jogador deverá conseguir salvar e recuperar seu progresso.

Inicialmente, persistir:
- Posição do personagem.
- Saúde.
- Dinheiro.
- Inventário.
- Missões concluídas.
- Progresso geral.

Utilizar uma estrutura JSON versionada, armazenada no LocalStorage.

## 9. Organização e qualidade

Regras:
- Utilizar nomes descritivos.
- Evitar funções excessivamente grandes.
- Evitar duplicação de código.
- Separar lógica de jogo e interface.
- Não utilizar variáveis globais desnecessariamente.
- Não adicionar dependências sem justificativa.
- Documentar decisões arquiteturais relevantes.
- Tratar erros de carregamento de recursos.

## 10. Segurança e controle

O agente de desenvolvimento deverá:
- Trabalhar exclusivamente no diretório do projeto.
- Não executar comandos destrutivos sem autorização.
- Não modificar arquivos externos ao projeto.
- Não armazenar credenciais ou informações sensíveis no código.
- Não instalar dependências desnecessárias.
- Apresentar o plano antes de implementar mudanças estruturais.

## 11. Critérios de aceitação técnica

O projeto deverá:
- Iniciar com npm run dev.
- Gerar uma compilação com npm run build.
- Não apresentar erros críticos no console.
- Funcionar em navegador moderno.
- Permitir movimentação e interação.
- Manter desempenho aceitável no hardware de referência.
- Possuir estrutura preparada para evolução.
