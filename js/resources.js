/**
 * Sistema de Recursos do Jogo Forager
 * Gerencia a criação, renderização e coleta de recursos no mundo
 */

/**
 * Classe que representa um recurso coletável no jogo
 */
class Resource {
    /**
     * Cria um novo recurso
     * @param {number} x - Posição X no canvas
     * @param {number} y - Posição Y no canvas
     * @param {string} type - Tipo do recurso ('apple', 'grass', 'stone')
     */
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 40;
        this.height = 40;
        this.collected = false;
        this.pulseAnimation = 0; // Para animação de pulsação
    }

    /**
     * Desenha o recurso no canvas
     * @param {CanvasRenderingContext2D} ctx - Contexto do canvas
     */
    draw(ctx) {
        if (this.collected) return;

        // Animação de pulsação
        this.pulseAnimation += 0.1;
        const pulse = Math.sin(this.pulseAnimation) * 3;

        // Cores e formas para cada tipo de recurso
        const resourceData = {
            'apple': {
                color: '#FF6B6B',
                shadowColor: '#cc5555',
                shape: 'circle'
            },
            'grass': {
                color: '#51CF66',
                shadowColor: '#40c057',
                shape: 'rect'
            },
            'stone': {
                color: '#8B8680',
                shadowColor: '#6b6762',
                shape: 'rect'
            }
        };

        const data = resourceData[this.type] || resourceData['apple'];

        // Sombra elíptica
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(
            this.x + this.width / 2,
            this.y + this.height - 2,
            this.width / 2.5,
            4,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Corpo principal com gradiente
        ctx.shadowColor = data.shadowColor;
        ctx.shadowBlur = 8;

        if (data.shape === 'circle') {
            // Desenha maçã com gradiente
            const appleGradient = ctx.createRadialGradient(
                this.x + this.width / 2 - 5,
                this.y + this.height / 2 - 5 + pulse,
                0,
                this.x + this.width / 2,
                this.y + this.height / 2 + pulse,
                this.width / 2
            );
            appleGradient.addColorStop(0, '#FF8E8E');
            appleGradient.addColorStop(1, data.color);
            ctx.fillStyle = appleGradient;
            
            ctx.beginPath();
            ctx.arc(
                this.x + this.width / 2,
                this.y + this.height / 2 + pulse,
                this.width / 2 - 2,
                0,
                Math.PI * 2
            );
            ctx.fill();
            
            // Brilho na maçã
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(
                this.x + this.width / 2 - 8,
                this.y + this.height / 2 - 8 + pulse,
                6,
                0,
                Math.PI * 2
            );
            ctx.fill();
            
            // Folha da maçã com gradiente
            const leafGradient = ctx.createLinearGradient(
                this.x + this.width / 2 - 3,
                this.y + 5 + pulse,
                this.x + this.width / 2 + 3,
                this.y + 5 + pulse
            );
            leafGradient.addColorStop(0, '#40c057');
            leafGradient.addColorStop(1, '#51CF66');
            ctx.fillStyle = leafGradient;
            ctx.beginPath();
            ctx.ellipse(
                this.x + this.width / 2,
                this.y + 5 + pulse,
                3,
                8,
                0,
                0,
                Math.PI * 2
            );
            ctx.fill();
            
            // Caule
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(
                this.x + this.width / 2 - 1,
                this.y + 3 + pulse,
                2,
                4
            );
        } else {
            // Desenha grama ou pedra com gradiente
            const rectGradient = ctx.createLinearGradient(
                this.x,
                this.y + pulse,
                this.x,
                this.y + this.height + pulse
            );
            rectGradient.addColorStop(0, data.color);
            rectGradient.addColorStop(1, data.shadowColor);
            ctx.fillStyle = rectGradient;
            
            // Retângulo arredondado
            this.drawRoundedRect(
                ctx,
                this.x + 2,
                this.y + 2 + pulse,
                this.width - 4,
                this.height - 4,
                4
            );
            
            // Detalhes para grama
            if (this.type === 'grass') {
                // Folhas de grama
                ctx.fillStyle = '#40c057';
                for (let i = 0; i < 4; i++) {
                    const offset = (i - 1.5) * 8;
                    ctx.beginPath();
                    ctx.moveTo(this.x + this.width / 2 + offset, this.y + this.height - 2 + pulse);
                    ctx.quadraticCurveTo(
                        this.x + this.width / 2 + offset + 2,
                        this.y + 5 + pulse,
                        this.x + this.width / 2 + offset,
                        this.y + 8 + pulse
                    );
                    ctx.quadraticCurveTo(
                        this.x + this.width / 2 + offset - 2,
                        this.y + 5 + pulse,
                        this.x + this.width / 2 + offset,
                        this.y + this.height - 2 + pulse
                    );
                    ctx.fill();
                }
            }
            
            // Detalhes para pedra
            if (this.type === 'stone') {
                // Textura da pedra
                ctx.fillStyle = '#6b6762';
                ctx.fillRect(
                    this.x + 8,
                    this.y + 8 + pulse,
                    10,
                    10
                );
                ctx.fillRect(
                    this.x + 22,
                    this.y + 18 + pulse,
                    8,
                    8
                );
                ctx.fillRect(
                    this.x + 12,
                    this.y + 25 + pulse,
                    6,
                    6
                );
                
                // Brilho na pedra
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.fillRect(
                    this.x + 5,
                    this.y + 5 + pulse,
                    8,
                    4
                );
            }
        }

        ctx.shadowBlur = 0;
    }

    /**
     * Verifica se o recurso está colidindo com o jogador
     * @param {Player} player - Objeto do jogador
     * @returns {boolean} - True se há colisão
     */
    isCollidingWith(player) {
        return (
            player.x < this.x + this.width &&
            player.x + player.width > this.x &&
            player.y < this.y + this.height &&
            player.y + player.height > this.y
        );
    }

    /**
     * Desenha um retângulo arredondado
     * @param {CanvasRenderingContext2D} ctx - Contexto do canvas
     * @param {number} x - Posição X
     * @param {number} y - Posição Y
     * @param {number} width - Largura
     * @param {number} height - Altura
     * @param {number} radius - Raio das bordas
     */
    drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
    }
}

