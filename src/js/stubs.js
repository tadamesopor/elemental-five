/* fake versions of the effects, video and sound so the game already runs
   without them. the real files replace these */
var VIDS = {};
var FX = { set() {}, setLevel() {}, burst() {} };
var VID = { show() {}, level() {}, has: () => false };
var SND = {
  toggle: () => false, unlock() {}, flip() {}, deal() {}, pick() {}, click() {}, hover() {},
  tap() {}, thunder() {}, setAmbient() {}, level() {}, on: false,
};
