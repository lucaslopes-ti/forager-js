/**
 * Sistema de Estruturas Construíveis
 */

class Structure {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 50;
        this.height = 50;
        this.health = this.getMaxHealth();
        this.maxHealth = this.health;
        this.active = true;
        this.animationFrame = 0;
        this.lastEffectTime = 0;
    }

    getMaxHealth() {
        return { 'campfire': 100, 'fence': 80, 'tower': 150, 'trap': 50 }[this.type] || 100;
    }

    getEffect() {
        return {
            'campfire': { type: 'heal', range: 100, amount: 0.1, interval: 500 },
            'fence': { type: 'block', range: 0 },
            'tower': { type: 'attack', range: 150, damage: 15, interval: 1500 },
            'trap': { type: 'damage', range: 30, damage: 40, interval: 2000 }
        }[this.type] || null;
    }

    update(currentTime, player, enemies) {
        this.animationFrame += 0.1;
        if (!this.active) return;

        const effect = this.getEffect();
        if (!effect || currentTime - this.lastEffectTime < (effect.interval || 1000)) return;
        this.lastEffectTime = currentTime;

        const dx = player.getCenterX() - (this.x + this.width / 2);
        const dy = player.getCenterY() - (this.y + this.height / 2);
        const playerDist = Math.sqrt(dx * dx + dy * dy);

        if (effect.type === 'heal' && playerDist < effect.range && player.health < player.maxHealth) {
            player.health = Math.min(player.maxHealth, player.health + effect.amount);
        }

        if (effect.type === 'attack' || effect.type === 'damage') {
            enemies.forEach(enemy => {
                if (enemy.isDead) return;
                const ex = (enemy.x + enemy.width / 2) - (this.x + this.width / 2);
                const ey = (enemy.y + enemy.height / 2) - (this.y + this.height / 2);
                const dist = Math.sqrt(ex * ex + ey * ey);
                if (dist < effect.range) {
                    enemy.takeDamage(effect.damage);
                    particleSystem.createDamageEffect(enemy.x + enemy.width / 2, enemy.y, effect.damage);
                    if (effect.type === 'damage') {
                        this.health -= 15;
                        if (this.health <= 0) this.active = false;
                    }
                }
            });
        }
    }

    draw(ctx) {
        if (!this.active) return;
        const bounce = Math.sin(this.animationFrame) * 2;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, this.y + this.height - 2, this.width / 2, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        if (this.type === 'campfire') this.drawCampfire(ctx, bounce);
        else if (this.type === 'fence') this.drawFence(ctx);
        else if (this.type === 'tower') this.drawTower(ctx);
        else if (this.type === 'trap') this.drawTrap(ctx);

        if (this.health < this.maxHealth) {
            const hp = this.health / this.maxHealth;
            ctx.fillStyle = '#333';
            ctx.fillRect(this.x, this.y - 10, this.width, 5);
            ctx.fillStyle = hp > 0.5 ? '#51CF66' : hp > 0.25 ? '#ffd700' : '#ff6b6b';
            ctx.fillRect(this.x, this.y - 10, this.width * hp, 5);
        }
    }

    drawCampfire(ctx, bounce) {
        ctx.fillStyle = '#555';
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 * i) / 6;
            ctx.beginPath();
            ctx.arc(this.x + 25 + Math.cos(angle) * 15, this.y + 30 + Math.sin(angle) * 10, 5, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.fillStyle = '#8B4513';
        ctx.save();
        ctx.translate(this.x + 25, this.y + 28);
        for (let i = 0; i < 3; i++) { ctx.rotate(Math.PI / 3); ctx.fillRect(-12, -2, 24, 4); }
        ctx.restore();

        ['#ff4500', '#ff6b35', '#ffd700'].forEach((c, i) => {
            const flicker = Math.sin(this.animationFrame * 3 + i) * 3;
            ctx.fillStyle = c;
            ctx.beginPath();
            ctx.moveTo(this.x + 25, this.y + 8 + bounce + flicker);
            ctx.quadraticCurveTo(this.x + 38 - i * 4, this.y + 22 + bounce, this.x + 25, this.y + 35 + bounce);
            ctx.quadraticCurveTo(this.x + 12 + i * 4, this.y + 22 + bounce, this.x + 25, this.y + 8 + bounce + flicker);
            ctx.fill();
        });

        ctx.fillStyle = 'rgba(255, 200, 100, 0.1)';
        ctx.beginPath();
        ctx.arc(this.x + 25, this.y + 25, 35, 0, Math.PI * 2);
        ctx.fill();
    }

    drawFence(ctx) {
        ctx.fillStyle = '#8B4513';
        for (let i = 0; i < 3; i++) {
            const x = this.x + 8 + i * 15;
            ctx.fillRect(x, this.y + 10, 5, 32);
            ctx.beginPath();
            ctx.moveTo(x, this.y + 10);
            ctx.lineTo(x + 2.5, this.y + 2);
            ctx.lineTo(x + 5, this.y + 10);
            ctx.fill();
        }
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(this.x + 5, this.y + 16, 38, 3);
        ctx.fillRect(this.x + 5, this.y + 28, 38, 3);
    }

    drawTower(ctx) {
        ctx.fillStyle = '#555';
        ctx.fillRect(this.x + 12, this.y + 32, 26, 15);
        ctx.fillStyle = '#777';
        ctx.fillRect(this.x + 16, this.y + 5, 18, 30);
        ctx.fillStyle = '#4dabf7';
        ctx.beginPath();
        ctx.moveTo(this.x + 12, this.y + 8);
        ctx.lineTo(this.x + 25, this.y - 3);
        ctx.lineTo(this.x + 38, this.y + 8);
        ctx.fill();
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(this.x + 20, this.y + 14, 10, 10);
    }

    drawTrap(ctx) {
        ctx.fillStyle = '#333';
        ctx.fillRect(this.x + 5, this.y + 32, 40, 10);
        ctx.fillStyle = '#888';
        for (let i = 0; i < 5; i++) {
            const x = this.x + 8 + i * 8;
            ctx.beginPath();
            ctx.moveTo(x, this.y + 32);
            ctx.lineTo(x + 3, this.y + 18);
            ctx.lineTo(x + 6, this.y + 32);
            ctx.fill();
        }
    }

    isCollidingWith(entity) {
        return this.type === 'fence' &&
            entity.x < this.x + this.width && entity.x + entity.width > this.x &&
            entity.y < this.y + this.height && entity.y + entity.height > this.y;
    }
}

