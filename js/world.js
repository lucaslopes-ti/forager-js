/**
 * Sistema do Mundo
 */

class World {
    constructor(canvas) {
        this.canvas = canvas;
        this.trees = [];
        this.decorations = [];
        this.dayNightCycle = 0;
        this.generateWorld();
    }

    generateWorld() {
        // Árvores decorativas
        for (let i = 0; i < 8; i++) {
            this.trees.push({
                x: Math.random() * (this.canvas.width - 80) + 40,
                y: Math.random() * (this.canvas.height - 80) + 40,
                size: 0.7 + Math.random() * 0.6,
                type: Math.floor(Math.random() * 3)
            });
        }

        // Decorações (flores, pedras pequenas)
        for (let i = 0; i < 20; i++) {
            this.decorations.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                type: Math.random() < 0.6 ? 'flower' : 'rock',
                color: ['#ff6b6b', '#ffd700', '#ff6eb4', '#9b59b6', '#3498db'][Math.floor(Math.random() * 5)],
                size: 0.5 + Math.random() * 0.5
            });
        }
    }

    draw(ctx) {
        this.drawBackground(ctx);
        this.drawDecorations(ctx);
        this.drawTrees(ctx);
    }

    drawBackground(ctx) {
        // Gradiente do céu/chão
        const gradient = ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, Math.max(this.canvas.width, this.canvas.height)
        );
        gradient.addColorStop(0, '#5a8f3e');
        gradient.addColorStop(0.5, '#4a7f2e');
        gradient.addColorStop(1, '#3a6f1e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Padrão de grama
        ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
        for (let x = 0; x < this.canvas.width; x += 40) {
            for (let y = 0; y < this.canvas.height; y += 40) {
                if ((x + y) % 80 === 0) {
                    ctx.fillRect(x, y, 20, 20);
                }
            }
        }
    }

    drawDecorations(ctx) {
        this.decorations.forEach(dec => {
            if (dec.type === 'flower') {
                ctx.fillStyle = dec.color;
                ctx.beginPath();
                ctx.arc(dec.x, dec.y, 4 * dec.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#ffd700';
                ctx.beginPath();
                ctx.arc(dec.x, dec.y, 2 * dec.size, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillStyle = '#888';
                ctx.beginPath();
                ctx.ellipse(dec.x, dec.y, 5 * dec.size, 3 * dec.size, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }

    drawTrees(ctx) {
        this.trees.forEach(tree => this.drawTree(ctx, tree.x, tree.y, tree.size, tree.type));
    }

    drawTree(ctx, x, y, size, type) {
        // Sombra
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.beginPath();
        ctx.ellipse(x, y + 45 * size, 25 * size, 8 * size, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tronco
        const trunkGradient = ctx.createLinearGradient(x - 8 * size, y, x + 8 * size, y);
        trunkGradient.addColorStop(0, '#5d4037');
        trunkGradient.addColorStop(0.5, '#8B4513');
        trunkGradient.addColorStop(1, '#5d4037');
        ctx.fillStyle = trunkGradient;
        ctx.fillRect(x - 8 * size, y, 16 * size, 45 * size);

        // Copa
        if (type === 0) {
            // Árvore redonda
            const leafGradient = ctx.createRadialGradient(x - 5 * size, y - 20 * size, 0, x, y - 10 * size, 40 * size);
            leafGradient.addColorStop(0, '#6dd5a0');
            leafGradient.addColorStop(0.5, '#2ed573');
            leafGradient.addColorStop(1, '#1e8449');
            ctx.fillStyle = leafGradient;
            ctx.beginPath();
            ctx.arc(x, y - 10 * size, 35 * size, 0, Math.PI * 2);
            ctx.fill();
        } else if (type === 1) {
            // Pinheiro
            ctx.fillStyle = '#1e8449';
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.moveTo(x, y - 50 * size - i * 15 * size);
                ctx.lineTo(x - 25 * size + i * 5 * size, y + 5 * size - i * 20 * size);
                ctx.lineTo(x + 25 * size - i * 5 * size, y + 5 * size - i * 20 * size);
                ctx.closePath();
                ctx.fill();
            }
        } else {
            // Árvore com múltiplas copas
            const colors = ['#2ed573', '#27ae60', '#1e8449'];
            [-15, 15, 0].forEach((ox, i) => {
                ctx.fillStyle = colors[i];
                ctx.beginPath();
                ctx.arc(x + ox * size, y - 15 * size + (i === 2 ? -15 : 0) * size, 22 * size, 0, Math.PI * 2);
                ctx.fill();
            });
        }
    }

    drawMinimap(ctx, player, resources, enemies, structures) {
        const mapSize = 120;
        const mapX = this.canvas.width - mapSize - 15;
        const mapY = 15;
        const scaleX = mapSize / this.canvas.width;
        const scaleY = mapSize / this.canvas.height;

        // Fundo
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(mapX - 2, mapY - 2, mapSize + 4, mapSize + 4);
        ctx.fillStyle = '#2d5a27';
        ctx.fillRect(mapX, mapY, mapSize, mapSize);

        // Recursos
        resources.forEach(r => {
            ctx.fillStyle = { 'apple': '#ff6b6b', 'grass': '#51CF66', 'stone': '#888', 'wood': '#8B4513', 'gold': '#ffd700' }[r.type] || '#fff';
            ctx.fillRect(mapX + r.x * scaleX, mapY + r.y * scaleY, 3, 3);
        });

        // Estruturas
        if (structures) {
            structures.forEach(s => {
                ctx.fillStyle = '#4dabf7';
                ctx.fillRect(mapX + s.x * scaleX, mapY + s.y * scaleY, 5, 5);
            });
        }

        // Inimigos
        enemies.forEach(e => {
            ctx.fillStyle = e.isBoss ? '#ff00ff' : '#ff4757';
            ctx.fillRect(mapX + e.x * scaleX, mapY + e.y * scaleY, e.isBoss ? 5 : 3, e.isBoss ? 5 : 3);
        });

        // Jogador
        ctx.fillStyle = '#00ff88';
        ctx.beginPath();
        ctx.arc(mapX + player.x * scaleX + 2, mapY + player.y * scaleY + 2, 4, 0, Math.PI * 2);
        ctx.fill();

        // Borda
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(mapX, mapY, mapSize, mapSize);

        // Título
        ctx.fillStyle = '#fff';
        ctx.font = '10px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText('MAPA', mapX + mapSize / 2, mapY - 5);
    }
}
