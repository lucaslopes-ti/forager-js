/**
 * Sistema de Mundo do Jogo Forager
 * Gerencia o ambiente e elementos do mundo do jogo
 */

/**
 * Classe que gerencia o mundo do jogo
 */
class World {
    /**
     * Cria um novo mundo
     * @param {HTMLCanvasElement} canvas - Canvas do jogo
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gridSize = 64; // Tamanho do grid para visualização
        this.drawGrid = false; // Se deve desenhar grid (debug)
    }

    /**
     * Desenha o fundo do mundo
     */
    drawBackground() {
        // Gradiente de fundo
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#2a4a2a');
        gradient.addColorStop(1, '#1e3a1e');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Desenha grid se habilitado
        if (this.drawGrid) {
            this.drawGridLines();
        }

        // Desenha algumas "árvores" decorativas no fundo
        this.drawDecorativeElements();
    }

    /**
     * Desenha linhas de grid (para debug)
     */
    drawGridLines() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;

        // Linhas verticais
        for (let x = 0; x < this.canvas.width; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        // Linhas horizontais
        for (let y = 0; y < this.canvas.height; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    /**
     * Desenha elementos decorativos no fundo (árvores, pedras, etc)
     */
    drawDecorativeElements() {
        // Desenha algumas "árvores" simples no fundo
        const treePositions = [
            { x: 100, y: 100 },
            { x: 800, y: 150 },
            { x: 200, y: 600 },
            { x: 900, y: 650 },
            { x: 500, y: 200 }
        ];

        treePositions.forEach(pos => {
            this.drawTree(pos.x, pos.y);
        });
    }

    /**
     * Desenha uma árvore decorativa
     * @param {number} x - Posição X
     * @param {number} y - Posição Y
     */
    drawTree(x, y) {
        // Sombra da árvore
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.beginPath();
        this.ctx.ellipse(x, y + 30, 15, 5, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Tronco com gradiente
        const trunkGradient = this.ctx.createLinearGradient(x - 5, y, x + 5, y + 30);
        trunkGradient.addColorStop(0, '#6d4c41');
        trunkGradient.addColorStop(1, '#5d4037');
        this.ctx.fillStyle = trunkGradient;
        this.ctx.fillRect(x - 6, y, 12, 32);

        // Detalhes do tronco
        this.ctx.fillStyle = '#4e342e';
        this.ctx.fillRect(x - 2, y + 5, 4, 25);

        // Folhas com gradiente (múltiplas camadas)
        const leavesGradient = this.ctx.createRadialGradient(x, y - 10, 0, x, y - 10, 25);
        leavesGradient.addColorStop(0, '#4a7c59');
        leavesGradient.addColorStop(0.7, '#2d5016');
        leavesGradient.addColorStop(1, '#1a3a0a');
        this.ctx.fillStyle = leavesGradient;
        
        // Camada principal
        this.ctx.beginPath();
        this.ctx.arc(x, y - 5, 22, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Camada superior (mais clara)
        this.ctx.fillStyle = '#5a8c69';
        this.ctx.beginPath();
        this.ctx.arc(x - 8, y - 12, 12, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(x + 8, y - 12, 12, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Brilho nas folhas
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.beginPath();
        this.ctx.arc(x - 5, y - 15, 8, 0, Math.PI * 2);
        this.ctx.fill();
    }

    /**
     * Limpa o canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
