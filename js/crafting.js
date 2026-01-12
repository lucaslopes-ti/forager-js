/**
 * Sistema de Crafting
 */

class CraftingRecipe {
    constructor(name, result, ingredients, icon, description, category) {
        this.name = name;
        this.result = result;
        this.ingredients = ingredients;
        this.icon = icon;
        this.description = description;
        this.category = category;
    }
}

class CraftingSystem {
    constructor() {
        this.recipes = [
            // Ferramentas
            new CraftingRecipe('Machado', 'axe', { stone: 2, wood: 3 }, '🪓', 'Corta madeira mais rápido', 'tools'),
            new CraftingRecipe('Picareta', 'pickaxe', { stone: 3, wood: 2 }, '⛏️', 'Minera pedras e ouro', 'tools'),
            // Armas
            new CraftingRecipe('Espada', 'sword', { stone: 2, wood: 2, gold: 1 }, '⚔️', 'Mais dano aos inimigos', 'weapons'),
            new CraftingRecipe('Arco', 'bow', { wood: 5, grass: 3 }, '🏹', 'Ataque à distância', 'weapons'),
            new CraftingRecipe('Escudo', 'shield', { wood: 3, stone: 2 }, '🛡️', 'Reduz dano recebido', 'weapons'),
            // Consumíveis
            new CraftingRecipe('Poção de Vida', 'health_potion', { apple: 5, grass: 3 }, '🧪', 'Restaura 50 HP', 'consumables')
        ];
    }

    craft(inventory, recipeIndex) {
        if (recipeIndex < 0 || recipeIndex >= this.recipes.length) return false;
        const recipe = this.recipes[recipeIndex];
        if (!inventory.hasIngredients(recipe.ingredients)) return false;
        if (!inventory.removeIngredients(recipe.ingredients)) return false;
        inventory.addItem(recipe.result, 1);
        return true;
    }

    getRecipes() { return this.recipes; }
    
    getRecipesByCategory(cat) {
        return this.recipes.filter(r => r.category === cat);
    }

    canCraft(inventory, recipeIndex) {
        if (recipeIndex < 0 || recipeIndex >= this.recipes.length) return false;
        return inventory.hasIngredients(this.recipes[recipeIndex].ingredients);
    }
}
