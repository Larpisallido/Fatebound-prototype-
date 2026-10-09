/* ==========================================
   FATEBOUND - STAT POTENTIAL
   ========================================== */


/* ==========================================
   STAT DEFINITIONS
   ========================================== */

const potentialStats = [

    "STR",
    "DEX",
    "CON",
    "INT",
    "WIS",
    "CHA"

];


const potentialNames = {

    STR: "STRENGTH",

    DEX: "DEXTERITY",

    CON: "CONSTITUTION",

    INT: "INTELLIGENCE",

    WIS: "WISDOM",

    CHA: "CHARISMA"

};


/* ==========================================
   POTENTIAL TABLE
   ========================================== */

function getPotentialGrade(roll) {

    if (roll <= 2) {
        return "F";
    }

    if (roll <= 4) {
        return "E";
    }

    if (roll <= 6) {
        return "D";
    }

    if (roll <= 10) {
        return "C";
    }

    if (roll <= 14) {
        return "B";
    }

    if (roll <= 17) {
        return "A";
    }

    if (roll <= 19) {
        return "S";
    }

    return "S+";

}


/* ==========================================
   ELEMENTS
   ========================================== */

const currentStatName =
    document.getElementById(
        "currentStatName"
    );


const statRollNumber =
    document.getElementById(
        "statRollNumber"
    );


const statPotentialResult =
    document.getElementById(
        "statPotentialResult"
    );


const completedStats =
    document.getElementById(
        "completedStats"
    );


const rollStatButton =
    document.getElementById(
        "rollStatButton"
    );


const statPotentialContinueButton =
    document.getElementById(
        "statPotentialContinueButton"
    );


const statPotentialLobbyButton =
    document.getElementById(
        "statPotentialLobbyButton"
    );


/* ==========================================
   STATE
   ========================================== */

let currentStatIndex = 0;

let statRolling = false;

let statPotentials = {};


/* ==========================================
   RESET
   ========================================== */

function resetStatPotential() {

    currentStatIndex = 0;

    statRolling = false;

    statPotentials = {};


    if (currentStatName) {

        currentStatName.textContent =
            "STRENGTH";

    }


    if (statRollNumber) {

        statRollNumber.textContent = "?";

        statRollNumber.classList.remove(
            "origin-final"
        );

    }


    if (statPotentialResult) {

        statPotentialResult.textContent =
            "Awaiting Fate...";

    }


    if (completedStats) {

        completedStats.innerHTML = "";

    }


    if (rollStatButton) {

        rollStatButton.classList.remove(
            "hidden"
        );

        rollStatButton.disabled = false;

        rollStatButton.textContent =
            "ROLL STRENGTH";

        rollStatButton.classList.remove(
            "rolling-button"
        );

    }


    if (statPotentialContinueButton) {

        statPotentialContinueButton.classList.add(
            "hidden"
        );

    }

}


/* ==========================================
   START
   ========================================== */

function startStatPotential() {

    resetStatPotential();

    showScreen(
        document.getElementById(
            "statPotentialScreen"
        )
    );

}


/* ==========================================
   ROLL STAT
   ========================================== */

if (rollStatButton) {

    rollStatButton.addEventListener(
        "click",
        () => {

            if (statRolling) {
                return;
            }


            if (
                currentStatIndex >=
                potentialStats.length
            ) {

                return;

            }


            statRolling = true;


            const stat =
                potentialStats[
                    currentStatIndex
                ];


            currentStatName.textContent =
                potentialNames[stat];


            statPotentialResult.textContent =
                "Fate is deciding...";


            statRollNumber.textContent =
                "?";


            statRollNumber.classList.remove(
                "origin-final"
            );


            rollStatButton.disabled = true;

            rollStatButton.classList.add(
                "rolling-button"
            );


            /* =========================
               REAL RESULT
               ========================= */

            const roll =
                Math.floor(
                    Math.random() * 20
                ) + 1;


            const grade =
                getPotentialGrade(roll);


            /* =========================
               ANIMATION
               ========================= */

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

                        const randomNumber =
                            Math.floor(
                                Math.random() * 20
                            ) + 1;


                        statRollNumber.textContent =
                            randomNumber;


                        lastNumber = now;

                    }


                    requestAnimationFrame(
                        animateRoll
                    );

                } else {

                    statRollNumber.textContent =
                        roll;


                    statRollNumber.classList.add(
                        "origin-final"
                    );


                    statPotentialResult.textContent =
                        `${grade} POTENTIAL`;


                    statPotentials[stat] = {

                        roll: roll,

                        grade: grade

                    };


                    setTimeout(
                        () => {

                            finishStatRoll(
                                stat
                            );

                        },
                        700
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
   FINISH STAT ROLL
   ========================================== */

function finishStatRoll(stat) {

    addCompletedStat(
        stat,
        statPotentials[stat]
    );


    currentStatIndex++;


    statRolling = false;


    /* =========================
       ALL SIX COMPLETE
       ========================= */

    if (
        currentStatIndex >=
        potentialStats.length
    ) {

        rollStatButton.classList.add(
            "hidden"
        );


        statPotentialContinueButton.classList.remove(
            "hidden"
        );


        statPotentialResult.textContent =
            "All potentials revealed.";


        saveStatPotentials();


        return;

    }


    /* =========================
       NEXT STAT
       ========================= */

    const nextStat =
        potentialStats[
            currentStatIndex
        ];


    currentStatName.textContent =
        potentialNames[nextStat];


    statRollNumber.textContent =
        "?";


    statRollNumber.classList.remove(
        "origin-final"
    );


    statPotentialResult.textContent =
        "Awaiting Fate...";


    rollStatButton.textContent =
        `ROLL ${potentialNames[nextStat]}`;


    rollStatButton.disabled = false;

    rollStatButton.classList.remove(
        "rolling-button"
    );

}


/* ==========================================
   COMPLETED STAT DISPLAY
   ========================================== */

function addCompletedStat(
    stat,
    result
) {

    if (!completedStats) {
        return;
    }


    const row =
        document.createElement("div");


    row.className =
        "completed-stat";


    row.innerHTML = `

        <span class="completed-stat-name">
            ${potentialNames[stat]}
        </span>

        <span class="completed-stat-roll">
            ${result.roll}
        </span>

        <span class="completed-stat-grade">
            ${result.grade}
        </span>

    `;


    completedStats.appendChild(
        row
    );

}


/* ==========================================
   SAVE
   ========================================== */

function saveStatPotentials() {

    if (!currentCharacter) {
        return;
    }


    currentCharacter.potential =
        statPotentials;


    saveGame(
        currentCharacter
    );

}


/* ==========================================
   CONTINUE TO FATE'S DESIGN
   ========================================== */

if (statPotentialContinueButton) {
    statPotentialContinueButton.addEventListener(
        "click",
        () => {

            if (statRolling) return;

            if (
                currentStatIndex <
                potentialStats.length
            ) {
                return;
            }

            showFateDetails();
        }
    );
}


/* ==========================================
   RETURN TO LOBBY
   ========================================== */

if (statPotentialLobbyButton) {

    statPotentialLobbyButton.addEventListener(
        "click",
        () => {

            if (statRolling) {
                return;
            }


            resetStatPotential();

            resetCharacterCreation();

            showLobby();

        }
    );

           }