/**
 * Gerenciador de recursos do jogo
 * Controla spawn, atualização e remoção de recursos
 */
class ResourceManager {
    /**
     * Cria um novo gerenciador de recursos
     */
    constructor() {
        this.resources = [];
        this.spawnInterval = 3000; // 3 segundos
        this.lastSpawn = 0;
        this.maxResources = 15; // Máximo de recursos no mapa
    }

    /**
     * Cria um novo recurso em posição aleatória
     * @param {HTMLCanvasElement} canvas - Canvas do jogo
     */
    spawnResource(canvas) {
        if (this.resources.length >= this.maxResources) return;

        const types = ['apple', 'grass', 'stone'];
        // Probabilidades: grass 50%, apple 30%, stone 20%
        const rand = Math.random();
        let type;
        if (rand < 0.5) type = 'grass';
        else if (rand < 0.8) type = 'apple';
        else type = 'stone';

        const x = Math.random() * (canvas.width - 50);
        const y = Math.random() * (canvas.height - 50);

        // Garante que não spawna muito perto das bordas
        const margin = 50;
        const finalX = Math.max(margin, Math.min(x, canvas.width - margin - 40));
        const finalY = Math.max(margin, Math.min(y, canvas.height - margin - 40));

        this.resources.push(new Resource(finalX, finalY, type));
    }

    /**
     * Atualiza o gerenciador de recursos
     * @param {number} currentTime - Tempo atual do jogo
     * @param {HTMLCanvasElement} canvas - Canvas do jogo
     */
    update(currentTime, canvas) {
        // Spawna novos recursos periodicamente
        if (currentTime - this.lastSpawn > this.spawnInterval) {
            this.spawnResource(canvas);
            this.lastSpawn = currentTime;
        }
    }

    /**
     * Desenha todos os recursos no canvas
     * @param {CanvasRenderingContext2D} ctx - Contexto do canvas
     */
    draw(ctx) {
        this.resources.forEach(resource => {
            resource.draw(ctx);
        });
    }

    /**
     * Verifica colisões com o jogador e retorna recursos coletados
     * @param {Player} player - Objeto do jogador
     * @returns {Array} - Array de recursos coletados
     */
    checkCollisions(player) {
        const collected = [];
        this.resources = this.resources.filter(resource => {
            if (!resource.collected && resource.isCollidingWith(player)) {
                resource.collected = true;
                collected.push(resource.type);
                return false; // Remove da lista
            }
            return true; // Mantém na lista
        });
        return collected;
    }

    /**
     * Retorna a quantidade de recursos de cada tipo no mapa
     * @returns {Object} - Objeto com contagem de recursos
     */
    getResourceCounts() {
        const counts = { apple: 0, grass: 0, stone: 0 };
        this.resources.forEach(resource => {
            if (!resource.collected) {
                counts[resource.type]++;
            }
        });
        return counts;
    }
}
