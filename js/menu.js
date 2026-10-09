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
  return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;", "'":"&#39;"}[ch]));
}
function openCharacterStatusOverlay() {
  if (!characterStatusOverlay || !characterStatusOverlayContent) return;
  const character = typeof currentCharacter !== "undefined" ? currentCharacter : null;
  const stats = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];
  const statMarkup = stats.map(stat => {
    const value = character?.initialStats?.[stat];
    const grade = character?.potential?.[stat]?.grade;
    return `<div class="status-overlay-stat"><span class="status-overlay-stat-name">${stat}</span><strong class="status-overlay-stat-value">${safeStatusText(value)}</strong><span class="status-overlay-stat-grade">${safeStatusText(grade)}</span></div>`;
  }).join("");
  const originValue = character?.origin;
  const originName = typeof originValue === "object" ? (originValue?.name || originValue?.title || "—") : originValue;
  const details = [
    ["ORIGIN", originName],
    ["AGE", character?.age?.result],
    ["APPEARANCE", character?.appearance?.result],
    ["LUCK", character?.luck]
  ].map(([label, value]) => `<div class="status-overlay-detail"><span>${label}</span><strong>${safeStatusText(value)}</strong></div>`).join("");
  characterStatusOverlayContent.innerHTML = `
    <div class="status-overlay-vitals">
      <div class="status-overlay-vital"><span>HP</span><strong>— / —</strong><div class="status-overlay-bar"><span class="status-overlay-bar-fill"></span></div></div>
      <div class="status-overlay-vital"><span>LVL</span><strong>—</strong><div class="status-overlay-bar"><span class="status-overlay-bar-fill"></span></div></div>
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
  try { localStorage.removeItem("fatebound_save"); } catch (_) {}
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
if (gameMenuSaveButton) gameMenuSaveButton.addEventListener("click", () => {});
if (gameMenuLobbyButton) gameMenuLobbyButton.addEventListener("click", endCampaignToLobby);
if (worldViewStatusButton) worldViewStatusButton.addEventListener("click", openCharacterStatusOverlay);
if (worldEndCampaignButton) worldEndCampaignButton.addEventListener("click", endCampaignToLobby);
if (characterStatusOverlayCloseButton) characterStatusOverlayCloseButton.addEventListener("click", closeCharacterStatusOverlay);
if (characterStatusOverlay) characterStatusOverlay.addEventListener("click", event => { if (event.target === characterStatusOverlay) closeCharacterStatusOverlay(); });
