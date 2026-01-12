/**
 * Forager Game - Main Entry Point
 */

// Game State
let canvas, ctx;
let player, resourceManager, inventory, craftingSystem, uiManager;
let world, enemyManager, structureManager, questManager, achievementManager;
let gameState = 'start';
let keys = {};
let lastTime = 0;
let isPaused = false;

// Initialize Game
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = 900;
    canvas.height = 600;

    // Initialize systems
    player = new Player(canvas.width / 2 - 20, canvas.height / 2 - 20);
    resourceManager = new ResourceManager();
    inventory = new Inventory();
    craftingSystem = new CraftingSystem();
    uiManager = new UIManager();
    world = new World(canvas);
    enemyManager = new EnemyManager();
    structureManager = new StructureManager();
    questManager = new QuestManager();
    achievementManager = new AchievementManager();

    // Initial resources
    for (let i = 0; i < 10; i++) {
        resourceManager.spawnResource(canvas);
    }

    // Start first wave
    enemyManager.startWave(1);

    setupEventListeners();
    updateUI();

    gameState = 'playing';
    audioManager.init();
    requestAnimationFrame(gameLoop);
}

function setupEventListeners() {
    // Keyboard
    document.addEventListener('keydown', (e) => {
        keys[e.key] = true;

        // Tool selection (1-5)
        if (e.key >= '1' && e.key <= '5') {
            player.selectTool(parseInt(e.key) - 1);
        }

        // Attack
        if (e.key === ' ' || e.key === 'f' || e.key === 'F') {
            if (player.attack()) {
                audioManager.playAttack();

                // Harvest resources
                const tool = player.tools[player.selectedTool];
                const collected = resourceManager.harvestNearby(player, tool, player.getAttackDamage());
                collected.forEach(type => {
                    inventory.addItem(type, 1);
                    audioManager.playCollect(type);
                    particleSystem.createCollectEffect(player.getCenterX(), player.getCenterY(), type);
                    questManager.updateQuest('collect_' + type, 1);
                    achievementManager.updateStat('collected', 1);
                    if (type === 'gold') achievementManager.updateStat('gold', 1);
                });
            }
        }

        // Eat
        if (e.key === 'e' || e.key === 'E') {
            if (player.eat(inventory)) {
                audioManager.playEat();
                particleSystem.createHealEffect(player.getCenterX(), player.getCenterY(), 25);
                uiManager.showNotification('🍎 Maçã consumida! +25 Fome', 'success');
            }
        }

        // Use potion
        if (e.key === 'q' || e.key === 'Q') {
            if (player.useHealthPotion(inventory)) {
                audioManager.playEat();
                particleSystem.createHealEffect(player.getCenterX(), player.getCenterY(), 50);
                uiManager.showNotification('🧪 Poção usada! +50 HP', 'success');
            }
        }

        // Build mode
        if (e.key === 'b' || e.key === 'B') {
            structureManager.buildMode = !structureManager.buildMode;
            document.getElementById('build-menu').classList.toggle('visible', structureManager.buildMode);
            if (structureManager.buildMode) {
                uiManager.updateBuildMenu(structureManager, inventory);
            }
        }

        // Toggle panels
        if (e.key === 'j' || e.key === 'J') {
            document.getElementById('quest-panel').classList.toggle('visible');
            uiManager.updateQuestPanel(questManager);
        }

        if (e.key === 'k' || e.key === 'K') {
            document.getElementById('achievement-panel').classList.toggle('visible');
            uiManager.updateAchievementPanel(achievementManager);
        }

        // Pause
        if (e.key === 'Escape') {
            if (gameState === 'playing') {
                isPaused = !isPaused;
            }
        }

        // Restart
        if (e.key === 'Enter' && gameState === 'gameover') {
            init();
        }

        // Save/Load
        if (e.key === 'F5') {
            e.preventDefault();
            saveGame();
        }
        if (e.key === 'F9') {
            e.preventDefault();
            loadGame();
        }
    });

    document.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });

    // Mouse for building
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        structureManager.previewX = e.clientX - rect.left;
        structureManager.previewY = e.clientY - rect.top;
    });

    canvas.addEventListener('click', (e) => {
        if (structureManager.buildMode && structureManager.selectedBuilding) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (structureManager.build(structureManager.selectedBuilding, x, y, inventory)) {
                audioManager.playBuild();
                uiManager.showNotification('🏗️ Estrutura construída!', 'success');
                questManager.updateQuest('build', 1);
                achievementManager.updateStat('built', 1);
                updateUI();
            } else {
                uiManager.showNotification('❌ Recursos insuficientes!', 'error');
            }
        }
    });

    // Crafting clicks
    document.getElementById('crafting').addEventListener('click', (e) => {
        const craftBtn = e.target.closest('.craft-btn');
        if (craftBtn && !craftBtn.disabled) {
            const item = craftBtn.closest('.craft-item');
            const index = parseInt(item.dataset.index);

            if (craftingSystem.craft(inventory, index)) {
                const recipe = craftingSystem.getRecipes()[index];
                audioManager.playCraft();
                uiManager.showNotification(`✅ ${recipe.name} criado!`, 'success');
                questManager.updateQuest('craft', 1);
                achievementManager.updateStat('crafted', 1);

                // Equip tool if applicable
                if (['axe', 'pickaxe', 'sword', 'bow', 'shield'].includes(recipe.result)) {
                    const emptySlot = player.tools.findIndex((t, i) => i > 0 && t === null);
                    if (emptySlot !== -1) {
                        player.equipTool(recipe.result, emptySlot);
                    }
                }

                updateUI();
            }
        }
    });

    // Build menu clicks
    document.getElementById('build-menu').addEventListener('click', (e) => {
        const item = e.target.closest('.build-item');
        if (item && item.classList.contains('available')) {
            structureManager.selectedBuilding = item.dataset.type;
            document.querySelectorAll('.build-item').forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
        }
    });

    // Quest claim clicks
    document.getElementById('quest-panel').addEventListener('click', (e) => {
        const claimBtn = e.target.closest('.claim-btn');
        if (claimBtn) {
            const questId = claimBtn.dataset.id;
            if (questManager.claimReward(questId, player, inventory)) {
                audioManager.playAchievement();
                uiManager.showNotification('🎁 Recompensa coletada!', 'success');
                uiManager.updateQuestPanel(questManager);
                updateUI();
            }
        }
    });
}

