/**
 * Sistema do Jogador do Jogo Forager
 * Gerencia movimento, posição e renderização do jogador
 */

/**
 * Classe que representa o jogador
 */
class Player {
    /**
     * Cria um novo jogador
     * @param {number} x - Posição X inicial
     * @param {number} y - Posição Y inicial
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.speed = 4;
        this.velocityX = 0;
        this.velocityY = 0;
        this.direction = 'down'; // 'up', 'down', 'left', 'right'
        this.animationFrame = 0;
    }

    /**
     * Processa entrada do teclado
     * @param {Object} keys - Objeto com estado das teclas
     */
    handleInput(keys) {
        this.velocityX = 0;
        this.velocityY = 0;

        // Movimento vertical
        if (keys['w'] || keys['ArrowUp']) {
            this.velocityY = -this.speed;
            this.direction = 'up';
        }
        if (keys['s'] || keys['ArrowDown']) {
            this.velocityY = this.speed;
            this.direction = 'down';
        }

        // Movimento horizontal
        if (keys['a'] || keys['ArrowLeft']) {
            this.velocityX = -this.speed;
            this.direction = 'left';
        }
        if (keys['d'] || keys['ArrowRight']) {
            this.velocityX = this.speed;
            this.direction = 'right';
        }

        // Movimento diagonal (normaliza velocidade)
        if (this.velocityX !== 0 && this.velocityY !== 0) {
            this.velocityX *= 0.707; // 1/√2 para manter velocidade constante
            this.velocityY *= 0.707;
        }

        // Atualiza animação quando está se movendo
        if (this.velocityX !== 0 || this.velocityY !== 0) {
            this.animationFrame += 0.2;
        }
    }

    /**
     * Atualiza posição do jogador e aplica limites do canvas
     * @param {HTMLCanvasElement} canvas - Canvas do jogo
     */
    update(canvas) {
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Limita movimento dentro do canvas
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x + this.width > canvas.width) {
            this.x = canvas.width - this.width;
        }
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
        }
    }

    /**
     * Desenha o jogador no canvas
     * @param {CanvasRenderingContext2D} ctx - Contexto do canvas
     */
    draw(ctx) {
        // Sombra do jogador (elíptica)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(
            this.x + this.width / 2,
            this.y + this.height - 2,
            this.width / 2.5,
            3,
            0,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Animação de movimento (pequeno bounce)
        const bounce = Math.sin(this.animationFrame) * 2;
        const drawY = this.y + (this.velocityX !== 0 || this.velocityY !== 0 ? bounce : 0);

        // Gradiente para o corpo
        const bodyGradient = ctx.createLinearGradient(
            this.x,
            drawY,
            this.x,
            drawY + this.height
        );
        bodyGradient.addColorStop(0, '#FFB366');
        bodyGradient.addColorStop(1, '#FF8C42');
        ctx.fillStyle = bodyGradient;
        ctx.shadowColor = '#cc7d49';
        ctx.shadowBlur = 8;

        // Desenha corpo principal com mais detalhes
        this.drawRoundedRect(
            ctx,
            this.x + 5,
            drawY + 5,
            this.width - 10,
            this.height - 10,
            6
        );

        // Detalhes do corpo (cinto/linha)
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(
            this.x + 8,
            drawY + 25,
            this.width - 16,
            3
        );

        // Cabeça com gradiente
        const headGradient = ctx.createRadialGradient(
            this.x + this.width / 2,
            drawY + 8,
            0,
            this.x + this.width / 2,
            drawY + 12,
            10
        );
        headGradient.addColorStop(0, '#FFE5B4');
        headGradient.addColorStop(1, '#FFD4A3');
        ctx.fillStyle = headGradient;
        ctx.beginPath();
        ctx.arc(
            this.x + this.width / 2,
            drawY + 12,
            9,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Cabelo
        ctx.fillStyle = '#8B4513';
        ctx.beginPath();
        ctx.arc(
            this.x + this.width / 2,
            drawY + 8,
            10,
            Math.PI,
            0,
            false
        );
        ctx.fill();

        // Olhos baseados na direção (com brilho)
        const eyeOffsetX = this.direction === 'left' ? -2 : this.direction === 'right' ? 2 : 0;
        const eyeOffsetY = this.direction === 'up' ? -1 : this.direction === 'down' ? 1 : 0;
        
        // Olhos (branco)
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(
            this.x + this.width / 2 - 3 + eyeOffsetX,
            drawY + 10 + eyeOffsetY,
            2.5,
            0,
            Math.PI * 2
        );
        ctx.arc(
            this.x + this.width / 2 + 3 + eyeOffsetX,
            drawY + 10 + eyeOffsetY,
            2.5,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Pupilas
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(
            this.x + this.width / 2 - 3 + eyeOffsetX,
            drawY + 10 + eyeOffsetY,
            1.5,
            0,
            Math.PI * 2
        );
        ctx.arc(
            this.x + this.width / 2 + 3 + eyeOffsetX,
            drawY + 10 + eyeOffsetY,
            1.5,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Brilho nos olhos
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(
            this.x + this.width / 2 - 2.5 + eyeOffsetX,
            drawY + 9.5 + eyeOffsetY,
            0.8,
            0,
            Math.PI * 2
        );
        ctx.arc(
            this.x + this.width / 2 + 3.5 + eyeOffsetX,
            drawY + 9.5 + eyeOffsetY,
            0.8,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Braços (indicam direção) com gradiente
        const armGradient = ctx.createLinearGradient(
            this.x,
            drawY,
            this.x,
            drawY + this.height
        );
        armGradient.addColorStop(0, '#FFB366');
        armGradient.addColorStop(1, '#FF8C42');
        ctx.fillStyle = armGradient;

        if (this.direction === 'left') {
            ctx.fillRect(this.x - 4, drawY + 15, 7, 14);
            // Mão
            ctx.fillStyle = '#FFD4A3';
            ctx.fillRect(this.x - 5, drawY + 28, 9, 4);
        } else if (this.direction === 'right') {
            ctx.fillRect(this.x + this.width - 3, drawY + 15, 7, 14);
            // Mão
            ctx.fillStyle = '#FFD4A3';
            ctx.fillRect(this.x + this.width - 4, drawY + 28, 9, 4);
        } else if (this.direction === 'up') {
            ctx.fillRect(this.x + 7, drawY - 4, 9, 7);
            ctx.fillRect(this.x + 24, drawY - 4, 9, 7);
            // Mãos
            ctx.fillStyle = '#FFD4A3';
            ctx.fillRect(this.x + 8, drawY - 5, 7, 3);
            ctx.fillRect(this.x + 25, drawY - 5, 7, 3);
        } else {
            ctx.fillRect(this.x + 7, drawY + this.height - 3, 9, 7);
            ctx.fillRect(this.x + 24, drawY + this.height - 3, 9, 7);
            // Mãos
            ctx.fillStyle = '#FFD4A3';
            ctx.fillRect(this.x + 8, drawY + this.height + 4, 7, 3);
            ctx.fillRect(this.x + 25, drawY + this.height + 4, 7, 3);
        }

        ctx.shadowBlur = 0;
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

    /**
     * Retorna o centro X do jogador
     * @returns {number} - Posição X do centro
     */
    getCenterX() {
        return this.x + this.width / 2;
    }

    /**
     * Retorna o centro Y do jogador
     * @returns {number} - Posição Y do centro
     */
    getCenterY() {
        return this.y + this.height / 2;
    }
}
