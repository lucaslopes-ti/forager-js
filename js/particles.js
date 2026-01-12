/**
 * Sistema de Partículas Avançado
 */

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    update(deltaTime) {
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= p.friction;
            p.vy *= p.friction;
            p.vy += p.gravity;
            p.life -= deltaTime;
            p.alpha = Math.max(0, p.life / p.maxLife);
            p.size *= p.shrink;
            p.rotation += p.rotationSpeed;
            return p.life > 0;
        });
    }

    draw(ctx) {
        this.particles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);

            if (p.type === 'text') {
                ctx.font = `bold ${p.size}px Orbitron`;
                ctx.fillStyle = p.color;
                ctx.textAlign = 'center';
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 2;
                ctx.strokeText(p.text, 0, 0);
                ctx.fillText(p.text, 0, 0);
            } else {
                const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
                gradient.addColorStop(0, p.color);
                gradient.addColorStop(1, 'transparent');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        });
    }

    createCollectEffect(x, y, type) {
        const colors = {
            'apple': ['#FF6B6B', '#ff8787'],
            'grass': ['#51CF66', '#69db7c'],
            'stone': ['#868e96', '#adb5bd'],
            'wood': ['#8B4513', '#A0522D'],
            'gold': ['#ffd700', '#ffec99']
        };
        const c = colors[type] || ['#fff'];

        for (let i = 0; i < 10; i++) {
            const angle = (Math.PI * 2 * i) / 10;
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * (2 + Math.random() * 2),
                vy: Math.sin(angle) * (2 + Math.random() * 2),
                size: 4 + Math.random() * 4,
                color: c[Math.floor(Math.random() * c.length)],
                life: 400, maxLife: 400, alpha: 1,
                gravity: 0.1, friction: 0.95, shrink: 0.97,
                rotation: 0, rotationSpeed: 0.1, type: 'circle'
            });
        }

        this.particles.push({
            x, y: y - 10, vx: 0, vy: -1.5,
            size: 14, color: '#fff',
            life: 600, maxLife: 600, alpha: 1,
            gravity: 0, friction: 1, shrink: 1,
            rotation: 0, rotationSpeed: 0, type: 'text', text: '+1'
        });
    }

    createDamageEffect(x, y, damage) {
        for (let i = 0; i < 6; i++) {
            const angle = Math.random() * Math.PI * 2;
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * (2 + Math.random() * 2),
                vy: Math.sin(angle) * (2 + Math.random() * 2),
                size: 3 + Math.random() * 3,
                color: '#ff4757',
                life: 300, maxLife: 300, alpha: 1,
                gravity: 0.15, friction: 0.95, shrink: 0.96,
                rotation: 0, rotationSpeed: 0, type: 'circle'
            });
        }

        this.particles.push({
            x, y: y - 20, vx: (Math.random() - 0.5) * 2, vy: -2,
            size: 16, color: '#ff4757',
            life: 800, maxLife: 800, alpha: 1,
            gravity: 0, friction: 0.98, shrink: 1,
            rotation: 0, rotationSpeed: 0, type: 'text', text: `-${damage}`
        });
    }

    createXPEffect(x, y, amount) {
        for (let i = 0; i < 5; i++) {
            const angle = Math.random() * Math.PI * 2;
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * (1 + Math.random()),
                vy: Math.sin(angle) * (1 + Math.random()) - 1,
                size: 6 + Math.random() * 4,
                color: '#ffd700',
                life: 500, maxLife: 500, alpha: 1,
                gravity: -0.02, friction: 0.98, shrink: 0.98,
                rotation: 0, rotationSpeed: 0.15, type: 'circle'
            });
        }

        this.particles.push({
            x, y: y - 25, vx: 0, vy: -1,
            size: 12, color: '#ffd700',
            life: 800, maxLife: 800, alpha: 1,
            gravity: 0, friction: 1, shrink: 1,
            rotation: 0, rotationSpeed: 0, type: 'text', text: `+${amount}XP`
        });
    }

    createLevelUpEffect(x, y) {
        for (let i = 0; i < 25; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + Math.random() * 4;
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 5 + Math.random() * 6,
                color: ['#ffd700', '#00ff88', '#ff6b6b', '#4dabf7'][Math.floor(Math.random() * 4)],
                life: 800, maxLife: 800, alpha: 1,
                gravity: 0.05, friction: 0.97, shrink: 0.98,
                rotation: 0, rotationSpeed: 0.2, type: 'circle'
            });
        }
    }

    createDeathEffect(x, y) {
        for (let i = 0; i < 15; i++) {
            const angle = Math.random() * Math.PI * 2;
            this.particles.push({
                x, y,
                vx: Math.cos(angle) * (2 + Math.random() * 3),
                vy: Math.sin(angle) * (2 + Math.random() * 3),
                size: 4 + Math.random() * 4,
                color: ['#ff4757', '#2ed573'][Math.floor(Math.random() * 2)],
                life: 600, maxLife: 600, alpha: 1,
                gravity: 0.1, friction: 0.96, shrink: 0.97,
                rotation: 0, rotationSpeed: 0.15, type: 'circle'
            });
        }
    }

    createBuildEffect(x, y) {
        for (let i = 0; i < 12; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 40,
                y: y + 20,
                vx: (Math.random() - 0.5) * 2,
                vy: -2 - Math.random() * 2,
                size: 4 + Math.random() * 3,
                color: ['#4dabf7', '#74c0fc'][Math.floor(Math.random() * 2)],
                life: 500, maxLife: 500, alpha: 1,
                gravity: 0.08, friction: 0.96, shrink: 0.97,
                rotation: 0, rotationSpeed: 0.1, type: 'circle'
            });
        }
    }

    createHealEffect(x, y, amount) {
        for (let i = 0; i < 6; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: 0, vy: -1 - Math.random(),
                size: 5 + Math.random() * 3,
                color: '#51CF66',
                life: 600, maxLife: 600, alpha: 1,
                gravity: -0.02, friction: 0.99, shrink: 0.99,
                rotation: 0, rotationSpeed: 0, type: 'circle'
            });
        }

        this.particles.push({
            x, y: y - 15, vx: 0, vy: -1.5,
            size: 14, color: '#51CF66',
            life: 800, maxLife: 800, alpha: 1,
            gravity: 0, friction: 1, shrink: 1,
            rotation: 0, rotationSpeed: 0, type: 'text', text: `+${amount}`
        });
    }

    createComboEffect(x, y, combo) {
        this.particles.push({
            x, y, vx: 0, vy: -2,
            size: 18 + combo,
            color: combo >= 10 ? '#ff00ff' : combo >= 5 ? '#ffd700' : '#00ff88',
            life: 1000, maxLife: 1000, alpha: 1,
            gravity: 0, friction: 0.98, shrink: 1,
            rotation: 0, rotationSpeed: 0, type: 'text', text: `x${combo}!`
        });
    }
}

const particleSystem = new ParticleSystem();
