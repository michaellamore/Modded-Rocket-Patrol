class Menu extends Phaser.Scene {
  constructor() {
    super ("menuScene");
  }

  preload() {
    this.load.image('title', './assets/title.png')
    this.load.image('background', './assets/background.png');
    this.load.audio('sfx_select', './assets/blip_select12.wav');
    this.load.audio('sfx_explosion', './assets/explosion38.wav');
    this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
  }

  create() {
    this.background = this.add.tileSprite(0,0,640, 480, 'background').setOrigin(0,0);
    this.title = this.add.image(0, 0, 'title').setOrigin(0,0);

    let menuConfig = {
      fontFamily: 'Upheavtt',
      fontSize: '28px',
      color: '#FFFFFF',
      stroke: '#10141f',
      strokeThickness: 6,
      align: 'right',
      padding: {
        top: 5,
        bottom: 5,
      },
      fixedWidth: 0
    }

    this.add.text(game.config.width/2, game.config.height/2 + borderUISize*2, 'Use Arrow Keys to move, (F) to Fire', menuConfig).setOrigin(0.5);
    this.add.text(game.config.width/2, game.config.height/2 + borderUISize*3, 'Press (R) for Novice or (F) for Expert', menuConfig).setOrigin(0.5);

    // define keys
    keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
  }

  update() {
    this.background.tilePositionX -= 0.5;
    this.background.tilePositionY -= 0.5;

    if (Phaser.Input.Keyboard.JustDown(keyR)) {
      // Easy
      game.settings = {
        playerSpeed: 5,
        animalSpeed: {
          hard: 5,
          med: 4,
          easy: 3
        },
        gameTimer: 60000
      }
      this.sound.play('sfx_select');
      this.scene.start('playScene');
    }
    if (Phaser.Input.Keyboard.JustDown(keyF)) {
      // Hard
      game.settings = {
        playerSpeed: 3,
        animalSpeed: {
          hard: 8,
          med: 6,
          easy: 5
        },
        gameTimer: 45000
      }
      this.sound.play('sfx_select');
      this.scene.start('playScene');
    }
  }
}