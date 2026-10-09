/* ==========================================
   FATEBOUND - AGE / APPEARANCE / LUCK
   ========================================== */


/* ==========================================
   FATE DETAILS
   ========================================== */

const fateDetails = [

    {
        key: "age",
        name: "AGE",
        button: "ROLL AGE",
        sides: 10
    },

    {
        key: "appearance",
        name: "APPEARANCE",
        button: "ROLL APPEARANCE",
        sides: 10
    },

    {
        key: "luck",
        name: "LUCK",
        button: "ROLL LUCK",
        sides: 10,
        hidden: true
    }

];


/* ==========================================
   ELEMENTS
   ========================================== */

const fateDetailName =
    document.getElementById(
        "fateDetailName"
    );


const fateDetailRollNumber =
    document.getElementById(
        "fateDetailRollNumber"
    );


const fateDetailResult =
    document.getElementById(
        "fateDetailResult"
    );


const fateDetailsResults =
    document.getElementById(
        "fateDetailsResults"
    );


const rollFateDetailButton =
    document.getElementById(
        "rollFateDetailButton"
    );


const fateDetailsContinueButton =
    document.getElementById(
        "fateDetailsContinueButton"
    );


const fateDetailsLobbyButton =
    document.getElementById(
        "fateDetailsLobbyButton"
    );


/* ==========================================
   STATE
   ========================================== */

let fateDetailIndex = 0;

let fateDetailRolling = false;

let fateDetailData = {};


/* ==========================================
   AGE
   ========================================== */

function getAgeFromRoll(roll) {

    return roll + 14;

}


/* ==========================================
   APPEARANCE
   ========================================== */

function getAppearanceFromRoll(roll) {

    if (roll <= 2) {
        return "Unfortunate Looking";
    }

    if (roll <= 4) {
        return "Unpleasant";
    }

    if (roll === 5) {
        return "Average";
    }

    if (roll <= 7) {
        return "Decently Handsome";
    }

    if (roll <= 9) {
        return "Strikingly Attractive";
    }

    return "🗿";

}


/* ==========================================
   RESET
   ========================================== */

function resetFateDetails() {

    fateDetailIndex = 0;

    fateDetailRolling = false;

    fateDetailData = {};


    if (fateDetailName) {
        fateDetailName.textContent = "AGE";
    }


    if (fateDetailRollNumber) {

        fateDetailRollNumber.textContent = "?";

        fateDetailRollNumber.classList.remove(
            "origin-final"
        );

    }


    if (fateDetailResult) {

        fateDetailResult.textContent =
            "Awaiting Fate...";

    }


    if (fateDetailsResults) {

        fateDetailsResults.innerHTML = "";

    }


    if (rollFateDetailButton) {

        rollFateDetailButton.classList.remove(
            "hidden"
        );

        rollFateDetailButton.disabled = false;

        rollFateDetailButton.classList.remove(
            "rolling-button"
        );

        rollFateDetailButton.textContent =
            "ROLL AGE";

    }


    if (fateDetailsContinueButton) {

        fateDetailsContinueButton.classList.add(
            "hidden"
        );

    }

}


/* ==========================================
   START
   ========================================== */

function startFateDetails() {
    resetFateDetails();
    showFateDetails();
}


/* ==========================================
   ROLL
   ========================================== */

