/* game settings, element look and small helpers */
/* image paths; the build script swaps these for embedded files */
const ELS = ['vuur', 'lucht', 'aarde', 'water', 'ether'];
const IMG = window.__IMGS__ || (() => {
  const m = { back: 'assets/img/back.jpg', hand: 'assets/img/hand.png', ig: 'assets/img/ig.png' };
  ELS.forEach(e => {
    for (let n = 1; n <= 7; n++) m[e + n] = `assets/img/${e}${n}.jpg`;
    m[e + '_round'] = `assets/img/${e}_round.jpg`;
  });
  return m;
})();
const LINKS = {
  koop: 'https://innergames.nl/product/spel-the-elemental-five-compleet/',
  workshop: 'https://innergames.nl/product/ontdek-jouw-drijfveren/',
};
const EL = DATA.elements;
const byId = Object.fromEntries(EL.map(e => [e.id, e]));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = s => document.querySelector(s);
const wait = ms => new Promise(r => setTimeout(r, reduce ? Math.min(ms, 60) : ms));
const img = (el, n) => IMG[`${el}${n}`];
const rect = el => el && el.getBoundingClientRect();


/* per element: slider words, colour, table tint */
const ELX = {
  vuur:  { low: 'smeulend',  high: 'laaiend',          rgb: '234,86,31',
           tint: 'radial-gradient(ellipse 95% 75% at 50% 105%, rgba(255,160,50,.45), transparent 70%)' },
  lucht: { low: 'windstil',  high: 'vrij als de wind', rgb: '116,204,226',
           tint: 'radial-gradient(ellipse 120% 95% at 50% 38%, rgba(160,224,242,.62), rgba(46,120,160,.62) 68%, rgba(16,52,84,.8))' },
  aarde: { low: 'zwevend',   high: 'diep geworteld',   rgb: '250,181,18',
           tint: 'radial-gradient(ellipse 120% 95% at 50% 42%, rgba(252,200,90,.5), rgba(160,96,24,.6) 72%, rgba(70,40,12,.82))' },
  water: { low: 'kalm',      high: 'volop stromend',   rgb: '107,203,155',
           tint: 'radial-gradient(ellipse 120% 95% at 50% 42%, rgba(120,214,178,.6), rgba(22,112,104,.68) 70%, rgba(6,48,56,.86))' },
  ether: { low: 'helder',    high: 'onweer',           rgb: '95,116,163',
           tint: 'radial-gradient(ellipse 120% 95% at 50% 36%, rgba(120,140,200,.62), rgba(40,50,98,.8) 64%, rgba(10,14,38,.92))' },
};
