/* ==========================================
   FATEBOUND - WORLD
   ========================================== */


/* ==========================================
   PREDETERMINED SCENARIO
   ========================================== */

const currentScenario = {

    location: "THE OLD ROAD",

    time: "Late Afternoon",

    description:
        "You are travelling along an old road outside a small settlement. The road is quiet, and the sun is beginning to descend behind the distant hills.",

    situation:
        "Ahead, you notice a wounded traveler lying beside a broken wooden cart. Blood stains the road around him. From the nearby forest, you hear the faint sound of something moving between the trees.",

    choices: [

        {
            text: "HELP THE TRAVELER",

            result:
                "You approach the wounded traveler carefully. He looks up at you with exhausted eyes and reaches toward you. \"Please... help me.\" You notice that his wounds appear to have come from something far more dangerous than a simple robbery."
        },

        {
            text: "SEARCH THE CART",

            result:
                "You ignore the traveler for a moment and inspect the broken cart. Most of its contents have been scattered across the road. Beneath a torn cloth, you discover an unfamiliar metal insignia."
        },

        {
            text: "INVESTIGATE THE FOREST",

            result:
                "You turn your attention toward the forest. The movement stops immediately. For a moment everything is completely silent. Then you hear a branch snap somewhere deep among the trees."
        },

        {
            text: "WALK PAST",

            result:
                "You decide not to involve yourself. As you continue down the road, you hear the wounded traveler calling after you. You do not turn around."
        }

    ]

};


/* ==========================================
   ELEMENTS
   ========================================== */

const worldLocation =
    document.getElementById("worldLocation");


const worldTime =
    document.getElementById("worldTime");


const worldDescription =
    document.getElementById("worldDescription");


const worldSituation =
    document.getElementById("worldSituation");


const worldChoices =
    document.getElementById("worldChoices");


const worldResult =
    document.getElementById("worldResult");


const worldResultText =
    document.getElementById("worldResultText");


const worldEndMessage =
    document.getElementById("worldEndMessage");




/* ==========================================
   STATE
   ========================================== */

let worldTurnCompleted = false;


/* ==========================================
   START WORLD
   ========================================== */

function startWorld() {

    worldTurnCompleted = false;


    /* =========================
       RESET RESULT
       ========================= */

    if (worldResult) {

        worldResult.classList.add("hidden");

    }


    if (worldEndMessage) {

        worldEndMessage.classList.add("hidden");

    }


    if (worldGameOver) {

        worldGameOver.classList.add("hidden");

    }


    /* =========================
       CLEAR OLD CHOICES
       ========================= */

    if (worldChoices) {

        worldChoices.innerHTML = "";

        worldChoices.classList.remove("hidden");

    }


    /* =========================
       LOAD SCENARIO
       ========================= */

    if (worldLocation) {

        worldLocation.textContent =
            currentScenario.location;

    }


    if (worldTime) {

        worldTime.textContent =
            currentScenario.time;

    }


    if (worldDescription) {

        worldDescription.textContent =
            currentScenario.description;

    }


    if (worldSituation) {

        worldSituation.textContent =
            currentScenario.situation;

    }


    /* =========================
       CREATE CHOICES
       ========================= */

    createWorldChoices();


    /* =========================
       SHOW WORLD
       ========================= */

    showWorld();

}


/* ==========================================
   CREATE CHOICES
   ========================================== */

function createWorldChoices() {

    if (!worldChoices) {
        return;
    }


    currentScenario.choices.forEach(
        (choice, index) => {

            const button =
                document.createElement("button");


            button.className =
                "menu-button world-choice-button";


            button.textContent =
                choice.text;


            button.addEventListener(
                "click",
                () => {

                    chooseWorldAction(index);

                }
            );


            worldChoices.appendChild(button);

        }
    );

}


/* ==========================================
   CHOOSE ACTION
   ========================================== */

function chooseWorldAction(index) {

    if (worldTurnCompleted) {
        return;
    }


    const choice =
        currentScenario.choices[index];


    if (!choice) {
        return;
    }


    worldTurnCompleted = true;


    /* =========================
       DISABLE CHOICES
       ========================= */

    const buttons =
        worldChoices.querySelectorAll("button");


    buttons.forEach(
        button => {

            button.disabled = true;

        }
    );


    /* =========================
       SHOW RESULT
       ========================= */

    if (worldResultText) {

        worldResultText.textContent =
            choice.result;

    }


    if (worldGameOverResult) {

        worldGameOverResult.textContent =
            choice.result;

    }


    /* =========================
       END TURN
       ========================= */

    if (worldEndMessage) {

        worldEndMessage.textContent =
            "THE TURN HAS ENDED.";

    }


    if (worldChoices) {

        worldChoices.classList.add("hidden");

    }


    if (worldResult) {

        worldResult.classList.add("hidden");

    }


    if (worldEndMessage) {

        worldEndMessage.classList.add("hidden");

    }


    if (worldGameOver) {

        worldGameOver.classList.remove("hidden");

    }

}



/* ==========================================
   GAME OVER ACTIONS
   ========================================== */

if (worldViewStatusButton) {

    worldViewStatusButton.addEventListener(
        "click",
        () => {

            if (typeof showCharacterStatusOverlay === "function") {
                showCharacterStatusOverlay();
            }

        }
    );

}


if (worldEndCampaignButton) {

    worldEndCampaignButton.addEventListener(
        "click",
        () => {

            if (typeof endCampaignToLobby === "function") {
                endCampaignToLobby();
            }

        }
    );

}
