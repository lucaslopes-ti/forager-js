# 🌿 Forager JS

Um jogo de sobrevivência e coleta inspirado em Forager, desenvolvido em JavaScript puro com HTML5 Canvas.

![Forager JS](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=flat-square&logo=javascript)
![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange?style=flat-square&logo=html5)
![CSS3](https://img.shields.io/badge/CSS3-Animations-blue?style=flat-square&logo=css3)

## 🎮 Como Jogar

### Controles

| Tecla | Ação |
|-------|------|
| `WASD` / `Setas` | Mover o jogador |
| `Espaço` / `F` | Atacar / Coletar recursos |
| `E` | Comer maçã (recupera fome) |
| `Q` | Usar poção de vida |
| `B` | Modo construção |
| `1-5` | Selecionar ferramenta |
| `J` | Abrir painel de missões |
| `K` | Abrir conquistas |
| `ESC` | Pausar jogo |
| `F5` | Salvar jogo |
| `F9` | Carregar jogo |

### Recursos

- 🍎 **Maçã** - Alimento para recuperar fome
- 🌿 **Grama** - Material básico
- 🪨 **Pedra** - Material de construção
- 🪵 **Madeira** - Material de construção
- 💰 **Ouro** - Recurso raro e valioso

### Crafting

| Item | Ingredientes | Descrição |
|------|-------------|-----------|
| 🪓 Machado | 2 Pedra + 3 Madeira | Coleta madeira mais rápido |
| ⛏️ Picareta | 3 Pedra + 2 Madeira | Minera pedra e ouro |
| ⚔️ Espada | 2 Pedra + 2 Madeira + 1 Ouro | Mais dano aos inimigos |
| 🏹 Arco | 5 Madeira + 3 Grama | Ataque à distância |
| 🛡️ Escudo | 3 Madeira + 2 Pedra | Reduz dano recebido |
| 🧪 Poção | 5 Maçã + 3 Grama | Restaura 50 HP |

### Construções

| Estrutura | Custo | Efeito |
|-----------|-------|--------|
| 🔥 Fogueira | 5 Madeira + 3 Pedra | Cura vida lentamente |
| 🚧 Cerca | 4 Madeira | Bloqueia inimigos |
| 🗼 Torre | 8 Pedra + 5 Madeira + 2 Ouro | Ataca automaticamente |
| ⚠️ Armadilha | 3 Pedra + 2 Madeira | Causa dano a inimigos |

### Inimigos

- 🟢 **Slime** - Inimigo básico, lento
- 🦇 **Morcego** - Rápido, pouca vida
- 👺 **Goblin** - Equilibrado
- 💀 **Esqueleto** - Forte, mais vida

### Sistema de Waves

O jogo possui um sistema de waves progressivas:
- Cada wave aumenta a dificuldade
- A cada 5 waves aparece um **BOSS**
- Complete waves para ganhar bônus de pontuação

### Missões

Complete missões para ganhar XP e Ouro:
- Coletar recursos específicos
- Derrotar inimigos
- Construir estruturas
- Sobreviver waves

### Conquistas

Desbloqueie conquistas realizando feitos especiais:
- Derrotar inimigos
- Coletar recursos
- Alcançar níveis
- E muito mais!

## 🚀 Como Executar

1. Clone o repositório:
```bash
git clone https://github.com/lucaslopes-ti/forager-js.git
```

2. Abra o arquivo `index.html` em um navegador moderno

Ou use um servidor local:
```bash
# Com Python
python -m http.server 8000

# Com Node.js
npx serve
```

## 📁 Estrutura do Projeto

```
MeuForager/
├── index.html          # Página principal
├── css/
│   └── style.css       # Estilos do jogo
├── js/
│   ├── main.js         # Loop principal
│   ├── player.js       # Sistema do jogador
│   ├── resources.js    # Recursos coletáveis
│   ├── inventory.js    # Sistema de inventário
│   ├── crafting.js     # Sistema de crafting
│   ├── enemies.js      # Sistema de inimigos
│   ├── structures.js   # Estruturas construíveis
│   ├── quests.js       # Missões e conquistas
│   ├── particles.js    # Sistema de partículas
│   ├── audio.js        # Efeitos sonoros
│   ├── world.js        # Mundo do jogo
│   └── ui.js           # Interface do usuário
└── README.md           # Documentação
```

## ✨ Funcionalidades

- ✅ Coleta de recursos com feedback visual
- ✅ Sistema de crafting completo
- ✅ Inventário com ferramentas e consumíveis
- ✅ Inimigos com IA e sistema de waves
- ✅ Boss fights a cada 5 waves
- ✅ Sistema de combo e multiplicador
- ✅ Construção de estruturas
- ✅ Missões e conquistas
- ✅ Sistema de níveis e XP
- ✅ Efeitos sonoros sintetizados
- ✅ Sistema de partículas
- ✅ Minimapa
- ✅ Save/Load com LocalStorage
- ✅ UI moderna e responsiva

## 🛠️ Tecnologias

- **JavaScript ES6+** - Lógica do jogo
- **HTML5 Canvas** - Renderização gráfica
- **CSS3** - Animações e UI
- **Web Audio API** - Efeitos sonoros
- **LocalStorage** - Persistência de dados

## 📝 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

---

Feito com 💚 em JavaScript
