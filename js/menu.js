/* FATEBOUND — menu, Game Over, and post-turn character status */
const gameMenuButton = document.getElementById("gameMenuButton");
const gameMenuOverlay = document.getElementById("gameMenuOverlay");
const gameMenuCloseButton = document.getElementById("gameMenuCloseButton");
const gameMenuResumeButton = document.getElementById("gameMenuResumeButton");
const gameMenuViewStatusButton = document.getElementById("gameMenuViewStatusButton");
const gameMenuSettingsButton = document.getElementById("gameMenuSettingsButton");
const gameMenuSaveButton = document.getElementById("gameMenuSaveButton");
const gameMenuLobbyButton = document.getElementById("gameMenuLobbyButton");
const characterStatusOverlay = document.getElementById("characterStatusOverlay");
const characterStatusOverlayCloseButton = document.getElementById("characterStatusOverlayCloseButton");
const characterStatusOverlayContent = document.getElementById("characterStatusOverlayContent");
const worldViewStatusButton = document.getElementById("worldViewStatusButton");
const worldEndCampaignButton = document.getElementById("worldEndCampaignButton");
const worldGameOverResult = document.getElementById("worldGameOverResult");

function showGameMenuButton() {
  if (gameMenuButton) gameMenuButton.classList.remove("hidden");
}
function hideGameMenuButton() {
  if (gameMenuButton) gameMenuButton.classList.add("hidden");
}
function openGameMenu() {
  if (gameMenuOverlay) gameMenuOverlay.classList.remove("hidden");
}
function closeGameMenu() {
  if (gameMenuOverlay) gameMenuOverlay.classList.add("hidden");
}
function showGameOver() {
  const panel = document.getElementById("worldGameOver");
  if (worldGameOverResult) {
    worldGameOverResult.textContent = "Your actions for this turn have reached their conclusion. Fate now moves forward.";
  }
  if (panel) panel.classList.remove("hidden");
}
function safeStatusText(value) {
  if (value === undefined || value === null || value === "") return "—";
  return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}

/*
 * Upgrade old character saves to the RPG state once. Existing origin,
 * age, appearance, stats and potential are preserved. The migration only
 * adds missing RPG fields and then persists the migrated save.
 */
function getRpgCharacterState() {
  const character = typeof currentCharacter !== "undefined" ? currentCharacter : null;
  if (!character) return null;
  if (typeof window.FateboundRPG === "undefined") return character;

  const wasMigrated = character.rpgCoreVersion !== window.FateboundRPG.version;
  const state = window.FateboundRPG.createCharacterState(character);

  // Preserve existing resources on already-initialized characters; a legacy
  // save without resources receives full starting resources from the core.
  if (wasMigrated) {
    window.FateboundRPG.refreshDerived(state, character.hp !== undefined);
    state.rpgCoreVersion = window.FateboundRPG.version;
    if (typeof canSaveAdventure === "function" && canSaveAdventure() && typeof saveGame === "function") saveGame(state);
    // Keep the shared in-memory object used by the existing scripts.
    Object.keys(character).forEach(key => delete character[key]);
    Object.assign(character, state);
    return character;
  }
  return character;
}

