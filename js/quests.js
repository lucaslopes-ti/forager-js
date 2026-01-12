/**
 * Sistema de Quests e Achievements
 */

class Quest {
    constructor(id, name, description, target, reward, type = 'collect') {
        this.id = id;
        this.name = name;
        this.description = description;
        this.target = target;
        this.progress = 0;
        this.reward = reward;
        this.type = type;
        this.completed = false;
        this.claimed = false;
    }

    update(amount = 1) {
        if (this.completed) return false;
        this.progress = Math.min(this.target, this.progress + amount);
        if (this.progress >= this.target) {
            this.completed = true;
            return true;
        }
        return false;
    }

    getProgress() {
        return Math.min(100, (this.progress / this.target) * 100);
    }
}

class QuestManager {
    constructor() {
        this.quests = [];
        this.completedQuests = [];
        this.generateQuests();
    }

    generateQuests() {
        this.quests = [
            new Quest('collect_apple', 'Coletor de Maçãs', 'Colete 10 maçãs', 10, { xp: 50, gold: 2 }, 'collect_apple'),
            new Quest('collect_wood', 'Lenhador', 'Colete 15 madeiras', 15, { xp: 75, gold: 3 }, 'collect_wood'),
            new Quest('collect_stone', 'Minerador', 'Colete 10 pedras', 10, { xp: 60, gold: 2 }, 'collect_stone'),
            new Quest('kill_enemies', 'Caçador', 'Derrote 5 inimigos', 5, { xp: 100, gold: 5 }, 'kill'),
            new Quest('build_structure', 'Construtor', 'Construa 2 estruturas', 2, { xp: 80, gold: 3 }, 'build'),
            new Quest('craft_item', 'Artesão', 'Crie 3 itens', 3, { xp: 60, gold: 2 }, 'craft'),
            new Quest('survive_waves', 'Sobrevivente', 'Sobreviva 3 waves', 3, { xp: 150, gold: 8 }, 'wave'),
            new Quest('reach_level', 'Evoluído', 'Alcance nível 3', 3, { xp: 100, gold: 5 }, 'level')
        ];
    }

    updateQuest(type, amount = 1) {
        let completed = [];
        this.quests.forEach(quest => {
            if (quest.type === type && !quest.completed) {
                if (quest.update(amount)) {
                    completed.push(quest);
                }
            }
        });
        return completed;
    }

    claimReward(questId, player, inventory) {
        const quest = this.quests.find(q => q.id === questId);
        if (!quest || !quest.completed || quest.claimed) return false;

        quest.claimed = true;
        if (quest.reward.xp) player.addXP(quest.reward.xp);
        if (quest.reward.gold) inventory.addItem('gold', quest.reward.gold);

        this.completedQuests.push(quest);
        return true;
    }

    getActiveQuests() {
        return this.quests.filter(q => !q.claimed);
    }

    getSaveData() {
        return this.quests.map(q => ({
            id: q.id,
            progress: q.progress,
            completed: q.completed,
            claimed: q.claimed
        }));
    }

    loadSaveData(data) {
        data.forEach(d => {
            const quest = this.quests.find(q => q.id === d.id);
            if (quest) {
                quest.progress = d.progress;
                quest.completed = d.completed;
                quest.claimed = d.claimed;
            }
        });
    }
}

class Achievement {
    constructor(id, name, description, icon, condition) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.condition = condition;
        this.unlocked = false;
    }
}

class AchievementManager {
    constructor() {
        this.achievements = [
            new Achievement('first_blood', 'Primeiro Sangue', 'Derrote seu primeiro inimigo', '⚔️', { type: 'kills', value: 1 }),
            new Achievement('slayer', 'Matador', 'Derrote 25 inimigos', '💀', { type: 'kills', value: 25 }),
            new Achievement('destroyer', 'Destruidor', 'Derrote 100 inimigos', '☠️', { type: 'kills', value: 100 }),
            new Achievement('collector', 'Colecionador', 'Colete 50 recursos', '📦', { type: 'collected', value: 50 }),
            new Achievement('hoarder', 'Acumulador', 'Colete 200 recursos', '🏆', { type: 'collected', value: 200 }),
            new Achievement('builder', 'Construtor', 'Construa 5 estruturas', '🏗️', { type: 'built', value: 5 }),
            new Achievement('architect', 'Arquiteto', 'Construa 15 estruturas', '🏛️', { type: 'built', value: 15 }),
            new Achievement('crafter', 'Artesão', 'Crie 10 itens', '🔨', { type: 'crafted', value: 10 }),
            new Achievement('master_crafter', 'Mestre Artesão', 'Crie 30 itens', '⚒️', { type: 'crafted', value: 30 }),
            new Achievement('survivor', 'Sobrevivente', 'Sobreviva 5 waves', '🛡️', { type: 'wave', value: 5 }),
            new Achievement('veteran', 'Veterano', 'Sobreviva 10 waves', '🎖️', { type: 'wave', value: 10 }),
            new Achievement('legend', 'Lenda', 'Sobreviva 20 waves', '👑', { type: 'wave', value: 20 }),
            new Achievement('leveled', 'Evoluído', 'Alcance nível 5', '⭐', { type: 'level', value: 5 }),
            new Achievement('experienced', 'Experiente', 'Alcance nível 10', '🌟', { type: 'level', value: 10 }),
            new Achievement('gold_digger', 'Garimpeiro', 'Colete 10 ouros', '💰', { type: 'gold', value: 10 }),
            new Achievement('rich', 'Rico', 'Colete 50 ouros', '💎', { type: 'gold', value: 50 }),
            new Achievement('combo_master', 'Mestre do Combo', 'Faça um combo de 10x', '🔥', { type: 'combo', value: 10 }),
            new Achievement('score_hunter', 'Caçador de Pontos', 'Alcance 5000 pontos', '🎯', { type: 'score', value: 5000 }),
            new Achievement('high_scorer', 'Pontuação Alta', 'Alcance 20000 pontos', '🏅', { type: 'score', value: 20000 }),
            new Achievement('boss_slayer', 'Matador de Boss', 'Derrote um boss', '🐉', { type: 'boss', value: 1 })
        ];
        this.stats = {
            kills: 0, collected: 0, built: 0, crafted: 0,
            wave: 0, level: 1, gold: 0, combo: 0, score: 0, boss: 0
        };
    }

    updateStat(stat, value) {
        if (this.stats.hasOwnProperty(stat)) {
            if (stat === 'combo' || stat === 'level' || stat === 'wave') {
                this.stats[stat] = Math.max(this.stats[stat], value);
            } else {
                this.stats[stat] += value;
            }
        }
        return this.checkAchievements();
    }

    checkAchievements() {
        const unlocked = [];
        this.achievements.forEach(ach => {
            if (!ach.unlocked) {
                const stat = this.stats[ach.condition.type];
                if (stat >= ach.condition.value) {
                    ach.unlocked = true;
                    unlocked.push(ach);
                }
            }
        });
        return unlocked;
    }

    getUnlockedCount() {
        return this.achievements.filter(a => a.unlocked).length;
    }

    getSaveData() {
        return {
            stats: { ...this.stats },
            unlocked: this.achievements.filter(a => a.unlocked).map(a => a.id)
        };
    }

    loadSaveData(data) {
        if (data.stats) this.stats = { ...this.stats, ...data.stats };
        if (data.unlocked) {
            data.unlocked.forEach(id => {
                const ach = this.achievements.find(a => a.id === id);
                if (ach) ach.unlocked = true;
            });
        }
    }
}
