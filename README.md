# the elemental five

An online version of The Elemental Five, a card game by InnerGames. I made it during my internship at InnerGames (Front End Development, Fontys ICT). It's going to be a preview on the new website, so people can try the game before they buy it or book a workshop.

## how it works

You go through the 5 elements: vuur, lucht, aarde, water and ether. For every element you read the first card, use the slider to show how strong that element is for you, and then pick between 2 cards twice. At the end you see all your cards and get an image of your "elementen-mix" that you can save. There's no right or wrong, same as the real game.

There's also a short version where you only play 1 element.

## running it

- To work on it, open the folder in VS Code and open `src/index.html` with Live Server. The sound and the result image only work through a local server, not when you just double-click the file.
- `python build.py` makes `dist/elemental-five.html`. That's one file with everything in it (around 6 MB), so it works offline and can go on WordPress.
- To test it: `pip install playwright`, then once `playwright install chromium`. After that, run `python build.py` and then `python tests/playthrough.py`. It plays the whole game on desktop and phone size and stops if there's an error. Screenshots end up in `tests/screenshots`.

## folders

```
src/
  index.html
  css/            styles split up per part (table, title screen, effects etc.)
  data/cards.js   all 35 cards with the short texts
  js/             config, effects, video, sound, table, game flow, result, main
  assets/         card images, logos, videos and sounds
build.py          makes the single file in dist/
tests/            playthrough test
```

## history

The first version was just one big HTML file that I made at the end of October 2026, while I was checking the card texts with InnerGames (that part is in my werklog). On 3 November 2026 I put it in git and rebuilt it step by step, so every commit adds one part. From now on I commit every change.

I used Claude (AI) to help me write the code. What the game does, how it looks, the clips and sounds and the testing are my choices.

## credits

- Card texts, images and logos are from InnerGames and are only for InnerGames.
- I picked the videos and sounds from free sites. Before it goes live I still need to:

  ☐ save the license or download link for every video

  ☐ swap the gif videos (fire, water, lightning) for HD ones that can be used commercially

  ☐ save the license or download link for every sound

## notes / add later

