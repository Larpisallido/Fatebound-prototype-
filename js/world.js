/* =========================================================
   FATEBOUND — THE OLD ROAD
   Ten-turn playable RPG test scenario
   Requires saves.js, rpgCore.js and navigation.js beforehand.
   ========================================================= */

const currentScenario = {
    id: "old-road-test-v1",
    location: "THE OLD ROAD",
    time: "Late Afternoon"
};

const worldLocation = document.getElementById("worldLocation");
const worldTime = document.getElementById("worldTime");
const worldDescription = document.getElementById("worldDescription");
const worldSituation = document.getElementById("worldSituation");
const worldChoices = document.getElementById("worldChoices");
const worldResult = document.getElementById("worldResult");
const worldResultText = document.getElementById("worldResultText");
const worldEndMessage = document.getElementById("worldEndMessage");
const worldLobbyButton = document.getElementById("worldLobbyButton");

let worldTurnCompleted = false;
let scenarioState = null;
let combatState = null;

const OLD_ROAD_TURNS = {
    1: {
        title: "TURN 1 — THE WOUNDED TRAVELER",
        time: "Late Afternoon",
        description: "The old road runs between open fields and a dark forest. A broken cart lies across the ditch.",
        situation: "A wounded traveler reaches toward you. From the trees, you hear something moving.",
        kind: "story"
    },
    2: {
        title: "TURN 2 — FIRST COMBAT",
        time: "Late Afternoon",
        description: "A road lynx emerges from the forest, its fur bristling and its eyes fixed on you.",
        situation: "Defeat the lynx, use a skill, guard against its attacks, or try to flee.",
        kind: "combat1"
    },
    3: {
        title: "TURN 3 — THE INSIGNIA",
        time: "Early Evening",
        description: "The forest falls quiet. The traveler points to a metal insignia half-buried beside the cart.",
        situation: "The mark resembles the crest of a local military house. Someone may be looking for this cargo.",
        kind: "story"
    },
    4: {
        title: "TURN 4 — THE BROKEN BRIDGE",
        time: "Early Evening",
        description: "The road reaches a narrow bridge where a support beam has snapped. A cold stream rushes below.",
        situation: "Choose an approach. Your DEX or STR can improve the odds; a cautious detour is safer but costs time.",
        kind: "check1"
    },
    5: {
        title: "TURN 5 — A MOMENT TO REST",
        time: "Dusk",
        description: "You find a sheltered milestone away from the road. For a few minutes, the forest is still.",
        situation: "You can rest to recover some resources, inspect your belongings, or press on without resting.",
        kind: "story"
    },
    6: {
        title: "TURN 6 — SECOND COMBAT",
        time: "Dusk",
        description: "Two armed scouts step from behind a fallen tree. One carries the same insignia you found near the cart.",
        situation: "A scout captain blocks the path. This encounter tests whether you can manage resources across a second fight.",
        kind: "combat2"
    },
    7: {
        title: "TURN 7 — THE SEALED WAYSTONE",
        time: "Nightfall",
        description: "Beyond the scouts, an old waystone glows with faint runes. The air hums with restrained magic.",
        situation: "You can study the runes with INT, read the danger with WIS, or leave the stone untouched.",
        kind: "check2"
    },
    8: {
        title: "TURN 8 — LIGHTS IN THE DISTANCE",
        time: "Night",
        description: "At last, lanterns appear on a ridge. The settlement gates are still open, but distant horns sound behind you.",
        situation: "Decide what to do before reaching the gates. Your choice affects the closing narration and small rewards.",
        kind: "story"
    },
    9: {
        title: "TURN 9 — FATE'S TRAINING GROUND",
        time: "Night",
        description: "A strange chamber appears in your thoughts: a quiet place where time stands still and growth can be tested.",
        situation: "This is a development test. Click the +1,000 XP button as many times as you like. It never advances the story; use CONTINUE only when you are ready for Turn 10.",
        kind: "xpTest"
    },
    10: {
        title: "TURN 10 — THE GATES OF GREYHAVEN",
        time: "Late Night",
        description: "The settlement gates open. The road behind you disappears into darkness, and the watch captain waits beneath the lanterns.",
        situation: "Choose how to end this short test campaign. Your character's current level, stats, and resources will remain saved.",
        kind: "ending"
    }
};

