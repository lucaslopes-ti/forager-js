# Forager Game

## Descrição

Recria do jogo Forager em JavaScript puro com coleta de recursos, inventário e sistema de crafting. Este jogo foi desenvolvido como atividade EAD para o curso de Programação de Jogos Digitais do SENAI Dr. Celso Charuri.

## Como Executar

1. Extraia o arquivo .zip (se aplicável)
2. Abra o arquivo `index.html` em seu navegador moderno (Chrome, Firefox, Edge, etc.)
3. Clique no botão "INICIAR JOGO" na tela de início
4. Use WASD ou Setas para mover o personagem
5. Ande sobre os recursos para coletá-los automaticamente
6. Aperte C para abrir o menu de crafting
7. Clique nos botões de crafting para criar novos itens

## Controles

- **W/A/S/D** ou **Setas**: Mover o personagem
- **C**: Abrir/fechar menu de crafting
- **Mouse**: Clicar em botões de crafting

## Mecânicas Principais

### Coleta de Recursos
- Ande sobre os recursos (maçãs, grama, pedras) para coletá-los automaticamente
- Cada recurso coletado adiciona 5 XP
- Recursos reaparecem automaticamente no mapa a cada 3 segundos
- Máximo de 15 recursos simultâneos no mapa

### Inventário
- Visualize todos os itens coletados na interface lateral
- Itens são organizados por tipo com contador de quantidade
- Itens craftados também aparecem no inventário

### Sistema de Crafting
- Combine recursos para criar ferramentas e itens
- Receitas disponíveis:
  - **Machado**: 2 pedras + 3 gramas
  - **Picareta**: 5 pedras + 1 grama
  - **Espada**: 3 pedras + 5 gramas
  - **Cesta**: 10 gramas
  - **Martelo**: 4 pedras + 2 gramas
- Craftar itens adiciona 20 XP

### Sistema de Progressão
- Ganhe XP coletando recursos e craftando itens
- Aumente de nível para desbloquear novas possibilidades
- XP necessário para próximo nível aumenta progressivamente

## Tecnologias

- **HTML5 Canvas**: Renderização gráfica
- **JavaScript Vanilla**: Lógica do jogo (sem frameworks)
- **CSS3**: Estilização da interface

## Estrutura do Projeto

```
MeuForager/
├── index.html          # Arquivo principal HTML
├── css/
│   └── style.css       # Estilos da interface
├── js/
│   ├── main.js         # Game loop principal
│   ├── player.js       # Sistema do jogador
│   ├── world.js        # Sistema do mundo
│   ├── resources.js    # Sistema de recursos
│   ├── inventory.js    # Sistema de inventário
│   ├── crafting.js     # Sistema de crafting
│   └── ui.js           # Sistema de interface
├── README.md           # Este arquivo
└── DESIGN.md           # Documentação de design
```

## Assets

Os assets visuais são gerados programaticamente usando Canvas API, criando sprites simples e coloridos para:
- Personagem do jogador
- Recursos (maçãs, grama, pedras)
- Elementos decorativos do mundo

## Funcionalidades Implementadas

✅ Personagem controlável com WASD ou setas  
✅ Coleta de recursos (3 tipos: maçãs, grama, pedras)  
✅ Sistema de inventário visual em tempo real  
✅ Sistema básico de crafting com 5 receitas  
✅ Recursos reaparecem no mapa periodicamente  
✅ Contador de recursos e nível  
✅ Tela de início (start screen)  
✅ UI clara mostrando inventário e crafting  
✅ Efeitos visuais de partículas ao coletar  
✅ Código comentado em português  
✅ Sem erros no console do navegador  

## Melhorias Futuras

- Implementação de sons reais usando Web Audio API
- Mais tipos de recursos (madeira, ouro, sementes)
- Sistema de desbloqueio de áreas
- Animações mais elaboradas
- Sistema de save/load
- Mais receitas de crafting
- Sistema de upgrades de ferramentas

## Autor

Desenvolvido como atividade EAD para o curso de Programação de Jogos Digitais - SENAI Dr. Celso Charuri

## Data de Desenvolvimento

Dezembro de 2025
