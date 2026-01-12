/**
 * Sistema de Inventário do Jogo Forager
 * Gerencia itens coletados pelo jogador
 */

/**
 * Classe que gerencia o inventário do jogador
 */
class Inventory {
    /**
     * Cria um novo inventário vazio
     */
    constructor() {
        this.items = {
            'apple': 0,
            'grass': 0,
            'stone': 0
        };
    }

    /**
     * Adiciona um item ao inventário
     * @param {string} itemType - Tipo do item a adicionar
     * @param {number} quantity - Quantidade a adicionar (padrão: 1)
     */
    addItem(itemType, quantity = 1) {
        if (this.items.hasOwnProperty(itemType)) {
            this.items[itemType] += quantity;
        } else {
            this.items[itemType] = quantity;
        }
    }

    /**
     * Remove itens do inventário
     * @param {string} itemType - Tipo do item a remover
     * @param {number} quantity - Quantidade a remover
     * @returns {boolean} - True se conseguiu remover
     */
    removeItem(itemType, quantity) {
        if (this.hasItem(itemType, quantity)) {
            const currentQuantity = this.items[itemType] || 0;
            this.items[itemType] = currentQuantity - quantity;
            // Garante que não fique negativo
            if (this.items[itemType] < 0) {
                this.items[itemType] = 0;
            }
            return true;
        }
        return false;
    }

    /**
     * Verifica se o jogador tem quantidade suficiente de um item
     * @param {string} itemType - Tipo do item
     * @param {number} quantity - Quantidade necessária
     * @returns {boolean} - True se tem quantidade suficiente
     */
    hasItem(itemType, quantity) {
        const currentQuantity = this.items[itemType] || 0;
        return currentQuantity >= quantity;
    }

    /**
     * Verifica se o jogador tem todos os ingredientes de uma receita
     * @param {Object} ingredients - Objeto com ingredientes necessários
     * @returns {boolean} - True se tem todos os ingredientes
     */
    hasIngredients(ingredients) {
        for (const [item, quantity] of Object.entries(ingredients)) {
            if (!this.hasItem(item, quantity)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Remove os ingredientes de uma receita do inventário
     * @param {Object} ingredients - Objeto com ingredientes a remover
     * @returns {boolean} - True se conseguiu remover todos
     */
    removeIngredients(ingredients) {
        if (!this.hasIngredients(ingredients)) {
            return false;
        }

        for (const [item, quantity] of Object.entries(ingredients)) {
            this.removeItem(item, quantity);
        }
        return true;
    }

    /**
     * Retorna a quantidade de um item no inventário
     * @param {string} itemType - Tipo do item
     * @returns {number} - Quantidade do item
     */
    getQuantity(itemType) {
        return this.items[itemType] || 0;
    }

    /**
     * Retorna todos os itens do inventário
     * @returns {Object} - Objeto com todos os itens e quantidades
     */
    getAllItems() {
        return { ...this.items };
    }

    /**
     * Adiciona um item craftado ao inventário
     * @param {string} itemType - Tipo do item craftado
     */
    addCraftedItem(itemType) {
        this.addItem(itemType, 1);
    }
}
