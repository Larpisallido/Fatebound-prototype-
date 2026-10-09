/* ==========================================
   FATEBOUND - CHARACTER STATUS
   ========================================== */


/* ==========================================
   ELEMENTS
   ========================================== */

const characterStatusScreen =
    document.getElementById("characterStatusScreen");

const characterFirstName =
    document.getElementById("characterFirstName");

const generatedFamilyName =
    document.getElementById("generatedFamilyName");

const characterStatusDetails =
    document.getElementById("characterStatusDetails");

const characterStatusStats =
    document.getElementById("characterStatusStats");

const characterStatusContinueButton =
    document.getElementById("characterStatusContinueButton");

const characterStatusLobbyButton =
    document.getElementById("characterStatusLobbyButton");


/* ==========================================
   STAT NAMES
   ========================================== */

const statusStatNames = {
    STR: "STR",
    DEX: "DEX",
    CON: "CON",
    INT: "INT",
    WIS: "WIS",
    CHA: "CHA"
};


const statusStats = [
    "STR",
    "DEX",
    "CON",
    "INT",
    "WIS",
    "CHA"
];


/* ==========================================
   FAMILY NAME POOLS
   ========================================== */

const familyNamePools = {

    wealthy: [
        "Ashford",
        "Whitmore",
        "Blackwood",
        "Westmere",
        "Fairbourne",
        "Hawthorne",
        "Ravenscroft",
        "Wellington"
    ],

    minorNoble: [
        "Valebrook",
        "Ashcombe",
        "Ravenholt",
        "Dunmere",
        "Wyrmwood",
        "Thornfield",
        "Evershade",
        "Briarcrest"
    ],

    establishedNoble: [
        "Montclair",
        "Eldermere",
        "Gravesend",
        "Aldermark",
        "Ravencrest",
        "Winterbourne",
        "Stormvale",
        "Highmere"
    ],

    highNoble: [
        "Valemont",
        "D'Aubigne",
        "Ravenscourt",
        "Devereux",
        "Aurelmont",
        "Vandemar",
        "Blackthorn",
        "Evermont"
    ],

    greatNoble: [
        "Drakenhart",
        "Valerian",
        "Aurelius",
        "Ravenmark",
        "Montrose",
        "Eisenwald",
        "Stormborn",
        "Ashenvale"
    ],

    royal: [
        "Aurelius",
        "Valerius",
        "Dravencourt",
        "Eldoria",
        "Caelmont",
        "Arkenvale",
        "Solvaren",
        "Veyrane"
    ]

};


function randomFrom(list) {

    return list[
        Math.floor(Math.random() * list.length)
    ];

}


function getFamilyNamePool(originRoll) {

    if (originRoll >= 98) {
        return familyNamePools.royal;
    }

    if (originRoll >= 94) {
        return familyNamePools.greatNoble;
    }

    if (originRoll >= 83) {
        return familyNamePools.highNoble;
    }

    if (originRoll >= 71) {
        return familyNamePools.establishedNoble;
    }

    if (originRoll >= 56) {
        return familyNamePools.minorNoble;
    }

    return familyNamePools.wealthy;

}


function generateFamilyName(originRoll) {

    if (originRoll < 50) {
        return null;
    }

    return randomFrom(
        getFamilyNamePool(originRoll)
    );

}


/* ==========================================
   ORIGIN BASE STATS
   ========================================== */

function getOriginStatRange(originRoll) {

    if (originRoll >= 98) {
        return { low: 11, high: 12 };
    }

    if (originRoll >= 94) {
        return { low: 10, high: 11 };
    }

    if (originRoll >= 83) {
        return { low: 9, high: 10 };
    }

    if (originRoll >= 71) {
        return { low: 8, high: 9 };
    }

    if (originRoll >= 56) {
        return { low: 7, high: 8 };
    }

    if (originRoll >= 41) {
        return { low: 6, high: 7 };
    }

    if (originRoll >= 26) {
        return { low: 5, high: 6 };
    }

    if (originRoll >= 11) {
        return { low: 4, high: 5 };
    }

    return { low: 3, high: 4 };

}


