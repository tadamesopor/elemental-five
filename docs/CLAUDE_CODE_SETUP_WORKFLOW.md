# Claude Code task: set up the workflow (after the cards face up change)

Read `CLAUDE.md` first. Do this **after** the "both cards face up" change is committed. No changes to how the game plays.

Do not add `Co-Authored-By` or any Claude/AI attribution lines to commits.

## 1. Commit CLAUDE.md and docs/

Commit `CLAUDE.md` and the `docs/` folder as `add claude notes and task files`.

## 2. A sync script to the website

Write `sync_to_website.py`:
- It takes the path to the inner-games repo as an argument (default `../../../website/innergames-prototype/innergames-prototype`, check that the path exists and stop with a clear message if not).
- It stops if this repo has uncommitted changes ("commit first").
- It copies `src/` into `<inner-games>/public/games/elemental-five`, removing files there that no longer exist in `src/`.
- It writes `VERSION.txt` there with the commit hash and the date.
- It prints what changed and the git command to commit in inner-games: `update elemental five game to <hash>`. It does not commit or push by itself.

Check it once: run it, then look at `git status` in inner-games and tell me what it changed. Don't commit in inner-games yourself.

Add a short "updating the website" part to `README.md` about the script.

Commit as `add sync script to the website`.

## 3. Tell me

- Whether the website copy was the same as `src/` before the sync, or older (and which files differed).
- That there are two local copies of this repo on my laptop: `git/elemental-five-repo` (old, last changed 3 November) and `git/elemental-five-repo2` (the one in use). Confirm which one you are in.
