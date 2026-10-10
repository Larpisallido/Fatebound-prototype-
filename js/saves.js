/* ==========================================
   FATEBOUND - VERSIONED SAVE SYSTEM
   Backward-compatible with legacy character-only saves.
   ========================================== */

const SAVE_KEY = "fatebound_save";
const SAVE_SCHEMA_VERSION = 2;

function normalizeSavedGame(parsed) {
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;

    // Current versioned format.
    if (parsed.schemaVersion === SAVE_SCHEMA_VERSION && parsed.character && typeof parsed.character === "object") {
        return {
            schemaVersion: SAVE_SCHEMA_VERSION,
            savedAt: typeof parsed.savedAt === "string" ? parsed.savedAt : null,
            character: parsed.character,
            world: parsed.world && typeof parsed.world === "object" ? parsed.world : null
        };
    }

    // Accept an envelope from a future/older schema when its character is intact.
    if (parsed.character && typeof parsed.character === "object") {
        return {
            schemaVersion: SAVE_SCHEMA_VERSION,
            savedAt: typeof parsed.savedAt === "string" ? parsed.savedAt : null,
            character: parsed.character,
            world: parsed.world && typeof parsed.world === "object" ? parsed.world : null
        };
    }

    // Migrate the original format, which stored the character object directly.
    return {
        schemaVersion: SAVE_SCHEMA_VERSION,
        savedAt: null,
        character: parsed,
        world: null
    };
}

function loadGame() {
    let raw;
    try {
        raw = localStorage.getItem(SAVE_KEY);
    } catch (error) {
        console.error("Fatebound could not access local storage:", error);
        return null;
    }

    if (!raw) return null;

    try {
        return normalizeSavedGame(JSON.parse(raw));
    } catch (error) {
        console.error("Failed to load Fatebound save:", error);
        return null;
    }
}

function saveGame(gameData, options) {
    if (!gameData || typeof gameData !== "object" || Array.isArray(gameData)) {
        console.error("Fatebound save skipped: character data is missing or invalid.");
        return false;
    }

    const settings = options || {};
    const existing = settings.resetWorld ? null : loadGame();
    let world = existing && existing.world ? existing.world : null;

    // The world module supplies a snapshot only after a scenario has started.
    // Character-creation saves therefore won't erase the current adventure.
    if (!settings.resetWorld && typeof getWorldSaveState === "function") {
        try {
            const currentWorld = getWorldSaveState();
            if (currentWorld) world = currentWorld;
        } catch (error) {
            console.error("Could not snapshot Fatebound world progress:", error);
        }
    }

    const payload = {
        schemaVersion: SAVE_SCHEMA_VERSION,
        savedAt: new Date().toISOString(),
        character: gameData.character && typeof gameData.character === "object" ? gameData.character : gameData,
        world: settings.resetWorld ? null : world
    };

    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
        return true;
    } catch (error) {
        console.error("Failed to save Fatebound:", error);
        return false;
    }
}

function hasSave() {
    const save = loadGame();
    return !!(save && save.character && typeof save.character === "object");
}

function clearSaveGame() {
    try {
        localStorage.removeItem(SAVE_KEY);
        return true;
    } catch (error) {
        console.error("Failed to clear Fatebound save:", error);
        return false;
    }
}
