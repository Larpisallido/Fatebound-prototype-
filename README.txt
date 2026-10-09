Fatebound prototype fixes

1. Replace js/lobby.js with lobby.js.
2. Replace js/menu.js with menu.js.
3. In js/characterStatus.js, change the statusStatNames map to:
   const statusStatNames = {
       STR: "STR",
       DEX: "DEX",
       CON: "CON",
       INT: "INT",
       WIS: "WIS",
       CHA: "CHA"
   };
4. Open style.css.patch and append its entire contents to the END of your existing style.css.
   Do NOT replace style.css with style.css.patch; it is an override patch, not the whole stylesheet.

The CSS makes mobile typography/spacing more compact, adds space between the two mode buttons,
keeps the status stats from overlapping, and styles the character name in the status overlay.
The JavaScript changes restore the Classic Mode work-in-progress alert and add the character name
to the status overlay.
