let config = {
  type: Phaser.CANVAS,
  width: 640,
  height: 480,
  parent: "phaser-canvas",
  pixelArt: true,
  zoom: 1,
  fps:{
    target: 60,
    forceSetTimeOut: true
  },
  scene: [Menu, Play]
}

let game = new Phaser.Game(config);
let highscore = 0;
let highscoreConfig;

// Reserve keyboard vars
let keyP1Action, keyP1Left, keyP1Right, keyP2Action, keyP2Left, keyP2Right, keyExtraAction;

// UI sizes
let borderUISize = game.config.width / 15;
let borderPadding = borderUISize / 3;

// Positions
let startPos = game.config.height - borderUISize - borderPadding;
let endPos = borderUISize * 3 + borderPadding;