if (rollFateDetailButton) {

    rollFateDetailButton.addEventListener(
        "click",
        () => {

            if (fateDetailRolling) {
                return;
            }


            if (
                fateDetailIndex >=
                fateDetails.length
            ) {

                return;

            }


            fateDetailRolling = true;


            const detail =
                fateDetails[
                    fateDetailIndex
                ];


            fateDetailName.textContent =
                detail.name;


            fateDetailResult.textContent =
                "Fate is deciding...";


            fateDetailRollNumber.textContent =
                "?";


            fateDetailRollNumber.classList.remove(
                "origin-final"
            );


            rollFateDetailButton.disabled =
                true;


            rollFateDetailButton.classList.add(
                "rolling-button"
            );


            /*
             * Generate the real result
             * independently.
             *
             * For Luck, it is NEVER
             * displayed.
             */

            const realRoll =
                Math.floor(
                    Math.random() * detail.sides
                ) + 1;


            const duration = 2400;

            const startTime =
                performance.now();

            let lastNumber = 0;


            function animateRoll(currentTime) {

                const elapsed =
                    currentTime -
                    startTime;


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
                            180 *
                            (1 - eased)
                        );


                    const now =
                        performance.now();


                    if (
                        now - lastNumber >=
                        speed
                    ) {

                        /*
                         * These are purely
                         * visual numbers.
                         *
                         * They are never used
                         * as the actual result.
                         */

                        const visualRoll =
                            Math.floor(
                                Math.random() *
                                detail.sides
                            ) + 1;


                        fateDetailRollNumber.textContent =
                            visualRoll;


                        lastNumber = now;

                    }


                    requestAnimationFrame(
                        animateRoll
                    );

                } else {

                    finishFateDetail(
                        detail,
                        realRoll
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
   FINISH ROLL
   ========================================== */

function finishFateDetail(
    detail,
    realRoll
) {

    /* =========================
       HIDDEN LUCK
       ========================= */

    if (detail.hidden) {

        /*
         * Never show the real roll.
         */

        fateDetailRollNumber.textContent =
            "—";


        fateDetailRollNumber.classList.add(
            "origin-final"
        );


        fateDetailResult.textContent =
            "Fate has decided.";


        /*
         * Store the actual hidden value.
         */

        fateDetailData.luck =
            realRoll;

    }


    /* =========================
       VISIBLE RESULTS
       ========================= */

    else {

        fateDetailRollNumber.textContent =
            realRoll;


        fateDetailRollNumber.classList.add(
            "origin-final"
        );


        let result;


        if (detail.key === "age") {

            result =
                getAgeFromRoll(
                    realRoll
                );

        }


        if (
            detail.key ===
            "appearance"
        ) {

            result =
                getAppearanceFromRoll(
                    realRoll
                );

        }


        fateDetailData[
            detail.key
        ] = {

            roll: realRoll,

            result: result

        };


        fateDetailResult.textContent =
            result;


        addFateDetailResult(
            detail,
            realRoll,
            result
        );

    }


    setTimeout(
        () => {

            fateDetailIndex++;

            fateDetailRolling = false;


            /* =========================
               ALL COMPLETE
               ========================= */

            if (
                fateDetailIndex >=
                fateDetails.length
            ) {

                rollFateDetailButton.classList.add(
                    "hidden"
                );


                fateDetailsContinueButton.classList.remove(
                    "hidden"
                );


                fateDetailResult.textContent =
                    "Fate has been decided.";


                saveFateDetails();

                return;

            }


            /* =========================
               NEXT DETAIL
               ========================= */

            const nextDetail =
                fateDetails[
                    fateDetailIndex
                ];


            fateDetailName.textContent =
                nextDetail.name;


            fateDetailRollNumber.textContent =
                "?";


            fateDetailRollNumber.classList.remove(
                "origin-final"
            );


            fateDetailResult.textContent =
                "Awaiting Fate...";


            rollFateDetailButton.textContent =
                nextDetail.button;


            rollFateDetailButton.disabled =
                false;


            rollFateDetailButton.classList.remove(
                "rolling-button"
            );

        },
        700
    );

}


/* ==========================================
   VISIBLE RESULT
   ========================================== */

function addFateDetailResult(
    detail,
    roll,
    result
) {

    if (!fateDetailsResults) {
        return;
    }


    const row =
        document.createElement("div");


    row.className =
        "fate-detail-result-row";


    row.innerHTML = `

        <span class="fate-detail-result-name">
            ${detail.name}
        </span>

        <span class="fate-detail-result-roll">
            ${roll}
        </span>

        <span class="fate-detail-result-value">
            ${result}
        </span>

    `;


    fateDetailsResults.appendChild(
        row
    );

}


/* ==========================================
   SAVE
   ========================================== */

function saveFateDetails() {

    if (!currentCharacter) {
        return;
    }


    if (fateDetailData.age) {

        currentCharacter.age =
            fateDetailData.age;

    }


    if (fateDetailData.appearance) {

        currentCharacter.appearance =
            fateDetailData.appearance;

    }


    /*
     * Luck remains hidden from
     * the character UI.
     */

    if (
        typeof fateDetailData.luck ===
        "number"
    ) {

        currentCharacter.luck =
            fateDetailData.luck;

    }


    saveGame(
        currentCharacter
    );

}


/* ==========================================
   CONTINUE
   ========================================== */

if (fateDetailsContinueButton) {

    fateDetailsContinueButton.addEventListener(
        "click",
        () => {

            if (fateDetailRolling) {
                return;
            }


            if (
                fateDetailIndex <
                fateDetails.length
            ) {

                return;

            }


            startCharacterStatus();

        }
    );

}


/* ==========================================
   RETURN TO LOBBY
   ========================================== */

if (fateDetailsLobbyButton) {

    fateDetailsLobbyButton.addEventListener(
        "click",
        () => {

            if (fateDetailRolling) {
                return;
            }


            resetFateDetails();

            resetStatPotential();

            resetCharacterCreation();

            showLobby();

        }
    );

}
