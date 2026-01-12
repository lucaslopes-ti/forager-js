# Documentação de Design - Forager Game

## Visão Geral

O Forager Game é um jogo 2D estilo top-down que combina elementos de coleta, crafting e progressão. O jogador controla um personagem que coleta recursos do ambiente, os armazena em um inventário e os utiliza para craftar novos itens e ferramentas.

## Mecânicas Principais

### 1. Sistema de Movimento

**Implementação:**
- Movimento suave em 8 direções (WASD ou setas)
- Velocidade normalizada para movimento diagonal
- Limites de tela para manter o jogador visível
- Animação sutil de "bounce" durante movimento

**Detalhes Técnicos:**
- Velocidade base: 4 pixels por frame
- Normalização diagonal: multiplicação por 0.707 (1/√2)
- Detecção de direção para animação visual

### 2. Sistema de Coleta

**Implementação:**
- Coleta automática ao caminhar sobre recursos
- Detecção de colisão AABB (Axis-Aligned Bounding Box)
- Remoção imediata do recurso após coleta
- Efeitos visuais de partículas ao coletar

**Tipos de Recursos:**
- **Maçãs (Apple)**: Probabilidade 30%, coletável rapidamente
- **Grama (Grass)**: Probabilidade 50%, matéria-prima comum
- **Pedras (Stone)**: Probabilidade 20%, recurso raro

**Spawn de Recursos:**
- Intervalo: 3 segundos
- Máximo simultâneo: 15 recursos
- Posicionamento aleatório com margem de segurança

### 3. Sistema de Inventário

**Implementação:**
- Armazenamento em objeto JavaScript
- Atualização em tempo real na UI
- Suporte para múltiplos tipos de itens
- Contagem automática de quantidades

**Estrutura:**
```javascript
{
    'apple': quantidade,
    'grass': quantidade,
    'stone': quantidade,
    'axe': quantidade,
    // ... outros itens craftados
}
```

### 4. Sistema de Crafting

**Implementação:**
- Sistema baseado em receitas
- Verificação de ingredientes antes de craftar
- Remoção automática de ingredientes
- Adição do item resultante ao inventário

**Receitas Disponíveis:**

| Item | Ingredientes | XP Ganho |
|------|--------------|----------|
| Machado | 2 pedras + 3 gramas | 20 |
| Picareta | 5 pedras + 1 grama | 20 |
| Espada | 3 pedras + 5 gramas | 20 |
| Cesta | 10 gramas | 20 |
| Martelo | 4 pedras + 2 gramas | 20 |

**Validação:**
- Verifica disponibilidade de todos os ingredientes
- Botões desabilitados quando ingredientes insuficientes
- Feedback visual claro

### 5. Sistema de Progressão

**Implementação:**
- Sistema de níveis baseado em XP
- XP ganho por ações:
  - Coletar recurso: 5 XP
  - Craftar item: 20 XP
- XP necessário aumenta progressivamente (×1.5 por nível)

**Fórmula:**
```
XP inicial para nível 2: 100
XP para nível N: XP_anterior × 1.5
```

### 6. Sistema de Partículas

**Implementação:**
- Partículas geradas ao coletar recursos
- Movimento aleatório com física simples
- Fade out gradual (alpha decay)
- Cores baseadas no tipo de recurso coletado

**Propriedades:**
- Quantidade: 8 partículas por coleta
- Vida: 30 frames
- Velocidade: aleatória entre -2 e +2 pixels/frame
- Tamanho: 2-5 pixels

## Arquitetura do Código

### Separação de Responsabilidades

**main.js:**
- Game loop principal
- Coordenação entre sistemas
- Gerenciamento de eventos globais
- Sistema de partículas

**player.js:**
- Movimento e controle
- Renderização do personagem
- Detecção de posição

**resources.js:**
- Gerenciamento de recursos
- Spawn e remoção
- Renderização de recursos
- Detecção de colisão

