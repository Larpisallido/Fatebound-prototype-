/* ==========================================
   FATEBOUND - NAVIGATION
   ========================================== */

const screens = {

    lobby:
        document.getElementById("lobby"),

    newGame:
        document.getElementById("newGameScreen"),

    characterCreation:
        document.getElementById("characterCreationScreen"),

    statPotential:
        document.getElementById("statPotentialScreen"),

    fateDetails:
        document.getElementById("fateDetailsScreen"),

    characterStatus:
        document.getElementById("characterStatusScreen"),

    world:
        document.getElementById("worldScreen"),

    continue:
        document.getElementById("continueScreen"),

    game:
        document.getElementById("gameScreen")

};


/* ==========================================
   HIDE ALL SCREENS
   ========================================== */

function hideAllScreens() {

    Object.values(screens).forEach(screen => {

        if (screen) {
            screen.classList.add("hidden");
        }

    });

}


/* ==========================================
   SHOW SCREEN
   ========================================== */

function showScreen(screen) {

    hideAllScreens();

    if (screen) {
        screen.classList.remove("hidden");
    }

}


/* ==========================================
   NAVIGATION FUNCTIONS
   ========================================== */

function showLobby() {
    showScreen(screens.lobby);
}


function showNewGame() {
    showScreen(screens.newGame);
}


function showCharacterCreation() {
    showScreen(screens.characterCreation);
}


function showStatPotential() {
    showScreen(screens.statPotential);
}


function showFateDetails() {
    showScreen(screens.fateDetails);
}


function showCharacterStatus() {
    showScreen(screens.characterStatus);
}


function showWorld() {
    showScreen(screens.world);
}


function showContinue() {
    showScreen(screens.continue);
}


function showGame() {
    showScreen(screens.game);
}