function getScenarioCharacter() {
    if (typeof currentCharacter === "undefined" || !currentCharacter) return null;
    if (!window.FateboundRPG) return null;

    const core = window.FateboundRPG;
    // Recalculate derived maxima even for saves created by an earlier core version,
    // while preserving current HP/MP/stamina if they already exist.
    const migrated = core.createCharacterState(currentCharacter);
    core.refreshDerived(migrated, currentCharacter.hp !== undefined);
    Object.keys(currentCharacter).forEach(key => delete currentCharacter[key]);
    Object.assign(currentCharacter, migrated);
    saveScenarioCharacter();
    return currentCharacter;
}

function saveScenarioCharacter() {
    if (typeof saveGame === "function" && typeof currentCharacter !== "undefined" && currentCharacter) {
        saveGame(currentCharacter);
    }
}

// Called by saves.js to persist the adventure alongside the character.
function getWorldSaveState() {
    if (!scenarioState) return null;
    return {
        scenarioId: scenarioState.scenarioId,
        turn: scenarioState.turn,
        flags: JSON.parse(JSON.stringify(scenarioState.flags || {})),
        completed: !!scenarioState.completed,
        turnCompleted: !!worldTurnCompleted,
        combat: combatState ? JSON.parse(JSON.stringify(combatState)) : null,
        resultText: worldResultText ? worldResultText.textContent : ""
    };
}

function restoreWorldFromSave(savedWorld) {
    const validTurn = savedWorld && Number.isInteger(savedWorld.turn) && savedWorld.turn >= 1 && savedWorld.turn <= 10;
    if (!savedWorld || savedWorld.scenarioId !== currentScenario.id || !validTurn) {
        startWorld();
        return;
    }

    scenarioState = {
        scenarioId: currentScenario.id,
        turn: savedWorld.turn,
        flags: savedWorld.flags && typeof savedWorld.flags === "object" ? savedWorld.flags : {},
        completed: !!savedWorld.completed
    };

    const savedCombat = savedWorld.combat;
    combatState = savedCombat && (savedCombat.which === 1 || savedCombat.which === 2)
        && Number.isFinite(savedCombat.hp) && Number.isFinite(savedCombat.maxHP)
        ? {
            which: savedCombat.which,
            enemyName: savedCombat.which === 1 ? "Road Lynx" : "Bandit Scout Captain",
            maxHP: Math.max(1, Math.floor(savedCombat.maxHP)),
            hp: Math.max(0, Math.min(Math.floor(savedCombat.maxHP), Math.floor(savedCombat.hp))),
            damage: Math.max(1, Math.floor(Number(savedCombat.damage) || 1)),
            xp: Math.max(0, Math.floor(Number(savedCombat.xp) || 0)),
            guardNext: !!savedCombat.guardNext,
            round: Math.max(0, Math.floor(Number(savedCombat.round) || 0))
        }
        : null;

    setWorldCopy(scenarioState.turn);
    worldTurnCompleted = !!savedWorld.turnCompleted;
    if (typeof showGameMenuButton === "function") showGameMenuButton();

    if (scenarioState.completed) {
        if (worldChoices) worldChoices.innerHTML = "";
        if (worldEndMessage) {
            worldEndMessage.textContent = "THE TEN-TURN SCENARIO IS COMPLETE.";
            worldEndMessage.classList.remove("hidden");
        }
        if (worldTime) worldTime.textContent = "Scenario complete";
        showResult(savedWorld.resultText || "The Old Road test scenario is complete.");
        if (typeof showGameOver === "function") showGameOver();
        const endingResult = document.getElementById("worldGameOverResult");
        if (endingResult) endingResult.textContent = savedWorld.resultText || "The Old Road test scenario is complete.";
    } else if (combatState) {
        if (worldDescription) worldDescription.textContent = combatState.which === 1
            ? "A road lynx crouches low and prepares to spring. Watch your HP and stamina."
            : "A veteran scout draws a notched blade. He studies your stance and waits for your move.";
        renderCombatChoices();
        if (savedWorld.resultText) showResult(savedWorld.resultText);
    } else if (worldTurnCompleted) {
        // Rebuild the resolved turn's Continue button without replaying its choices.
        const turnData = OLD_ROAD_TURNS[scenarioState.turn];
        if (turnData && worldDescription) worldDescription.textContent = turnData.description;
        if (turnData && worldSituation) worldSituation.textContent = turnData.situation;
        if (savedWorld.resultText) showResult(savedWorld.resultText);
        showContinueButton(scenarioState.turn >= 10 ? "FINISH CAMPAIGN" : `CONTINUE TO TURN ${scenarioState.turn + 1}`);
    } else {
        renderCurrentTurn();
        if (savedWorld.resultText) showResult(savedWorld.resultText);
    }

    if (typeof showWorld === "function") showWorld();
    saveScenarioCharacter();
}