**inventory.js:**
- Armazenamento de itens
- Adição/remoção de itens
- Verificação de disponibilidade

**crafting.js:**
- Definição de receitas
- Validação de ingredientes
- Execução de crafting

**world.js:**
- Renderização do ambiente
- Elementos decorativos
- Grid de debug (opcional)

**ui.js:**
- Atualização da interface
- Gerenciamento de menus
- Exibição de estatísticas
- Feedback ao jogador

### Padrões de Design Utilizados

1. **Classe Singleton (implícito)**: Cada sistema é instanciado uma vez
2. **Observer Pattern**: UI atualiza quando inventário muda
3. **Component Pattern**: Sistemas independentes e modulares

## Design Visual

### Paleta de Cores

**Fundo:**
- Verde escuro gradiente (#2a4a2a → #1e3a1e)

**Recursos:**
- Maçã: #FF6B6B (vermelho claro)
- Grama: #51CF66 (verde claro)
- Pedra: #8B8680 (cinza)

**Personagem:**
- Corpo: #FF9D5C (laranja)
- Cabeça: #FFD4A3 (pele claro)

**UI:**
- Fundo: rgba(0, 0, 0, 0.85)
- Texto: #fff
- Destaques: #ffd700 (dourado)
- Botões: Gradientes coloridos

### Estilo Artístico

- **Estilo**: Pixel art simplificado
- **Resolução**: Canvas 1024x768
- **Sprites**: Gerados programaticamente
- **Animações**: Suaves e sutis

## Fluxo de Jogo

### Loop Principal

1. **Input**: Captura teclado
2. **Update**: Atualiza todos os sistemas
   - Movimento do jogador
   - Spawn de recursos
   - Detecção de colisões
   - Atualização de partículas
3. **Render**: Desenha tudo na ordem:
   - Fundo
   - Recursos
   - Partículas
   - Jogador
4. **UI Update**: Atualiza interface
5. **Repeat**: RequestAnimationFrame

### Estados do Jogo

1. **Tela de Início**: Menu inicial com botão
2. **Jogando**: Game loop ativo
3. **Crafting Aberto**: Menu de crafting visível

## Decisões de Design

### Por que Canvas ao invés de DOM?

- Melhor performance para jogos
- Controle total sobre renderização
- Suporte a animações suaves
- Facilita implementação de partículas

### Por que JavaScript Vanilla?

- Sem dependências externas
- Fácil de entender e modificar
- Compatibilidade universal
- Requisito da atividade

### Por que Sprites Programáticos?

- Não requer assets externos
- Fácil de modificar cores/formas
- Funciona imediatamente
- Demonstra conhecimento de Canvas API

## Melhorias Implementadas Além do Básico

1. **Sistema de Partículas**: Efeitos visuais ao coletar
2. **Animações Suaves**: Movimento e pulsação
3. **UI Moderna**: Design limpo e responsivo
4. **Sistema de Níveis**: Progressão clara
5. **Feedback Visual**: Cores e animações
6. **Múltiplas Receitas**: 5 receitas diferentes
7. **Validação de Crafting**: Botões inteligentes

## Considerações de Performance

- **Otimizações:**
  - Remoção imediata de recursos coletados
  - Limite de recursos no mapa
  - Partículas com vida limitada
  - Renderização apenas do necessário

- **Limitações:**
  - Máximo 15 recursos simultâneos
  - Partículas limitadas a 30 frames
  - Grid de debug desabilitado por padrão

## Extensibilidade

O código foi estruturado para facilitar:
- Adição de novos tipos de recursos
- Criação de novas receitas
- Implementação de novos sistemas
- Modificação de mecânicas existentes

## Conclusão

O jogo implementa todas as funcionalidades obrigatórias e adiciona melhorias visuais e de jogabilidade. A arquitetura modular permite fácil manutenção e expansão futura.
