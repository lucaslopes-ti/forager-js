/**
 * Sistema de Interface do Jogo Forager
 * Gerencia a atualização e renderização da UI
 */

/**
 * Classe que gerencia a interface do usuário
 */
class UIManager {
    /**
     * Cria um novo gerenciador de UI
     * @param {Inventory} inventory - Inventário do jogador
     * @param {CraftingSystem} craftingSystem - Sistema de crafting
     */
    constructor(inventory, craftingSystem) {
        this.inventory = inventory;
        this.craftingSystem = craftingSystem;
        this.craftingMenuOpen = false;
        this.level = 1;
        this.xp = 0;
        this.xpToNextLevel = 100;
    }

    /**
     * Inicializa a UI
     */
    init() {
        this.updateInventory();
        this.updateCraftingMenu();
        this.updateStats();

        // Botão de crafting
        const craftButton = document.getElementById('craft-button');
        craftButton.addEventListener('click', () => {
            this.toggleCraftingMenu();
        });

        // Botão de iniciar jogo
        const startButton = document.getElementById('start-button');
        startButton.addEventListener('click', () => {
            this.hideStartScreen();
        });
    }

    /**
     * Esconde a tela de início e inicia o jogo
     */
    hideStartScreen() {
        const startScreen = document.getElementById('start-screen');
        startScreen.classList.add('hidden');
        
        // Inicia o game loop se a função startGame estiver disponível
        if (typeof startGame === 'function') {
            startGame();
        }
    }

    /**
     * Atualiza a exibição do inventário
     */
    updateInventory() {
        const inventoryItems = document.getElementById('inventory-items');
        inventoryItems.innerHTML = '';

        const items = this.inventory.getAllItems();
        const itemColors = {
            'apple': '#FF6B6B',
            'grass': '#51CF66',
            'stone': '#8B8680',
            'axe': '#8B4513',
            'pickaxe': '#696969',
            'sword': '#C0C0C0',
            'basket': '#DEB887',
            'hammer': '#708090'
        };

        const itemNames = {
            'apple': 'Maçã',
            'grass': 'Grama',
            'stone': 'Pedra',
            'axe': 'Machado',
            'pickaxe': 'Picareta',
            'sword': 'Espada',
            'basket': 'Cesta',
            'hammer': 'Martelo'
        };

        for (const [itemType, quantity] of Object.entries(items)) {
            if (quantity > 0) {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'inventory-item';

                const icon = document.createElement('div');
                icon.className = 'inventory-item-icon';
                icon.style.backgroundColor = itemColors[itemType] || '#999';
                icon.style.border = `2px solid ${itemColors[itemType] || '#999'}`;

                const count = document.createElement('div');
                count.className = 'inventory-item-count';
                count.textContent = quantity;

                const name = document.createElement('div');
                name.className = 'inventory-item-name';
                name.textContent = itemNames[itemType] || itemType;

                itemDiv.appendChild(icon);
                itemDiv.appendChild(count);
                itemDiv.appendChild(name);
                inventoryItems.appendChild(itemDiv);
            }
        }

        // Se inventário vazio, mostra mensagem
        if (Object.values(items).every(qty => qty === 0)) {
            const emptyMsg = document.createElement('div');
            emptyMsg.style.color = '#888';
            emptyMsg.style.fontSize = '0.9em';
            emptyMsg.textContent = 'Inventário vazio';
            inventoryItems.appendChild(emptyMsg);
        }
    }

