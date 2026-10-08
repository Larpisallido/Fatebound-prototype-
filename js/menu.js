/* ==========================================
   FATEBOUND - IN-GAME MENU
   ========================================== */


const gameMenuButton =
    document.getElementById("gameMenuButton");

const gameMenuOverlay =
    document.getElementById("gameMenuOverlay");

const gameMenuCloseButton =
    document.getElementById("gameMenuCloseButton");

const gameMenuSettingsButton =
    document.getElementById("gameMenuSettingsButton");

const gameMenuSaveButton =
    document.getElementById("gameMenuSaveButton");

const gameMenuLobbyButton =
    document.getElementById("gameMenuLobbyButton");


const characterStatusOverlay =
    document.getElementById("characterStatusOverlay");

const characterStatusOverlayCloseButton =
    document.getElementById("characterStatusOverlayCloseButton");

const characterStatusOverlayContent =
    document.getElementById("characterStatusOverlayContent");


/* ==========================================
   MENU VISIBILITY
   ========================================== */

function showGameMenuButton() {

    if (gameMenuButton) {
        gameMenuButton.classList.remove("hidden");
    }

}


function hideGameMenuButton() {

    if (gameMenuButton) {
        gameMenuButton.classList.add("hidden");
    }

}


function openGameMenu() {

    if (gameMenuOverlay) {
        gameMenuOverlay.classList.remove("hidden");
    }

}


function closeGameMenu() {

    if (gameMenuOverlay) {
        gameMenuOverlay.classList.add("hidden");
    }

}


/* ==========================================
   CHARACTER STATUS OVERLAY
   ========================================== */

function formatOverlayStat(stat) {

    if (typeof stat === "number") {
        return Number.isInteger(stat)
            ? stat
            : stat.toFixed(1);
    }

    return "—";

}


function getOverlayGrade(stat) {

    return currentCharacter?.potential?.[stat]?.grade || "—";

}


function renderCharacterStatusOverlay() {

    if (!characterStatusOverlayContent || !currentCharacter) {
        return;
    }


    const stats = [
        ["STR", "STRENGTH"],
        ["DEX", "DEXTERITY"],
        ["CON", "CONSTITUTION"],
        ["INT", "INTELLIGENCE"],
        ["WIS", "WISDOM"],
        ["CHA", "CHARISMA"]
    ];


    const hp =
        typeof currentCharacter.hp === "number"
            ? currentCharacter.hp
            : 100;

    const maxHp =
        typeof currentCharacter.maxHp === "number"
            ? currentCharacter.maxHp
            : 100;

    const level =
        typeof currentCharacter.level === "number"
            ? currentCharacter.level
            : 1;

    const initialStats =
        currentCharacter.initialStats || {};

    const age =
        currentCharacter.age?.result ?? "—";

    const appearance =
        currentCharacter.appearance?.result ?? "—";

    const origin =
        currentCharacter.origin || "UNKNOWN";

    const luck =
        typeof currentCharacter.luck === "number"
            ? currentCharacter.luck
            : "—";


    let statHTML = "";

    stats.forEach(([key, name]) => {

        statHTML += `
            <div class="status-overlay-stat">
                <span class="status-overlay-stat-name">${name}</span>
                <strong class="status-overlay-stat-value">
                    ${formatOverlayStat(initialStats[key])}
                </strong>
                <span class="status-overlay-stat-grade">
                    ${getOverlayGrade(key)}
                </span>
            </div>
        `;

    });


    characterStatusOverlayContent.innerHTML = `

        <div class="status-overlay-vitals">

            <div class="status-overlay-vital">
                <span>HP</span>
                <strong>${hp} / ${maxHp}</strong>
            </div>

            <div class="status-overlay-vital">
                <span>LVL</span>
                <strong>${level}</strong>
            </div>

        </div>

        <div class="status-overlay-divider"></div>

        <div class="status-overlay-stats">
            ${statHTML}
        </div>

        <div class="status-overlay-divider"></div>

        <div class="status-overlay-details">

            <div class="status-overlay-detail">
                <span>ORIGIN</span>
                <strong>${origin}</strong>
            </div>

            <div class="status-overlay-detail">
                <span>AGE</span>
                <strong>${age}</strong>
            </div>

            <div class="status-overlay-detail">
                <span>APPEARANCE</span>
                <strong>${appearance}</strong>
            </div>

            <div class="status-overlay-detail">
                <span>LUCK</span>
                <strong>${luck}</strong>
            </div>

        </div>

    `;

}


function showCharacterStatusOverlay() {

    renderCharacterStatusOverlay();

    if (characterStatusOverlay) {
        characterStatusOverlay.classList.remove("hidden");
    }

}


function hideCharacterStatusOverlay() {

    if (characterStatusOverlay) {
        characterStatusOverlay.classList.add("hidden");
    }

}


/* ==========================================
   END CAMPAIGN
   ========================================== */

function endCampaignToLobby() {

    closeGameMenu();

    hideCharacterStatusOverlay();

    hideGameMenuButton();

    if (typeof resetCharacterStatus === "function") {
        resetCharacterStatus();
    }

    if (typeof resetFateDetails === "function") {
        resetFateDetails();
    }

    if (typeof resetStatPotential === "function") {
        resetStatPotential();
    }

    if (typeof resetCharacterCreation === "function") {
        resetCharacterCreation();
    }

    if (typeof currentCharacter !== "undefined") {
        currentCharacter = null;
    }

    showLobby();

}


/* ==========================================
   EVENTS
   ========================================== */

if (gameMenuButton) {

    gameMenuButton.addEventListener(
        "click",
        openGameMenu
    );

}


if (gameMenuCloseButton) {

    gameMenuCloseButton.addEventListener(
        "click",
        closeGameMenu
    );

}


if (gameMenuOverlay) {

    gameMenuOverlay.addEventListener(
        "click",
        event => {

            if (event.target === gameMenuOverlay) {
                closeGameMenu();
            }

        }
    );

}


if (gameMenuSettingsButton) {

    gameMenuSettingsButton.addEventListener(
        "click",
        () => {
            // Reserved for future settings.
        }
    );

}


if (gameMenuSaveButton) {

    gameMenuSaveButton.addEventListener(
        "click",
        () => {
            // Saving will be implemented later.
        }
    );

}


if (gameMenuLobbyButton) {

    gameMenuLobbyButton.addEventListener(
        "click",
        endCampaignToLobby
    );

}


if (characterStatusOverlayCloseButton) {

    characterStatusOverlayCloseButton.addEventListener(
        "click",
        hideCharacterStatusOverlay
    );

}


if (characterStatusOverlay) {

    characterStatusOverlay.addEventListener(
        "click",
        event => {

            if (event.target === characterStatusOverlay) {
                hideCharacterStatusOverlay();
            }

        }
    );

}