function rollOriginBaseStats(originRoll) {

    const range =
        getOriginStatRange(originRoll);

    const stats = {};

    statusStats.forEach(stat => {
        stats[stat] = range.low;
    });


    const shuffled = [...statusStats];

    for (let i = shuffled.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] =
            [shuffled[j], shuffled[i]];

    }


    stats[shuffled[0]] = range.high;
    stats[shuffled[1]] = range.high;


    return stats;

}


/* ==========================================
   AGE MODIFIER
   ========================================== */

function getAgeModifier(originRoll, age) {

    const yearsAfterFifteen =
        Math.max(0, age - 15);


    if (originRoll < 50) {
        return yearsAfterFifteen;
    }


    return yearsAfterFifteen * 1.5;

}


function calculateInitialStats(originRoll, age) {

    const baseStats =
        rollOriginBaseStats(originRoll);

    const modifier =
        getAgeModifier(originRoll, age);

    const initialStats = {};


    statusStats.forEach(stat => {

        initialStats[stat] =
            baseStats[stat] + modifier;

    });


    return {
        base: baseStats,
        ageModifier: modifier,
        initial: initialStats
    };

}


/* ==========================================
   FORMATTING
   ========================================== */

function formatStatValue(value) {

    if (Number.isInteger(value)) {
        return String(value);
    }

    return value.toFixed(1);

}


/* ==========================================
   RESET
   ========================================== */

function resetCharacterStatus() {

    if (characterFirstName) {
        characterFirstName.value = "";
    }

    if (generatedFamilyName) {
        generatedFamilyName.textContent = "";
    }

    if (characterStatusDetails) {
        characterStatusDetails.innerHTML = "";
    }

    if (characterStatusStats) {
        characterStatusStats.innerHTML = "";
    }

}


/* ==========================================
   START NORMAL STATUS
   ========================================== */

function startCharacterStatus() {

    if (!currentCharacter) {
        return;
    }


    resetCharacterStatus();


    const originRoll =
        currentCharacter.originRoll;

    const age =
        currentCharacter.age?.result;


    if (
        typeof originRoll !== "number" ||
        typeof age !== "number"
    ) {
        return;
    }


    if (!currentCharacter.familyName) {

        currentCharacter.familyName =
            generateFamilyName(originRoll);

    }


    const calculated =
        calculateInitialStats(
            originRoll,
            age
        );


    currentCharacter.baseStats =
        calculated.base;

    currentCharacter.ageModifier =
        calculated.ageModifier;

    currentCharacter.initialStats =
        calculated.initial;


    renderNormalStatus();

    showScreen(characterStatusScreen);


    saveGame(currentCharacter);

}


/* ==========================================
   SPECIAL ORIGIN STATUS
   ========================================== */

function startSpecialCharacterStatus() {

    if (!currentCharacter) {
        return;
    }


    resetCharacterStatus();


    currentCharacter.special = true;

    currentCharacter.age = {
        roll: null,
        result: 16
    };

    currentCharacter.initialStats = {
        STR: 15,
        DEX: 15,
        CON: 15,
        INT: 15,
        WIS: 15,
        CHA: 15
    };

    currentCharacter.baseStats = {
        STR: 15,
        DEX: 15,
        CON: 15,
        INT: 15,
        WIS: 15,
        CHA: 15
    };

    currentCharacter.ageModifier = 0;

    currentCharacter.potential = {
        STR: { roll: 20, grade: "S+" },
        DEX: { roll: 20, grade: "S+" },
        CON: { roll: 20, grade: "S+" },
        INT: { roll: 20, grade: "S+" },
        WIS: { roll: 20, grade: "S+" },
        CHA: { roll: 20, grade: "S+" }
    };

    currentCharacter.familyName = null;


    renderSpecialStatus();

    showScreen(characterStatusScreen);

    saveGame(currentCharacter);

}


/* ==========================================
   RENDER NORMAL STATUS
   ========================================== */