function makeChoiceButton(text, action, className) {
    if (!worldChoices) return null;
    const button = document.createElement("button");
    button.type = "button";
    button.className = className || "menu-button world-choice-button";
    button.textContent = text;
    button.addEventListener("click", action);
    worldChoices.appendChild(button);
    return button;
}

function showResult(text) {
    if (worldResultText) worldResultText.textContent = text;
    if (worldResult) worldResult.classList.remove("hidden");
}

function setWorldCopy(turn) {
    const data = OLD_ROAD_TURNS[turn];
    if (!data) return;
    if (worldLocation) worldLocation.textContent = data.title;
    if (worldTime) worldTime.textContent = data.time;
    if (worldDescription) worldDescription.textContent = data.description;
    if (worldSituation) worldSituation.textContent = data.situation;
    if (worldResult) worldResult.classList.add("hidden");
    if (worldEndMessage) worldEndMessage.classList.add("hidden");
    if (worldChoices) worldChoices.innerHTML = "";
    worldTurnCompleted = false;
}

function startWorld() {
    const character = getScenarioCharacter();
    scenarioState = {
        scenarioId: currentScenario.id,
        turn: 1,
        flags: {},
        completed: false
    };
    combatState = null;

    if (worldEndMessage) worldEndMessage.classList.add("hidden");
    if (worldGameOver) worldGameOver.classList.add("hidden");
    setWorldCopy(1);

    if (!character) {
        if (worldSituation) worldSituation.textContent = "No character was loaded. Return to character creation and try again.";
        return;
    }

    if (typeof showGameMenuButton === "function") showGameMenuButton();
    renderCurrentTurn();
    if (typeof showWorld === "function") showWorld();
    saveScenarioCharacter();
}

function renderCurrentTurn() {
    if (!scenarioState) return;
    const turn = scenarioState.turn;
    setWorldCopy(turn);

    switch (OLD_ROAD_TURNS[turn].kind) {
        case "story": renderStoryTurn(turn); break;
        case "combat1": startCombat(1); break;
        case "combat2": startCombat(2); break;
        case "check1": renderBridgeEvent(); break;
        case "check2": renderWaystoneEvent(); break;
        case "xpTest": renderXPTestTurn(); break;
        case "ending": renderEndingTurn(); break;
        default: renderStoryTurn(turn);
    }
}

function advanceTurn(message) {
    if (!scenarioState || scenarioState.completed) return;
    if (message) showResult(message);
    scenarioState.turn += 1;
    combatState = null;
    if (scenarioState.turn > 10) scenarioState.turn = 10;
    renderCurrentTurn();
    saveScenarioCharacter();
}

function showContinueButton(label) {
    worldTurnCompleted = true;
    if (worldChoices) worldChoices.innerHTML = "";
    makeChoiceButton(label || `CONTINUE TO TURN ${Math.min(10, scenarioState.turn + 1)}`, () => {
        if (scenarioState.turn >= 10) {
            finishCampaign("You have completed all ten turns of The Old Road test scenario.");
        } else {
            advanceTurn();
        }
    });
    saveScenarioCharacter();
}

