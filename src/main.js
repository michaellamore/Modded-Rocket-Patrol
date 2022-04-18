//
//  Name: Michael Remorin
//  Project Title: Grab 'Em All
//  Started: 4/11/2022
//  Finished: 4/18/2022
//

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
let endPos = borderUISize * 2 + borderPadding;


/*
  CREDIT: 
  Background Music: "Powerup!" by Jeremy Blake
  https://www.youtube.com/watch?v=l7SwiFWOQqM&ab_channel=FreeMusic
*/

/*
POINTS BREAKDOWN
I did a little over 100 points in-case I didn't fulfill some of the requirements

Implement a simultaneous two-player mode (30)
- Can play 1P mode or 2P mode, and each have their own scores

Redesign the game's artwork, UI, and sound to change its theme/aesthetic (60)
- Created a claw-machine type of game, not sci-fi whatsoever

Display the time remaining (in seconds) on the screen (10)
- Timer is at the top of the screen everytime player begins playing

Implement a new timing/scoring mechanism that adds time to clock for successful hits (20)
- the very bottom animals add a couple milliseconds to the timer, whilst the highest animal gives a couple of seconds (varies between two vs one player modes)

Create and implement a new weapon (w/ new behavior and graphics) (20)
- Players play as the claw from a claw machine! 
- Moves up and down the play space
- "Grabs" stuffed animals and drags them down

Track a high score that persists across scenes and displays it in the UI (5)
- The highscore is saved in main.js, so it's useable in both Menu.js and Play.js
- Shows up on the "Gameover" screen after a complete playthrough

Randomize each spaceship's movement direction at the start of each play (5)
- Top and bottom animals go to the right, and the middle goes left. I didn't want to make it random because it would be too chaotic to play, but I wanted to explain that the code is CAPABLE of doing random movement
*/