function updateUI() {
    uiManager.updateInventory(inventory);
    uiManager.updateCraftingMenu(craftingSystem, inventory);
    uiManager.updateStats(player, enemyManager);
}

function update(deltaTime) {
    if (isPaused || gameState !== 'playing') return;

    const currentTime = performance.now();

    // Player
    player.handleInput(keys);
    player.update(canvas, deltaTime);

    // Resources
    resourceManager.update(currentTime, canvas);
    const collected = resourceManager.checkCollisions(player);
    collected.forEach(type => {
        inventory.addItem(type, 1);
        audioManager.playCollect(type);
        particleSystem.createCollectEffect(player.getCenterX(), player.getCenterY(), type);
        questManager.updateQuest('collect_' + type, 1);
        achievementManager.updateStat('collected', 1);
        if (type === 'gold') achievementManager.updateStat('gold', 1);
    });

    // Enemies
    enemyManager.trySpawn(currentTime, canvas, player.level);
    enemyManager.update(player, deltaTime, canvas, structureManager);

    // Enemy attacks
    const damage = enemyManager.checkAttacks(player);
    if (damage > 0) {
        if (player.takeDamage(damage)) {
            gameState = 'gameover';
            audioManager.playGameOver();
            return;
        }
        audioManager.playHurt();
        particleSystem.createDamageEffect(player.getCenterX(), player.getCenterY(), damage);
    }

    // Player attacks
    const killed = enemyManager.checkPlayerAttack(player);
    killed.forEach(enemy => {
        audioManager.playEnemyDeath();
        particleSystem.createDeathEffect(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2);

        const killResult = player.addKill();
        const xpGain = enemy.xpReward;

        if (player.addXP(xpGain)) {
            audioManager.playLevelUp();
            particleSystem.createLevelUpEffect(player.getCenterX(), player.getCenterY());
            uiManager.showNotification(`🎉 LEVEL UP! Nível ${player.level}`, 'levelup');
            questManager.updateQuest('level', player.level);
            achievementManager.updateStat('level', player.level);
        }

        particleSystem.createXPEffect(enemy.x + enemy.width / 2, enemy.y, xpGain);

        if (killResult.combo > 1) {
            particleSystem.createComboEffect(player.getCenterX(), player.getCenterY() - 40, killResult.combo);
            audioManager.playCombo();
            achievementManager.updateStat('combo', killResult.combo);
        }

        questManager.updateQuest('kill', 1);
        achievementManager.updateStat('kills', 1);
        achievementManager.updateStat('score', killResult.points);

        if (enemy.isBoss) {
            achievementManager.updateStat('boss', 1);
            uiManager.showNotification('👑 BOSS DERROTADO!', 'success');
        }

        // Drop loot
        const dropChance = Math.random();
        if (dropChance < 0.3) {
            inventory.addItem('gold', 1);
            uiManager.showNotification('💰 +1 Ouro!', 'info');
        }
    });

    // Wave completion
    if (enemyManager.isWaveComplete()) {
        audioManager.playWaveComplete();
        uiManager.showNotification(`🌊 Wave ${enemyManager.wave} completa!`, 'success');
        questManager.updateQuest('wave', 1);
        achievementManager.updateStat('wave', enemyManager.wave);

        // Bonus
        const bonus = enemyManager.wave * 50;
        player.score += bonus;

        setTimeout(() => {
            enemyManager.startWave(enemyManager.wave + 1);
            if (enemyManager.wave % 5 === 0) {
                audioManager.playBossWarning();
                uiManager.showNotification('⚠️ BOSS WAVE!', 'warning');
            }
        }, 2000);
    }

    // Structures
    structureManager.update(currentTime, player, enemyManager.enemies);

    // Particles
    particleSystem.update(deltaTime);

    // Check achievements
    const newAchievements = achievementManager.checkAchievements();
    newAchievements.forEach(ach => {
        audioManager.playAchievement();
        uiManager.showNotification(`🏆 ${ach.icon} ${ach.name}`, 'achievement');
    });

    // Update UI
    updateUI();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // World
    world.draw(ctx);

    // Structures
    structureManager.draw(ctx);

    // Resources
    resourceManager.draw(ctx);

    // Enemies
    enemyManager.draw(ctx);

    // Player
    player.draw(ctx);

    // Particles
    particleSystem.draw(ctx);

    // Minimap
    world.drawMinimap(ctx, player, resourceManager.resources, enemyManager.enemies, structureManager.structures);

    // Overlays
    if (isPaused) {
        uiManager.drawPauseScreen(ctx);
    }

    if (gameState === 'gameover') {
        uiManager.drawGameOver(ctx, player);
    }
}

function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    update(deltaTime);
    draw();

    requestAnimationFrame(gameLoop);
}

function saveGame() {
    const saveData = {
        player: player.getSaveData(),
        inventory: inventory.getSaveData(),
        structures: structureManager.getSaveData(),
        quests: questManager.getSaveData(),
        achievements: achievementManager.getSaveData(),
        wave: enemyManager.wave
    };
    localStorage.setItem('foragerSave', JSON.stringify(saveData));
    uiManager.showNotification('💾 Jogo salvo!', 'success');
}

function loadGame() {
    const saveData = localStorage.getItem('foragerSave');
    if (saveData) {
        const data = JSON.parse(saveData);
        player.loadSaveData(data.player);
        inventory.loadSaveData(data.inventory);
        structureManager.loadSaveData(data.structures);
        questManager.loadSaveData(data.quests);
        achievementManager.loadSaveData(data.achievements);
        enemyManager.startWave(data.wave);
        uiManager.showNotification('📂 Jogo carregado!', 'success');
        updateUI();
    } else {
        uiManager.showNotification('❌ Nenhum save encontrado!', 'error');
    }
}

// Start screen
document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const startBtn = document.getElementById('start-btn');

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            startScreen.classList.add('hidden');
            init();
        });
    }
});