function renderStoryTurn(turn) {
    if (turn === 1) {
        makeChoiceButton("HELP THE TRAVELER", () => {
            scenarioState.flags.travelerHelped = true;
            awardXP(10, "Helped the wounded traveler");
            resolveStoryChoice("You help the traveler reach the milestone. He warns you that a road lynx has been stalking carts along this route. +10 XP.");
        });
        makeChoiceButton("SEARCH THE CART", () => {
            scenarioState.flags.searchedCart = true;
            const character = getScenarioCharacter();
            const result = window.FateboundRPG.addItem(character, {
                id: "old-road-healing-draught", name: "Healing Draught", type: "consumable",
                rarity: "Common", quantity: 1, description: "Restores 35 HP when used.",
                effects: [{ type: "heal", amount: 35 }], value: 12
            });
            saveScenarioCharacter();
            resolveStoryChoice(result.ok
                ? "You discover a Healing Draught and a military insignia hidden beneath the cart's cloth."
                : "You find a military insignia, but your inventory is full and you cannot take the draught.");
        });
        makeChoiceButton("FOLLOW THE TRACKS", () => {
            scenarioState.flags.followedTracks = true;
            resolveStoryChoice("Fresh claw marks lead toward the forest. Whatever attacked the cart is still nearby.");
        });
        makeChoiceButton("WALK PAST", () => {
            scenarioState.flags.walkedPast = true;
            resolveStoryChoice("You begin to leave, but the growl from the forest moves to block the road ahead.");
        });
        return;
    }

    if (turn === 3) {
        makeChoiceButton("QUESTION THE TRAVELER", () => {
            scenarioState.flags.askedTraveler = true;
            awardXP(15, "Gathered information");
            resolveStoryChoice("The traveler explains that the insignia belongs to a military supply caravan. He heard the attackers mention a sealed waystone. +15 XP.");
        });
        makeChoiceButton("KEEP THE INSIGNIA", () => {
            scenarioState.flags.keptInsignia = true;
            awardXP(10, "Recovered the insignia");
            resolveStoryChoice("You keep the insignia. It may open doors—or draw the wrong attention. +10 XP.");
        });
        makeChoiceButton("LEAVE THE CARGO ALONE", () => {
            resolveStoryChoice("You decide not to disturb the cargo. The safest route is onward.");
        });
        return;
    }

    if (turn === 5) {
        makeChoiceButton("REST FOR A MOMENT", () => {
            const character = getScenarioCharacter();
            const core = window.FateboundRPG;
            const hp = core.restoreResource(character, "hp", Math.ceil(character.derived.maxHP * 0.25));
            const mp = core.restoreResource(character, "mp", Math.ceil(character.derived.maxMP * 0.25));
            const stamina = core.restoreResource(character, "stamina", Math.ceil(character.derived.maxStamina * 0.5));
            saveScenarioCharacter();
            resolveStoryChoice(`You catch your breath. Restored ${hp.restored} HP, ${mp.restored} MP and ${stamina.restored} stamina.`);
        });
        makeChoiceButton("CHECK YOUR EQUIPMENT", () => {
            const character = getScenarioCharacter();
            const items = character.inventory.items || [];
            resolveStoryChoice(`You check your belongings. Inventory: ${items.length} item(s). Your current resources are HP ${character.hp}/${character.derived.maxHP}, MP ${character.mp}/${character.derived.maxMP}, stamina ${character.stamina}/${character.derived.maxStamina}.`);
        });
        makeChoiceButton("PRESS ON", () => {
            awardXP(10, "Kept moving despite exhaustion");
            resolveStoryChoice("You press on without resting. The decision saves time but leaves you tired. +10 XP.");
        });
        return;
    }

    if (turn === 8) {
        makeChoiceButton("APPROACH THE GATES OPENLY", () => {
            scenarioState.flags.openApproach = true;
            awardXP(15, "Reached the settlement");
            resolveStoryChoice("You approach the guards openly and show them the recovered insignia. They lower their spears and invite you inside. +15 XP.");
        });
        makeChoiceButton("SLIP IN THROUGH THE SIDE ROAD", () => {
            const character = getScenarioCharacter();
            const mod = statModifier(character, "DEX");
            const check = window.FateboundRPG.rollCheck(mod, 14);
            if (check.success) {
                awardXP(20, "Entered without trouble");
                resolveStoryChoice(`You find a quiet side entrance and slip inside unnoticed. DEX check: ${check.total} vs DC 14 — success. +20 XP.`);
            } else {
                window.FateboundRPG.applyDamage(character, 5, "physical");
                saveScenarioCharacter();
                resolveStoryChoice(`A guard spots you and orders you to stop. You escape the scuffle but take 5 damage. DEX check: ${check.total} vs DC 14 — failure.`);
            }
        });
        makeChoiceButton("WAIT FOR THE WATCH CAPTAIN", () => {
            scenarioState.flags.waitedForCaptain = true;
            resolveStoryChoice("You wait by the gate. The watch captain arrives and asks what happened on the road.");
        });
        return;
    }
}