function renderNormalStatus() {

    const family =
        currentCharacter.familyName;


    if (generatedFamilyName) {

        if (family) {

            generatedFamilyName.textContent =
                `FAMILY NAME: ${family}`;

        } else {

            generatedFamilyName.textContent =
                "No family name";

        }

    }


    characterStatusDetails.innerHTML = `

        <div class="status-detail-row">
            <span>ORIGIN</span>
            <strong>
                ${currentCharacter.origin}
            </strong>
        </div>

        <div class="status-detail-row">
            <span>AGE</span>
            <strong>
                ${currentCharacter.age.result}
            </strong>
        </div>

        <div class="status-detail-row">
            <span>APPEARANCE</span>
            <strong>
                ${currentCharacter.appearance.result}
            </strong>
        </div>

        <div class="status-detail-row">
            <span>STARTING SKILL</span>
            <strong>
                ${currentCharacter.skill}
                Lv.${currentCharacter.skillLevel}
            </strong>
        </div>

        <div class="status-detail-row">
            <span>AGE MODIFIER</span>
            <strong>
                +${formatStatValue(currentCharacter.ageModifier)}
                ALL STATS
            </strong>
        </div>

    `;


    renderStats(false);

    characterStatusContinueButton.textContent =
        "CONTINUE TO WORLD";

}


/* ==========================================
   RENDER SPECIAL STATUS
   ========================================== */

function renderSpecialStatus() {

    if (generatedFamilyName) {

        generatedFamilyName.textContent =
            "SPECIAL ORIGIN — NO FAMILY NAME";

    }


    characterStatusDetails.innerHTML = `

        <div class="status-detail-row">
            <span>ORIGIN</span>
            <strong>
                100 — UNKNOWN
            </strong>
        </div>

        <div class="status-detail-row">
            <span>AGE</span>
            <strong>
                16
            </strong>
        </div>

        <div class="status-detail-row">
            <span>STARTING SKILL</span>
            <strong>
                None
            </strong>
        </div>

    `;


    renderStats(true);

    characterStatusContinueButton.textContent =
        "ENTER WORLD";

}


/* ==========================================
   RENDER STATS
   ========================================== */

function renderStats(special) {

    let html = `
        <div class="status-section-title">
            INITIAL STATS
        </div>
    `;


    if (!special) {

        html += `
            <div class="status-stat-subtitle">
                Base Origin Stats + Age Modifier
            </div>
        `;

    } else {

        html += `
            <div class="status-stat-subtitle">
                All Core Stats: 15 • Growth: S+
            </div>
        `;

    }


    statusStats.forEach(stat => {

        const value =
            currentCharacter.initialStats[stat];

        const potential =
            currentCharacter.potential?.[stat];

        const grade =
            potential?.grade ||
            (special ? "S+" : "—");


        html += `

            <div class="status-stat-row">

                <span class="status-stat-name">
                    ${statusStatNames[stat]}
                </span>

                <strong class="status-stat-value">
                    ${formatStatValue(value)}
                </strong>

                <span class="status-stat-potential">
                    ${grade}
                </span>

            </div>

        `;

    });


    characterStatusStats.innerHTML = html;

}


/* ==========================================
   NAME
   ========================================== */

function updateCharacterName() {

    if (!currentCharacter || !characterFirstName) {
        return;
    }


    const firstName =
        characterFirstName.value.trim();


    currentCharacter.firstName =
        firstName;


    if (currentCharacter.familyName) {

        currentCharacter.name =
            `${firstName} ${currentCharacter.familyName}`.trim();

    } else {

        currentCharacter.name =
            firstName;

    }

}


/* ==========================================
   CONTINUE TO WORLD
   ========================================== */

if (characterStatusContinueButton) {

    characterStatusContinueButton.addEventListener(
        "click",
        () => {

            if (!currentCharacter) {
                return;
            }


            updateCharacterName();


            if (!currentCharacter.firstName) {

                characterFirstName.focus();

                return;

            }


            saveGame(currentCharacter);


            startWorld();

        }
    );

}


/* ==========================================
   RETURN TO LOBBY
   ========================================== */

if (characterStatusLobbyButton) {

    characterStatusLobbyButton.addEventListener(
        "click",
        () => {

            resetCharacterStatus();

            resetFateDetails();

            resetStatPotential();

            resetCharacterCreation();

            showLobby();

        }
    );

}


/* ==========================================
   NAME INPUT
   ========================================== */

if (characterFirstName) {

    characterFirstName.addEventListener(
        "input",
        updateCharacterName
    );

}
