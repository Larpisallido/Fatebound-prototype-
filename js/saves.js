/* ==========================================
   FATEBOUND - SAVE SYSTEM
   ========================================== */

const SAVE_KEY = "fatebound_save";


function saveGame(gameData) {

    localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(gameData)
    );

}


function loadGame() {

    const savedGame =
        localStorage.getItem(SAVE_KEY);

    if (!savedGame) {
        return null;
    }

    try {

        return JSON.parse(savedGame);

    } catch (error) {

        console.error(
            "Failed to load Fatebound save:",
            error
        );

        return null;

    }

}


function hasSave() {

    return loadGame() !== null;

}
