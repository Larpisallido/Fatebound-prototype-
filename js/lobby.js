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
        if (hasSave()) showGame();
        else showContinue();
    });
}

if (continueBackButton) continueBackButton.addEventListener("click", showLobby);

if (settingsButton) {
    settingsButton.addEventListener("click", () => {
        alert("Settings will be added later.");
    });
}
