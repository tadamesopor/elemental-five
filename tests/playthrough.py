"""Plays the whole game in a browser (desktop and phone size) and fails if there's an error.

Setup: pip install playwright, then once: playwright install chromium
Run:   python build.py, then python tests/playthrough.py
Screenshots go in tests/screenshots/
"""
import asyncio
import pathlib
import sys

from playwright.async_api import async_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGE = ROOT / 'dist' / 'elemental-five.html'
SHOTS = ROOT / 'tests' / 'screenshots'

# keeps track of which sound loops start, to check the sound works
SOUND_PROBE = """
window.__snd = [];
const start = AudioBufferSourceNode.prototype.start;
AudioBufferSourceNode.prototype.start = function (...a) {
  if (this.buffer && this.buffer.duration > 5 && this.loop) window.__snd.push(Math.round(this.buffer.duration));
  return start.apply(this, a);
};
"""


async def set_slider(page, value):
    await page.evaluate("""v => { const i = document.querySelector('#stage .feel input');
      i.value = v; i.dispatchEvent(new Event('input', { bubbles: true })); }""", str(value))


async def play(width, height, tag):
    async with async_playwright() as p:
        browser = await p.chromium.launch(args=['--autoplay-policy=no-user-gesture-required'])
        page = await browser.new_page(viewport={'width': width, 'height': height})
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('console', lambda m: m.type == 'error' and errors.append(m.text))
        await page.add_init_script(SOUND_PROBE)
        await page.goto(PAGE.as_uri())
        await page.wait_for_timeout(400)
        await page.screenshot(path=SHOTS / f'{tag}_0_title.png')

        await page.click('#play')
        await page.wait_for_timeout(2800)
        for r, level in enumerate([85, 30, 90, 70, 95]):
            await page.locator('#hand .hc').first.click()          # open an element
            await page.wait_for_timeout(1700)
            await set_slider(page, level)
            await page.wait_for_timeout(1200)
            await page.screenshot(path=SHOTS / f'{tag}_{r + 1}_element.png')
            await page.get_by_role('button', name='verder').click()
            await page.wait_for_timeout(1800)
            for _ in range(2):                                      # two choices per element
                await page.locator('#hand .hc').first.click()
                await page.wait_for_timeout(1300)
                await page.get_by_role('button', name='kies deze kaart').click()
                await page.wait_for_timeout(2300)
            await page.locator('.esheet [data-a="next"]').click()  # next element
            await page.wait_for_timeout(2800)

        await page.wait_for_timeout(1500)
        await page.screenshot(path=SHOTS / f'{tag}_6_result.png')
        has_image = await page.locator('img.mix').count() == 1
        sounds = await page.evaluate('window.__snd')
        await browser.close()

    ok = not errors and has_image
    print(f'{tag}: {"ok" if ok else "FAILED"}  errors={errors}  result image={has_image}  loops started={sounds}')
    return ok


async def main():
    if not PAGE.exists():
        sys.exit('dist/elemental-five.html not found, run python build.py first')
    SHOTS.mkdir(parents=True, exist_ok=True)
    results = [await play(1280, 800, 'desktop'), await play(390, 844, 'phone')]
    sys.exit(0 if all(results) else 1)


asyncio.run(main())
