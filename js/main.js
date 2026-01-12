/**
 * Arquivo Principal do Jogo Forager
 * Gerencia o game loop e coordena todos os sistemas
 */

// Variáveis globais do jogo
let canvas;
let ctx;
let player;
let resourceManager;
let inventory;
let craftingSystem;
let world;
let uiManager;

// Estado do jogo
let keys = {};
let gameRunning = false;
let lastTime = 0;
let particles = []; // Sistema de partículas para efeitos visuais

/**
 * Inicializa o jogo
 */
function init() {
    // Obtém canvas e contexto
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    // Inicializa sistemas
    inventory = new Inventory();
    craftingSystem = new CraftingSystem();
    player = new Player(canvas.width / 2, canvas.height / 2);
    resourceManager = new ResourceManager();
    world = new World(canvas);
    uiManager = new UIManager(inventory, craftingSystem);

    // Inicializa UI
    uiManager.init();

    // Spawna recursos iniciais
    for (let i = 0; i < 8; i++) {
        resourceManager.spawnResource(canvas);
    }

    // Event listeners para teclado
    document.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        
        // Toggle crafting menu com 'C'
        if (e.key === 'c' || e.key === 'C') {
            uiManager.toggleCraftingMenu();
        }
    });

    document.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });

    // Previne comportamento padrão de algumas teclas
    document.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault();
        }
    });

    console.log('Jogo Forager inicializado!');
    console.log('Controles: WASD ou Setas para mover, C para abrir crafting');
}

/**
 * Atualiza a lógica do jogo
 * @param {number} currentTime - Tempo atual em milissegundos
 */
function update(currentTime) {
    if (!gameRunning) return;

    // Atualiza jogador
    player.handleInput(keys);
    player.update(canvas);

    // Atualiza recursos
    resourceManager.update(currentTime, canvas);

    // Verifica colisões e coleta recursos
    const collected = resourceManager.checkCollisions(player);
    collected.forEach(resourceType => {
        inventory.addItem(resourceType, 1);
        uiManager.addXP(5); // Ganha XP ao coletar
        createParticles(player.getCenterX(), player.getCenterY(), resourceType);
        
        // Mostra notificação de coleta
        const resourceNames = {
            'apple': '🍎 Maçã',
            'grass': '🌱 Grama',
            'stone': '🪨 Pedra'
        };
        uiManager.showNotification(`+1 ${resourceNames[resourceType] || resourceType}`, 'success');
        uiManager.playSound('collect');
    });

    // Atualiza partículas
    particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.98; // Fricção
        p.vy *= 0.98;
        p.vy += 0.1; // Gravidade leve
        p.life--;
        p.alpha = p.life / p.maxLife;
        p.rotation += p.rotationSpeed;
        p.size *= 0.98; // Encolhe gradualmente
        return p.life > 0 && p.alpha > 0;
    });

    // Atualiza UI
    uiManager.update();
}

/**
 * Renderiza o jogo
 */
function draw() {
    if (!gameRunning) return;

    // Limpa canvas
    world.clear();

    // Desenha fundo
    world.drawBackground();

    // Desenha recursos
    resourceManager.draw(ctx);

    // Desenha partículas
    drawParticles();

    // Desenha jogador
    player.draw(ctx);
}

/**
 * Cria partículas de efeito ao coletar recursos
 * @param {number} x - Posição X
 * @param {number} y - Posição Y
 * @param {string} resourceType - Tipo do recurso
 */
function createParticles(x, y, resourceType) {
    const colors = {
        'apple': '#FF6B6B',
        'grass': '#51CF66',
        'stone': '#8B8680'
    };

    const color = colors[resourceType] || '#fff';

    // Cria mais partículas com variação
    for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 * i) / 12;
        const speed = Math.random() * 3 + 2;
        particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 40,
            maxLife: 40,
            color: color,
            alpha: 1,
            size: Math.random() * 4 + 3,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.2
        });
    }
}

/**
 * Desenha partículas no canvas
 */
function drawParticles() {
    particles.forEach(particle => {
        ctx.save();
        ctx.globalAlpha = particle.alpha;
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        
        // Gradiente para partícula
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size);
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        
        ctx.beginPath();
        ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Brilho
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(-particle.size * 0.3, -particle.size * 0.3, particle.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    });
}

/**
 * Game loop principal
 * @param {number} currentTime - Tempo atual em milissegundos
 */
function gameLoop(currentTime) {
    if (!lastTime) lastTime = currentTime;
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    update(currentTime);
    draw();

    requestAnimationFrame(gameLoop);
}

/**
 * Inicia o jogo quando a tela de início é fechada
 */
function startGame() {
    if (gameRunning) return; // Evita iniciar múltiplas vezes
    gameRunning = true;
    lastTime = performance.now();
    gameLoop(performance.now());
}

// Torna a função acessível globalmente
window.startGame = startGame;

// Quando a página carregar, inicializa o jogo
window.addEventListener('load', () => {
    init();
    
    // O game loop será iniciado quando o botão de start for clicado
    // (gerenciado pelo uiManager)
});
