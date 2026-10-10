/* ==========================================
   FATEBOUND - LOBBY
   ========================================== */

const newGameButton = document.getElementById("newGameButton");
const continueButton = document.getElementById("continueButton");
const settingsButton = document.getElementById("settingsButton");
const fateboundModeButton = document.getElementById("fateboundModeButton");
const classicModeButton = document.getElementById("classicModeButton");
const newGameBackButton = document.getElementById("newGameBackButton");
const continueBackButton = document.getElementById("continueBackButton");

if (newGameButton) newGameButton.addEventListener("click", showNewGame);
if (newGameBackButton) newGameBackButton.addEventListener("click", showLobby);

if (fateboundModeButton) {
    fateboundModeButton.addEventListener("click", () => {
        // Starting a new character is an explicit choice to replace the old run.
        if (typeof clearSaveGame === "function") clearSaveGame();
        if (typeof showGameMenuButton === "function") showGameMenuButton();
        startFateboundCreation();
    });
}

/* Classic Mode is not implemented yet: do not save or navigate to the game. */
if (classicModeButton) {
    classicModeButton.addEventListener("click", () => {
        alert("Classic Mode is a work in progress.");
    });
}

if (continueButton) {
    continueButton.addEventListener("click", () => {
        const save = typeof loadGame === "function" ? loadGame() : null;
        if (!save || !save.character) {
            showContinue();
            return;
        }

        // currentCharacter is a top-level lexical binding declared by characterCreation.js.
        if (typeof currentCharacter !== "undefined") {
            currentCharacter = save.character;
        }

        if (save.world && typeof restoreWorldFromSave === "function") {
            restoreWorldFromSave(save.world);
        } else if (typeof startWorld === "function") {
            // Legacy character-only saves resume at the beginning of the scenario.
            startWorld();
        } else {
            showGame();
        }
    });
}

if (continueBackButton) continueBackButton.addEventListener("click", showLobby);

if (settingsButton) {
    settingsButton.addEventListener("click", () => {
        alert("Settings will be added later.");
    });
}
