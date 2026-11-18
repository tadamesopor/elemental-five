# The Elemental Five web game: notes for Claude Code

## What this is
An online version of The Elemental Five, a card game by InnerGames (Eindhoven). Damian made it during his internship (Front End Development, Fontys ICT). It is the game preview on the new InnerGames website: people try it before they buy the game or book a workshop. Ariën Kingma (owner, made the game) approves the texts and the look.

## Stack
Plain HTML, CSS and JavaScript, no framework and no bundler. `build.py` makes one file `dist/elemental-five.html` with everything inlined, for WordPress later.

## Files
- `src/index.html`: the page
- `src/css/`: styles per part (table, title screen, effects)
- `src/data/cards.js`: all 35 cards with the short texts. **Ariën approved these texts. Never change, shorten or rewrite a card text without Damian asking for it.**
- `src/js/flow.js`: the game flow (deal, read, choose, next element)
- `src/js/table.js`: the table, the cards, the big reading card
- `src/js/result.js`: the end screen and the saved image
- `src/js/fx.js`, `video.js`, `sound.js`: effects, background, sound
- `tests/playthrough.py`: plays the whole game at desktop and phone size
- `docs/`: task files for Claude Code, one per change (see below)

## Rules for the game
- Text is in Dutch, informal ("je"), short sentences.
- There is no right or wrong answer, same as the real game. Never add scores or "good/bad" wording.
- Keep it calm: Ariën found the moving backgrounds too distracting. No new busy animations.
- Everything works with the keyboard, on a phone (390px) and with reduced motion.

## Working
- Read the task file in `docs/` first, make a short plan, then build.
- Before every commit: `python build.py`, then `python tests/playthrough.py`. Both must pass. Look at the screenshots in `tests/screenshots`.
- **One commit per finished change.** Short lowercase message in plain English that says what changed, for example `both cards face up next to each other`. Never a vague message like `worked on game` or `updates`.
- Commit the task file from `docs/` together with the change it describes.
- No `Co-Authored-By` or any Claude/AI attribution lines in commits.
- Don't push. Damian pushes himself.

## Task files
Every bigger change gets a file in `docs/` before you start: `docs/CLAUDE_CODE_<TOPIC>.md`, with why, what to change, and "done when" checks. This is how the website repo (inner-games) works too. It shows in the history why something changed.

## The copy on the website
The website repo `inner-games` has a copy of this game in `public/games/elemental-five` (a copy of `src/`). After a change here:
1. Copy `src/` into `inner-games/public/games/elemental-five`.
2. Write the commit hash of this repo into `public/games/elemental-five/VERSION.txt` there, so we always know which version the website shows.
3. Commit in inner-games as `update elemental five game to <hash>`.
If a script for this exists (`sync_to_website.py`), use it.

## Where it runs
- Own deploy: https://elemental-five-two.vercel.app
- On the website: https://inner-games.vercel.app (task 4 of the user test uses it)
- During a running user test, only push game changes at a quiet moment, so everyone in one test round plays the same version.