class StructureManager {
    constructor() {
        this.structures = [];
        this.buildMode = false;
        this.selectedBuilding = null;
        this.previewX = 0;
        this.previewY = 0;

        this.buildingRecipes = [
            { type: 'campfire', name: 'Fogueira', icon: '🔥', description: 'Cura vida lentamente', cost: { wood: 5, stone: 3 } },
            { type: 'fence', name: 'Cerca', icon: '🚧', description: 'Bloqueia inimigos', cost: { wood: 4 } },
            { type: 'tower', name: 'Torre', icon: '🗼', description: 'Ataca automaticamente', cost: { stone: 8, wood: 5, gold: 2 } },
            { type: 'trap', name: 'Armadilha', icon: '⚠️', description: 'Dano a inimigos', cost: { stone: 3, wood: 2 } }
        ];
    }

    canBuild(recipe, inventory) {
        for (const [item, amount] of Object.entries(recipe.cost)) {
            if (!inventory.hasItem(item, amount)) return false;
        }
        return true;
    }

    build(type, x, y, inventory) {
        const recipe = this.buildingRecipes.find(r => r.type === type);
        if (!recipe || !this.canBuild(recipe, inventory)) return false;

        for (const [item, amount] of Object.entries(recipe.cost)) {
            inventory.removeItem(item, amount);
        }

        this.structures.push(new Structure(x - 25, y - 25, type));
        particleSystem.createBuildEffect(x, y);
        return true;
    }

    update(currentTime, player, enemies) {
        this.structures = this.structures.filter(s => s.active);
        this.structures.forEach(s => s.update(currentTime, player, enemies));
    }

    draw(ctx) {
        this.structures.forEach(s => s.draw(ctx));

        if (this.buildMode && this.selectedBuilding) {
            ctx.globalAlpha = 0.5;
            const preview = new Structure(this.previewX - 25, this.previewY - 25, this.selectedBuilding);
            preview.draw(ctx);
            ctx.globalAlpha = 1;

            const effect = preview.getEffect();
            if (effect && effect.range) {
                ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.arc(this.previewX, this.previewY, effect.range, 0, Math.PI * 2);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }
    }

    checkCollisions(entity) {
        for (const s of this.structures) {
            if (s.isCollidingWith(entity)) return s;
        }
        return null;
    }

    getSaveData() {
        return this.structures.map(s => ({ x: s.x, y: s.y, type: s.type, health: s.health }));
    }

    loadSaveData(data) {
        this.structures = data.map(d => {
            const s = new Structure(d.x, d.y, d.type);
            s.health = d.health;
            return s;
        });
    }
}