function openCharacterStatusOverlay() {
  if (!characterStatusOverlay || !characterStatusOverlayContent) return;
  const character = getRpgCharacterState();
  if (!character) {
    characterStatusOverlayContent.innerHTML = `<p class="status-overlay-detail">No character data is available yet.</p>`;
    characterStatusOverlay.classList.remove("hidden");
    return;
  }

  const core = window.FateboundRPG;
  const derived = character.derived || core.derivedStats(character);
  const hp = Number.isFinite(Number(character.hp)) ? Number(character.hp) : derived.maxHP;
  const mp = Number.isFinite(Number(character.mp)) ? Number(character.mp) : derived.maxMP;
  const stamina = Number.isFinite(Number(character.stamina)) ? Number(character.stamina) : derived.maxStamina;
  const xp = Math.max(0, Number(character.xp) || 0);
  const level = Math.max(1, Number(character.level) || 1);
  const xpRequired = core.xpToNextLevel(level);
  const hpPercent = derived.maxHP ? Math.max(0, Math.min(100, hp / derived.maxHP * 100)) : 0;
  const xpPercent = xpRequired ? Math.max(0, Math.min(100, xp / xpRequired * 100)) : 100;
  const statMarkup = core.coreStats.map(stat => {
    const value = character.initialStats && character.initialStats[stat];
    const grade = character.potential && character.potential[stat] && character.potential[stat].grade;
    return `<div class="status-overlay-stat"><span class="status-overlay-stat-name">${stat}</span><strong class="status-overlay-stat-value">${safeStatusText(value)}</strong><span class="status-overlay-stat-grade">${safeStatusText(grade)}</span></div>`;
  }).join("");

  const originValue = character.origin;
  const originName = typeof originValue === "object" ? (originValue?.name || originValue?.title || "—") : originValue;
  const characterName = character.name || [character.firstName, character.familyName].filter(Boolean).join(" ") || "Unnamed Character";
  const details = [
    ["ORIGIN", originName],
    ["AGE", character.age && character.age.result],
    ["APPEARANCE", character.appearance && character.appearance.result],
    ["CLASS", character.class && character.class.name || "Unclassed"],
    ["XP", xpRequired ? `${xp} / ${xpRequired}` : "MAX LEVEL"],
    ["MP", `${mp} / ${derived.maxMP}`],
    ["STAMINA", `${stamina} / ${derived.maxStamina}`],
    ["LUCK", character.luck]
  ].map(([label, value]) => `<div class="status-overlay-detail"><span>${label}</span><strong>${safeStatusText(value)}</strong></div>`).join("");

  characterStatusOverlayContent.innerHTML = `
    <div class="status-overlay-character-name">${safeStatusText(characterName)}</div>
    <div class="status-overlay-vitals">
      <div class="status-overlay-vital">
        <span>HP</span><strong>${hp} / ${derived.maxHP}</strong>
        <div class="status-overlay-bar"><span class="status-overlay-bar-fill" style="width:${hpPercent}%"></span></div>
      </div>
      <div class="status-overlay-vital">
        <span>LVL ${level}</span><strong>${xpRequired ? `${Math.max(0, xpRequired - xp)} XP TO NEXT` : "MAX LEVEL"}</strong>
        <div class="status-overlay-bar"><span class="status-overlay-bar-fill" style="width:${xpPercent}%"></span></div>
      </div>
    </div>
    <div class="status-overlay-divider"></div>
    <div class="status-overlay-stats">${statMarkup}</div>
    <div class="status-overlay-divider"></div>
    <div class="status-overlay-details">${details}</div>`;
  characterStatusOverlay.classList.remove("hidden");
}

function closeCharacterStatusOverlay() {
  if (characterStatusOverlay) characterStatusOverlay.classList.add("hidden");
}
function endCampaignToLobby() {
  closeGameMenu();
  closeCharacterStatusOverlay();
  hideGameMenuButton();
  if (typeof resetCharacterStatus === "function") resetCharacterStatus();
  if (typeof resetFateDetails === "function") resetFateDetails();
  if (typeof resetStatPotential === "function") resetStatPotential();
  if (typeof resetCharacterCreation === "function") resetCharacterCreation();
  if (typeof currentCharacter !== "undefined") currentCharacter = null;
  // Keep the saved adventure so Continue can resume it from the lobby.
  const panel = document.getElementById("worldGameOver");
  if (panel) panel.classList.add("hidden");
  if (typeof showLobby === "function") showLobby();
}
if (gameMenuButton) gameMenuButton.addEventListener("click", openGameMenu);
if (gameMenuCloseButton) gameMenuCloseButton.addEventListener("click", closeGameMenu);
if (gameMenuResumeButton) gameMenuResumeButton.addEventListener("click", closeGameMenu);
if (gameMenuOverlay) gameMenuOverlay.addEventListener("click", event => { if (event.target === gameMenuOverlay) closeGameMenu(); });
if (gameMenuViewStatusButton) gameMenuViewStatusButton.addEventListener("click", () => { closeGameMenu(); openCharacterStatusOverlay(); });
if (gameMenuSettingsButton) gameMenuSettingsButton.addEventListener("click", () => {});
if (gameMenuSaveButton) gameMenuSaveButton.addEventListener("click", () => {
  // Saving during character creation would let players reroll by reloading.
  if (typeof canSaveAdventure !== "function" || !canSaveAdventure()) {
    alert("Can’t save during character creation. You can save after entering the world.");
    return;
  }

  try {
    const character = getRpgCharacterState();
    if (!character || typeof saveGame !== "function") {
      alert("Unable to save: character data or the save system is unavailable.");
      return;
    }

    if (saveGame(character)) {
      alert("Adventure saved successfully!");
    } else {
      alert("Adventure could not be saved. Check browser storage settings and try again.");
    }
  } catch (error) {
    console.error("Fatebound save error:", error);
    alert("Adventure could not be saved. Check the browser console for details.");
  }
});
if (gameMenuLobbyButton) gameMenuLobbyButton.addEventListener("click", endCampaignToLobby);
if (worldViewStatusButton) worldViewStatusButton.addEventListener("click", openCharacterStatusOverlay);
if (worldEndCampaignButton) worldEndCampaignButton.addEventListener("click", endCampaignToLobby);
if (characterStatusOverlayCloseButton) characterStatusOverlayCloseButton.addEventListener("click", closeCharacterStatusOverlay);
if (characterStatusOverlay) characterStatusOverlay.addEventListener("click", event => { if (event.target === characterStatusOverlay) closeCharacterStatusOverlay(); });