function resolveStoryChoice(message) {
    showResult(message);
    showContinueButton(`CONTINUE TO TURN ${scenarioState.turn + 1}`);
}

function statModifier(character, stat) {
    const value = Number(character && character.initialStats && character.initialStats[stat]) || 10;
    return Math.floor((value - 10) / 2);
}

function renderBridgeEvent() {
    makeChoiceButton("JUMP THE GAP (DEX CHECK)", () => {
        const character = getScenarioCharacter();
        const check = window.FateboundRPG.rollCheck(statModifier(character, "DEX"), 16);
        if (check.success) {
            awardXP(35, "Crossed the broken bridge");
            resolveStoryChoice(`You land on the far side and keep your footing. DEX ${character.initialStats.DEX} check: ${check.total} vs DC 16 — success. +35 XP.`);
        } else {
            window.FateboundRPG.applyDamage(character, 12, "physical");
            saveScenarioCharacter();
            resolveStoryChoice(`Your foot slips against the wet stone. You reach the far side, but take 12 damage. DEX check: ${check.total} vs DC 16 — failure.`);
        }
    });
    makeChoiceButton("BRACE A BEAM (STR CHECK)", () => {
        const character = getScenarioCharacter();
        const check = window.FateboundRPG.rollCheck(statModifier(character, "STR"), 15);
        if (check.success) {
            awardXP(30, "Secured a safe crossing");
            resolveStoryChoice(`You shift a broken beam into place and cross safely. STR check: ${check.total} vs DC 15 — success. +30 XP.`);
        } else {
            window.FateboundRPG.applyDamage(character, 8, "physical");
            saveScenarioCharacter();
            resolveStoryChoice(`The beam shifts before you can secure it. You scramble across and take 8 damage. STR check: ${check.total} vs DC 15 — failure.`);
        }
    });
    makeChoiceButton("TAKE THE LONG DETOUR", () => {
        resolveStoryChoice("You follow the stream until it narrows and cross safely. It takes longer, but you avoid the dangerous check.");
    });
}

function renderWaystoneEvent() {
    makeChoiceButton("DECIPHER THE RUNES (INT CHECK)", () => {
        const character = getScenarioCharacter();
        const check = window.FateboundRPG.rollCheck(statModifier(character, "INT"), 17);
        if (check.success) {
            awardXP(40, "Deciphered the waystone");
            window.FateboundRPG.restoreResource(character, "mp", 15);
            saveScenarioCharacter();
            resolveStoryChoice(`You understand the runes and draw a little energy from the stone. INT check: ${check.total} vs DC 17 — success. +40 XP and up to 15 MP restored.`);
        } else {
            window.FateboundRPG.applyDamage(character, 8, "magical");
            saveScenarioCharacter();
            resolveStoryChoice(`The runes flare and throw you backward. You take 8 magical damage. INT check: ${check.total} vs DC 17 — failure.`);
        }
    });
    makeChoiceButton("SENSE THE DANGER (WIS CHECK)", () => {
        const character = getScenarioCharacter();
        const check = window.FateboundRPG.rollCheck(statModifier(character, "WIS"), 14);
        if (check.success) {
            awardXP(25, "Read the waystone safely");
            resolveStoryChoice(`You sense the unstable rune before touching it and learn how to pass safely. WIS check: ${check.total} vs DC 14 — success. +25 XP.`);
        } else {
            window.FateboundRPG.applyDamage(character, 6, "magical");
            saveScenarioCharacter();
            resolveStoryChoice(`You misread the pulse and take 6 magical damage. WIS check: ${check.total} vs DC 14 — failure.`);
        }
    });
    makeChoiceButton("LEAVE THE WAYSTONE UNTOUCHED", () => {
        resolveStoryChoice("You decide that some old magic is better left alone and continue toward the settlement.");
    });
}

