/* ==========================================
   FATEBOUND - ORIGINS
   ========================================== */


/* ==========================================
   ORIGIN TABLE
   ========================================== */

const origins = {

    1: ["Starving Beggar", "Begging", 1],
    2: ["Abandoned Orphan", "Scavenging", 1],
    3: ["Street Child", "Street Awareness", 1],
    4: ["Slum Dweller", "Street Survival", 1],
    5: ["Destitute Laborer's Child", "Physical Labor", 1],
    6: ["Poor Farmer's Child", "Farming", 1],
    7: ["Beggar Family", "Begging", 2],
    8: ["Wandering Refugee Family", "Survival", 1],
    9: ["Poor Fisherman's Family", "Fishing", 1],
    10: ["Poor Hunter's Family", "Hunting", 1],

    11: ["Village Farmer's Family", "Farming", 2],
    12: ["Village Laborer's Family", "Physical Labor", 2],
    13: ["Shepherd's Family", "Animal Handling", 1],
    14: ["Woodcutter's Family", "Woodcutting", 1],
    15: ["Fisherman's Family", "Fishing", 2],
    16: ["Hunter's Family", "Hunting", 2],
    17: ["Stablekeeper's Family", "Riding", 1],
    18: ["Caravan Worker's Family", "Navigation", 1],
    19: ["Innkeeper's Family", "Hospitality", 1],
    20: ["Household Servant's Family", "Housekeeping", 1],
    21: ["Blacksmith's Family", "Blacksmithing", 1],
    22: ["Carpenter's Family", "Carpentry", 1],
    23: ["Weaver's Family", "Weaving", 1],
    24: ["Potter's Family", "Pottery", 1],
    25: ["Village Scholar's Family", "Literacy", 1],

    26: ["Master Blacksmith's Family", "Blacksmithing", 2],
    27: ["Master Carpenter's Family", "Carpentry", 2],
    28: ["Master Weaver's Family", "Weaving", 2],
    29: ["Master Tanner's Family", "Leatherworking", 1],
    30: ["Experienced Merchant's Family", "Commerce", 1],
    31: ["Apothecary's Family", "Herbalism", 1],
    32: ["Physician's Family", "Medicine", 1],
    33: ["Scribe's Family", "Writing", 1],
    34: ["Teacher's Family", "Teaching", 1],
    35: ["Master Mason's Family", "Masonry", 1],
    36: ["Shipwright's Family", "Shipbuilding", 1],
    37: ["Professional Hunter's Family", "Hunting", 3],
    38: ["Scout's Family", "Reconnaissance", 1],
    39: ["Guard's Family", "Weapon Handling", 1],
    40: ["Veteran Soldier's Family", "Military Training", 1],

    41: ["Wealthy Merchant Family", "Commerce", 2],
    42: ["Merchant Guild Family", "Negotiation", 1],
    43: ["Banking Family", "Finance", 1],
    44: ["Wealthy Artisan Family", "Craftsmanship", 1],
    45: ["Renowned Blacksmith Family", "Blacksmithing", 3],
    46: ["Renowned Physician Family", "Medicine", 2],
    47: ["Scholar Family", "Scholarship", 1],
    48: ["Academy Scholar's Family", "Academic Theory", 1],
    49: ["Court Scribe's Family", "Writing", 2],
    50: ["Guildmaster's Family", "Guild Management", 1],
    51: ["Caravan Master Family", "Navigation", 2],
    52: ["Ship Captain's Family", "Navigation", 3],
    53: ["Renowned Hunter Family", "Hunting", 4],
    54: ["Wealthy Landowner Family", "Land Management", 1],
    55: ["Influential Local Family", "Leadership", 1],

    56: ["Knight's Family", "Swordsmanship", 1],
    57: ["Knight Commander's Family", "Swordsmanship", 2],
    58: ["Noble Military Family", "Military Strategy", 1],
    59: ["Noble Cavalry Family", "Mounted Combat", 1],
    60: ["Noble Archer Family", "Archery", 1],
    61: ["Noble Scholar Family", "Scholarship", 2],
    62: ["Noble Administrator Family", "Administration", 1],
    63: ["Minor Noble House", "Etiquette", 1],
    64: ["Old Noble House", "Etiquette", 2],
    65: ["Noble Diplomatic Family", "Diplomacy", 1],
    66: ["Noble Political Family", "Politics", 1],
    67: ["Noble Merchant House", "Commerce", 3],
    68: ["Noble Mage Family", "Magic Theory", 1],
    69: ["Noble Clerical Family", "Religious Knowledge", 1],
    70: ["Baronial Household", "Leadership", 2],

    71: ["Powerful Baron Family", "Leadership", 3],
    72: ["Ancient Baron House", "Swordsmanship", 3],
    73: ["Wealthy Baron House", "Commerce", 4],
    74: ["Military Noble House", "Military Strategy", 2],
    75: ["Elite Knight House", "Swordsmanship", 4],
    76: ["Noble Cavalry House", "Mounted Combat", 2],
    77: ["Noble Mage House", "Magic Theory", 2],
    78: ["Noble Scholar House", "Scholarship", 3],
    79: ["Political Noble House", "Politics", 2],
    80: ["Diplomatic Noble House", "Diplomacy", 2],
    81: ["Royal Administrator's House", "Administration", 2],
    82: ["Powerful Noble House", "Leadership", 4],

    83: ["Count Family", "Leadership", 5],
    84: ["Count Military House", "Military Strategy", 3],
    85: ["Count Knightly House", "Swordsmanship", 5],
    86: ["Count Mage House", "Magic Theory", 3],
    87: ["Count Political House", "Politics", 3],
    88: ["Ancient Count House", "Etiquette", 3],

    89: ["Marquis Family", "Leadership", 6],
    90: ["Marquis Military House", "Military Strategy", 4],
    91: ["Marquis Knightly House", "Swordsmanship", 6],
    92: ["Marquis Mage House", "Magic Theory", 4],
    93: ["Marquis Diplomatic House", "Diplomacy", 4],

    94: ["Duke Family", "Leadership", 7],
    95: ["Duke Military House", "Military Strategy", 5],
    96: ["Duke Knightly House", "Swordsmanship", 7],
    97: ["Ancient Duke House", "Diplomacy", 5],

    98: ["Royal Family", "Royal Etiquette", 1],
    99: ["Direct Royal Bloodline", "Royal Authority", 1],

    100: ["Amnesiac Orphan", null, null]

};


/* ==========================================
   ROLL ORIGIN
   ========================================== */

function rollOrigin() {

    const roll =
        Math.floor(Math.random() * 100) + 1;

    const origin =
        origins[roll];

    return {

        roll: roll,

        name: origin[0],

        skill: origin[1],

        skillLevel: origin[2],

        special: roll === 100

    };

         }
