/* =========================================================
   FATEBOUND - RPG CORE FOUNDATION
   Version: 0.2.0
   This module defines deterministic RPG rules. It does not
   modify the existing character-creation flow by itself.
   ========================================================= */
(function (global) {
    "use strict";

    const VERSION = "0.2.0";
    const CORE_STATS = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
    const STAT_CAP = 50;
    const LEVEL_CAP = 50;
    const STARTING_LEVEL = 1;
    const STARTING_STAMINA = 100;

    const POTENTIAL_GROWTH = {
        F: 0,
        E: 0.1,
        D: 0.2,
        C: 0.3,
        B: 0.4,
        A: 0.5,
        S: 0.75,
        "S+": 1
    };

    // Experience needed to advance from the current level to the next.
    function xpToNextLevel(level) {
        const safeLevel = clampInt(level || 1, 1, LEVEL_CAP);
        if (safeLevel >= LEVEL_CAP) return 0;
        return Math.floor(100 * Math.pow(safeLevel, 1.65));
    }

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, Number(value) || 0));
    }

    function clampInt(value, min, max) {
        return Math.floor(clamp(value, min, max));
    }

    function finiteNumber(value, fallback) {
        const number = Number(value);
        return Number.isFinite(number) ? number : fallback;
    }

    function gradeFor(character, stat) {
        const potential = character && character.potential && character.potential[stat];
        return potential && POTENTIAL_GROWTH[potential.grade] !== undefined
            ? potential.grade
            : "C";
    }

    function statValue(character, stat) {
        const stats = character && character.initialStats;
        return clamp(finiteNumber(stats && stats[stat], 5), 1, STAT_CAP);
    }

    function derivedStats(character) {
        const level = clampInt(character && character.level || STARTING_LEVEL, 1, LEVEL_CAP);
        const con = statValue(character || {}, "CON");
        const int = statValue(character || {}, "INT");
        const wis = statValue(character || {}, "WIS");
        const dex = statValue(character || {}, "DEX");
        const str = statValue(character || {}, "STR");
        return {
            maxHP: Math.max(1, Math.floor(50 + con * 10 + (level - 1) * (8 + con * 0.5))),
            maxMP: Math.max(0, Math.floor(20 + int * 8 + wis * 2 + (level - 1) * (4 + int * 0.35))),
            maxStamina: Math.max(1, Math.floor(STARTING_STAMINA + con * 2 + str + dex)),
            physicalPower: Math.floor(str * 1.5 + level),
            accuracy: Math.floor(dex * 1.2 + level),
            defense: Math.floor(con * 0.8 + str * 0.4 + level * 0.5),
            spellPower: Math.floor(int * 1.4 + wis * 0.4 + level),
            perception: Math.floor(wis * 1.2 + dex * 0.3),
            socialInfluence: Math.floor(statValue(character || {}, "CHA") * 1.2 + level * 0.25)
        };
    }

    function createDefaultSkills(character) {
        const startingSkill = character && character.skill;
        if (!startingSkill || startingSkill === "None") return [];
        return [{
            id: slug(startingSkill),
            name: startingSkill,
            level: clampInt(character.skillLevel || 1, 1, 10),
            type: "origin",
            description: "Your origin-granted starting skill. Its full effect can be defined in the skill catalogue.",
            costs: { mp: 0, stamina: 10 },
            cooldown: 0,
            tags: ["starting"]
        }];
    }

    function slug(value) {
        return String(value || "skill").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "skill";
    }

    function createCharacterState(character) {
        if (!character || typeof character !== "object") {
            throw new TypeError("A character object is required.");
        }
        const result = JSON.parse(JSON.stringify(character));
        result.level = clampInt(result.level || STARTING_LEVEL, 1, LEVEL_CAP);
        result.xp = Math.max(0, finiteNumber(result.xp, 0));
        result.class = result.class || { id: "unclassed", name: "Unclassed", path: null };
        result.traits = Array.isArray(result.traits) ? result.traits : [];
        result.talents = Array.isArray(result.talents) ? result.talents : [];
        result.skills = Array.isArray(result.skills) ? result.skills : createDefaultSkills(result);
        result.inventory = result.inventory && typeof result.inventory === "object"
            ? result.inventory
            : { capacity: 20, items: [], equipment: { weapon: null, offhand: null, head: null, chest: null, hands: null, legs: null, feet: null, accessory1: null, accessory2: null } };
        result.inventory.capacity = clampInt(result.inventory.capacity || 20, 1, 500);
        result.inventory.items = Array.isArray(result.inventory.items) ? result.inventory.items : [];
        result.inventory.equipment = result.inventory.equipment || {};
        result.statusEffects = Array.isArray(result.statusEffects) ? result.statusEffects : [];
        result.derived = derivedStats(result);
        result.hp = clampInt(result.hp === undefined ? result.derived.maxHP : result.hp, 0, result.derived.maxHP);
        result.mp = clampInt(result.mp === undefined ? result.derived.maxMP : result.mp, 0, result.derived.maxMP);
        result.stamina = clampInt(result.stamina === undefined ? result.derived.maxStamina : result.stamina, 0, result.derived.maxStamina);
        result.rpgCoreVersion = VERSION;
        return result;
    }

    function refreshDerived(character, preserveCurrentResources) {
        const old = { hp: character.hp, mp: character.mp, stamina: character.stamina };
        character.derived = derivedStats(character);
        if (preserveCurrentResources) {
            character.hp = clampInt(old.hp, 0, character.derived.maxHP);
            character.mp = clampInt(old.mp, 0, character.derived.maxMP);
            character.stamina = clampInt(old.stamina, 0, character.derived.maxStamina);
        } else {
            character.hp = character.derived.maxHP;
            character.mp = character.derived.maxMP;
            character.stamina = character.derived.maxStamina;
        }
        return character;
    }

    function addExperience(character, amount) {
        const state = character;
        let remaining = Math.max(0, Math.floor(finiteNumber(amount, 0)));
        const result = { gained: remaining, levelsGained: 0, levelUps: [] };
        if (!state || typeof state !== "object") throw new TypeError("A character state is required.");
        state.level = clampInt(state.level || 1, 1, LEVEL_CAP);
        state.xp = Math.max(0, finiteNumber(state.xp, 0)) + remaining;
        while (state.level < LEVEL_CAP && state.xp >= xpToNextLevel(state.level)) {
            const required = xpToNextLevel(state.level);
            state.xp -= required;
            state.level += 1;

            // Every core stat grows automatically from its own potential.
            // Keep fractional growth in saved state so it accumulates over time.
            state.initialStats = state.initialStats || {};
            const statsGained = {};
            for (const stat of CORE_STATS) {
                const before = statValue(state, stat);
                const growth = 0.5 + POTENTIAL_GROWTH[gradeFor(state, stat)];
                const after = Math.min(STAT_CAP, Math.round((before + growth) * 100) / 100);
                state.initialStats[stat] = after;
                statsGained[stat] = Math.round((after - before) * 100) / 100;
            }

            result.levelsGained += 1;
            result.levelUps.push({ level: state.level, statsGained });
            refreshDerived(state, true);
            // Small recovery on level-up; not a full heal.
            state.hp = Math.min(state.derived.maxHP, state.hp + Math.ceil(state.derived.maxHP * 0.25));
            state.mp = Math.min(state.derived.maxMP, state.mp + Math.ceil(state.derived.maxMP * 0.25));
            state.stamina = state.derived.maxStamina;
        }
        if (state.level >= LEVEL_CAP) state.xp = 0;
        return result;
    }


    function applyDamage(character, amount, type) {
        const damage = Math.max(0, Math.floor(finiteNumber(amount, 0)));
        const actual = Math.min(character.hp, damage);
        character.hp = Math.max(0, character.hp - actual);
        return { damage: actual, hp: character.hp, defeated: character.hp <= 0, damageType: type || "physical" };
    }

    function heal(character, amount) {
        const before = character.hp;
        character.hp = Math.min(character.derived.maxHP, character.hp + Math.max(0, Math.floor(finiteNumber(amount, 0))));
        return { healed: character.hp - before, hp: character.hp, maxHP: character.derived.maxHP };
    }

    function restoreResource(character, resource, amount) {
        const caps = { hp: "maxHP", mp: "maxMP", stamina: "maxStamina" };
        if (!caps[resource]) return { ok: false, reason: "Unknown resource." };
        const before = character[resource];
        character[resource] = Math.min(character.derived[caps[resource]], before + Math.max(0, Math.floor(finiteNumber(amount, 0))));
        return { ok: true, restored: character[resource] - before, current: character[resource], maximum: character.derived[caps[resource]] };
    }

    function useSkill(character, skillId, context) {
        const skill = (character.skills || []).find(item => item.id === skillId || item.name === skillId);
        if (!skill) return { ok: false, reason: "Skill not found." };
        const costs = skill.costs || {};
        const mpCost = Math.max(0, costs.mp || 0);
        const staminaCost = Math.max(0, costs.stamina || 0);
        if (character.hp <= 0) return { ok: false, reason: "A defeated character cannot use skills." };
        if (character.mp < mpCost) return { ok: false, reason: "Not enough MP." };
        if (character.stamina < staminaCost) return { ok: false, reason: "Not enough stamina." };
        character.mp -= mpCost;
        character.stamina -= staminaCost;
        // Effects are deliberately data-driven; the combat engine will resolve these in a later step.
        return { ok: true, skill: skill.name, costsPaid: { mp: mpCost, stamina: staminaCost }, context: context || null, effect: skill.effect || null, message: skill.effect ? "Skill costs paid; effect is ready for resolution." : "Skill costs paid; this skill needs an effect definition." };
    }

    const ITEM_RARITIES = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Mythical"];
    const RARITY_MULTIPLIERS = { Common: 1, Uncommon: 1.15, Rare: 1.35, Epic: 1.65, Legendary: 2.1, Mythical: 2.8 };

    function createItem(item) {
        if (!item || !item.name) throw new TypeError("An item requires a name.");
        const rarity = ITEM_RARITIES.includes(item.rarity) ? item.rarity : "Common";
        return {
            id: item.id || slug(item.name) + "-" + Math.random().toString(36).slice(2, 8),
            name: String(item.name),
            type: item.type || "misc",
            rarity,
            quantity: clampInt(item.quantity || 1, 1, 999),
            weight: Math.max(0, finiteNumber(item.weight, 0)),
            slot: item.slot || null,
            classRequirements: Array.isArray(item.classRequirements) ? item.classRequirements : [],
            statRequirements: item.statRequirements || {},
            bonuses: item.bonuses || {},
            effects: Array.isArray(item.effects) ? item.effects : [],
            description: item.description || "",
            value: Math.max(0, clampInt(item.value || 0, 0, 999999999))
        };
    }

    function addItem(character, itemInput) {
        const inventory = character.inventory;
        if (inventory.items.length >= inventory.capacity) return { ok: false, reason: "Inventory is full." };
        const item = createItem(itemInput);
        inventory.items.push(item);
        return { ok: true, item, itemCount: inventory.items.length, capacity: inventory.capacity };
    }

    function removeItem(character, itemId, quantity) {
        const items = character.inventory.items;
        const index = items.findIndex(item => item.id === itemId || item.name === itemId);
        if (index < 0) return { ok: false, reason: "Item not found." };
        const amount = clampInt(quantity || 1, 1, 999);
        if (items[index].quantity > amount) items[index].quantity -= amount;
        else items.splice(index, 1);
        return { ok: true };
    }

    function equipItem(character, itemId) {
        const inventory = character.inventory;
        const index = inventory.items.findIndex(item => item.id === itemId || item.name === itemId);
        if (index < 0) return { ok: false, reason: "Item not found in inventory." };
        const item = inventory.items[index];
        if (!item.slot) return { ok: false, reason: "This item cannot be equipped." };
        const currentClass = character.class && character.class.name;
        if (item.classRequirements.length && !item.classRequirements.includes(currentClass)) {
            return { ok: false, reason: "Your class cannot equip this item." };
        }
        for (const stat of Object.keys(item.statRequirements)) {
            if (statValue(character, stat) < item.statRequirements[stat]) return { ok: false, reason: "Stat requirement not met: " + stat + "." };
        }
        inventory.equipment[item.slot] = item.id;
        return { ok: true, item, slot: item.slot };
    }

    function rollCheck(modifier, difficulty, randomFn) {
        const random = typeof randomFn === "function" ? randomFn : Math.random;
        const die = Math.floor(random() * 20) + 1;
        const total = die + Math.floor(finiteNumber(modifier, 0));
        const target = Math.floor(finiteNumber(difficulty, 10));
        return { die, modifier: Math.floor(finiteNumber(modifier, 0)), total, difficulty: target, success: total >= target, criticalSuccess: die === 20, criticalFailure: die === 1 };
    }

    function snapshot(character) {
        return JSON.parse(JSON.stringify(character));
    }

    global.FateboundRPG = Object.freeze({
        version: VERSION,
        coreStats: CORE_STATS.slice(),
        statCap: STAT_CAP,
        levelCap: LEVEL_CAP,
        potentialGrowth: Object.assign({}, POTENTIAL_GROWTH),
        itemRarities: ITEM_RARITIES.slice(),
        rarityMultipliers: Object.assign({}, RARITY_MULTIPLIERS),
        xpToNextLevel,
        derivedStats,
        createCharacterState,
        refreshDerived,
        addExperience,
        applyDamage,
        heal,
        restoreResource,
        useSkill,
        createItem,
        addItem,
        removeItem,
        equipItem,
        rollCheck,
        snapshot
    });
})(typeof window !== "undefined" ? window : globalThis);