function startCombat(which) {
    const character = getScenarioCharacter();
    const level = character ? Number(character.level) || 1 : 1;
    const first = which === 1;
    combatState = {
        which,
        enemyName: first ? "Road Lynx" : "Bandit Scout Captain",
        maxHP: first ? 42 + Math.min(18, level * 2) : 60 + Math.min(30, level * 3),
        hp: first ? 42 + Math.min(18, level * 2) : 60 + Math.min(30, level * 3),
        damage: first ? 9 + Math.min(5, level) : 12 + Math.min(8, level),
        xp: first ? 45 : 85,
        guardNext: false,
        round: 0
    };
    if (worldDescription) worldDescription.textContent = first
        ? "A road lynx crouches low and prepares to spring. Watch your HP and stamina."
        : "A veteran scout draws a notched blade. He studies your stance and waits for your move.";
    if (worldSituation) worldSituation.textContent = "Choose one combat action. The enemy retaliates after your action unless you defeat it or escape.";
    renderCombatChoices();
}

function renderCombatChoices() {
    if (!combatState || !worldChoices) return;
    worldChoices.innerHTML = "";
    const character = getScenarioCharacter();
    if (!character) return;
    const core = window.FateboundRPG;
    const skill = (character.skills || [])[0];
    const skillLabel = skill ? `USE ${String(skill.name).toUpperCase()} (COSTS ${skill.costs && skill.costs.stamina || 0} STA)` : "HEAVY ATTACK (15 STA)";
    makeChoiceButton("ATTACK", () => runCombatAction("attack"));
    makeChoiceButton(skillLabel, () => runCombatAction("skill"));
    makeChoiceButton("GUARD", () => runCombatAction("guard"));
    makeChoiceButton("USE HEALING DRAUGHT", () => runCombatAction("potion"));
    makeChoiceButton("TRY TO FLEE (DEX CHECK)", () => runCombatAction("flee"), "back-button");
    if (worldTime) worldTime.textContent = `Combat ${combatState.which}/2 · ${combatState.enemyName}: ${combatState.hp}/${combatState.maxHP} HP`;
    if (worldSituation) worldSituation.textContent = `Your resources: HP ${character.hp}/${character.derived.maxHP} · MP ${character.mp}/${character.derived.maxMP} · Stamina ${character.stamina}/${character.derived.maxStamina}`;
}

