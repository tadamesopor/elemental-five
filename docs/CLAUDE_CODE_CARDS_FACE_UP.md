# Claude Code task: both cards face up, choose directly

## Why
In the "pick one of two cards" step, people have to flip each card to read it and flip back to read the other. Testers found that annoying.

## What to change
In `dealPair` and `readCard` (`src/js/flow.js`) and `stageCard` (`src/js/table.js`):

1. After the deal, both cards turn to their text side by themselves, next to each other: the heading, the short text (`c.short`) and the pause line. No tapping needed to read.
2. Each card has its own `kies deze kaart` button under its text. Remove `lees de andere kaart` and `terug naar de andere`.
3. `lees de hele kaart` stays on each card. It opens the full text of that card only (bigger, over the other one or in a panel). Closing it goes back to the two cards.
4. The slow breath (`shortPause`) happens once, after both cards are turned, then both buttons work.
5. Prompt above the cards: `Welke van deze twee kaarten past het beste bij jouw gevoel?`
6. Phones (under 640px): the two cards stacked, each compact (heading, short text, button), the page scrolls. Remove the swipe hint.
7. Keyboard: Tab reaches both buttons, focus starts on the first card.
8. Keep the sounds, the fly animation of the chosen card to its slot, and reduced motion.

## Done when
- [ ] `python build.py` and `python tests/playthrough.py` pass at desktop and phone size
- [ ] Both cards readable at once, choosing takes one click
- [ ] Full text opens and closes per card
- [ ] Works with the keyboard and with reduced motion

Commit as `both cards face up next to each other`, together with this file. Don't push.
