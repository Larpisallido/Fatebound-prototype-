/* ==========================================
   FATEBOUND - CHARACTER CREATION
   ========================================== */


/* ==========================================
   ELEMENTS
   ========================================== */

const rollOriginButton =
    document.getElementById("rollOriginButton");

const originContinueButton =
    document.getElementById("originContinueButton");

const originResult =
    document.getElementById("originResult");

const originName =
    document.getElementById("originName");

const originDescription =
    document.getElementById("originDescription");

const originSkill =
    document.getElementById("originSkill");

const originRollDisplay =
    document.getElementById("originRollDisplay");

const originRollNumber =
    document.getElementById("originRollNumber");

const rollStatus =
    document.getElementById("rollStatus");

const characterCreationLobbyButton =
    document.getElementById(
        "characterCreationLobbyButton"
    );


/* ==========================================
   CHARACTER DATA
   ========================================== */

let currentCharacter = null;

let rolling = false;


/* ==========================================
   RESET
   ========================================== */

function resetCharacterCreation() {

    currentCharacter = null;

    rolling = false;


    if (originResult) {
        originResult.classList.add("hidden");
    }


    if (originRollDisplay) {
        originRollDisplay.classList.add("hidden");
    }


    if (rollOriginButton) {

        rollOriginButton.classList.remove("hidden");

        rollOriginButton.disabled = false;

        rollOriginButton.classList.remove(
            "rolling-button"
        );

    }


    if (originContinueButton) {
        originContinueButton.classList.add("hidden");
    }


    if (originRollNumber) {

        originRollNumber.textContent = "?";

        originRollNumber.classList.remove(
            "origin-final"
        );

    }


    if (rollStatus) {
        rollStatus.textContent = "Awaiting Fate...";
    }

}


/* ==========================================
   START FATEBOUND CREATION
   ========================================== */

function startFateboundCreation() {

    resetCharacterCreation();

    showCharacterCreation();

}


/* ==========================================
   ROLL ORIGIN
   ========================================== */

if (rollOriginButton) {

    rollOriginButton.addEventListener(
        "click",
        () => {

            if (rolling) {
                return;
            }


            rolling = true;


            /* =========================
               HIDE OLD RESULT
               ========================= */

            originResult.classList.add("hidden");

            originContinueButton.classList.add(
                "hidden"
            );


            /* =========================
               SHOW ROLL DISPLAY
               ========================= */

            originRollDisplay.classList.remove(
                "hidden"
            );


            rollOriginButton.disabled = true;

            rollOriginButton.classList.add(
                "rolling-button"
            );


            rollStatus.textContent =
                "Fate is deciding...";


            /* =========================
               DETERMINE REAL RESULT
               ========================= */

            const result = rollOrigin();


            /* =========================
               ANIMATION SETTINGS
               ========================= */

            const duration = 2400;

            const startTime =
                performance.now();

            let lastNumber = 0;


            /* =========================
               ROLL ANIMATION
               ========================= */

            function animateRoll(currentTime) {

                const elapsed =
                    currentTime - startTime;


                const progress =
                    Math.min(
                        elapsed / duration,
                        1
                    );


                const eased =
                    1 -
                    Math.pow(
                        1 - progress,
                        3
                    );


                if (progress < 1) {

                    const speed =
                        Math.max(
                            35,
                            180 * (1 - eased)
                        );


                    const now =
                        performance.now();


                    if (
                        now - lastNumber >=
                        speed
                    ) {

                        const randomNumber =
                            Math.floor(
                                Math.random() * 100
                            ) + 1;


                        originRollNumber.textContent =
                            randomNumber;


                        lastNumber = now;

                    }


                    requestAnimationFrame(
                        animateRoll
                    );

                } else {

                    originRollNumber.textContent =
                        result.roll;


                    originRollNumber.classList.add(
                        "origin-final"
                    );


                    rollStatus.textContent =
                        "Fate has spoken.";


                    setTimeout(
                        () => {

                            revealOrigin(result);

                        },
                        550
                    );

                }

            }


            requestAnimationFrame(
                animateRoll
            );

        }
    );

}


/* ==========================================
   REVEAL ORIGIN
   ========================================== */

function revealOrigin(result) {

    currentCharacter = {

        mode: "Fatebound",

        originRoll:
            result.roll,

        origin:
            result.name,

        skill:
            result.skill,

        skillLevel:
            result.skillLevel,

        createdAt:
            new Date().toISOString()

    };


    originName.textContent =
        `${result.roll} — ${result.name}`;


    if (result.special) {

        originDescription.textContent =
            "A mysterious orphan with no known memories of their past.";

        originSkill.textContent =
            "Your past and abilities are unknown.";

    } else {

        originDescription.textContent =
            `You were born into the circumstances of a ${result.name.toLowerCase()}.`;

        originSkill.textContent =
            `Starting Skill: ${result.skill} Lv.${result.skillLevel}`;

    }


    originResult.classList.remove(
        "hidden"
    );


    rollOriginButton.classList.add(
        "hidden"
    );


    originContinueButton.classList.remove(
        "hidden"
    );


    saveGame(currentCharacter);

    rolling = false;

}


/* ==========================================
   CONTINUE TO STAT POTENTIAL
   ========================================== */

if (originContinueButton) {

    originContinueButton.addEventListener(
        "click",
        () => {

            if (rolling) {
                return;
            }


            if (
                currentCharacter &&
                currentCharacter.originRoll === 100
            ) {

                startSpecialCharacterStatus();

                return;

            }


            startStatPotential();

        }
    );

}


/* ==========================================
   RETURN TO LOBBY
   ========================================== */

if (characterCreationLobbyButton) {

    characterCreationLobbyButton.addEventListener(
        "click",
        () => {

            if (rolling) {
                return;
            }


            resetCharacterCreation();

            showLobby();

        }
    );

}