function runCombatAction(action) {
    if (!combatState || !scenarioState || scenarioState.completed) return;
    const character = getScenarioCharacter();
    if (!character || character.hp <= 0) {
        showDefeatOptions("You are at 0 HP. Restore your resources to retry this test encounter.");
        return;
    }
    const core = window.FateboundRPG;
    const derived = character.derived || core.derivedStats(character);
    let message = "";
    let defending = false;

    if (action === "attack") {
        const check = core.rollCheck(statModifier(character, "DEX") + Math.floor(derived.accuracy / 5), 13);
        if (check.success) {
            const damage = Math.max(1, Math.floor(derived.physicalPower * 0.65) + Math.floor(Math.random() * 5));
            combatState.hp = Math.max(0, combatState.hp - damage);
            message = `You hit for ${damage} damage (attack check ${check.total} vs DC 13).`;
        } else {
            message = `Your attack misses (check ${check.total} vs DC 13).`;
        }
    } else if (action === "skill") {
        const skill = (character.skills || [])[0];
        if (skill) {
            const usage = core.useSkill(character, skill.id, { enemy: combatState.enemyName });
            if (!usage.ok) {
                showResult(usage.reason);
                renderCombatChoices();
                return;
            }
            const damage = Math.max(1, Math.floor(derived.physicalPower * 0.9) + 4 * (skill.level || 1));
            combatState.hp = Math.max(0, combatState.hp - damage);
            message = `${skill.name} strikes true and deals ${damage} damage. ${usage.costsPaid.stamina} stamina spent.`;
        } else {
            if (character.stamina < 15) {
                showResult("Not enough stamina for a heavy attack.");
                renderCombatChoices();
                return;
            }
            character.stamina -= 15;
            const damage = Math.max(1, Math.floor(derived.physicalPower * 0.85) + 6);
            combatState.hp = Math.max(0, combatState.hp - damage);
            message = `Your heavy attack deals ${damage} damage. 15 stamina spent.`;
        }
    } else if (action === "guard") {
        if (character.stamina < 5) {
            showResult("Not enough stamina to guard.");
            renderCombatChoices();
            return;
        }
        character.stamina -= 5;
        combatState.guardNext = true;
        defending = true;
        message = "You brace yourself. The next incoming hit will be reduced.";
    } else if (action === "potion") {
        const potionIndex = (character.inventory.items || []).findIndex(item => item.name === "Healing Draught" && item.quantity > 0);
        if (potionIndex < 0) {
            showResult("You have no Healing Draught. Search the cart during Turn 1 to find one.");
            renderCombatChoices();
            return;
        }
        const potion = character.inventory.items[potionIndex];
        potion.quantity -= 1;
        if (potion.quantity <= 0) character.inventory.items.splice(potionIndex, 1);
        const healed = core.heal(character, 35);
        message = `You use a Healing Draught and restore ${healed.healed} HP.`;
    } else if (action === "flee") {
        const check = core.rollCheck(statModifier(character, "DEX"), 13);
        if (check.success) {
            saveScenarioCharacter();
            const result = `You escape the ${combatState.enemyName}. DEX check ${check.total} vs DC 13 — success. No combat XP awarded.`;
            combatState = null;
            resolveCombatEncounter(result);
            return;
        }
        message = `You fail to escape (DEX check ${check.total} vs DC 13).`;
    }

    combatState.round += 1;
    if (combatState.hp <= 0) {
        const defeatedName = combatState.enemyName;
        const reward = combatState.xp;
        combatState = null;
        const levelInfo = awardXP(reward, `Defeated ${defeatedName}`);
        const levelText = levelInfo && levelInfo.levelsGained
            ? ` Level-up: now Level ${character.level}.`
            : "";
        saveScenarioCharacter();
        resolveCombatEncounter(`${message} You defeat ${defeatedName} and gain ${reward} XP.${levelText}`);
        return;
    }

    const enemyBaseDamage = combatState.damage;
    const reduction = combatState.guardNext ? 0.6 : 0;
    combatState.guardNext = false;
    const mitigated = Math.max(1, Math.floor(enemyBaseDamage * (1 - reduction) - Math.floor(derived.defense * 0.3)));
    const damageResult = core.applyDamage(character, mitigated, "physical");
    saveScenarioCharacter();

    if (damageResult.defeated) {
        showDefeatOptions(`${message} ${combatState.enemyName} hits you for ${damageResult.damage}. Your HP reaches 0. Retry the encounter or restore your resources and continue testing.`);
        return;
    }

    showResult(`${message} ${combatState.enemyName} retaliates for ${damageResult.damage} damage.`);
    renderCombatChoices();
}

function showDefeatOptions(message) {
    if (worldDescription) worldDescription.textContent = "DEFEATED — this is a test encounter, so permanent death is disabled.";
    if (worldSituation) worldSituation.textContent = message;
    showResult(message);
    if (worldChoices) worldChoices.innerHTML = "";
    makeChoiceButton("RESTORE RESOURCES & RETRY FIGHT", () => {
        const character = getScenarioCharacter();
        if (!character) return;
        window.FateboundRPG.refreshDerived(character, false);
        saveScenarioCharacter();
        startCombat(scenarioState.turn === 2 ? 1 : 2);
    });
    makeChoiceButton("RESTORE RESOURCES & RETREAT", () => {
        const character = getScenarioCharacter();
        if (character) {
            window.FateboundRPG.refreshDerived(character, false);
            saveScenarioCharacter();
        }
        combatState = null;
        resolveCombatEncounter("You retreat from the encounter and recover enough to continue. No XP was awarded for this fight.");
    }, "back-button");
}

