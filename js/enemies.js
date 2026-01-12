/**
 * Sistema de Inimigos
 */

class Enemy {
    constructor(x, y, type = 'slime', isBoss = false) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.isBoss = isBoss;
        this.width = isBoss ? 60 : 35;
        this.height = isBoss ? 60 : 35;

        const stats = this.getStats();
        this.health = stats.health * (isBoss ? 5 : 1);
        this.maxHealth = this.health;
        this.speed = stats.speed * (isBoss ? 0.7 : 1);
        this.damage = stats.damage * (isBoss ? 2 : 1);
        this.xpReward = stats.xpReward * (isBoss ? 10 : 1);

        this.velocityX = 0;
        this.velocityY = 0;
        this.animationFrame = Math.random() * Math.PI * 2;
        this.state = 'idle';
        this.attackCooldown = 0;
        this.isDead = false;
        this.deathAnimation = 0;
    }

    getStats() {
        return {
            'slime': { health: 30, speed: 1.5, damage: 10, xpReward: 15 },
            'bat': { health: 20, speed: 2.8, damage: 8, xpReward: 12 },
            'skeleton': { health: 50, speed: 1.8, damage: 15, xpReward: 25 },
            'goblin': { health: 40, speed: 2.2, damage: 12, xpReward: 20 }
        }[this.type] || { health: 30, speed: 1.5, damage: 10, xpReward: 15 };
    }

    update(player, deltaTime, canvas, structures) {
        if (this.isDead) {
            this.deathAnimation += 0.1;
            return;
        }

        this.animationFrame += 0.1;

        const dx = player.getCenterX() - (this.x + this.width / 2);
        const dy = player.getCenterY() - (this.y + this.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (this.attackCooldown > 0) this.attackCooldown -= deltaTime;

        if (distance < 40) {
            this.state = 'attack';
            this.velocityX = 0;
            this.velocityY = 0;
        } else if (distance < 250) {
            this.state = 'chase';
            const angle = Math.atan2(dy, dx);
            this.velocityX = Math.cos(angle) * this.speed;
            this.velocityY = Math.sin(angle) * this.speed;
        } else {
            this.state = 'idle';
            if (Math.random() < 0.02) {
                this.velocityX = (Math.random() - 0.5) * this.speed;
                this.velocityY = (Math.random() - 0.5) * this.speed;
            }
        }

        // Colisão com estruturas
        if (structures) {
            const collision = structures.checkCollisions(this);
            if (collision) {
                this.velocityX *= -1;
                this.velocityY *= -1;
            }
        }

        this.x = Math.max(0, Math.min(this.x + this.velocityX, canvas.width - this.width));
        this.y = Math.max(0, Math.min(this.y + this.velocityY, canvas.height - this.height));
    }

    tryAttack(player) {
        if (this.isDead || this.state !== 'attack' || this.attackCooldown > 0) return false;

        const dx = player.getCenterX() - (this.x + this.width / 2);
        const dy = player.getCenterY() - (this.y + this.height / 2);
        if (Math.sqrt(dx * dx + dy * dy) < 50) {
            this.attackCooldown = 1000;
            return true;
        }
        return false;
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.health = 0;
            this.isDead = true;
            return true;
        }
        return false;
    }

    draw(ctx) {
        if (this.isDead) {
            ctx.globalAlpha = Math.max(0, 1 - this.deathAnimation);
            ctx.save();
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            ctx.scale(1 + this.deathAnimation * 0.5, 1 + this.deathAnimation * 0.5);
            ctx.translate(-this.width / 2, -this.height / 2);
        }

        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, this.y + this.height - 2, this.width / 2.5, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        const bounce = Math.sin(this.animationFrame) * 3;
        const scale = this.isBoss ? 1.5 : 1;

        switch (this.type) {
            case 'slime': this.drawSlime(ctx, bounce, scale); break;
            case 'bat': this.drawBat(ctx, bounce, scale); break;
            case 'skeleton': this.drawSkeleton(ctx, bounce, scale); break;
            case 'goblin': this.drawGoblin(ctx, bounce, scale); break;
        }

        if (this.isDead) {
            ctx.restore();
            ctx.globalAlpha = 1;
            return;
        }

        // HP bar
        if (this.health < this.maxHealth) {
            const hp = this.health / this.maxHealth;
            ctx.fillStyle = '#222';
            ctx.fillRect(this.x, this.y - 10, this.width, 5);
            ctx.fillStyle = hp > 0.5 ? '#51CF66' : hp > 0.25 ? '#ffd700' : '#ff6b6b';
            ctx.fillRect(this.x, this.y - 10, this.width * hp, 5);
        }

        // Boss indicator
        if (this.isBoss) {
            ctx.fillStyle = '#ff4757';
            ctx.font = 'bold 12px Orbitron';
            ctx.textAlign = 'center';
            ctx.fillText('BOSS', this.x + this.width / 2, this.y - 15);
        }
    }

    drawSlime(ctx, bounce, scale) {
        const g = ctx.createRadialGradient(
            this.x + this.width / 2 - 5, this.y + this.height / 2 - 5 + bounce, 0,
            this.x + this.width / 2, this.y + this.height / 2 + bounce, this.width / 2
        );
        g.addColorStop(0, this.isBoss ? '#ff6b6b' : '#7bed9f');
        g.addColorStop(1, this.isBoss ? '#ee5a5a' : '#2ed573');
        ctx.fillStyle = g;
        ctx.shadowColor = this.isBoss ? '#ff4757' : '#2ed573';
        ctx.shadowBlur = 8;

        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, this.y + this.height / 2 + bounce,
            this.width / 2, this.height / 2 - 5 + Math.sin(this.animationFrame * 2) * 3, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(this.x + 10 * scale, this.y + 14 * scale + bounce, 4 * scale, 0, Math.PI * 2);
        ctx.arc(this.x + 22 * scale, this.y + 14 * scale + bounce, 4 * scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.beginPath();
        ctx.arc(this.x + 10 * scale, this.y + 10 * scale + bounce, 5 * scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
    }

    drawBat(ctx, bounce, scale) {
        ctx.fillStyle = '#3a3a3a';
        ctx.shadowColor = '#222';
        ctx.shadowBlur = 4;

        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, this.y + this.height / 2 + bounce, 10 * scale, 12 * scale, 0, 0, Math.PI * 2);
        ctx.fill();

        const wingOffset = Math.sin(this.animationFrame * 3) * 8;
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2 + bounce);
        ctx.lineTo(this.x - 5, this.y + 10 + bounce + wingOffset);
        ctx.lineTo(this.x + 5, this.y + this.height / 2 + bounce);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 2, this.y + this.height / 2 + bounce);
        ctx.lineTo(this.x + this.width + 5, this.y + 10 + bounce + wingOffset);
        ctx.lineTo(this.x + this.width - 5, this.y + this.height / 2 + bounce);
        ctx.fill();

        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(this.x + 14 * scale, this.y + 15 * scale + bounce, 3 * scale, 0, Math.PI * 2);
        ctx.arc(this.x + 21 * scale, this.y + 15 * scale + bounce, 3 * scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
    }

    drawSkeleton(ctx, bounce, scale) {
        ctx.fillStyle = '#f0f0f0';
        ctx.shadowColor = '#ccc';
        ctx.shadowBlur = 4;

        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + 12 * scale + bounce, 10 * scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillRect(this.x + 12 * scale, this.y + 20 * scale + bounce, 11 * scale, 15 * scale);
        ctx.fillStyle = '#333';
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(this.x + 14 * scale, this.y + 22 * scale + i * 5 * scale + bounce, 7 * scale, 2 * scale);
        }

        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(this.x + 14 * scale, this.y + 10 * scale + bounce, 3 * scale, 0, Math.PI * 2);
        ctx.arc(this.x + 21 * scale, this.y + 10 * scale + bounce, 3 * scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
    }

    drawGoblin(ctx, bounce, scale) {
        ctx.fillStyle = '#2d8a4e';
        ctx.shadowColor = '#1e6b3a';
        ctx.shadowBlur = 4;

        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, this.y + this.height / 2 + 5 * scale + bounce, 12 * scale, 15 * scale, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#3da55d';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + 12 * scale + bounce, 10 * scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#3da55d';
        ctx.beginPath();
        ctx.moveTo(this.x + 5 * scale, this.y + 10 * scale + bounce);
        ctx.lineTo(this.x - 2 * scale, this.y + 2 * scale + bounce);
        ctx.lineTo(this.x + 10 * scale, this.y + 8 * scale + bounce);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(this.x + 30 * scale, this.y + 10 * scale + bounce);
        ctx.lineTo(this.x + 37 * scale, this.y + 2 * scale + bounce);
        ctx.lineTo(this.x + 25 * scale, this.y + 8 * scale + bounce);
        ctx.fill();

        ctx.fillStyle = '#ff0';
        ctx.beginPath();
        ctx.arc(this.x + 13 * scale, this.y + 10 * scale + bounce, 4 * scale, 0, Math.PI * 2);
        ctx.arc(this.x + 22 * scale, this.y + 10 * scale + bounce, 4 * scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(this.x + 13 * scale, this.y + 10 * scale + bounce, 2 * scale, 0, Math.PI * 2);
        ctx.arc(this.x + 22 * scale, this.y + 10 * scale + bounce, 2 * scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
    }
}

class EnemyManager {
    constructor() {
        this.enemies = [];
        this.wave = 1;
        this.waveEnemies = 0;
        this.waveKills = 0;
        this.waveInProgress = false;
        this.spawnInterval = 3000;
        this.lastSpawn = 0;
        this.bossSpawned = false;
    }

    startWave(wave) {
        this.wave = wave;
        this.waveEnemies = 3 + wave * 2;
        this.waveKills = 0;
        this.waveInProgress = true;
        this.bossSpawned = false;
        this.spawnInterval = Math.max(1500, 3000 - wave * 150);
    }

    spawnEnemy(canvas, playerLevel) {
        if (this.waveKills >= this.waveEnemies) return;

        const types = ['slime'];
        if (playerLevel >= 2 || this.wave >= 2) types.push('bat');
        if (playerLevel >= 3 || this.wave >= 3) types.push('goblin');
        if (playerLevel >= 4 || this.wave >= 5) types.push('skeleton');

        const type = types[Math.floor(Math.random() * types.length)];
        const isBoss = this.wave % 5 === 0 && !this.bossSpawned && this.waveKills >= this.waveEnemies - 1;

        let x, y;
        const edge = Math.floor(Math.random() * 4);
        switch (edge) {
            case 0: x = Math.random() * canvas.width; y = -30; break;
            case 1: x = canvas.width + 30; y = Math.random() * canvas.height; break;
            case 2: x = Math.random() * canvas.width; y = canvas.height + 30; break;
            case 3: x = -30; y = Math.random() * canvas.height; break;
        }

        const enemy = new Enemy(x, y, type, isBoss);
        enemy.health *= (1 + (this.wave - 1) * 0.15);
        enemy.maxHealth = enemy.health;
        enemy.damage *= (1 + (this.wave - 1) * 0.1);

        if (isBoss) this.bossSpawned = true;

        this.enemies.push(enemy);
    }

    update(player, deltaTime, canvas, structures) {
        this.enemies = this.enemies.filter(e => !(e.isDead && e.deathAnimation > 1));
        this.enemies.forEach(e => e.update(player, deltaTime, canvas, structures));
    }

    draw(ctx) {
        this.enemies.forEach(e => e.draw(ctx));
    }

    checkAttacks(player) {
        let totalDamage = 0;
        this.enemies.forEach(e => {
            if (e.tryAttack(player)) totalDamage += e.damage;
        });
        return totalDamage;
    }

    checkPlayerAttack(player) {
        if (!player.isAttacking) return [];

        const killed = [];
        const damage = player.getAttackDamage();
        const range = player.getAttackRange();

        this.enemies.forEach(enemy => {
            if (enemy.isDead) return;
            const dx = (enemy.x + enemy.width / 2) - player.getCenterX();
            const dy = (enemy.y + enemy.height / 2) - player.getCenterY();
            if (Math.sqrt(dx * dx + dy * dy) < range) {
                if (enemy.takeDamage(damage)) {
                    killed.push(enemy);
                    this.waveKills++;
                }
            }
        });

        return killed;
    }

    trySpawn(currentTime, canvas, playerLevel) {
        if (!this.waveInProgress) return;

        const spawned = this.enemies.filter(e => !e.isDead).length;
        const toSpawn = this.waveEnemies - this.waveKills;

        if (spawned < Math.min(5, toSpawn) && currentTime - this.lastSpawn > this.spawnInterval) {
            this.spawnEnemy(canvas, playerLevel);
            this.lastSpawn = currentTime;
        }
    }

    isWaveComplete() {
        return this.waveInProgress && this.waveKills >= this.waveEnemies && this.enemies.filter(e => !e.isDead).length === 0;
    }

    getWaveProgress() {
        return this.waveEnemies > 0 ? (this.waveKills / this.waveEnemies) * 100 : 0;
    }
}