    /**
     * Atualiza o menu de crafting
     */
    updateCraftingMenu() {
        const craftingRecipes = document.getElementById('crafting-recipes');
        craftingRecipes.innerHTML = '';

        const recipes = this.craftingSystem.getRecipes();

        recipes.forEach((recipe, index) => {
            const recipeDiv = document.createElement('div');
            recipeDiv.className = 'recipe-item';

            const nameDiv = document.createElement('div');
            nameDiv.className = 'recipe-name';
            nameDiv.textContent = recipe.name;

            const ingredientsDiv = document.createElement('div');
            ingredientsDiv.className = 'recipe-ingredients';
            const ingredientsText = Object.entries(recipe.ingredients)
                .map(([item, qty]) => `${qty}x ${item}`)
                .join(', ');
            ingredientsDiv.textContent = `Requer: ${ingredientsText}`;

            const button = document.createElement('button');
            button.className = 'recipe-button';
            button.textContent = 'Craftar';
            button.type = 'button'; // Garante que não seja submit
            const canCraft = this.craftingSystem.canCraft(this.inventory, index);
            button.disabled = !canCraft;
            
            // Debug
            console.log(`Receita ${recipe.name}:`, {
                canCraft: canCraft,
                ingredients: recipe.ingredients,
                inventory: this.inventory.getAllItems()
            });

            // Adiciona evento de clique
            const clickHandler = (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                console.log(`[CRAFT] Tentando craftar: ${recipe.name}`, {
                    recipeIndex: index,
                    ingredients: recipe.ingredients,
                    inventory: this.inventory.getAllItems()
                });
                
                // Verifica novamente se pode craftar
                const canCraftNow = this.craftingSystem.canCraft(this.inventory, index);
                console.log('[CRAFT] Pode craftar agora?', canCraftNow);
                
                if (!canCraftNow) {
                    console.log('[CRAFT] Não pode craftar - ingredientes insuficientes');
                    this.showNotification('❌ Ingredientes insuficientes!', 'error');
                    return;
                }
                
                // Tenta craftar
                const craftResult = this.craftingSystem.craft(this.inventory, index);
                console.log('[CRAFT] Resultado do craft:', craftResult);
                
                if (craftResult) {
                    console.log('[CRAFT] Craft realizado com sucesso!');
                    
                    // Animação de crafting
                    recipeDiv.classList.add('crafting');
                    setTimeout(() => {
                        recipeDiv.classList.remove('crafting');
                    }, 600);
                    
                    // Atualiza UI
                    this.updateInventory();
                    this.updateCraftingMenu();
                    this.addXP(20); // Ganha XP ao craftar
                    this.showNotification(`✨ ${recipe.name} craftado com sucesso!`, 'success');
                    this.playSound('craft');
                } else {
                    console.log('[CRAFT] Falha ao craftar');
                    this.showNotification('❌ Erro ao craftar! Verifique os ingredientes.', 'error');
                }
            };
            
            button.addEventListener('click', clickHandler);
            // Também adiciona mousedown como fallback
            button.addEventListener('mousedown', (e) => {
                e.preventDefault();
                clickHandler(e);
            });

            recipeDiv.appendChild(nameDiv);
            recipeDiv.appendChild(ingredientsDiv);
            recipeDiv.appendChild(button);
            craftingRecipes.appendChild(recipeDiv);
        });
    }

    /**
     * Alterna visibilidade do menu de crafting
     */
    toggleCraftingMenu() {
        this.craftingMenuOpen = !this.craftingMenuOpen;
        const craftingRecipes = document.getElementById('crafting-recipes');
        const craftButton = document.getElementById('craft-button');

        if (this.craftingMenuOpen) {
            craftingRecipes.style.display = 'block';
            craftButton.textContent = 'Fechar Crafting (C)';
            // Atualiza o menu quando abre para garantir que os botões estejam corretos
            this.updateCraftingMenu();
        } else {
            craftingRecipes.style.display = 'none';
            craftButton.textContent = 'Abrir Crafting (C)';
        }
    }

    /**
     * Atualiza estatísticas (nível e XP)
     */
    updateStats() {
        document.getElementById('level-value').textContent = this.level;
        document.getElementById('xp-value').textContent = this.xp;
        document.getElementById('xp-max').textContent = this.xpToNextLevel;
        
        // Atualiza barra de XP
        const xpPercentage = (this.xp / this.xpToNextLevel) * 100;
        const xpBarFill = document.getElementById('xp-bar-fill');
        const xpBarGlow = document.getElementById('xp-bar-glow');
        if (xpBarFill) {
            xpBarFill.style.width = `${xpPercentage}%`;
            xpBarGlow.style.width = `${xpPercentage}%`;
        }
    }

    /**
     * Adiciona XP ao jogador
     * @param {number} amount - Quantidade de XP a adicionar
     */
    addXP(amount) {
        const oldLevel = this.level;
        this.xp += amount;
        
        while (this.xp >= this.xpToNextLevel) {
            this.xp -= this.xpToNextLevel;
            this.level++;
            this.xpToNextLevel = Math.floor(this.xpToNextLevel * 1.5);
        }
        
        // Mostra notificação de level up
        if (this.level > oldLevel) {
            this.showNotification(`🎉 Nível ${this.level} alcançado!`, 'level-up');
        }
        
        this.updateStats();
    }

    /**
     * Mostra uma mensagem temporária
     * @param {string} message - Mensagem a exibir
     * @param {string} type - Tipo da notificação ('success', 'error', 'level-up')
     */
    showMessage(message, type = 'success') {
        this.showNotification(message, type);
    }

    /**
     * Mostra uma notificação visual na tela
     * @param {string} message - Mensagem a exibir
     * @param {string} type - Tipo da notificação ('success', 'error', 'level-up')
     */
    showNotification(message, type = 'success') {
        const container = document.getElementById('notifications-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        container.appendChild(notification);

        // Remove após animação
        setTimeout(() => {
            notification.style.animation = 'notification-fade-out 0.3s ease-in forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Toca um som (simulado)
     * @param {string} soundType - Tipo do som
     */
    playSound(soundType) {
        // Simulação de som - em uma implementação completa, usaria Web Audio API
        console.log(`[SOM] ${soundType}`);
    }

    /**
     * Atualiza toda a UI
     */
    update() {
        this.updateInventory();
        this.updateCraftingMenu();
        this.updateStats();
    }
}
