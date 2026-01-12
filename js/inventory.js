/**
 * Sistema de Inventário
 */

class Inventory {
    constructor() {
        this.items = { 'apple': 0, 'grass': 0, 'stone': 0, 'wood': 0, 'gold': 0 };
        this.tools = { 'axe': 0, 'pickaxe': 0, 'sword': 0, 'bow': 0, 'shield': 0 };
        this.consumables = { 'health_potion': 0 };
    }

    addItem(type, amount = 1) {
        if (this.items.hasOwnProperty(type)) this.items[type] += amount;
        else if (this.tools.hasOwnProperty(type)) this.tools[type] += amount;
        else if (this.consumables.hasOwnProperty(type)) this.consumables[type] += amount;
        else this.items[type] = amount;
    }

    removeItem(type, amount) {
        if (this.hasItem(type, amount)) {
            if (this.items.hasOwnProperty(type)) this.items[type] -= amount;
            else if (this.tools.hasOwnProperty(type)) this.tools[type] -= amount;
            else if (this.consumables.hasOwnProperty(type)) this.consumables[type] -= amount;
            return true;
        }
        return false;
    }

    hasItem(type, amount) {
        const qty = this.items[type] || this.tools[type] || this.consumables[type] || 0;
        return qty >= amount;
    }

    hasIngredients(ingredients) {
        for (const [item, qty] of Object.entries(ingredients)) {
            if (!this.hasItem(item, qty)) return false;
        }
        return true;
    }

    removeIngredients(ingredients) {
        if (!this.hasIngredients(ingredients)) return false;
        for (const [item, qty] of Object.entries(ingredients)) {
            this.removeItem(item, qty);
        }
        return true;
    }

    getQuantity(type) {
        return this.items[type] || this.tools[type] || this.consumables[type] || 0;
    }

    getAllItems() {
        return { ...this.items, ...this.tools, ...this.consumables };
    }

    getTotalItems() {
        let total = 0;
        for (const qty of Object.values(this.items)) total += qty;
        return total;
    }

    hasTool(type) {
        return (this.tools[type] || 0) > 0;
    }

    getSaveData() {
        return { items: { ...this.items }, tools: { ...this.tools }, consumables: { ...this.consumables } };
    }

    loadSaveData(data) {
        if (data.items) this.items = { ...this.items, ...data.items };
        if (data.tools) this.tools = { ...this.tools, ...data.tools };
        if (data.consumables) this.consumables = { ...this.consumables, ...data.consumables };
    }
}
