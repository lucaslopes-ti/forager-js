/**
 * Sistema do Jogador
 */

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.speed = 4;
        this.speedBonus = 0;
        this.velocityX = 0;
        this.velocityY = 0;
        this.direction = 'down';
        this.animationFrame = 0;

        this.maxHealth = 100;
        this.health = 100;
        this.maxHunger = 100;
        this.hunger = 100;
        this.maxStamina = 100;
        this.stamina = 100;

        this.selectedTool = 0;
        this.tools = ['hand', null, null, null, null];

        this.isAttacking = false;
        this.attackCooldown = 0;
        this.attackDuration = 0;
        this.invincible = false;
        this.invincibleTime = 0;

        this.level = 1;
        this.xp = 0;
        this.xpToNextLevel = 100;
        this.kills = 0;
        this.score = 0;
        this.combo = 0;
        this.comboTimer = 0;
    }

    handleInput(keys) {
        this.velocityX = 0;
        this.velocityY = 0;

        if (keys['w'] || keys['W'] || keys['ArrowUp']) { this.velocityY = -1; this.direction = 'up'; }
        if (keys['s'] || keys['S'] || keys['ArrowDown']) { this.velocityY = 1; this.direction = 'down'; }
        if (keys['a'] || keys['A'] || keys['ArrowLeft']) { this.velocityX = -1; this.direction = 'left'; }
        if (keys['d'] || keys['D'] || keys['ArrowRight']) { this.velocityX = 1; this.direction = 'right'; }

        if (this.velocityX !== 0 && this.velocityY !== 0) {
            this.velocityX *= 0.707;
            this.velocityY *= 0.707;
        }

        const currentSpeed = this.speed * (1 + this.speedBonus);
        this.velocityX *= currentSpeed;
        this.velocityY *= currentSpeed;

        if (this.velocityX !== 0 || this.velocityY !== 0) this.animationFrame += 0.2;
    }

    update(canvas, deltaTime) {
        this.x = Math.max(0, Math.min(this.x + this.velocityX, canvas.width - this.width));
        this.y = Math.max(0, Math.min(this.y + this.velocityY, canvas.height - this.height));

        if (this.attackCooldown > 0) this.attackCooldown -= deltaTime;
        if (this.attackDuration > 0) {
            this.attackDuration -= deltaTime;
            if (this.attackDuration <= 0) this.isAttacking = false;
        }
        if (this.invincibleTime > 0) {
            this.invincibleTime -= deltaTime;
            if (this.invincibleTime <= 0) this.invincible = false;
        }

        // Combo timer
        if (this.comboTimer > 0) {
            this.comboTimer -= deltaTime;
            if (this.comboTimer <= 0) this.combo = 0;
        }

        // Fome
        this.hunger -= 0.004;
        if (this.hunger <= 0) {
            this.hunger = 0;
            this.health -= 0.015;
        }

        // Stamina regenera
        if (this.velocityX === 0 && this.velocityY === 0) {
            this.stamina = Math.min(this.maxStamina, this.stamina + 0.05);
        }

        // Regeneração de vida
        if (this.hunger > 80 && this.health < this.maxHealth) {
            this.health += 0.008;
        }

        this.speedBonus = 0;
    }

    attack() {
        if (this.attackCooldown > 0) return false;
        this.isAttacking = true;
        this.attackDuration = 200;
        this.attackCooldown = 350;
        return true;
    }

    getAttackDamage() {
        const tool = this.tools[this.selectedTool];
        const dmg = { 'hand': 8, 'axe': 18, 'pickaxe': 15, 'sword': 30, 'bow': 25 };
        return dmg[tool] || 8;
    }

    getAttackRange() {
        const tool = this.tools[this.selectedTool];
        if (tool === 'bow') return 180;
        if (tool === 'sword') return 65;
        return 50;
    }

    takeDamage(amount) {
        if (this.invincible) return false;
        if (this.tools.includes('shield')) amount *= 0.6;
        this.health -= amount;
        this.invincible = true;
        this.invincibleTime = 400;
        this.combo = 0;
        return this.health <= 0;
    }

    addKill() {
        this.kills++;
        this.combo++;
        this.comboTimer = 3000;
        const comboMultiplier = 1 + (this.combo - 1) * 0.1;
        const points = Math.floor(100 * comboMultiplier);
        this.score += points;
        return { combo: this.combo, points };
    }

    eat(inventory) {
        if (inventory.hasItem('apple', 1) && this.hunger < this.maxHunger) {
            inventory.removeItem('apple', 1);
            this.hunger = Math.min(this.maxHunger, this.hunger + 25);
            return true;
        }
        return false;
    }

    useHealthPotion(inventory) {
        if (inventory.hasItem('health_potion', 1) && this.health < this.maxHealth) {
            inventory.removeItem('health_potion', 1);
            this.health = Math.min(this.maxHealth, this.health + 50);
            return true;
        }
        return false;
    }

    addXP(amount) {
        this.xp += amount;
        this.score += amount;
        if (this.xp >= this.xpToNextLevel) {
            this.xp -= this.xpToNextLevel;
            this.level++;
            this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.4);
            this.maxHealth += 15;
            this.health = this.maxHealth;
            this.maxStamina += 10;
            this.stamina = this.maxStamina;
            return true;
        }
        return false;
    }

    equipTool(type, slot) {
        if (slot >= 1 && slot < this.tools.length) this.tools[slot] = type;
    }

    selectTool(slot) {
        if (slot >= 0 && slot < this.tools.length) this.selectedTool = slot;
    }

    draw(ctx) {
        if (this.invincible && Math.floor(Date.now() / 80) % 2 === 0) return;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, this.y + this.height - 2, this.width / 2.5, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        const bounce = Math.sin(this.animationFrame) * 2;
        const drawY = this.y + (this.velocityX !== 0 || this.velocityY !== 0 ? bounce : 0);

        // Corpo
        const bodyG = ctx.createLinearGradient(this.x, drawY, this.x, drawY + this.height);
        bodyG.addColorStop(0, '#FFB366');
        bodyG.addColorStop(1, '#FF8C42');
        ctx.fillStyle = bodyG;
        ctx.shadowColor = '#cc7d49';
        ctx.shadowBlur = 6;
        this.drawRoundedRect(ctx, this.x + 5, drawY + 10, this.width - 10, this.height - 15, 6);

        // Cabeça
        const headG = ctx.createRadialGradient(this.x + this.width / 2, drawY + 8, 0, this.x + this.width / 2, drawY + 12, 12);
        headG.addColorStop(0, '#FFE5B4');
        headG.addColorStop(1, '#FFD4A3');
        ctx.fillStyle = headG;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, drawY + 12, 10, 0, Math.PI * 2);
        ctx.fill();

        // Cabelo
        ctx.fillStyle = '#654321';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, drawY + 8, 11, Math.PI, 0, false);
        ctx.fill();

        // Olhos
        const eyeX = this.direction === 'left' ? -2 : this.direction === 'right' ? 2 : 0;
        const eyeY = this.direction === 'up' ? -1 : this.direction === 'down' ? 1 : 0;

        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2 - 4 + eyeX, drawY + 10 + eyeY, 3, 0, Math.PI * 2);
        ctx.arc(this.x + this.width / 2 + 4 + eyeX, drawY + 10 + eyeY, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2 - 4 + eyeX, drawY + 10 + eyeY, 1.5, 0, Math.PI * 2);
        ctx.arc(this.x + this.width / 2 + 4 + eyeX, drawY + 10 + eyeY, 1.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;

        if (this.isAttacking) this.drawTool(ctx, drawY);
    }

    drawTool(ctx, drawY) {
        const tool = this.tools[this.selectedTool];
        if (!tool || tool === 'hand') return;

        ctx.save();
        ctx.translate(this.x + this.width / 2, drawY + this.height / 2);
        const angle = { 'up': -Math.PI / 2, 'down': Math.PI / 2, 'left': Math.PI, 'right': 0 }[this.direction];
        ctx.rotate(angle);
        ctx.font = '18px Arial';
        ctx.textAlign = 'center';
        const icons = { 'axe': '🪓', 'pickaxe': '⛏️', 'sword': '⚔️', 'bow': '🏹' };
        ctx.fillText(icons[tool] || '👊', 22, 4);
        ctx.restore();
    }

    drawRoundedRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
    }

    getCenterX() { return this.x + this.width / 2; }
    getCenterY() { return this.y + this.height / 2; }

    getSaveData() {
        return {
            x: this.x, y: this.y, health: this.health, hunger: this.hunger, stamina: this.stamina,
            level: this.level, xp: this.xp, xpToNextLevel: this.xpToNextLevel,
            kills: this.kills, score: this.score, tools: [...this.tools],
            maxHealth: this.maxHealth, maxStamina: this.maxStamina
        };
    }

    loadSaveData(data) {
        Object.assign(this, data);
        if (data.tools) this.tools = [...data.tools];
    }
}
