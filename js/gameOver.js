/* ==========================================
   FATEBOUND - GAME OVER / STATUS OVERLAY
   Uses existing character data only. HP and Level remain placeholders
   until those systems exist in the game.
   ========================================== */

const worldViewStatusButton = document.getElementById("worldViewStatusButton");
const worldEndCampaignButton = document.getElementById("worldEndCampaignButton");
const characterStatusOverlay = document.getElementById("characterStatusOverlay");
const characterStatusOverlayContent = document.getElementById("characterStatusOverlayContent");
const characterStatusOverlayCloseButton = document.getElementById("characterStatusOverlayCloseButton");
const worldGameOverResult = document.getElementById("worldGameOverResult");
const gameMenuOverlayForStatus = document.getElementById("gameMenuOverlay");

function showGameOver() {
    const gameOver = document.getElementById("worldGameOver");
    if (!gameOver) return;

    if (worldGameOverResult) {
        worldGameOverResult.textContent =
            "Your actions for this turn have reached their conclusion. Fate now moves forward.";
    }

    gameOver.classList.remove("hidden");
}

function renderGameOverStatus() {
    if (!characterStatusOverlayContent) return;

    const character = typeof currentCharacter !== "undefined" ? currentCharacter : null;
    const stats = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
    const safeText = value => {
        if (value === undefined || value === null || value === "") return "—";
        return String(value);
    };

    const vitalMarkup = `
        <div class="status-overlay-vitals">
            <div class="status-overlay-vital">
                <span>HP</span>
                <strong>— / —</strong>
            </div>
            <div class="status-overlay-vital">
                <span>LVL</span>
                <strong>—</strong>
            </div>
        </div>
    `;

    const statMarkup = stats.map(stat => {
        const value = character?.initialStats?.[stat];
        const grade = character?.potential?.[stat]?.grade;
        return `
            <div class="status-overlay-stat">
                <span class="status-overlay-stat-name">${stat}</span>
                <strong class="status-overlay-stat-value">${safeText(value)}</strong>
                <span class="status-overlay-stat-grade">${safeText(grade)}</span>
            </div>
        `;
    }).join("");

    const age = character?.age?.result;
    const appearance = character?.appearance?.result;
    const origin = character?.origin;
    const luck = character?.luck;

    const detailMarkup = [
        ["ORIGIN", origin],
        ["AGE", age],
        ["APPEARANCE", appearance],
        ["LUCK", luck]
    ].map(([label, value]) => `
        <div class="status-overlay-detail">
            <span>${label}</span>
            <strong>${safeText(value)}</strong>
        </div>
    `).join("");

    characterStatusOverlayContent.innerHTML = `
        ${vitalMarkup}
        <div class="status-overlay-divider"></div>
        <div class="status-overlay-stats">${statMarkup}</div>
        <div class="status-overlay-divider"></div>
        <div class="status-overlay-details">${detailMarkup}</div>
    `;
}

function openCharacterStatusOverlay() {
    renderGameOverStatus();
    if (characterStatusOverlay) characterStatusOverlay.classList.remove("hidden");
}

function closeCharacterStatusOverlay() {
    if (characterStatusOverlay) characterStatusOverlay.classList.add("hidden");
}

if (worldViewStatusButton) {
    worldViewStatusButton.addEventListener("click", openCharacterStatusOverlay);
}

if (characterStatusOverlayCloseButton) {
    characterStatusOverlayCloseButton.addEventListener("click", closeCharacterStatusOverlay);
}

if (characterStatusOverlay) {
    characterStatusOverlay.addEventListener("click", event => {
        if (event.target === characterStatusOverlay) closeCharacterStatusOverlay();
    });
}

if (worldEndCampaignButton) {
    worldEndCampaignButton.addEventListener("click", () => {
        closeCharacterStatusOverlay();
        if (gameMenuOverlayForStatus) gameMenuOverlayForStatus.classList.add("hidden");

        if (typeof resetCharacterStatus === "function") resetCharacterStatus();
        if (typeof resetFateDetails === "function") resetFateDetails();
        if (typeof resetStatPotential === "function") resetStatPotential();
        if (typeof resetCharacterCreation === "function") resetCharacterCreation();

        localStorage.removeItem("fatebound_save");

        const gameOver = document.getElementById("worldGameOver");
        if (gameOver) gameOver.classList.add("hidden");

        const menuButton = document.getElementById("gameMenuButton");
        if (menuButton) menuButton.classList.add("hidden");

        if (typeof showLobby === "function") showLobby();
    });
}
