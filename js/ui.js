/**
 * Sistema de UI
 */

class UIManager {
    constructor() {
        this.notifications = [];
        this.showBuildMenu = false;
        this.showQuestPanel = false;
        this.showAchievementPanel = false;
    }

    showNotification(message, type = 'info', duration = 2500) {
        const container = document.getElementById('notifications');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = message;
        container.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 400);
        }, duration);
    }

    updateInventory(inventory) {
        const container = document.getElementById('inventory');
        if (!container) return;

        const icons = { 'apple': '🍎', 'grass': '🌿', 'stone': '🪨', 'wood': '🪵', 'gold': '💰' };
        let html = '<div class="inventory-title">📦 Inventário</div><div class="inventory-items">';

        for (const [item, qty] of Object.entries(inventory.items)) {
            if (qty > 0) {
                html += `<div class="inventory-item"><span class="item-icon">${icons[item] || '❓'}</span><span class="item-qty">${qty}</span></div>`;
            }
        }

        // Ferramentas
        for (const [tool, qty] of Object.entries(inventory.tools)) {
            if (qty > 0) {
                const toolIcons = { 'axe': '🪓', 'pickaxe': '⛏️', 'sword': '⚔️', 'bow': '🏹', 'shield': '🛡️' };
                html += `<div class="inventory-item tool"><span class="item-icon">${toolIcons[tool] || '🔧'}</span><span class="item-qty">${qty}</span></div>`;
            }
        }

        // Consumíveis
        if (inventory.consumables.health_potion > 0) {
            html += `<div class="inventory-item consumable"><span class="item-icon">🧪</span><span class="item-qty">${inventory.consumables.health_potion}</span></div>`;
        }

        html += '</div>';
        container.innerHTML = html;
    }

    updateCraftingMenu(craftingSystem, inventory) {
        const container = document.getElementById('crafting');
        if (!container) return;

        let html = '<div class="crafting-title">⚒️ Crafting</div><div class="crafting-items">';

        craftingSystem.getRecipes().forEach((recipe, index) => {
            const canCraft = craftingSystem.canCraft(inventory, index);
            html += `
                <div class="craft-item ${canCraft ? 'available' : 'unavailable'}" data-index="${index}">
                    <span class="craft-icon">${recipe.icon}</span>
                    <div class="craft-info">
                        <span class="craft-name">${recipe.name}</span>
                        <span class="craft-desc">${recipe.description}</span>
                        <div class="craft-cost">`;

            const icons = { 'apple': '🍎', 'grass': '🌿', 'stone': '🪨', 'wood': '🪵', 'gold': '💰' };
            for (const [item, qty] of Object.entries(recipe.ingredients)) {
                const has = inventory.hasItem(item, qty);
                html += `<span class="${has ? 'has' : 'missing'}">${icons[item] || item}${qty}</span>`;
            }

            html += `</div></div>
                    <button class="craft-btn" ${canCraft ? '' : 'disabled'}>${canCraft ? 'Criar' : '❌'}</button>
                </div>`;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    updateBuildMenu(structureManager, inventory) {
        const container = document.getElementById('build-menu');
        if (!container) return;

        let html = '<div class="build-title">🏗️ Construir</div><div class="build-items">';

        structureManager.buildingRecipes.forEach(recipe => {
            const canBuild = structureManager.canBuild(recipe, inventory);
            html += `
                <div class="build-item ${canBuild ? 'available' : 'unavailable'}" data-type="${recipe.type}">
                    <span class="build-icon">${recipe.icon}</span>
                    <div class="build-info">
                        <span class="build-name">${recipe.name}</span>
                        <span class="build-desc">${recipe.description}</span>
                        <div class="build-cost">`;

            const icons = { 'wood': '🪵', 'stone': '🪨', 'gold': '💰' };
            for (const [item, qty] of Object.entries(recipe.cost)) {
                const has = inventory.hasItem(item, qty);
                html += `<span class="${has ? 'has' : 'missing'}">${icons[item] || item}${qty}</span>`;
            }

            html += `</div></div></div>`;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    updateQuestPanel(questManager) {
        const container = document.getElementById('quest-panel');
        if (!container) return;

        let html = '<div class="quest-title">📜 Missões</div><div class="quest-list">';

        questManager.getActiveQuests().forEach(quest => {
            const progress = quest.getProgress();
            html += `
                <div class="quest-item ${quest.completed ? 'completed' : ''}">
                    <div class="quest-header">
                        <span class="quest-name">${quest.name}</span>
                        ${quest.completed && !quest.claimed ? `<button class="claim-btn" data-id="${quest.id}">Coletar</button>` : ''}
                    </div>
                    <span class="quest-desc">${quest.description}</span>
                    <div class="quest-progress">
                        <div class="quest-progress-bar" style="width: ${progress}%"></div>
                        <span class="quest-progress-text">${quest.progress}/${quest.target}</span>
                    </div>
                    <div class="quest-reward">
                        ${quest.reward.xp ? `⭐${quest.reward.xp}XP` : ''}
                        ${quest.reward.gold ? `💰${quest.reward.gold}` : ''}
                    </div>
                </div>`;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    updateAchievementPanel(achievementManager) {
        const container = document.getElementById('achievement-panel');
        if (!container) return;

        const unlocked = achievementManager.getUnlockedCount();
        const total = achievementManager.achievements.length;

        let html = `<div class="achievement-title">🏆 Conquistas (${unlocked}/${total})</div><div class="achievement-list">`;

        achievementManager.achievements.forEach(ach => {
            html += `
                <div class="achievement-item ${ach.unlocked ? 'unlocked' : 'locked'}">
                    <span class="achievement-icon">${ach.icon}</span>
                    <div class="achievement-info">
                        <span class="achievement-name">${ach.unlocked ? ach.name : '???'}</span>
                        <span class="achievement-desc">${ach.unlocked ? ach.description : 'Conquista bloqueada'}</span>
                    </div>
                </div>`;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    updateStats(player, enemyManager) {
        const container = document.getElementById('stats');
        if (!container) return;

        const healthPercent = (player.health / player.maxHealth) * 100;
        const hungerPercent = (player.hunger / player.maxHunger) * 100;
        const xpPercent = (player.xp / player.xpToNextLevel) * 100;
        const waveProgress = enemyManager.getWaveProgress();

        let html = `
            <div class="stat-row">
                <span class="stat-label">❤️ Vida</span>
                <div class="stat-bar health-bar">
                    <div class="stat-fill" style="width: ${healthPercent}%"></div>
                    <span class="stat-text">${Math.ceil(player.health)}/${player.maxHealth}</span>
                </div>
            </div>
            <div class="stat-row">
                <span class="stat-label">🍖 Fome</span>
                <div class="stat-bar hunger-bar">
                    <div class="stat-fill" style="width: ${hungerPercent}%"></div>
                    <span class="stat-text">${Math.ceil(player.hunger)}/${player.maxHunger}</span>
                </div>
            </div>
            <div class="stat-row">
                <span class="stat-label">⭐ XP</span>
                <div class="stat-bar xp-bar">
                    <div class="stat-fill" style="width: ${xpPercent}%"></div>
                    <span class="stat-text">${player.xp}/${player.xpToNextLevel}</span>
                </div>
            </div>
            <div class="stat-info">
                <span>🎮 Nível: ${player.level}</span>
                <span>💀 Kills: ${player.kills}</span>
                <span>🎯 Score: ${player.score}</span>
            </div>`;

        if (enemyManager.waveInProgress) {
            html += `
                <div class="wave-info">
                    <span class="wave-label">🌊 Wave ${enemyManager.wave}</span>
                    <div class="stat-bar wave-bar">
                        <div class="stat-fill" style="width: ${waveProgress}%"></div>
                        <span class="stat-text">${enemyManager.waveKills}/${enemyManager.waveEnemies}</span>
                    </div>
                </div>`;
        }

        if (player.combo > 1) {
            html += `<div class="combo-display">🔥 COMBO x${player.combo}</div>`;
        }

        html += `<div class="tool-bar">`;
        player.tools.forEach((tool, i) => {
            const icons = { 'hand': '👊', 'axe': '🪓', 'pickaxe': '⛏️', 'sword': '⚔️', 'bow': '🏹' };
            const icon = icons[tool] || '⬜';
            const selected = i === player.selectedTool ? 'selected' : '';
            html += `<div class="tool-slot ${selected}" data-slot="${i}"><span>${icon}</span><span class="slot-key">${i + 1}</span></div>`;
        });
        html += `</div>`;

        container.innerHTML = html;
    }

    drawGameOver(ctx, player) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.fillStyle = '#ff4757';
        ctx.font = 'bold 48px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', ctx.canvas.width / 2, ctx.canvas.height / 2 - 60);

        ctx.fillStyle = '#fff';
        ctx.font = '24px Orbitron';
        ctx.fillText(`Score Final: ${player.score}`, ctx.canvas.width / 2, ctx.canvas.height / 2);
        ctx.fillText(`Nível: ${player.level}`, ctx.canvas.width / 2, ctx.canvas.height / 2 + 35);
        ctx.fillText(`Inimigos Derrotados: ${player.kills}`, ctx.canvas.width / 2, ctx.canvas.height / 2 + 70);

        ctx.fillStyle = '#51CF66';
        ctx.font = '18px Orbitron';
        ctx.fillText('Pressione ENTER para reiniciar', ctx.canvas.width / 2, ctx.canvas.height / 2 + 120);
    }

    drawPauseScreen(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 48px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText('PAUSADO', ctx.canvas.width / 2, ctx.canvas.height / 2);

        ctx.fillStyle = '#fff';
        ctx.font = '18px Orbitron';
        ctx.fillText('Pressione ESC para continuar', ctx.canvas.width / 2, ctx.canvas.height / 2 + 50);
    }
}
