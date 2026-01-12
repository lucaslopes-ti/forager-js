/**
 * Sistema de Recursos
 */

class Resource {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 40;
        this.height = 40;
        this.collected = false;
        this.pulseAnimation = Math.random() * Math.PI * 2;
        this.health = this.getMaxHealth();
    }

    getMaxHealth() {
        return { 'apple': 1, 'grass': 1, 'stone': 3, 'wood': 2, 'gold': 5 }[this.type] || 1;
    }

    takeDamage(damage, toolType) {
        let bonus = 0;
        if (toolType === 'axe' && this.type === 'wood') bonus = 2;
        if (toolType === 'pickaxe' && (this.type === 'stone' || this.type === 'gold')) bonus = 2;
        this.health -= (damage + bonus);
        if (this.health <= 0) {
            this.collected = true;
            return true;
        }
        return false;
    }

    draw(ctx) {
        if (this.collected) return;
        this.pulseAnimation += 0.05;
        const pulse = Math.sin(this.pulseAnimation) * 2;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, this.y + this.height - 2, this.width / 2.5, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 6;

        switch (this.type) {
            case 'apple': this.drawApple(ctx, pulse); break;
            case 'grass': this.drawGrass(ctx, pulse); break;
            case 'stone': this.drawStone(ctx, pulse); break;
            case 'wood': this.drawWood(ctx, pulse); break;
            case 'gold': this.drawGold(ctx, pulse); break;
        }

        ctx.shadowBlur = 0;

        if (this.getMaxHealth() > 1) {
            const hp = this.health / this.getMaxHealth();
            ctx.fillStyle = '#222';
            ctx.fillRect(this.x, this.y - 8, this.width, 4);
            ctx.fillStyle = hp > 0.5 ? '#51CF66' : hp > 0.25 ? '#ffd700' : '#ff6b6b';
            ctx.fillRect(this.x, this.y - 8, this.width * hp, 4);
        }
    }

    drawApple(ctx, pulse) {
        ctx.shadowColor = '#cc5555';
        const g = ctx.createRadialGradient(this.x + 15, this.y + 15 + pulse, 0, this.x + 20, this.y + 20 + pulse, 18);
        g.addColorStop(0, '#FF8E8E');
        g.addColorStop(1, '#FF6B6B');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(this.x + 20, this.y + 20 + pulse, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.beginPath();
        ctx.arc(this.x + 14, this.y + 14 + pulse, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#51CF66';
        ctx.beginPath();
        ctx.ellipse(this.x + 20, this.y + 5 + pulse, 3, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(this.x + 19, this.y + 3 + pulse, 2, 4);
    }

    drawGrass(ctx, pulse) {
        ctx.shadowColor = '#40c057';
        ctx.fillStyle = '#51CF66';
        ctx.fillRect(this.x + 5, this.y + 30 + pulse, 30, 8);
        for (let i = 0; i < 5; i++) {
            ctx.fillStyle = i % 2 === 0 ? '#51CF66' : '#40c057';
            ctx.beginPath();
            ctx.moveTo(this.x + 8 + i * 6, this.y + 32 + pulse);
            ctx.lineTo(this.x + 8 + i * 6 - 2, this.y + 8 + pulse);
            ctx.lineTo(this.x + 8 + i * 6 + 2, this.y + 8 + pulse);
            ctx.closePath();
            ctx.fill();
        }
    }

    drawStone(ctx, pulse) {
        ctx.shadowColor = '#555';
        const g = ctx.createLinearGradient(this.x, this.y + pulse, this.x, this.y + 40 + pulse);
        g.addColorStop(0, '#9e9e9e');
        g.addColorStop(1, '#6b6762');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(this.x + 5, this.y + 35 + pulse);
        ctx.lineTo(this.x + 2, this.y + 15 + pulse);
        ctx.lineTo(this.x + 10, this.y + 5 + pulse);
        ctx.lineTo(this.x + 30, this.y + 3 + pulse);
        ctx.lineTo(this.x + 38, this.y + 12 + pulse);
        ctx.lineTo(this.x + 35, this.y + 35 + pulse);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#555';
        ctx.fillRect(this.x + 10, this.y + 12 + pulse, 8, 6);
        ctx.fillRect(this.x + 22, this.y + 18 + pulse, 6, 5);
    }

    drawWood(ctx, pulse) {
        ctx.shadowColor = '#5d4037';
        const g = ctx.createLinearGradient(this.x, this.y + pulse, this.x + 40, this.y + pulse);
        g.addColorStop(0, '#8B4513');
        g.addColorStop(0.5, '#A0522D');
        g.addColorStop(1, '#8B4513');
        ctx.fillStyle = g;
        ctx.fillRect(this.x + 5, this.y + 5 + pulse, 30, 30);
        ctx.strokeStyle = '#6b4423';
        ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(this.x + 20, this.y + 20 + pulse, 5 + i * 4, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.fillStyle = '#5d4037';
        ctx.fillRect(this.x + 5, this.y + 5 + pulse, 3, 30);
        ctx.fillRect(this.x + 32, this.y + 5 + pulse, 3, 30);
    }

    drawGold(ctx, pulse) {
        ctx.shadowColor = '#ffd700';
        const g = ctx.createRadialGradient(this.x + 15, this.y + 15 + pulse, 0, this.x + 20, this.y + 20 + pulse, 18);
        g.addColorStop(0, '#ffe066');
        g.addColorStop(0.5, '#ffd700');
        g.addColorStop(1, '#cc9900');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(this.x + 8, this.y + 32 + pulse);
        ctx.lineTo(this.x + 5, this.y + 15 + pulse);
        ctx.lineTo(this.x + 15, this.y + 5 + pulse);
        ctx.lineTo(this.x + 28, this.y + 8 + pulse);
        ctx.lineTo(this.x + 35, this.y + 18 + pulse);
        ctx.lineTo(this.x + 32, this.y + 32 + pulse);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.beginPath();
        ctx.arc(this.x + 15, this.y + 12 + pulse, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + 26, this.y + 18 + pulse, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    isCollidingWith(entity) {
        return entity.x < this.x + this.width && entity.x + entity.width > this.x &&
               entity.y < this.y + this.height && entity.y + entity.height > this.y;
    }
}

class ResourceManager {
    constructor() {
        this.resources = [];
        this.spawnInterval = 2000;
        this.lastSpawn = 0;
        this.maxResources = 25;
    }

    spawnResource(canvas) {
        if (this.resources.length >= this.maxResources) return;

        const rand = Math.random();
        let type;
        if (rand < 0.30) type = 'grass';
        else if (rand < 0.55) type = 'apple';
        else if (rand < 0.75) type = 'wood';
        else if (rand < 0.92) type = 'stone';
        else type = 'gold';

        const margin = 60;
        const x = margin + Math.random() * (canvas.width - margin * 2 - 40);
        const y = margin + Math.random() * (canvas.height - margin * 2 - 40);

        this.resources.push(new Resource(x, y, type));
    }

    update(currentTime, canvas) {
        if (currentTime - this.lastSpawn > this.spawnInterval) {
            this.spawnResource(canvas);
            this.lastSpawn = currentTime;
        }
    }

    draw(ctx) {
        this.resources.forEach(r => r.draw(ctx));
    }

    checkCollisions(player) {
        const collected = [];
        this.resources = this.resources.filter(r => {
            if (!r.collected && r.isCollidingWith(player) && r.getMaxHealth() === 1) {
                r.collected = true;
                collected.push(r.type);
                return false;
            }
            return !r.collected;
        });
        return collected;
    }

    harvestNearby(player, toolType, damage) {
        const collected = [];
        const range = 60;

        this.resources = this.resources.filter(r => {
            if (r.collected) return false;
            const dx = (r.x + r.width / 2) - (player.x + player.width / 2);
            const dy = (r.y + r.height / 2) - (player.y + player.height / 2);
            if (Math.sqrt(dx * dx + dy * dy) < range) {
                if (r.takeDamage(damage, toolType)) {
                    collected.push(r.type);
                    return false;
                }
            }
            return true;
        });

        return collected;
    }
}
