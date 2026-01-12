/**
 * Sistema de Crafting do Jogo Forager
 * Gerencia receitas e criação de novos itens
 */

/**
 * Classe que representa uma receita de crafting
 */
class CraftingRecipe {
    /**
     * Cria uma nova receita
     * @param {string} name - Nome da receita
     * @param {string} result - Tipo do item resultante
     * @param {Object} ingredients - Objeto com ingredientes necessários
     */
    constructor(name, result, ingredients) {
        this.name = name;
        this.result = result;
        this.ingredients = ingredients;
    }
}

/**
 * Sistema de crafting do jogo
 */
class CraftingSystem {
    /**
     * Cria um novo sistema de crafting com receitas padrão
     */
    constructor() {
        // Define as receitas disponíveis no jogo
        this.recipes = [
            new CraftingRecipe(
                'Machado',
                'axe',
                { 'stone': 2, 'grass': 3 }
            ),
            new CraftingRecipe(
                'Picareta',
                'pickaxe',
                { 'stone': 5, 'grass': 1 }
            ),
            new CraftingRecipe(
                'Espada',
                'sword',
                { 'stone': 3, 'grass': 5 }
            ),
            new CraftingRecipe(
                'Cesta',
                'basket',
                { 'grass': 10 }
            ),
            new CraftingRecipe(
                'Martelo',
                'hammer',
                { 'stone': 4, 'grass': 2 }
            )
        ];
    }

    /**
     * Tenta craftar um item baseado na receita
     * @param {Inventory} inventory - Inventário do jogador
     * @param {number} recipeIndex - Índice da receita no array
     * @returns {boolean} - True se conseguiu craftar
     */
    craft(inventory, recipeIndex) {
        if (recipeIndex < 0 || recipeIndex >= this.recipes.length) {
            console.error('Índice de receita inválido:', recipeIndex);
            return false;
        }

        const recipe = this.recipes[recipeIndex];
        console.log('Craftando receita:', recipe.name, recipe.ingredients);

        // Verifica se tem os ingredientes
        const hasIngredients = inventory.hasIngredients(recipe.ingredients);
        console.log('Tem ingredientes?', hasIngredients, 'Inventário:', inventory.getAllItems());
        
        if (!hasIngredients) {
            console.log('Ingredientes insuficientes');
            return false;
        }

        // Remove os ingredientes
        const removed = inventory.removeIngredients(recipe.ingredients);
        console.log('Ingredientes removidos?', removed);
        
        if (!removed) {
            console.log('Falha ao remover ingredientes');
            return false;
        }

        // Adiciona o item craftado
        inventory.addCraftedItem(recipe.result);
        console.log('Item craftado adicionado:', recipe.result);
        return true;
    }

    /**
     * Retorna todas as receitas disponíveis
     * @returns {Array} - Array de receitas
     */
    getRecipes() {
        return this.recipes;
    }

    /**
     * Retorna uma receita específica
     * @param {number} index - Índice da receita
     * @returns {CraftingRecipe|null} - Receita ou null se inválido
     */
    getRecipe(index) {
        if (index >= 0 && index < this.recipes.length) {
            return this.recipes[index];
        }
        return null;
    }

    /**
     * Verifica se o jogador pode craftar uma receita
     * @param {Inventory} inventory - Inventário do jogador
     * @param {number} recipeIndex - Índice da receita
     * @returns {boolean} - True se pode craftar
     */
    canCraft(inventory, recipeIndex) {
        if (recipeIndex < 0 || recipeIndex >= this.recipes.length) {
            return false;
        }
        return inventory.hasIngredients(this.recipes[recipeIndex].ingredients);
    }
}