function resolveCombatEncounter(message) {
    showResult(message);
    showContinueButton(`CONTINUE TO TURN ${scenarioState.turn + 1}`);
}

function renderXPTestTurn() {
    const character = getScenarioCharacter();
    if (!character) return;
    makeChoiceButton("GAIN +1,000 XP (REPEATABLE TEST)", () => {
        const state = getScenarioCharacter();
        const beforeLevel = state.level;
        const beforeStats = Object.assign({}, state.initialStats);
        const result = window.FateboundRPG.addExperience(state, 1000);
        saveScenarioCharacter();
        const gainedLevels = result.levelsGained;
        const gains = [];
        for (const stat of window.FateboundRPG.coreStats) {
            const delta = Math.round(((state.initialStats[stat] || 0) - (beforeStats[stat] || 0)) * 100) / 100;
            if (delta > 0) gains.push(`${stat} +${delta}`);
        }
        const capped = state.level >= window.FateboundRPG.levelCap;
        const text = capped
            ? `+1,000 XP requested. Level ${state.level}/${window.FateboundRPG.levelCap} cap reached. No more levels can be gained; the core discards excess XP at the cap.`
            : `+1,000 XP! Level ${beforeLevel} → ${state.level} (${gainedLevels} level${gainedLevels === 1 ? "" : "s"} gained). Stat growth: ${gains.join(", ") || "none this time"}. XP remaining: ${state.xp}/${window.FateboundRPG.xpToNextLevel(state.level)}.`;
        showResult(text);
        if (worldDescription) worldDescription.textContent = OLD_ROAD_TURNS[9].description;
        if (worldSituation) worldSituation.textContent = "The test button can be pressed repeatedly. It never advances the turn; when ready, choose CONTINUE TO TURN 10.";
        if (worldTime) worldTime.textContent = `TURN 9/10 · LEVEL ${state.level}/${window.FateboundRPG.levelCap}`;
        if (worldChoices) {
            // Re-render the same turn; the XP action does not change scenarioState.turn.
            worldChoices.innerHTML = "";
            renderXPTestTurn();
        }
        saveScenarioCharacter();
    });
    makeChoiceButton("CONTINUE TO TURN 10", () => advanceTurn());
}

function renderEndingTurn() {
    makeChoiceButton("TELL THE WATCH CAPTAIN WHAT HAPPENED", () => {
        scenarioState.flags.ending = "honest";
        finishCampaign("You tell the watch captain about the traveler, the insignia, and the dangers on the road. He records your account. The Old Road test scenario is complete.");
    });
    makeChoiceButton("KEEP THE INSIGNIA SECRET", () => {
        scenarioState.flags.ending = "secret";
        finishCampaign("You keep part of the story to yourself. The captain lets you pass, but the insignia may matter again. The Old Road test scenario is complete.");
    });
    makeChoiceButton("LEAVE THE SETTLEMENT", () => {
        scenarioState.flags.ending = "leave";
        finishCampaign("You decline to remain in Greyhaven and continue toward the dark hills. The Old Road test scenario is complete.");
    });
}

function awardXP(amount, reason) {
    const character = getScenarioCharacter();
    if (!character || !window.FateboundRPG) return null;
    const result = window.FateboundRPG.addExperience(character, amount);
    saveScenarioCharacter();
    return result;
}

function finishCampaign(message) {
    if (!scenarioState || scenarioState.completed) return;
    scenarioState.completed = true;
    if (worldChoices) worldChoices.innerHTML = "";
    if (worldEndMessage) {
        worldEndMessage.textContent = "THE TEN-TURN SCENARIO IS COMPLETE.";
        worldEndMessage.classList.remove("hidden");
    }
    if (worldTime) worldTime.textContent = "Scenario complete";
    showResult(message);
    if (typeof showGameOver === "function") {
        showGameOver();
        const result = document.getElementById("worldGameOverResult");
        if (result) result.textContent = message;
    }
    saveScenarioCharacter();
}

if (worldLobbyButton) {
    worldLobbyButton.addEventListener("click", () => {
        if (typeof showLobby === "function") showLobby();
    });
}
